# ─────────────────────────────────────────────────────────────────────────────
# build-pdf-decks.ps1 — versión PDF de las presentaciones, desde el mismo JSON
# que produce los PPTX. Página de 960 × 540 pt (16:9), texto vectorial.
#
#   powershell -ExecutionPolicy Bypass -File scripts/build-pdf-decks.ps1
#
# Sirve para proyectar sin PowerPoint y como respaldo del plan de contingencia
# cuando no hay internet en la sala.
# ─────────────────────────────────────────────────────────────────────────────
param(
  [string]$DecksDir = "materials/decks",
  [string]$OutDir   = "public/materiales"
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'lib-pdf.ps1')

$PAL = @{
  bg='070B12'; bgCard='0C121E'; bgSoft='121A2E'; code='05080E'
  white='F8FAFC'; cyan='06B6D4'; cyanL='22D3EE'; indigo='818CF8'
  purple='A855F7'; emerald='34D399'; amber='FBBF24'; rose='FB7185'
  gray='64748B'; grayL='94A3B8'; grayD='334155'; line='1E293B'
}

function Accent([string]$n) { if ($PAL.ContainsKey($n)) { return $PAL[$n] } return $PAL.cyan }

$SW = 960; $SH = 540; $ML = 56; $MR = $SW - 56; $CW = $MR - $ML

