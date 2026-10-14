const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Helper to create an ICO buffer containing multiple PNG frames
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // number of images

  let offset = 6 + count * 16;
  const dirEntries = [];

  for (const item of pngBuffers) {
    const { width, height, buffer } = item;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // image offset
    dirEntries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map(p => p.buffer)
  ]);
}

async function run() {
  const publicDir = path.resolve(__dirname, '../public');

  // Load trimmed logo
  const trimmedLogoBuf = await sharp(path.resolve(__dirname, '../src/assets/images/logonew.png'))
    .trim()
    .toBuffer();

  const whiteTrimmedBuf = await sharp(path.resolve(__dirname, '../src/assets/images/NM new Logo white.png'))
    .trim()
    .toBuffer();

  // 1. Create a 512x512 Master Luxury Disc Badge:
  // Circular disc with warm ivory (#FAF8F5) background, elegant double-gold rim (#C5A880),
  // and the authentic charcoal brand logo in the center.
  // This ensures 100% visibility on DARK browser tabs (like Chrome/Edge in dark mode)
  // as well as LIGHT browser tabs!
  const size = 512;
  const innerPadding = 72;
  const targetLogoSize = size - (innerPadding * 2);

  const logoResized = await sharp(trimmedLogoBuf)
    .resize(targetLogoSize, targetLogoSize, { fit: 'inside' })
    .toBuffer();

  const logoMeta = await sharp(logoResized).metadata();
  const topOffset = Math.round((size - logoMeta.height) / 2);
  const leftOffset = Math.round((size - logoMeta.width) / 2);

  const circleSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E2C99D" />
        <stop offset="50%" stop-color="#C5A880" />
        <stop offset="100%" stop-color="#9E8056" />
      </linearGradient>
      <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.18" />
      </filter>
    </defs>
    <!-- Background circular ivory base with shadow -->
    <circle cx="256" cy="256" r="248" fill="#FBF9F5" />
    <!-- Outer gold luxury rim -->
    <circle cx="256" cy="256" r="242" fill="none" stroke="url(#goldGrad)" stroke-width="14" />
    <!-- Fine concentric inner gold filigree accent -->
    <circle cx="256" cy="256" r="226" fill="none" stroke="#C5A880" stroke-width="2" stroke-opacity="0.45" />
  </svg>`;

  const masterBadge = await sharp(Buffer.from(circleSvg))
    .composite([
      { input: logoResized, top: topOffset, left: leftOffset }
    ])
    .png()
    .toBuffer();

  // Save 512x512 master favicon.png
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), masterBadge);
  console.log('Generated public/favicon.png (512x512)');

  // Save 192x192
  const pwa192 = await sharp(masterBadge).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

  // Save 512x512 PWA
  fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), masterBadge);

  // Save 180x180 Apple Touch Icon
  const appleIcon = await sharp(masterBadge).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

  // Save 32x32 & 16x16 PNGs
  const p32 = await sharp(masterBadge).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), p32);

  const p16 = await sharp(masterBadge).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), p16);

  const p48 = await sharp(masterBadge).resize(48, 48).png().toBuffer();

  // Generate valid multi-resolution favicon.ico (16, 32, 48)
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated public/favicon.ico with 16, 32, and 48 frames');

  // Also create a modern vector favicon.svg for razor-sharp SVG favicon support!
  // In vector SVG, embed the PNG as base64 inside the circle for 100% fidelity
  const base64Png = masterBadge.toString('base64');
  const faviconSvg = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <image width="64" height="64" href="data:image/png;base64,${base64Png}" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
  console.log('Generated public/favicon.svg');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
