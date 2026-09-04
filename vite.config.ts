import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Sert les fonctions du dossier `api/` pendant le développement.
 *
 * Sans cela, `vite dev` ne connaît que le client : tout appel à /api échoue, et
 * l'import LinkedIn, le paiement et le téléchargement du PDF sont intestables
 * en local. Les mêmes fichiers sont ici chargés par Vite et appelés avec la
 * signature Web qu'ils attendent, de sorte que le comportement local reflète
 * celui du déploiement.
 */
function apiDevServer(): Plugin {
  return {
    name: 'api-dev-server',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.url ?? ''
        if (!raw.startsWith('/api/')) return next()

        void (async () => {
          const url = new URL(raw, 'http://localhost')
          const route = url.pathname.replace(/^\/api\//, '')

          // Un segment `..` permettrait de charger n'importe quel fichier du
          // disque : on refuse avant toute résolution de chemin.
          if (!/^[a-z0-9/_-]+$/i.test(route)) return next()

          const file = [`api/${route}.ts`, `api/${route}/index.ts`]
            .map((candidate) => join(server.config.root, candidate))
            .find((candidate) => existsSync(candidate))

          if (!file) return next()

          try {
            const module = await server.ssrLoadModule(file)
            const handler = module.default as (request: Request) => Promise<Response>

            const body =
              req.method === 'GET' || req.method === 'HEAD'
                ? undefined
                : await new Promise<Buffer>((resolve, reject) => {
                    const chunks: Buffer[] = []
                    req.on('data', (chunk: Buffer) => chunks.push(chunk))
                    req.on('end', () => resolve(Buffer.concat(chunks)))
                    req.on('error', reject)
                  })

            const headers = new Headers()
            for (const [key, value] of Object.entries(req.headers)) {
              if (typeof value === 'string') headers.set(key, value)
              else if (Array.isArray(value)) headers.set(key, value.join(', '))
            }

            const response = await handler(
              new Request(`http://${req.headers.host ?? 'localhost'}${raw}`, {
                method: req.method,
                headers,
                body: body && body.length > 0 ? new Uint8Array(body) : undefined,
              }),
            )

            res.statusCode = response.status
            response.headers.forEach((value, key) => res.setHeader(key, value))

            // Le corps est recopié au fil de l'eau et non mis en tampon :
            // l'aide à la rédaction diffuse son texte, et l'attendre en entier
            // en local donnerait un comportement que le déploiement n'a pas.
            if (!response.body) {
              res.end()
              return
            }
            const reader = response.body.getReader()
            for (;;) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(Buffer.from(value))
            }
            res.end()
          } catch (error) {
            // Une erreur de la fonction doit rester lisible et rester du JSON :
            // c'est ce que le client sait interpréter.
            server.config.logger.error(`[api] ${route} : ${String(error)}`)
            res.statusCode = 500
            res.setHeader('content-type', 'application/json; charset=utf-8')
            res.end(
              JSON.stringify({
                error: 'handler_error',
                message: `La fonction /api/${route} a échoué : ${String(error)}`,
              }),
            )
          }
        })()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Les fonctions lisent `process.env` ; en développement, le fichier .env doit
  // donc y être versé, y compris les variables sans préfixe VITE_.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), tailwindcss(), apiDevServer()],
    // Base absolue : l'application sert plusieurs chemins (/, /cv/…, /editeur),
    // et des URL d'assets relatives se résoudraient mal sur les routes profondes.
    base: '/',
  }
})
