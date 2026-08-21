# ─────────────────────────────────────────────────────────────────────────────
# lib-ooxml.ps1 — utilidades comunes para generar OOXML (PPTX / DOCX) sin Node.
#
# Motivo: el entorno de trabajo no dispone de Node/npm, LibreOffice ni Python,
# de modo que las presentaciones y documentos se construyen escribiendo el XML
# de Office directamente y empaquetándolo con System.IO.Compression.
# ─────────────────────────────────────────────────────────────────────────────

Add-Type -AssemblyName System.IO.Compression | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem | Out-Null

# Escapa texto para insertarlo como contenido XML.
function Esc([string]$s) {
  if ($null -eq $s) { return '' }
  $s = $s -replace '&', '&amp;'
  $s = $s -replace '<', '&lt;'
  $s = $s -replace '>', '&gt;'
  $s = $s -replace '"', '&quot;'
  return $s
}

# Escribe un archivo UTF-8 sin BOM (Office rechaza el BOM en algunas partes).
function Write-Part([string]$Root, [string]$RelPath, [string]$Content) {
  $full = Join-Path $Root $RelPath
  $dir = Split-Path $full -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($full, $Content, $enc)
}

# Empaqueta un directorio como archivo OOXML (zip con separadores '/').
function New-OoxmlPackage([string]$SourceDir, [string]$OutFile) {
  $outDir = Split-Path $OutFile -Parent
  if ($outDir -and -not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
  if (Test-Path $OutFile) { Remove-Item $OutFile -Force }
  $src = (Resolve-Path $SourceDir).Path
  $zip = [System.IO.Compression.ZipFile]::Open($OutFile, 'Create')
  try {
    # [Content_Types].xml debe ir primero en el paquete.
    $files = @(Get-ChildItem -Path $src -Recurse -File)
    $ordered = @($files | Where-Object { $_.Name -eq '[Content_Types].xml' }) +
               @($files | Where-Object { $_.Name -ne '[Content_Types].xml' })
    foreach ($f in $ordered) {
      $rel = $f.FullName.Substring($src.Length + 1).Replace('\', '/')
      $entry = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
      $stream = $entry.Open()
      $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
      $stream.Write($bytes, 0, $bytes.Length)
      $stream.Dispose()
    }
  } finally { $zip.Dispose() }
  $size = [math]::Round((Get-Item $OutFile).Length / 1KB, 1)
  Write-Host ("  OK  {0}  ({1} KB)" -f (Split-Path $OutFile -Leaf), $size)
}

# Paleta DIAT — coincide con la identidad de la plataforma y de los PDF.
$Global:PAL = @{
  bg      = '070B12'
  bgCard  = '0C121E'
  bgSoft  = '121A2E'
  white   = 'F8FAFC'
  cyan    = '06B6D4'
  cyanL   = '22D3EE'
  indigo  = '818CF8'
  purple  = 'A855F7'
  emerald = '34D399'
  amber   = 'FBBF24'
  rose    = 'FB7185'
  gray    = '64748B'
  grayL   = '94A3B8'
  grayD   = '334155'
  line    = '1E293B'
}

function Accent([string]$name) {
  if ($PAL.ContainsKey($name)) { return $PAL[$name] }
  return $PAL.cyan
}