# ─── Bloques ─────────────────────────────────────────────────────────────────
function Draw-Block($pdf, $page, $blk, [double]$y, [string]$acc) {
  switch ($blk.type) {

    'lead' {
      $y = Add-PdfParagraph $pdf $page $ML $y $CW 17 'H' $PAL.grayL $blk.text 24
      $y += 12
    }

    'bullets' {
      foreach ($it in $blk.items) {
        $lines = Split-PdfText $it 14 'H' ($CW - 18)
        Add-PdfRect $pdf $page $ML ($y + 4) 3 14 $acc
        $ly = $y
        foreach ($l in $lines) { Add-PdfText $pdf $page ($ML + 16) $ly 14 'H' $PAL.grayL $l; $ly += 19 }
        $y = $ly + 5
      }
      $y += 8
    }

    'chips' {
      $x = $ML
      foreach ($it in $blk.items) {
        $w = (Measure-PdfText $it 11 'CB') + 26
        if ($x + $w -gt $MR) { $x = $ML; $y += 34 }
        Add-PdfRect $pdf $page $x $y $w 26 $PAL.bgCard
        Add-PdfRect $pdf $page $x $y $w 1.2 $acc
        Add-PdfText $pdf $page ($x + 13) ($y + 7) 11 'CB' $PAL.cyanL $it
        $x += $w + 8
      }
      $y += 40
    }

    'cards' {
      $cols = if ($blk.cols) { [int]$blk.cols } else { 3 }
      $gap = 14
      $w = ($CW - $gap * ($cols - 1)) / $cols
      $maxLines = 1
      foreach ($c in $blk.items) {
        if ($c.d) {
          $n = (Split-PdfText $c.d 11 'H' ($w - 32)).Count
          if ($n -gt $maxLines) { $maxLines = $n }
        }
      }
      $h = 56 + $maxLines * 16
      $i = 0
      foreach ($c in $blk.items) {
        $r = [math]::Floor($i / $cols); $cIdx = $i % $cols
        $cx = $ML + $cIdx * ($w + $gap)
        $cy = $y + $r * ($h + $gap)
        Add-PdfRect $pdf $page $cx $cy $w $h $PAL.bgCard
        Add-PdfRect $pdf $page $cx $cy 2.5 $h $acc
        $iy = $cy + 14
        if ($c.n) { Add-PdfText $pdf $page ($cx + 16) $iy 10 'CB' $acc $c.n; $iy += 16 }
        if ($c.t) { Add-PdfText $pdf $page ($cx + 16) $iy 13 'HB' $PAL.white $c.t; $iy += 18 }
        if ($c.d) {
          foreach ($l in (Split-PdfText $c.d 11 'H' ($w - 32))) {
            Add-PdfText $pdf $page ($cx + 16) $iy 11 'H' $PAL.gray $l; $iy += 15
          }
        }
        $i++
      }
      $rows = [math]::Ceiling($blk.items.Count / [double]$cols)
      $y += $rows * ($h + $gap) + 6
    }

    'steps' {
      $n = $blk.items.Count
      $gap = 10; $arrow = 20
      $w = ($CW - ($gap + $arrow) * ($n - 1)) / $n
      $h = 94
      $i = 0
      foreach ($s in $blk.items) {
        $cx = $ML + $i * ($w + $gap + $arrow)
        Add-PdfRect $pdf $page $cx $y $w $h $PAL.bgCard
        Add-PdfRect $pdf $page $cx $y 2.5 $h $acc
        Add-PdfText $pdf $page ($cx + 14) ($y + 13) 10 'CB' $acc ("0" + ($i + 1))
        $ty = $y + 31
        foreach ($l in (Split-PdfText $s.t 12.5 'HB' ($w - 28))) {
          Add-PdfText $pdf $page ($cx + 14) $ty 12.5 'HB' $PAL.white $l; $ty += 16
        }
        if ($s.d) {
          $ty += 2
          foreach ($l in (Split-PdfText $s.d 10 'H' ($w - 28))) {
            Add-PdfText $pdf $page ($cx + 14) $ty 10 'H' $PAL.gray $l; $ty += 13
          }
        }
        if ($i -lt $n - 1) {
          Add-PdfText $pdf $page ($cx + $w + $gap + 6) ($y + $h / 2 - 8) 14 'CB' $acc '>'
        }
        $i++
      }
      $y += $h + 16
    }

    'code' {
      $lines = @($blk.lines)
      $h = $lines.Count * 20 + 30
      Add-PdfRect $pdf $page $ML $y $CW $h $PAL.code
      Add-PdfRect $pdf $page $ML $y 2.5 $h $acc
      $ly = $y + 15
      foreach ($l in $lines) {
        $col = if ($l -match '^\s*(#|//)') { $PAL.gray } else { $PAL.cyanL }
        Add-PdfText $pdf $page ($ML + 16) $ly 11.5 'C' $col $l
        $ly += 20
      }
      if ($blk.label) {
        $lw = (Measure-PdfText $blk.label 9 'CB') + 20
        Add-PdfRect $pdf $page ($ML + 14) ($y - 9) $lw 18 $PAL.bg
        Add-PdfText $pdf $page ($ML + 24) ($y - 5) 9 'CB' $acc $blk.label
      }
      $y += $h + 16
    }

    'split' {
      $gap = 18
      $w = ($CW - $gap) / 2
      $sides = @($blk.left, $blk.right)
      $cols = @($PAL.rose, $PAL.emerald)
      $maxItems = [math]::Max($blk.left.items.Count, $blk.right.items.Count)
      $h = 54 + $maxItems * 30
      for ($s = 0; $s -lt 2; $s++) {
        $side = $sides[$s]; $c = $cols[$s]
        $cx = $ML + $s * ($w + $gap)
        Add-PdfRect $pdf $page $cx $y $w $h $PAL.bgCard
        Add-PdfRect $pdf $page $cx $y 2.5 $h $c
        Add-PdfText $pdf $page ($cx + 18) ($y + 16) 10.5 'CB' $c $side.label.ToUpper()
        $iy = $y + 42
        foreach ($it in $side.items) {
          Add-PdfText $pdf $page ($cx + 18) $iy 12 'H' $c '·'
          foreach ($l in (Split-PdfText $it 12 'H' ($w - 46))) {
            Add-PdfText $pdf $page ($cx + 30) $iy 12 'H' $PAL.grayL $l; $iy += 16
          }
          $iy += 8
        }
      }
      $y += $h + 14
    }

    'table' {
      $cols = $blk.head.Count
      $w = $CW / $cols
      Add-PdfRect $pdf $page $ML $y $CW 26 $PAL.bgSoft
      for ($c = 0; $c -lt $cols; $c++) {
        Add-PdfText $pdf $page ($ML + $c * $w + 10) ($y + 8) 10 'CB' $acc ([string]$blk.head[$c]).ToUpper()
      }
      $y += 26
      $r = 0
      foreach ($row in $blk.rows) {
        $cellLines = @()
        $maxL = 1
        for ($c = 0; $c -lt $cols; $c++) {
          $ls = Split-PdfText ([string]$row[$c]) 11 'H' ($w - 20)
          $cellLines += ,$ls
          if ($ls.Count -gt $maxL) { $maxL = $ls.Count }
        }
        $h = [math]::Max(30, $maxL * 15 + 14)
        $bg = if ($r % 2 -eq 0) { $PAL.bgCard } else { $PAL.bg }
        Add-PdfRect $pdf $page $ML $y $CW $h $bg
        for ($c = 0; $c -lt $cols; $c++) {
          $ly = $y + 9
          $font = if ($c -eq 0) { 'HB' } else { 'H' }
          $col = if ($c -eq 0) { $PAL.white } else { $PAL.grayL }
          foreach ($l in $cellLines[$c]) {
            Add-PdfText $pdf $page ($ML + $c * $w + 10) $ly 11 $font $col $l; $ly += 15
          }
        }
        $y += $h
        $r++
      }
      $y += 16
    }

    'quote' {
      $lines = Split-PdfText $blk.text 20 'HB' ($CW - 26)
      $h = $lines.Count * 28 + 16
      Add-PdfRect $pdf $page $ML $y 4 $h $acc
      $ly = $y + 6
      foreach ($l in $lines) { Add-PdfText $pdf $page ($ML + 22) $ly 20 'HB' $PAL.white $l; $ly += 28 }
      $y += $h + 4
      if ($blk.cite) {
        Add-PdfText $pdf $page ($ML + 22) $y 11 'C' $PAL.gray $blk.cite
        $y += 26
      }
      $y += 10
    }

    'timeline' {
      foreach ($t in $blk.items) {
        Add-PdfRect $pdf $page $ML $y 96 34 $PAL.bgCard
        Add-PdfRect $pdf $page $ML $y 2.5 34 $acc
        Add-PdfText $pdf $page ($ML + 14) ($y + 11) 11.5 'CB' $acc $t.time
        Add-PdfText $pdf $page ($ML + 108) ($y + 11) 10 'CB' $PAL.grayL ([string]$t.who).ToUpper()
        foreach ($l in (Split-PdfText $t.what 12.5 'H' ($MR - $ML - 258))) {
          Add-PdfText $pdf $page ($ML + 248) ($y + 11) 12.5 'H' $PAL.white $l
          break
        }
        $y += 40
      }
      $y += 10
    }
  }
  return $y
}

