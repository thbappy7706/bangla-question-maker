Add-Type -AssemblyName System.Drawing

# Screenshot wide (1280x720)
$bmp = New-Object System.Drawing.Bitmap(1280, 720)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(255, 0, 0, 0))
$bmp.Save("public\icons\screenshot-wide.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Host "Created screenshot-wide.png"

# Screenshot mobile (390x844)
$bmp2 = New-Object System.Drawing.Bitmap(390, 844)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.Clear([System.Drawing.Color]::FromArgb(255, 0, 0, 0))
$bmp2.Save("public\icons\screenshot-mobile.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose(); $bmp2.Dispose()
Write-Host "Created screenshot-mobile.png"

# Copy 192x192 as apple-touch-icon.png
Copy-Item "public\icons\icon-192x192.png" "public\apple-touch-icon.png" -Force
Write-Host "Created apple-touch-icon.png"
