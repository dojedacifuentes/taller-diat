# ─────────────────────────────────────────────────────────────────────────────
# lib-doc.ps1 — modelo de documento común y sus dos salidas: DOCX y PDF.
#
# Un guion o un manual se describe una sola vez como una lista de bloques, y
# de ahí salen las dos versiones. Evita que el .docx y el .pdf digan cosas
# distintas.
#
# Decisión de diseño: los documentos de lectura larga (guiones y manual) se
# componen sobre fondo blanco, al revés que la web, las diapositivas y las
# fichas. Están hechos para imprimirse y leerse en una sala; un fondo oscuro
# de treinta páginas es inutilizable en papel. La identidad se conserva con la
# tipografía, los acentos de color y la retícula.
# ─────────────────────────────────────────────────────────────────────────────

. (Join-Path $PSScriptRoot 'lib-ooxml.ps1')
. (Join-Path $PSScriptRoot 'lib-pdf.ps1')

# ─── Constructores del modelo ────────────────────────────────────────────────
function DocTitle([string]$t)                { @{ t='title';    text=$t } }
function DocSubtitle([string]$t)             { @{ t='subtitle'; text=$t } }
function DocMeta([string]$t)                 { @{ t='meta';     text=$t } }
function DocH1([string]$t)                   { @{ t='h1';       text=$t } }
function DocH2([string]$t)                   { @{ t='h2';       text=$t } }
function DocH3([string]$t)                   { @{ t='h3';       text=$t } }
function DocP([string]$t)                    { @{ t='p';        text=$t } }
function DocLead([string]$t)                 { @{ t='lead';     text=$t } }
function DocBullet([string]$t)               { @{ t='bullet';   text=$t } }
function DocNum([int]$n, [string]$t)         { @{ t='num';      n=$n; text=$t } }
function DocKV([string]$k, [string]$v)       { @{ t='kv';       label=$k; text=$v } }
function DocCallout([string]$k, [string]$v)  { @{ t='callout';  label=$k; text=$v } }
function DocQuote([string]$t)                { @{ t='quote';    text=$t } }
function DocCode([string[]]$lines)           { @{ t='code';     lines=$lines } }
function DocRule()                           { @{ t='rule' } }
function DocBreak()                          { @{ t='pagebreak' } }
function DocTable($head, $rows, $widths)     { @{ t='table'; head=$head; rows=$rows; widths=$widths } }

