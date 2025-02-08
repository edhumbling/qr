import QRCode from "qrcode"

export async function generateQR(options: {
  text: string
  foregroundColor: string
  backgroundColor: string
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
  logo?: string
}) {
  try {
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 1024

    await QRCode.toCanvas(canvas, options.text, {
      errorCorrectionLevel: options.errorCorrectionLevel,
      color: {
        dark: options.foregroundColor,
        light: options.backgroundColor,
      },
      width: 1024,
      margin: 1,
    })

    if (options.logo) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = options.logo
        })

        // Calculate logo size (20% of QR code)
        const logoSize = 204.8 // 20% of 1024
        const x = (canvas.width - logoSize) / 2
        const y = (canvas.height - logoSize) / 2

        // Create circular clipping path
        ctx.beginPath()
        ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        // Create white circular background
        ctx.fillStyle = options.backgroundColor
        ctx.fill()

        // Draw logo
        ctx.drawImage(img, x, y, logoSize, logoSize)
      }
    }

    return canvas.toDataURL("image/png")
  } catch (err) {
    console.error(err)
    return null
  }
}

