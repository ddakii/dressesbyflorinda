import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/images')
const hero = new Set(['look-12.png', 'look-14.png'])

const files = fs.readdirSync(dir).filter((name) => /^look-\d+\.png$/.test(name))

for (const name of files) {
  const input = path.join(dir, name)
  const width = hero.has(name) ? 3200 : 2200
  const tmp = path.join(dir, `${name}.tmp.png`)
  await sharp(input)
    .resize({
      width,
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .sharpen({ sigma: 1.15, m1: 1, m2: 0.45 })
    .modulate({ saturation: 1.04, brightness: 1.02 })
    .png({ compressionLevel: 8, quality: 92 })
    .toFile(tmp)
  fs.renameSync(tmp, input)
  const info = await sharp(input).metadata()
  console.log(`${name} → ${info.width}x${info.height}`)
}
