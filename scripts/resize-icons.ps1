Add-Type -AssemblyName System.Drawing

$src = "C:\Users\tanvi\.gemini\antigravity\brain\e95268bb-4e31-4fbc-bf60-6a985a36e97b\questioncraft_icon_512_1772444638132.png"
$outDir = "C:\Users\tanvi\Downloads\bangla-question-maker\public\icons"

if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$original = [System.Drawing.Image]::FromFile($src)

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($original, 0, 0, $size, $size)
    $outPath = "$outDir\icon-$($size)x$($size).png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated icon-$($size)x$($size).png"
}

# Also create apple-touch-icon at 180x180
$bmp = New-Object System.Drawing.Bitmap(180, 180)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($original, 0, 0, 180, 180)
$bmp.Save("C:\Users\tanvi\Downloads\bangla-question-maker\public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Generated apple-touch-icon.png (180x180)"

$original.Dispose()
Write-Host "All icons generated successfully!"
