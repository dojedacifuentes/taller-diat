# ─────────────────────────────────────────────────────────────────────────────
# CLASE 1 · RENDERIZADO Y QA VISUAL
#
#   powershell -ExecutionPolicy Bypass -File scripts/class1/render-deck.ps1
#
# Abre el .pptx con PowerPoint, exporta las 30 diapositivas a PNG y guarda el
# PDF. Es la comprobación de que el archivo es realmente legible y no solo un
# ZIP bien formado.
#
# PowerPoint 2007: Export() para PNG y SaveAs(..., 32, 0) para PDF —
# ExportAsFixedFormat no se puede invocar por enlace tardío desde PowerShell.
# ─────────────────────────────────────────────────────────────────────────────

param(
    [string]$Deck   = "",
    [int]$Width     = 1920,
    [int]$Height    = 1080
)

$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if ([string]::IsNullOrEmpty($Deck)) {
    if ($env:DIAT_OUT) { $outDir = $env:DIAT_OUT }
    else { $outDir = Join-Path (Split-Path -Parent (Split-Path -Parent $repo)) "Desktop\diat\CLASES TALLER DIAT 2026\CLASE 1\PPT_v2.0\build" }
    $Deck = Join-Path $outDir "DIAT_CLASE_1_CANON_2026.pptx"
} else {
    $outDir = Split-Path -Parent $Deck
}

if (-not (Test-Path $Deck)) { throw "No existe el deck: $Deck. Compílalo antes con npm run build:class1-ppt" }

$renders = Join-Path $outDir "renders"
$pdf     = Join-Path $outDir "DIAT_CLASE_1_CANON_2026.pdf"

if (Test-Path $renders) { Get-ChildItem $renders -Filter *.png | Remove-Item -Force }
else { New-Item -ItemType Directory $renders | Out-Null }
if (Test-Path $pdf) { Remove-Item $pdf -Force }

Write-Output "Abriendo $Deck"
$app = New-Object -ComObject PowerPoint.Application
$app.Visible = -1
$pres = $null
try {
    $pres = $app.Presentations.Open($Deck, -1, 0, -1)
    $n = $pres.Slides.Count
    Write-Output "Diapositivas: $n"
    if ($n -ne 30) { Write-Output "AVISO: se esperaban 30 diapositivas." }

    $pres.Export($renders, "PNG", $Width, $Height)
    Write-Output "PNG exportados a $renders"

    $pres.SaveAs($pdf, 32, 0)
    Write-Output "PDF exportado a $pdf"
} finally {
    if ($pres -ne $null) { try { $pres.Close() } catch {} }
    try { $app.Quit() } catch {}
}

# PowerPoint nombra los archivos según el idioma de la interfaz. Se normalizan
# a slide-01.png … slide-30.png para que la auditoría no dependa del idioma.
$files = Get-ChildItem $renders -Filter *.png | Sort-Object {
    $m = [regex]::Match($_.BaseName, '(\d+)$')
    if ($m.Success) { [int]$m.Groups[1].Value } else { 9999 }
}
$i = 0
foreach ($f in $files) {
    $i++
    $target = Join-Path $renders ("slide-{0:D2}.png" -f $i)
    if ($f.FullName -ne $target) { Move-Item $f.FullName $target -Force }
}
Write-Output "Renders normalizados: $i archivos slide-NN.png"

$missing = @()
for ($k = 1; $k -le 30; $k++) {
    $p = Join-Path $renders ("slide-{0:D2}.png" -f $k)
    if (-not (Test-Path $p)) { $missing += $k }
}
if ($missing.Count -gt 0) { Write-Output ("FALTAN RENDERS: " + ($missing -join ", ")) }
else { Write-Output "OK · 30 renders + PDF" }
