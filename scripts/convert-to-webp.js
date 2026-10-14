import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve('src/assets/images');

async function processImages() {
  const files = fs.readdirSync(imagesDir);
  console.log(`Scanning ${files.length} files in ${imagesDir}...`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
    if (file.endsWith('.webp')) continue;

    const inputPath = path.join(imagesDir, file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(imagesDir, `${baseName}.webp`);

    const statsBefore = fs.statSync(inputPath);
    const isLogo = file.toLowerCase().includes('logo') || file.toLowerCase().includes('footer');

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      let pipeline = sharp(inputPath);

      // If very large dimensions, scale reasonably
      if (metadata.width && metadata.width > 1920) {
        pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
      }

      if (isLogo) {
        await pipeline
          .webp({ quality: 90, effort: 6 })
          .toFile(outputPath);
      } else {
        await pipeline
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
      }

      const statsAfter = fs.statSync(outputPath);
      const savedPercent = (((statsBefore.size - statsAfter.size) / statsBefore.size) * 100).toFixed(1);
      console.log(`✓ ${file} (${(statsBefore.size / 1024).toFixed(0)} KB) -> ${baseName}.webp (${(statsAfter.size / 1024).toFixed(0)} KB) [-${savedPercent}%]`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

processImages();
