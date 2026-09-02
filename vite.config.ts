import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Base absolue : l'application sert désormais plusieurs chemins (/, /editeur),
  // et des URL d'assets relatives se résoudraient mal sur les routes profondes.
  base: '/',
})