# ═════════════════════════════════════════════════════════════════════════════
# SALIDA 1 · DOCX
# ═════════════════════════════════════════════════════════════════════════════
function ConvertTo-DocxParagraph([string]$style, [string]$text, [string]$color, [int]$size, [bool]$bold, [int]$indent) {
  $rPr = "<w:rPr>"
  if ($bold) { $rPr += "<w:b/>" }
  if ($size -gt 0) { $rPr += "<w:sz w:val=`"$size`"/><w:szCs w:val=`"$size`"/>" }
  if ($color) { $rPr += "<w:color w:val=`"$color`"/>" }
  $rPr += "</w:rPr>"

  $pPr = "<w:pPr>"
  if ($style) { $pPr += "<w:pStyle w:val=`"$style`"/>" }
  if ($indent -gt 0) { $pPr += "<w:ind w:left=`"$indent`"/>" }
  $pPr += "<w:spacing w:after=`"120`"/></w:pPr>"

  "<w:p>$pPr<w:r>$rPr<w:t xml:space=`"preserve`">$(Esc $text)</w:t></w:r></w:p>"
}

function ConvertTo-DocxBody($blocks) {
  $xml = ''
  foreach ($b in $blocks) {
    switch ($b.t) {
      'title'    { $xml += ConvertTo-DocxParagraph 'Title' $b.text '0F172A' 48 $true 0 }
      'subtitle' { $xml += ConvertTo-DocxParagraph '' $b.text '0891B2' 26 $false 0 }
      'meta'     { $xml += ConvertTo-DocxParagraph '' $b.text '64748B' 18 $false 0 }
      'h1'       { $xml += ConvertTo-DocxParagraph 'Heading1' $b.text '0891B2' 30 $true 0 }
      'h2'       { $xml += ConvertTo-DocxParagraph 'Heading2' $b.text '0F172A' 24 $true 0 }
      'h3'       { $xml += ConvertTo-DocxParagraph 'Heading3' $b.text '334155' 21 $true 0 }
      'lead'     { $xml += ConvertTo-DocxParagraph '' $b.text '334155' 22 $false 0 }
      'p'        { $xml += ConvertTo-DocxParagraph '' $b.text '1E293B' 20 $false 0 }
      'bullet'   { $xml += ConvertTo-DocxParagraph '' ("•  " + $b.text) '1E293B' 20 $false 340 }
      'num'      { $xml += ConvertTo-DocxParagraph '' ("$($b.n).  " + $b.text) '1E293B' 20 $false 340 }
      'quote'    { $xml += ConvertTo-DocxParagraph '' ("« " + $b.text + " »") '0F172A' 24 $true 340 }
      'kv' {
        $xml += "<w:p><w:pPr><w:spacing w:after=`"40`"/></w:pPr>" +
                "<w:r><w:rPr><w:b/><w:sz w:val=`"18`"/><w:color w:val=`"0891B2`"/></w:rPr><w:t xml:space=`"preserve`">$(Esc $b.label.ToUpper()): </w:t></w:r>" +
                "<w:r><w:rPr><w:sz w:val=`"20`"/><w:color w:val=`"1E293B`"/></w:rPr><w:t xml:space=`"preserve`">$(Esc $b.text)</w:t></w:r></w:p>"
      }
      'callout' {
        $xml += "<w:p><w:pPr><w:pBdr><w:left w:val=`"single`" w:sz=`"18`" w:space=`"8`" w:color=`"0891B2`"/></w:pBdr><w:ind w:left=`"200`"/><w:spacing w:after=`"160`"/></w:pPr>" +
                "<w:r><w:rPr><w:b/><w:sz w:val=`"18`"/><w:color w:val=`"0891B2`"/></w:rPr><w:t xml:space=`"preserve`">$(Esc $b.label.ToUpper()) — </w:t></w:r>" +
                "<w:r><w:rPr><w:sz w:val=`"20`"/><w:color w:val=`"334155`"/></w:rPr><w:t xml:space=`"preserve`">$(Esc $b.text)</w:t></w:r></w:p>"
      }
      'code' {
        foreach ($l in $b.lines) {
          $xml += "<w:p><w:pPr><w:ind w:left=`"340`"/><w:spacing w:after=`"0`"/></w:pPr>" +
                  "<w:r><w:rPr><w:rFonts w:ascii=`"Consolas`" w:hAnsi=`"Consolas`"/><w:sz w:val=`"18`"/><w:color w:val=`"0E7490`"/></w:rPr>" +
                  "<w:t xml:space=`"preserve`">$(Esc $l)</w:t></w:r></w:p>"
        }
        $xml += "<w:p><w:pPr><w:spacing w:after=`"120`"/></w:pPr></w:p>"
      }
      'rule' {
        $xml += "<w:p><w:pPr><w:pBdr><w:bottom w:val=`"single`" w:sz=`"6`" w:space=`"1`" w:color=`"CBD5E1`"/></w:pBdr></w:pPr></w:p>"
      }
      'pagebreak' {
        $xml += "<w:p><w:r><w:br w:type=`"page`"/></w:r></w:p>"
      }
      'table' {
        $cols = $b.head.Count
        $xml += "<w:tbl><w:tblPr><w:tblW w:w=`"5000`" w:type=`"pct`"/>" +
                "<w:tblBorders>" +
                "<w:top w:val=`"single`" w:sz=`"4`" w:color=`"CBD5E1`"/>" +
                "<w:bottom w:val=`"single`" w:sz=`"4`" w:color=`"CBD5E1`"/>" +
                "<w:left w:val=`"none`"/><w:right w:val=`"none`"/>" +
                "<w:insideH w:val=`"single`" w:sz=`"4`" w:color=`"E2E8F0`"/>" +
                "<w:insideV w:val=`"none`"/>" +
                "</w:tblBorders></w:tblPr>"
        # Cabecera
        $xml += "<w:tr><w:trPr><w:tblHeader/></w:trPr>"
        for ($c = 0; $c -lt $cols; $c++) {
          $w = [int]($b.widths[$c] * 50)
          $xml += "<w:tc><w:tcPr><w:tcW w:w=`"$w`" w:type=`"pct`"/><w:shd w:val=`"clear`" w:fill=`"F1F5F9`"/></w:tcPr>" +
                  "<w:p><w:pPr><w:spacing w:after=`"40`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"17`"/><w:color w:val=`"0891B2`"/></w:rPr>" +
                  "<w:t xml:space=`"preserve`">$(Esc ([string]$b.head[$c]).ToUpper())</w:t></w:r></w:p></w:tc>"
        }
        $xml += "</w:tr>"
        foreach ($row in $b.rows) {
          $xml += "<w:tr>"
          for ($c = 0; $c -lt $cols; $c++) {
            $w = [int]($b.widths[$c] * 50)
            $bold = if ($c -eq 0) { "<w:b/>" } else { "" }
            $xml += "<w:tc><w:tcPr><w:tcW w:w=`"$w`" w:type=`"pct`"/></w:tcPr>" +
                    "<w:p><w:pPr><w:spacing w:after=`"40`"/></w:pPr><w:r><w:rPr>$bold<w:sz w:val=`"18`"/><w:color w:val=`"1E293B`"/></w:rPr>" +
                    "<w:t xml:space=`"preserve`">$(Esc ([string]$row[$c]))</w:t></w:r></w:p></w:tc>"
          }
          $xml += "</w:tr>"
        }
        $xml += "</w:tbl><w:p><w:pPr><w:spacing w:after=`"120`"/></w:pPr></w:p>"
      }
    }
  }
  return $xml
}

function Save-Docx($blocks, [hashtable]$Meta, [string]$Path) {
  $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("docx_" + [System.IO.Path]::GetFileNameWithoutExtension($Path))
  if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
  New-Item -ItemType Directory -Path $tmp -Force | Out-Null

  $XD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  $WNS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
  $REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

  $body = ConvertTo-DocxBody $blocks

  Write-Part $tmp "word/document.xml" @"
$XD
<w:document xmlns:w="$WNS"><w:body>$body<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>
"@

  $styleP = {
    param($id, $name, $size, $color, $before)
    "<w:style w:type=`"paragraph`" w:styleId=`"$id`"><w:name w:val=`"$name`"/><w:basedOn w:val=`"Normal`"/><w:pPr><w:keepNext/><w:spacing w:before=`"$before`" w:after=`"120`"/></w:pPr><w:rPr><w:b/><w:sz w:val=`"$size`"/><w:color w:val=`"$color`"/></w:rPr></w:style>"
  }

  Write-Part $tmp "word/styles.xml" @"
$XD
<w:styles xmlns:w="$WNS"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="20"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>$(& $styleP 'Title' 'Title' 48 '0F172A' 0)$(& $styleP 'Heading1' 'heading 1' 30 '0891B2' 360)$(& $styleP 'Heading2' 'heading 2' 24 '0F172A' 280)$(& $styleP 'Heading3' 'heading 3' 21 '334155' 200)</w:styles>
"@

  Write-Part $tmp "word/_rels/document.xml.rels" @"
$XD
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="$REL/styles" Target="styles.xml"/></Relationships>
"@

  Write-Part $tmp "_rels/.rels" @"
$XD
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="$REL/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="$REL/extended-properties" Target="docProps/app.xml"/></Relationships>
"@

  Write-Part $tmp "docProps/core.xml" @"
$XD
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>$(Esc $Meta.Title)</dc:title><dc:subject>$(Esc $Meta.Subject)</dc:subject><dc:creator>$(Esc $Meta.Author)</dc:creator><cp:keywords>$(Esc $Meta.Keywords)</cp:keywords><cp:revision>1</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">2026-08-21T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-08-21T00:00:00Z</dcterms:modified></cp:coreProperties>
"@

  Write-Part $tmp "docProps/app.xml" @"
$XD
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>DIAT PUCV lib-doc.ps1</Application><Company>$(Esc $Meta.Author)</Company></Properties>
"@

  Write-Part $tmp "[Content_Types].xml" @"
$XD
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>
"@

  New-OoxmlPackage $tmp $Path
  Remove-Item $tmp -Recurse -Force
}

# ═════════════════════════════════════════════════════════════════════════════
# SALIDA 2 · PDF (A4 vertical, fondo blanco)
# ═════════════════════════════════════════════════════════════════════════════
$Global:DOC_PAL = @{
  paper='FFFFFF'; ink='0F172A'; body='1E293B'; soft='475569'; faint='94A3B8'
  accent='0891B2'; accentSoft='E0F2FE'; rule='CBD5E1'; band='F1F5F9'; code='F8FAFC'
}

function Save-DocPdf($blocks, [hashtable]$Meta, [string]$Path) {
  $script:W = 595.28; $script:H = 841.89
  $script:ML = 62; $script:MR = $script:W - 62; $script:CW = $script:MR - $script:ML
  $script:TOP = 64; $script:BOTTOM = 66

  $script:pdf = New-Pdf $script:W $script:H $Meta
  $script:page = $null
  $script:y = 0
  $script:pageNo = 0
  $script:runningHead = [string]$Meta.Title

  function New-DocPage {
    $script:pageNo++
    $script:page = Add-PdfPage $script:pdf
    Add-PdfRect $script:pdf $script:page 0 0 $script:W $script:H $DOC_PAL.paper
    Add-PdfRect $script:pdf $script:page 0 0 ($script:W / 2) 3 $DOC_PAL.accent
    Add-PdfRect $script:pdf $script:page ($script:W / 2) 0 ($script:W / 2) 3 '6366F1'
    if ($script:pageNo -gt 1) {
      Add-PdfText $script:pdf $script:page $script:ML 34 8 'C' $DOC_PAL.faint $script:runningHead
      Add-PdfRect $script:pdf $script:page $script:ML 46 $script:CW 0.6 $DOC_PAL.rule
    }
    Add-PdfRect $script:pdf $script:page $script:ML ($script:H - 52) $script:CW 0.6 $DOC_PAL.rule
    Add-PdfText $script:pdf $script:page $script:ML ($script:H - 44) 8 'C' $DOC_PAL.faint 'Taller de Prompting Jurídico 3.0 · DIAT PUCV · 2026'
    Add-PdfText $script:pdf $script:page ($script:MR - 20) ($script:H - 44) 8 'C' $DOC_PAL.faint ([string]$script:pageNo)
    $script:y = if ($script:pageNo -eq 1) { $script:TOP } else { $script:TOP + 6 }
  }

  function Need([double]$h) {
    if ($script:y + $h -gt $script:H - $script:BOTTOM) { New-DocPage }
  }

  New-DocPage

  foreach ($b in $blocks) {
    switch ($b.t) {
      'title' {
        Need 60
        foreach ($l in (Split-PdfText $b.text 26 'HB' $script:CW)) {
          Add-PdfText $script:pdf $script:page $script:ML $script:y 26 'HB' $DOC_PAL.ink $l; $script:y += 32
        }
        $script:y += 4
      }
      'subtitle' {
        Need 30
        $script:y = Add-PdfParagraph $script:pdf $script:page $script:ML $script:y $script:CW 13 'H' $DOC_PAL.accent $b.text 18
        $script:y += 4
      }
      'meta' {
        Need 20
        Add-PdfText $script:pdf $script:page $script:ML $script:y 9 'C' $DOC_PAL.soft $b.text
        $script:y += 15
      }
      'h1' {
        Need 46
        $script:y += 14
        Add-PdfText $script:pdf $script:page $script:ML $script:y 8.5 'CB' $DOC_PAL.accent $b.text.ToUpper()
        $script:y += 13
        Add-PdfRect $script:pdf $script:page $script:ML $script:y $script:CW 1 $DOC_PAL.accent
        $script:y += 12
      }
      'h2' {
        Need 34
        $script:y += 8
        foreach ($l in (Split-PdfText $b.text 14 'HB' $script:CW)) {
          Add-PdfText $script:pdf $script:page $script:ML $script:y 14 'HB' $DOC_PAL.ink $l; $script:y += 19
        }
        $script:y += 3
      }
      'h3' {
        Need 26
        $script:y += 5
        Add-PdfText $script:pdf $script:page $script:ML $script:y 11 'HB' $DOC_PAL.soft $b.text
        $script:y += 17
      }
      'lead' {
        Need 24
        $script:y = Add-PdfParagraph $script:pdf $script:page $script:ML $script:y $script:CW 11 'H' $DOC_PAL.soft $b.text 16
        $script:y += 5
      }
      'p' {
        foreach ($l in (Split-PdfText $b.text 10.5 "H" $script:CW)) {
          Need 15
          Add-PdfText $script:pdf $script:page $script:ML $script:y 10.5 "H" $DOC_PAL.body $l; $script:y += 16
        }
        $script:y += 5
      }
      'bullet' {
        $lines = Split-PdfText $b.text 10.5 "H" ($script:CW - 16)
        Need ($lines.Count * 16 + 4)
        Add-PdfText $script:pdf $script:page $script:ML $script:y 10 'H' $DOC_PAL.accent '·'
        foreach ($l in $lines) { Add-PdfText $script:pdf $script:page ($script:ML + 14) $script:y 10.5 "H" $DOC_PAL.body $l; $script:y += 16 }
        $script:y += 3
      }
      'num' {
        $lines = Split-PdfText $b.text 10.5 "H" ($script:CW - 22)
        Need ($lines.Count * 16 + 4)
        Add-PdfText $script:pdf $script:page $script:ML $script:y 9 'CB' $DOC_PAL.accent ("{0:D2}" -f $b.n)
        foreach ($l in $lines) { Add-PdfText $script:pdf $script:page ($script:ML + 22) $script:y 10.5 "H" $DOC_PAL.body $l; $script:y += 16 }
        $script:y += 3
      }
      'kv' {
        $labelW = (Measure-PdfText ($b.label.ToUpper() + ': ') 8.5 'CB')
        $lines = Split-PdfText $b.text 10 'H' ($script:CW - $labelW - 4)
        Need ($lines.Count * 16 + 4)
        Add-PdfText $script:pdf $script:page $script:ML $script:y 8.5 'CB' $DOC_PAL.accent ($b.label.ToUpper() + ':')
        $first = $true
        foreach ($l in $lines) {
          $x = if ($first) { $script:ML + $labelW } else { $script:ML + $labelW }
          Add-PdfText $script:pdf $script:page $x $script:y 10.5 "H" $DOC_PAL.body $l; $script:y += 16
          $first = $false
        }
        $script:y += 3
      }
      'callout' {
        $lines = Split-PdfText $b.text 10.5 "H" ($script:CW - 26)
        $h = $lines.Count * 16 + 26
        Need ($h + 6)
        Add-PdfRect $script:pdf $script:page $script:ML $script:y $script:CW $h $DOC_PAL.band
        Add-PdfRect $script:pdf $script:page $script:ML $script:y 2.5 $h $DOC_PAL.accent
        Add-PdfText $script:pdf $script:page ($script:ML + 14) ($script:y + 8) 8 'CB' $DOC_PAL.accent $b.label.ToUpper()
        $iy = $script:y + 22
        foreach ($l in $lines) { Add-PdfText $script:pdf $script:page ($script:ML + 14) $iy 10.5 "H" $DOC_PAL.body $l; $iy += 16 }
        $script:y += $h + 8
      }
      'quote' {
        $lines = Split-PdfText $b.text 13 'HB' ($script:CW - 20)
        Need ($lines.Count * 18 + 10)
        Add-PdfRect $script:pdf $script:page $script:ML $script:y 2.5 ($lines.Count * 18 + 4) $DOC_PAL.accent
        foreach ($l in $lines) { Add-PdfText $script:pdf $script:page ($script:ML + 16) $script:y 13 'HB' $DOC_PAL.ink $l; $script:y += 18 }
        $script:y += 10
      }
      'code' {
        $h = $b.lines.Count * 13.5 + 16
        Need ($h + 6)
        Add-PdfRect $script:pdf $script:page $script:ML $script:y $script:CW $h $DOC_PAL.code
        Add-PdfRect $script:pdf $script:page $script:ML $script:y 2 $h $DOC_PAL.accent
        $iy = $script:y + 9
        foreach ($l in $b.lines) { Add-PdfText $script:pdf $script:page ($script:ML + 12) $iy 9 'C' '0E7490' $l; $iy += 13.5 }
        $script:y += $h + 8
      }
      'rule' {
        Need 12
        Add-PdfRect $script:pdf $script:page $script:ML $script:y $script:CW 0.6 $DOC_PAL.rule
        $script:y += 12
      }
      'pagebreak' { New-DocPage }
      'table' {
        $cols = $b.head.Count
        $total = 0
        foreach ($w in $b.widths) { $total += $w }
        $colW = @()
        foreach ($w in $b.widths) { $colW += ($w / $total) * $script:CW }

        $drawHead = {
          Add-PdfRect $script:pdf $script:page $script:ML $script:y $script:CW 18 $DOC_PAL.band
          $x = $script:ML
          for ($c = 0; $c -lt $cols; $c++) {
            Add-PdfText $script:pdf $script:page ($x + 6) ($script:y + 5) 8 'CB' $DOC_PAL.accent ([string]$b.head[$c]).ToUpper()
            $x += $colW[$c]
          }
          $script:y += 18
        }
        Need 40
        & $drawHead

        $r = 0
        foreach ($row in $b.rows) {
          $cellLines = @()
          $maxL = 1
          for ($c = 0; $c -lt $cols; $c++) {
            $ls = Split-PdfText ([string]$row[$c]) 9.5 "H" ($colW[$c] - 12)
            $cellLines += ,$ls
            if ($ls.Count -gt $maxL) { $maxL = $ls.Count }
          }
          $h = $maxL * 13.5 + 8
          if ($script:y + $h -gt $script:H - $script:BOTTOM) { New-DocPage; & $drawHead }
          if ($r % 2 -eq 1) { Add-PdfRect $script:pdf $script:page $script:ML $script:y $script:CW $h 'F8FAFC' }
          $x = $script:ML
          for ($c = 0; $c -lt $cols; $c++) {
            $iy = $script:y + 5
            $font = if ($c -eq 0) { 'HB' } else { 'H' }
            foreach ($l in $cellLines[$c]) {
              Add-PdfText $script:pdf $script:page ($x + 6) $iy 9.5 $font $DOC_PAL.body $l; $iy += 13.5
            }
            $x += $colW[$c]
          }
          Add-PdfRect $script:pdf $script:page $script:ML ($script:y + $h) $script:CW 0.4 $DOC_PAL.rule
          $script:y += $h
          $r++
        }
        $script:y += 12
      }
    }
  }

  Save-Pdf $script:pdf $Path
}