# ─── Diapositiva ─────────────────────────────────────────────────────────────
function Draw-Slide($pdf, $slide, [int]$num, [int]$total, [string]$footer) {
  $page = Add-PdfPage $pdf
  $acc = Accent $(if ($slide.accent) { $slide.accent } else { 'cyan' })

  Add-PdfRect $pdf $page 0 0 $SW $SH $PAL.bg

  if ($slide.type -eq 'cover') {
    Add-PdfRect $pdf $page 0 0 ($SW / 2) 6 $PAL.cyan
    Add-PdfRect $pdf $page ($SW / 2) 0 ($SW / 2) 6 $PAL.indigo
    Add-PdfText $pdf $page $ML 132 12.5 'CB' $PAL.cyan $slide.kicker.ToUpper()
    $y = 168
    foreach ($l in (Split-PdfText $slide.title 44 'HB' $CW)) {
      Add-PdfText $pdf $page $ML $y 44 'HB' $PAL.white $l; $y += 54
    }
    if ($slide.lead) { Add-PdfText $pdf $page $ML ($y + 8) 19 'H' $PAL.cyanL $slide.lead; $y += 40 }
    Add-PdfRect $pdf $page $ML ($y + 20) 120 2 $PAL.cyan
    $my = $y + 40
    foreach ($m in $slide.meta) { Add-PdfText $pdf $page $ML $my 12.5 'C' $PAL.grayL $m; $my += 22 }
    Add-PdfText $pdf $page $ML 502 10 'C' $PAL.grayD $footer
    return
  }

  if ($slide.type -eq 'divider') {
    Add-PdfRect $pdf $page 0 0 $SW 6 $acc
    Add-PdfText $pdf $page $ML 216 12 'CB' $acc $slide.kicker.ToUpper()
    $y = 250
    foreach ($l in (Split-PdfText $slide.title 36 'HB' $CW)) {
      Add-PdfText $pdf $page $ML $y 36 'HB' $PAL.white $l; $y += 44
    }
    if ($slide.lead) { Add-PdfText $pdf $page $ML ($y + 6) 16 'H' $PAL.grayL $slide.lead }
    Add-PdfText $pdf $page $ML 502 9.5 'C' $PAL.grayD $footer
    Add-PdfText $pdf $page ($MR - 44) 502 9.5 'C' $PAL.grayD "$num / $total"
    return
  }

  Add-PdfRect $pdf $page 0 0 ($SW / 2) 4 $PAL.cyan
  Add-PdfRect $pdf $page ($SW / 2) 0 ($SW / 2) 4 $PAL.indigo

  $y = 38
  if ($slide.kicker) {
    Add-PdfText $pdf $page $ML $y 10 'CB' $acc $slide.kicker.ToUpper()
    $y += 24
  }
  foreach ($l in (Split-PdfText $slide.title 28 'HB' $CW)) {
    Add-PdfText $pdf $page $ML $y 28 'HB' $PAL.white $l; $y += 36
  }
  $y += 4
  Add-PdfRect $pdf $page $ML $y $CW 1 $PAL.line
  $y += 18

  foreach ($blk in $slide.blocks) { $y = Draw-Block $pdf $page $blk $y $acc }

  Add-PdfRect $pdf $page $ML 486 $CW 1 $PAL.line
  Add-PdfText $pdf $page $ML 494 9.5 'C' $PAL.grayD $footer
  Add-PdfText $pdf $page ($MR - 44) 494 9.5 'C' $PAL.grayD "$num / $total"
}

# ─── Entrada ─────────────────────────────────────────────────────────────────
$root = Split-Path $PSScriptRoot -Parent
$decks = @(Get-ChildItem -Path (Join-Path $root $DecksDir) -Filter '*.json' | Sort-Object Name)
Write-Host "Generando PDF de presentaciones ($($decks.Count))..."

foreach ($d in $decks) {
  $deck = Get-Content -LiteralPath $d.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
  $pdf = New-Pdf $SW $SH @{
    Title = $deck.title; Author = $deck.creator; Subject = $deck.subject; Keywords = $deck.keywords
  }
  $slides = @($deck.slides)
  for ($i = 0; $i -lt $slides.Count; $i++) {
    Draw-Slide $pdf $slides[$i] ($i + 1) $slides.Count $deck.footer
  }
  $out = Join-Path $root (Join-Path $OutDir ([System.IO.Path]::ChangeExtension($deck.filename, 'pdf')))
  Save-Pdf $pdf $out
}
Write-Host "Listo."
