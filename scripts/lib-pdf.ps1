# ─────────────────────────────────────────────────────────────────────────────
# lib-pdf.ps1 — escritor de PDF vectorial mínimo, sin dependencias.
#
# Motivo: el entorno no tiene Node, navegador headless ni LibreOffice, y un PDF
# hecho de capturas de pantalla sería inaceptable (texto no seleccionable, se
# pixela al ampliar y pesa de más). Este módulo escribe PDF 1.4 con las fuentes
# base-14 y codificación WinAnsi, de modo que el texto es vectorial, se puede
# buscar y copiar, y los acentos del español salen bien.
#
# Coordenadas: se trabaja con el origen ARRIBA a la izquierda, en puntos, y la
# conversión al sistema del PDF (origen abajo) ocurre al escribir.
# ─────────────────────────────────────────────────────────────────────────────

# ─── Anchos de las fuentes base-14 (unidades AFM, por 1000) ──────────────────
$Global:PDF_W_HELV = @{}
$Global:PDF_W_HELVB = @{}

$helv = @(
  278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,
  556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,
  1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,
  667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,
  333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,
  556,556,333,500,278,556,500,722,500,500,500,334,260,334,584
)
$helvB = @(
  278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,
  556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,
  975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,
  667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,
  333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,
  611,611,389,556,333,611,556,778,556,556,500,389,280,389,584
)
# Las claves son códigos de carácter, no caracteres: los literales de hash de
# PowerShell comparan claves sin distinguir mayúsculas y 'A' pisaría a 'a'.
for ($i = 0; $i -lt $helv.Count; $i++)  { $PDF_W_HELV[32 + $i]  = $helv[$i] }
for ($i = 0; $i -lt $helvB.Count; $i++) { $PDF_W_HELVB[32 + $i] = $helvB[$i] }

# Letras acentuadas: se les asigna el ancho de su letra base, que es exacto en
# las fuentes base-14 porque el acento no añade ancho. Se resuelve descomponiendo
# el carácter en vez de con una tabla: un literal de hash de PowerShell compara
# claves sin distinguir mayúsculas, y 'á' y 'Á' colisionarían.
function Get-BaseChar([char]$c) {
  $decomposed = ([string]$c).Normalize([System.Text.NormalizationForm]::FormD)
  foreach ($ch in $decomposed.ToCharArray()) {
    $cat = [System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch)
    if ($cat -ne [System.Globalization.UnicodeCategory]::NonSpacingMark) { return $ch }
  }
  return $c
}

# Signos tipográficos fuera del rango ASCII que aparecen en los documentos.
function Get-PunctWidth([char]$c) {
  switch ([int]$c) {
    0x00AB { return 500 }   # «
    0x00BB { return 500 }   # »
    0x00B7 { return 278 }   # ·
    0x2014 { return 1000 }  # em dash
    0x2013 { return 556 }   # en dash
    0x2026 { return 1000 }  # …
    0x201C { return 333 }
    0x201D { return 333 }
    0x2018 { return 222 }
    0x2019 { return 222 }
    default { return -1 }
  }
}

function Get-CharWidth([char]$c, [bool]$bold, [bool]$mono) {
  if ($mono) { return 600 }
  $t = $PDF_W_HELV
  if ($bold) { $t = $PDF_W_HELVB }
  $code = [int]$c
  if ($t.ContainsKey($code)) { return $t[$code] }
  $p = Get-PunctWidth $c
  if ($p -ge 0) { return $p }
  $baseCode = [int](Get-BaseChar $c)
  if ($t.ContainsKey($baseCode)) { return $t[$baseCode] }
  return 556
}

function Measure-PdfText([string]$text, [double]$size, [string]$font) {
  $bold = $font -like '*B'
  $mono = $font -like 'C*'
  $total = 0
  foreach ($c in $text.ToCharArray()) { $total += Get-CharWidth $c $bold $mono }
  return ($total * $size / 1000.0)
}

