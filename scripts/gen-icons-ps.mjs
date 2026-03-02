// Generates all PWA icons using PowerShell + .NET System.Drawing
// Run: node scripts/gen-icons-ps.mjs

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Use PowerShell to create PNG icons
const ps = `
Add-Type -AssemblyName System.Drawing

$sizes = @(${sizes.join(',')})
$iconsDir = '${iconsDir.replace(/\\/g, '\\\\')}'

foreach ($size in $sizes) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)

  # Background gradient
  $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect,
    [System.Drawing.Color]::FromArgb(255, 5, 150, 105),
    [System.Drawing.Color]::FromArgb(255, 6, 95, 70),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
  
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  
  # Rounded rectangle path
  $radius = [int]($size * 0.2)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc(0, 0, $radius*2, $radius*2, 180, 90)
  $path.AddArc($size - $radius*2, 0, $radius*2, $radius*2, 270, 90)
  $path.AddArc($size - $radius*2, $size - $radius*2, $radius*2, $radius*2, 0, 90)
  $path.AddArc(0, $size - $radius*2, $radius*2, $radius*2, 90, 90)
  $path.CloseFigure()
  $g.FillPath($brush, $path)

  # Draw text
  $fontSize = [int]($size * 0.45)
  $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
  $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString("QC", $font, $whiteBrush, $rect, $sf)

  $outPath = "$iconsDir\\icon-$($size)x$($size).png"
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $brush.Dispose()
  Write-Host "Generated icon-$($size)x$($size).png"
}
`.trim();

const psScript = path.join(__dirname, '_gen_icons.ps1');
fs.writeFileSync(psScript, ps);

try {
    execSync(`powershell -ExecutionPolicy Bypass -File "${psScript}"`, { stdio: 'inherit' });
    console.log('All icons generated!');
} finally {
    fs.unlinkSync(psScript);
}
