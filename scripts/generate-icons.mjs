// Script to generate PWA icons using Node.js built-in canvas (if available) or pure base64 PNG
// Run with: node scripts/generate-icons.mjs

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function generateIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background gradient - dark green
    const bg = ctx.createLinearGradient(0, 0, size, size);
    bg.addColorStop(0, '#059669');
    bg.addColorStop(1, '#065f46');

    // Rounded rect background
    const radius = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = bg;
    ctx.fill();

    // Draw a simple pencil/document icon
    const padding = size * 0.2;
    const iconSize = size - padding * 2;

    // Draw "Q" letter or pencil emoji representation
    ctx.fillStyle = 'white';
    ctx.font = `bold ${iconSize * 0.65}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✎', size / 2, size / 2);

    return canvas.toBuffer('image/png');
}

for (const size of sizes) {
    try {
        const buffer = generateIcon(size);
        const outPath = path.join(iconsDir, `icon-${size}x${size}.png`);
        fs.writeFileSync(outPath, buffer);
        console.log(`✓ Generated ${size}x${size} icon`);
    } catch (e) {
        console.error(`✗ Failed ${size}x${size}:`, e.message);
    }
}

console.log('Done!');