# Parte el texto en líneas que caben en $maxWidth.
function Split-PdfText([string]$text, [double]$size, [string]$font, [double]$maxWidth) {
  $out = New-Object System.Collections.Generic.List[string]
  foreach ($chunk in ($text -split "`n")) {
    $words = $chunk -split ' '
    $line = ''
    foreach ($w in $words) {
      $try = if ($line -eq '') { $w } else { "$line $w" }
      if ((Measure-PdfText $try $size $font) -le $maxWidth -or $line -eq '') {
        $line = $try
      } else {
        $out.Add($line) | Out-Null
        $line = $w
      }
    }
    $out.Add($line) | Out-Null
  }
  return $out.ToArray()
}

# ─── Escapado de cadenas PDF ─────────────────────────────────────────────────
function Esc-PdfString([string]$s) {
  $s = $s -replace '\\', '\\\\'
  $s = $s -replace '\(', '\('
  $s = $s -replace '\)', '\)'
  # Caracteres que WinAnsi no cubre y que conviene sustituir antes de escribir.
  $s = $s -replace '→', '->'
  $s = $s -replace '✓', 'v'
  $s = $s -replace '≤', '<='
  $s = $s -replace '≥', '>='
  return $s
}

# ─── Documento ───────────────────────────────────────────────────────────────
function New-Pdf([double]$Width, [double]$Height, [hashtable]$Meta) {
  return @{
    W = $Width
    H = $Height
    Pages = (New-Object System.Collections.Generic.List[object])
    Meta = if ($Meta) { $Meta } else { @{} }
  }
}

function Add-PdfPage($pdf) {
  $page = @{ Ops = (New-Object System.Collections.Generic.List[string]) }
  $pdf.Pages.Add($page) | Out-Null
  return $page
}

function Add-PdfRect($pdf, $page, [double]$x, [double]$y, [double]$w, [double]$h, [string]$hex) {
  $r = [Convert]::ToInt32($hex.Substring(0,2),16) / 255.0
  $g = [Convert]::ToInt32($hex.Substring(2,2),16) / 255.0
  $b = [Convert]::ToInt32($hex.Substring(4,2),16) / 255.0
  $py = $pdf.H - $y - $h
  $page.Ops.Add(("{0:F3} {1:F3} {2:F3} rg {3:F2} {4:F2} {5:F2} {6:F2} re f" -f $r,$g,$b,$x,$py,$w,$h)) | Out-Null
}

# $font: H (Helvetica), HB (Helvetica-Bold), HI (Helvetica-Oblique),
#        C (Courier), CB (Courier-Bold)
function Add-PdfText($pdf, $page, [double]$x, [double]$y, [double]$size, [string]$font, [string]$hex, [string]$text) {
  if ([string]::IsNullOrEmpty($text)) { return }
  $r = [Convert]::ToInt32($hex.Substring(0,2),16) / 255.0
  $g = [Convert]::ToInt32($hex.Substring(2,2),16) / 255.0
  $b = [Convert]::ToInt32($hex.Substring(4,2),16) / 255.0
  $py = $pdf.H - $y - $size * 0.78
  $t = Esc-PdfString $text
  $page.Ops.Add(("BT {0:F3} {1:F3} {2:F3} rg /{3} {4:F2} Tf {5:F2} {6:F2} Td ({7}) Tj ET" -f $r,$g,$b,$font,$size,$x,$py,$t)) | Out-Null
}

# Texto ajustado a un ancho. Devuelve la Y final.
function Add-PdfParagraph($pdf, $page, [double]$x, [double]$y, [double]$maxWidth, [double]$size, [string]$font, [string]$hex, [string]$text, [double]$leading = 0) {
  if ($leading -le 0) { $leading = $size * 1.35 }
  foreach ($line in (Split-PdfText $text $size $font $maxWidth)) {
    Add-PdfText $pdf $page $x $y $size $font $hex $line
    $y += $leading
  }
  return $y
}

