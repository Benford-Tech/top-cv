const MAX_SIDE = 480

/**
 * Réduit et recompresse la photo avant de la stocker : le quota de
 * localStorage est de quelques mégaoctets, une photo d'appareil brute
 * le saturerait à elle seule.
 */
export function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('Image illisible'))
      image.onload = () => {
        const ratio = Math.min(MAX_SIDE / image.width, MAX_SIDE / image.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * ratio)
        canvas.height = Math.round(image.height * ratio)
        const context = canvas.getContext('2d')
        if (!context) {
          resolve(String(reader.result))
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
