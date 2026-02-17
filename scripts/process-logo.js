import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');
const outputPath = path.join(__dirname, '..', 'public', 'images', 'logo-clean.png');

async function processLogo() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    console.log(`Input image: ${metadata.width}x${metadata.height}, channels: ${metadata.channels}`);

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    console.log(`Raw buffer: ${info.width}x${info.height}, channels: ${info.channels}`);

    const pixels = Buffer.from(data);
    const threshold = 228;
    const edgeThreshold = 195;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      if (r > threshold && g > threshold && b > threshold) {
        pixels[i + 3] = 0;
      } else if (r > edgeThreshold && g > edgeThreshold && b > edgeThreshold) {
        const brightness = (r + g + b) / 3;
        const alpha = Math.round(255 * (1 - (brightness - edgeThreshold) / (255 - edgeThreshold)));
        pixels[i + 3] = Math.min(pixels[i + 3], alpha);
      }
    }

    await sharp(pixels, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toFile(outputPath);

    console.log(`Processed logo saved to: ${outputPath}`);

    // Trim transparent padding to get just the insignia
    const trimmedPath = path.join(__dirname, '..', 'public', 'images', 'logo-trimmed.png');
    await sharp(outputPath)
      .trim()
      .png()
      .toFile(trimmedPath);

    const trimmedMeta = await sharp(trimmedPath).metadata();
    console.log(`Trimmed logo: ${trimmedMeta.width}x${trimmedMeta.height}`);
    console.log(`Trimmed logo saved to: ${trimmedPath}`);

    // Copy trimmed as the main logo
    const finalPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');
    await sharp(trimmedPath)
      .png()
      .toFile(finalPath + '.tmp');
    
    // Use sharp to read tmp and write to final
    const fs = await import('fs');
    fs.copyFileSync(finalPath + '.tmp', finalPath);
    fs.unlinkSync(finalPath + '.tmp');
    fs.unlinkSync(outputPath);
    fs.unlinkSync(trimmedPath);
    
    console.log('Replaced logo.png with transparent trimmed version');

  } catch (error) {
    console.error('Error processing logo:', error);
    process.exit(1);
  }
}

processLogo();