# ─── Guardado ────────────────────────────────────────────────────────────────
function Save-Pdf($pdf, [string]$Path) {
  $enc = [System.Text.Encoding]::GetEncoding(1252)
  $objects = New-Object System.Collections.Generic.List[string]

  # Reserva: 1 catálogo, 2 páginas, 3..7 fuentes. Las páginas y los streams van
  # después, en pares (página, contenido).
  $fontNames = @(
    @{ id='H';  base='Helvetica' },
    @{ id='HB'; base='Helvetica-Bold' },
    @{ id='HI'; base='Helvetica-Oblique' },
    @{ id='C';  base='Courier' },
    @{ id='CB'; base='Courier-Bold' }
  )

  $nPages = $pdf.Pages.Count
  $firstPageObj = 3 + $fontNames.Count            # primer objeto de página
  $pageObjIds = @()
  for ($i = 0; $i -lt $nPages; $i++) { $pageObjIds += ($firstPageObj + $i * 2) }

  # 1 · Catálogo
  $objects.Add("<< /Type /Catalog /Pages 2 0 R >>") | Out-Null

  # 2 · Árbol de páginas
  $kids = ($pageObjIds | ForEach-Object { "$_ 0 R" }) -join ' '
  $objects.Add("<< /Type /Pages /Count $nPages /Kids [$kids] >>") | Out-Null

  # 3..7 · Fuentes
  foreach ($f in $fontNames) {
    $objects.Add("<< /Type /Font /Subtype /Type1 /BaseFont /$($f.base) /Encoding /WinAnsiEncoding >>") | Out-Null
  }

  $fontRes = ($fontNames | ForEach-Object -Begin { $i = 3 } -Process {
    $s = "/$($_.id) $i 0 R"
    $i++
    $s
  }) -join ' '

  # Páginas y contenidos
  for ($i = 0; $i -lt $nPages; $i++) {
    $contentId = $pageObjIds[$i] + 1
    $objects.Add("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 $([math]::Round($pdf.W,2)) $([math]::Round($pdf.H,2))] /Resources << /Font << $fontRes >> >> /Contents $contentId 0 R >>") | Out-Null
    $stream = ($pdf.Pages[$i].Ops -join "`n")
    $len = $enc.GetByteCount($stream)
    $objects.Add("<< /Length $len >>`nstream`n$stream`nendstream") | Out-Null
  }

  # Metadatos
  $infoId = $objects.Count + 1
  $title = Esc-PdfString ([string]$pdf.Meta.Title)
  $author = Esc-PdfString ([string]$pdf.Meta.Author)
  $subject = Esc-PdfString ([string]$pdf.Meta.Subject)
  $keywords = Esc-PdfString ([string]$pdf.Meta.Keywords)
  $objects.Add("<< /Title ($title) /Author ($author) /Subject ($subject) /Keywords ($keywords) /Producer (DIAT PUCV lib-pdf.ps1) /CreationDate (D:20260821000000Z) >>") | Out-Null

  # Ensamblado con tabla xref
  $sb = New-Object System.Text.StringBuilder
  # El comentario con bytes altos marca el archivo como binario para las
  # herramientas que transfieren PDF.
  $binaryMark = "$([char]0xE2)$([char]0xE3)$([char]0xCF)$([char]0xD3)"
  [void]$sb.Append("%PDF-1.4`n%$binaryMark`n")

  $offsets = @()
  for ($i = 0; $i -lt $objects.Count; $i++) {
    $offsets += $enc.GetByteCount($sb.ToString())
    [void]$sb.Append("$($i + 1) 0 obj`n$($objects[$i])`nendobj`n")
  }

  $xrefPos = $enc.GetByteCount($sb.ToString())
  [void]$sb.Append("xref`n0 $($objects.Count + 1)`n")
  [void]$sb.Append("0000000000 65535 f `n")
  foreach ($o in $offsets) { [void]$sb.Append(("{0:D10} 00000 n `n" -f $o)) }
  [void]$sb.Append("trailer`n<< /Size $($objects.Count + 1) /Root 1 0 R /Info $infoId 0 R >>`nstartxref`n$xrefPos`n%%EOF`n")

  $dir = Split-Path $Path -Parent
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllBytes($Path, $enc.GetBytes($sb.ToString()))

  $kb = [math]::Round((Get-Item $Path).Length / 1KB, 1)
  Write-Host ("  OK  {0}  ({1} KB, {2} pág.)" -f (Split-Path $Path -Leaf), $kb, $nPages)
}
