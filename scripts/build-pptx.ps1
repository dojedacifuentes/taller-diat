# ─────────────────────────────────────────────────────────────────────────────
# build-pptx.ps1 — genera las presentaciones del taller a partir de los JSON
# de materials/decks/. Sin dependencias externas: escribe OOXML directamente.
#
#   powershell -ExecutionPolicy Bypass -File scripts/build-pptx.ps1
#
# Salida: public/materiales/*.pptx
# ─────────────────────────────────────────────────────────────────────────────
param(
  [string]$DecksDir = "materials/decks",
  [string]$OutDir   = "public/materiales"
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'lib-ooxml.ps1')

# ─── Geometría de diapositiva 16:9 ───────────────────────────────────────────
$PT = 12700                  # 1 punto = 12700 EMU
$SW = 960                    # ancho en puntos
$SH = 540                    # alto en puntos
$ML = 56                     # margen izquierdo
$MR = $SW - 56               # margen derecho
$CW = $MR - $ML              # ancho útil

$script:ShapeId = 1
function NextId { $script:ShapeId++; return $script:ShapeId }

# ─── Constructores de texto ──────────────────────────────────────────────────
function Run([string]$text, [hashtable]$o) {
  $sz    = if ($o.sz)    { $o.sz }    else { 1400 }
  $b     = if ($o.b)     { 1 }        else { 0 }
  $i     = if ($o.i)     { 1 }        else { 0 }
  $col   = if ($o.col)   { $o.col }   else { $PAL.grayL }
  $font  = if ($o.mono)  { 'Consolas' } else { 'Trebuchet MS' }
  $spc   = if ($o.spc)   { " spc=`"$($o.spc)`"" } else { '' }
  $caps  = if ($o.caps)  { ' cap="all"' } else { '' }
  "<a:r><a:rPr lang=`"es-CL`" sz=`"$sz`" b=`"$b`" i=`"$i`"$spc$caps dirty=`"0`"><a:solidFill><a:srgbClr val=`"$col`"/></a:solidFill><a:latin typeface=`"$font`"/><a:cs typeface=`"$font`"/></a:rPr><a:t>$(Esc $text)</a:t></a:r>"
}

function Para([string]$text, [hashtable]$o) {
  if ($null -eq $o) { $o = @{} }
  $algn  = if ($o.algn)  { $o.algn }  else { 'l' }
  $space = if ($o.before){ "<a:spcBef><a:spcPts val=`"$($o.before)`"/></a:spcBef>" } else { '' }
  $lnSpc = if ($o.line)  { "<a:lnSpc><a:spcPct val=`"$($o.line)`"/></a:lnSpc>" } else { '' }
  $bullet = if ($o.bullet) {
    "<a:buClr><a:srgbClr val=`"$($o.bulletCol)`"/></a:buClr><a:buFont typeface=`"Arial`"/><a:buChar char=`"$($o.bullet)`"/>"
  } else { '<a:buNone/>' }
  $indent = if ($o.indent) { " marL=`"$($o.indent)`" indent=`"-$($o.indent)`"" } else { ' marL="0" indent="0"' }
  "<a:p><a:pPr$indent algn=`"$algn`">$lnSpc$space$bullet</a:pPr>$(Run $text $o)</a:p>"
}

# ─── Constructores de forma ──────────────────────────────────────────────────
function Box([int]$x, [int]$y, [int]$w, [int]$h, [string]$paras, [hashtable]$o) {
  if ($null -eq $o) { $o = @{} }
  $id = NextId
  $fill = if ($o.fill) { "<a:solidFill><a:srgbClr val=`"$($o.fill)`"/></a:solidFill>" } else { '<a:noFill/>' }
  $line = if ($o.stroke) { $sw = if ($o.strokeW) { $o.strokeW } else { 1 }; "<a:ln w=`"$([int]($sw * $PT / 2))`"><a:solidFill><a:srgbClr val=`"$($o.stroke)`"/></a:solidFill></a:ln>" } else { '<a:ln><a:noFill/></a:ln>' }
  $geom = if ($o.round) { "<a:prstGeom prst=`"roundRect`"><a:avLst><a:gd name=`"adj`" fmla=`"val $($o.round)`"/></a:avLst></a:prstGeom>" } else { '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>' }
  $anchor = if ($o.anchor) { $o.anchor } else { 't' }
  $pad = if ($null -ne $o.pad) { [int]($o.pad * $PT) } else { 0 }
  $body = if ($paras) { $paras } else { '<a:p><a:endParaRPr lang="es-CL"/></a:p>' }
  @"
<p:sp><p:nvSpPr><p:cNvPr id="$id" name="s$id"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="$($x*$PT)" y="$($y*$PT)"/><a:ext cx="$($w*$PT)" cy="$($h*$PT)"/></a:xfrm>$geom$fill$line</p:spPr><p:txBody><a:bodyPr wrap="square" lIns="$pad" tIns="$pad" rIns="$pad" bIns="$pad" anchor="$anchor"><a:normAutofit/></a:bodyPr><a:lstStyle/>$body</p:txBody></p:sp>
"@
}

function Rect([int]$x, [int]$y, [int]$w, [int]$h, [string]$fill) {
  Box $x $y $w $h '' @{ fill = $fill }
}

# ─── Bloques de contenido ────────────────────────────────────────────────────
# Cada bloque recibe la Y actual y devuelve @{ xml = '...'; y = <nueva Y> }.
# El vocabulario es deliberadamente corto: una idea por diapositiva.

function Render-Block($blk, [int]$y, [string]$acc) {
  $xml = ''
  switch ($blk.type) {

    'lead' {
      $h = [int]([math]::Ceiling($blk.text.Length / 78.0) * 26) + 8
      $xml = Box $ML $y $CW $h (Para $blk.text @{ sz = 1700; col = $PAL.grayL; line = '108000' })
      $y += $h + 14
    }

    'bullets' {
      foreach ($it in $blk.items) {
        $lines = [math]::Ceiling($it.Length / 88.0)
        $h = [int]($lines * 22) + 10
        $xml += Rect $ML ($y + 7) 3 14 $acc
        $xml += Box ($ML + 16) $y ($CW - 16) $h (Para $it @{ sz = 1400; col = $PAL.grayL; line = '104000' })
        $y += $h + 4
      }
      $y += 8
    }

    'chips' {
      $x = $ML
      foreach ($it in $blk.items) {
        $w = [int]($it.Length * 7.6) + 26
        if ($x + $w -gt $MR) { $x = $ML; $y += 34 }
        $xml += Box $x $y $w 26 (Para $it @{ sz = 1100; col = $PAL.cyanL; b = $true; algn = 'ctr'; mono = $true }) @{ fill = $PAL.bgCard; stroke = $acc; round = 22000; anchor = 'ctr' }
        $x += $w + 8
      }
      $y += 40
    }

    'cards' {
      $cols = if ($blk.cols) { [int]$blk.cols } else { 3 }
      $gap = 14
      $w = [int]((($CW) - ($gap * ($cols - 1))) / $cols)
      $rows = [math]::Ceiling($blk.items.Count / [double]$cols)
      $maxLen = 0
      foreach ($c in $blk.items) { if ($c.d -and $c.d.Length -gt $maxLen) { $maxLen = $c.d.Length } }
      $perLine = [math]::Max(18, [int]($w / 6.4))
      $h = 54 + ([math]::Ceiling($maxLen / [double]$perLine) * 19)
      $i = 0
      foreach ($c in $blk.items) {
        $r = [math]::Floor($i / $cols); $cIdx = $i % $cols
        $cx = $ML + $cIdx * ($w + $gap)
        $cy = $y + $r * ($h + $gap)
        $p = ''
        if ($c.n) { $p += Para $c.n @{ sz = 1000; col = $acc; b = $true; mono = $true; spc = 120 } }
        if ($c.t) { $p += Para $c.t @{ sz = 1350; col = $PAL.white; b = $true; before = 500 } }
        if ($c.d) { $p += Para $c.d @{ sz = 1100; col = $PAL.gray; before = 400; line = '102000' } }
        $xml += Box $cx $cy $w $h $p @{ fill = $PAL.bgCard; stroke = $PAL.line; round = 6000; pad = 16 }
        $i++
      }
      $y += ($rows * ($h + $gap)) + 6
    }

    'steps' {
      $n = $blk.items.Count
      $gap = 10
      $arrow = 20
      $w = [int]((($CW) - (($gap + $arrow) * ($n - 1))) / $n)
      $h = 92
      $i = 0
      foreach ($s in $blk.items) {
        $cx = $ML + $i * ($w + $gap + $arrow)
        $p  = Para ("0" + ($i + 1)) @{ sz = 1000; col = $acc; b = $true; mono = $true }
        $p += Para $s.t @{ sz = 1250; col = $PAL.white; b = $true; before = 500 }
        if ($s.d) { $p += Para $s.d @{ sz = 1000; col = $PAL.gray; before = 300; line = '102000' } }
        $xml += Box $cx $y $w $h $p @{ fill = $PAL.bgCard; stroke = $PAL.line; round = 6000; pad = 14 }
        if ($i -lt $n - 1) {
          $xml += Box ($cx + $w + $gap) ($y + 34) $arrow 24 (Para '>' @{ sz = 1400; col = $acc; b = $true; algn = 'ctr'; mono = $true }) @{ anchor = 'ctr' }
        }
        $i++
      }
      $y += $h + 16
    }

    'code' {
      $lines = @($blk.lines)
      $h = ($lines.Count * 20) + 30
      $p = ''
      $first = $true
      foreach ($l in $lines) {
        $col = if ($l -match '^\s*(#|//|—|▸)') { $PAL.gray } else { $PAL.cyanL }
        $bef = if ($first) { 0 } else { 300 }
        $p += Para $l @{ sz = 1150; col = $col; mono = $true; before = $bef }
        $first = $false
      }
      $xml = Box $ML $y $CW $h $p @{ fill = '05080E'; stroke = $acc; round = 4000; pad = 16 }
      if ($blk.label) {
        $lw = [int]($blk.label.Length * 6.6) + 20
        $xml += Box ($ML + 14) ($y - 9) $lw 18 (Para $blk.label @{ sz = 900; col = $acc; b = $true; mono = $true; algn = 'ctr'; caps = $true }) @{ fill = $PAL.bg; anchor = 'ctr' }
      }
      $y += $h + 16
    }

    'split' {
      $gap = 18
      $w = [int](($CW - $gap) / 2)
      $sides = @($blk.left, $blk.right)
      $cols  = @($(if ($blk.leftColor) { $blk.leftColor } else { $PAL.rose }), $(if ($blk.rightColor) { $blk.rightColor } else { $PAL.emerald }))
      $maxItems = [math]::Max($blk.left.items.Count, $blk.right.items.Count)
      $h = 52 + ($maxItems * 30)
      for ($s = 0; $s -lt 2; $s++) {
        $side = $sides[$s]; $c = $cols[$s]
        $cx = $ML + $s * ($w + $gap)
        $p = Para $side.label @{ sz = 1050; col = $c; b = $true; mono = $true; caps = $true; spc = 120 }
        foreach ($it in $side.items) {
          $p += Para $it @{ sz = 1200; col = $PAL.grayL; before = 700; line = '102000'; bullet = '·'; bulletCol = $c; indent = 120000 }
        }
        $xml += Box $cx $y $w $h $p @{ fill = $PAL.bgCard; stroke = $c; round = 5000; pad = 18 }
      }
      $y += $h + 14
    }

    'table' {
      $cols = $blk.head.Count
      $w = [int]($CW / $cols)
      $rh = 30
      $xml += Rect $ML $y $CW 26 $PAL.bgSoft
      for ($c = 0; $c -lt $cols; $c++) {
        $xml += Box ($ML + $c * $w) $y $w 26 (Para $blk.head[$c] @{ sz = 1000; col = $acc; b = $true; mono = $true; caps = $true }) @{ pad = 10; anchor = 'ctr' }
      }
      $y += 26
      $r = 0
      foreach ($row in $blk.rows) {
        $bg = if ($r % 2 -eq 0) { $PAL.bgCard } else { $PAL.bg }
        $xml += Rect $ML $y $CW $rh $bg
        for ($c = 0; $c -lt $cols; $c++) {
          $isFirst = ($c -eq 0)
          $xml += Box ($ML + $c * $w) $y $w $rh (Para $row[$c] @{ sz = 1100; col = $(if ($isFirst) { $PAL.white } else { $PAL.grayL }); b = $isFirst }) @{ pad = 10; anchor = 'ctr' }
        }
        $y += $rh
        $r++
      }
      $y += 16
    }

    'big' {
      $xml  = Box $ML $y $CW 96 (Para $blk.value @{ sz = 6600; col = $acc; b = $true; algn = 'ctr' }) @{ anchor = 'ctr' }
      $xml += Box $ML ($y + 96) $CW 34 (Para $blk.label @{ sz = 1400; col = $PAL.grayL; algn = 'ctr' })
      $y += 140
    }

    'quote' {
      $h = [int]([math]::Ceiling($blk.text.Length / 62.0) * 34) + 26
      $xml  = Rect $ML $y 4 $h $acc
      $xml += Box ($ML + 22) $y ($CW - 22) $h (Para $blk.text @{ sz = 2000; col = $PAL.white; b = $true; line = '110000' })
      $y += $h + 6
      if ($blk.cite) {
        $xml += Box ($ML + 22) $y ($CW - 22) 24 (Para $blk.cite @{ sz = 1100; col = $PAL.gray; mono = $true })
        $y += 30
      }
      $y += 10
    }

    'timeline' {
      foreach ($t in $blk.items) {
        $h = 34
        $xml += Box $ML $y 96 $h (Para $t.time @{ sz = 1150; col = $acc; b = $true; mono = $true; algn = 'ctr' }) @{ fill = $PAL.bgCard; stroke = $acc; round = 4000; anchor = 'ctr' }
        $xml += Box ($ML + 108) $y 132 $h (Para $t.who @{ sz = 1000; col = $PAL.grayL; b = $true; mono = $true; caps = $true }) @{ anchor = 'ctr'; pad = 4 }
        $xml += Box ($ML + 248) $y ($MR - $ML - 248) $h (Para $t.what @{ sz = 1250; col = $PAL.white }) @{ anchor = 'ctr' }
        $y += $h + 6
      }
      $y += 10
    }
  }
  return @{ xml = $xml; y = $y }
}

# ─── Composición de diapositiva ──────────────────────────────────────────────
function Build-Slide($slide, [int]$num, [int]$total, [string]$footer) {
  $acc = Accent $(if ($slide.accent) { $slide.accent } else { 'cyan' })
  $shapes = Rect 0 0 $SW $SH $PAL.bg

  if ($slide.type -eq 'cover') {
    $shapes += Rect 0 0 ($SW / 2) 6 $PAL.cyan
    $shapes += Rect ($SW / 2) 0 ($SW / 2) 6 $PAL.indigo
    $shapes += Box $ML 132 $CW 26 (Para $slide.kicker @{ sz = 1250; col = $PAL.cyan; b = $true; mono = $true; caps = $true; spc = 300 })
    $shapes += Box $ML 172 $CW 120 (Para $slide.title @{ sz = 4800; col = $PAL.white; b = $true; line = '96000' })
    if ($slide.lead) {
      $shapes += Box $ML 300 $CW 40 (Para $slide.lead @{ sz = 2000; col = $PAL.cyanL })
    }
    $shapes += Rect $ML 356 120 2 $PAL.cyan
    if ($slide.meta) {
      $my = 380
      foreach ($m in $slide.meta) {
        $shapes += Box $ML $my $CW 24 (Para $m @{ sz = 1300; col = $PAL.grayL; mono = $true })
        $my += 26
      }
    }
    $shapes += Box $ML 494 $CW 20 (Para $footer @{ sz = 1000; col = $PAL.grayD; mono = $true })
  }
  elseif ($slide.type -eq 'divider') {
    $shapes += Rect 0 0 $SW 6 $acc
    $shapes += Box $ML 214 $CW 30 (Para $slide.kicker @{ sz = 1200; col = $acc; b = $true; mono = $true; caps = $true; spc = 300 })
    $shapes += Box $ML 250 $CW 90 (Para $slide.title @{ sz = 3800; col = $PAL.white; b = $true; line = '98000' })
    if ($slide.lead) { $shapes += Box $ML 344 $CW 40 (Para $slide.lead @{ sz = 1600; col = $PAL.grayL }) }
    $shapes += Box $ML 494 $CW 20 (Para $footer @{ sz = 950; col = $PAL.grayD; mono = $true })
    $shapes += Box ($MR - 60) 494 60 20 (Para "$num / $total" @{ sz = 950; col = $PAL.grayD; mono = $true; algn = 'r' })
  }
  else {
    $shapes += Rect 0 0 ($SW / 2) 4 $PAL.cyan
    $shapes += Rect ($SW / 2) 0 ($SW / 2) 4 $PAL.indigo
    $y = 38
    if ($slide.kicker) {
      $shapes += Box $ML $y $CW 20 (Para $slide.kicker @{ sz = 1000; col = $acc; b = $true; mono = $true; caps = $true; spc = 220 })
      $y += 24
    }
    $tLines = [math]::Ceiling($slide.title.Length / 48.0)
    $tH = [int]($tLines * 40)
    $shapes += Box $ML $y $CW $tH (Para $slide.title @{ sz = 2900; col = $PAL.white; b = $true; line = '96000' })
    $y += $tH + 6
    $shapes += Rect $ML $y $CW 1 $PAL.line
    $y += 18

    foreach ($blk in $slide.blocks) {
      $r = Render-Block $blk $y $acc
      $shapes += $r.xml
      $y = $r.y
    }

    $shapes += Rect $ML 486 $CW 1 $PAL.line
    $shapes += Box $ML 494 ($CW - 70) 20 (Para $footer @{ sz = 950; col = $PAL.grayD; mono = $true })
    $shapes += Box ($MR - 60) 494 60 20 (Para "$num / $total" @{ sz = 950; col = $PAL.grayD; mono = $true; algn = 'r' })
  }

  @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>$shapes</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>
"@
}

# ─── Notas del presentador ───────────────────────────────────────────────────
function Build-Notes([string]$notes, [int]$num) {
  $paras = ''
  foreach ($line in ($notes -split "\r?\n")) {
    if ($line.Trim() -eq '') { $paras += '<a:p><a:endParaRPr lang="es-CL"/></a:p>'; continue }
    $bold = $line -match '^\[(DIEGO|RELATOR A|RELATOR B|ACTIVIDAD|TODOS|FACILITACIÓN)\]'
    $paras += "<a:p><a:r><a:rPr lang=`"es-CL`" sz=`"1200`" b=`"$(if($bold){1}else{0})`" dirty=`"0`"/><a:t>$(Esc $line)</a:t></a:r></a:p>"
  }
  if ($paras -eq '') { $paras = '<a:p><a:endParaRPr lang="es-CL"/></a:p>' }
  @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:notes xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id="2" name="Slide Image Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr><p:spPr/></p:sp><p:sp><p:nvSpPr><p:cNvPr id="3" name="Notes Placeholder 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/>$paras</p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="4" name="Slide Number Placeholder 3"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldNum" sz="quarter" idx="10"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="es-CL"/><a:t>$num</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>
"@
}

# ─── Partes estáticas del paquete OOXML ──────────────────────────────────────
$XMLDECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
$NSA = 'http://schemas.openxmlformats.org/drawingml/2006/main'
$NSR = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
$NSP = 'http://schemas.openxmlformats.org/presentationml/2006/main'

function Theme-Xml {
  $fs = '<a:effectStyle><a:effectLst/></a:effectStyle>'
  @"
$XMLDECL
<a:theme xmlns:a="$NSA" name="DIAT"><a:themeElements><a:clrScheme name="DIAT"><a:dk1><a:srgbClr val="070B12"/></a:dk1><a:lt1><a:srgbClr val="F8FAFC"/></a:lt1><a:dk2><a:srgbClr val="0C121E"/></a:dk2><a:lt2><a:srgbClr val="94A3B8"/></a:lt2><a:accent1><a:srgbClr val="06B6D4"/></a:accent1><a:accent2><a:srgbClr val="818CF8"/></a:accent2><a:accent3><a:srgbClr val="A855F7"/></a:accent3><a:accent4><a:srgbClr val="34D399"/></a:accent4><a:accent5><a:srgbClr val="FBBF24"/></a:accent5><a:accent6><a:srgbClr val="FB7185"/></a:accent6><a:hlink><a:srgbClr val="22D3EE"/></a:hlink><a:folHlink><a:srgbClr val="A855F7"/></a:folHlink></a:clrScheme><a:fontScheme name="DIAT"><a:majorFont><a:latin typeface="Trebuchet MS"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Trebuchet MS"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme><a:fmtScheme name="DIAT"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst>$fs$fs$fs</a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>
"@
}

function TxStyle {
  $lvls = ''
  for ($i = 1; $i -le 9; $i++) {
    $lvls += "<a:lvl${i}pPr marL=`"$(($i-1)*228600)`" algn=`"l`"><a:defRPr sz=`"1400`"><a:solidFill><a:schemeClr val=`"tx1`"/></a:solidFill><a:latin typeface=`"+mn-lt`"/></a:defRPr></a:lvl${i}pPr>"
  }
  return $lvls
}

function SlideMaster-Xml {
  $lv = TxStyle
  @"
$XMLDECL
<p:sldMaster xmlns:a="$NSA" xmlns:r="$NSR" xmlns:p="$NSP"><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="070B12"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="dk1" tx1="lt1" bg2="dk2" tx2="lt2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle>$lv</p:titleStyle><p:bodyStyle>$lv</p:bodyStyle><p:otherStyle>$lv</p:otherStyle></p:txStyles></p:sldMaster>
"@
}

function SlideLayout-Xml {
  @"
$XMLDECL
<p:sldLayout xmlns:a="$NSA" xmlns:r="$NSR" xmlns:p="$NSP" type="blank" preserve="1"><p:cSld name="En blanco"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>
"@
}

function NotesMaster-Xml {
  $lv = TxStyle
  @"
$XMLDECL
<p:notesMaster xmlns:a="$NSA" xmlns:r="$NSR" xmlns:p="$NSP"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id="2" name="Slide Image Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="1143000" y="685800"/><a:ext cx="4572000" cy="2571750"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:ln w="12700"><a:solidFill><a:prstClr val="black"/></a:solidFill></a:ln></p:spPr></p:sp><p:sp><p:nvSpPr><p:cNvPr id="3" name="Notes Placeholder 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="685800" y="3429000"/><a:ext cx="5486400" cy="3086100"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720"/><a:lstStyle/><a:p><a:endParaRPr lang="es-CL"/></a:p></p:txBody></p:sp></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:notesStyle>$lv</p:notesStyle></p:notesMaster>
"@
}

# ─── Ensamblado del paquete ──────────────────────────────────────────────────
function Build-Deck([string]$JsonPath, [string]$OutFile) {
  $deck = Get-Content -LiteralPath $JsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
  $slides = @($deck.slides)
  $n = $slides.Count
  $footer = $deck.footer
  $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("pptx_" + [System.IO.Path]::GetFileNameWithoutExtension($OutFile))
  if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
  New-Item -ItemType Directory -Path $tmp -Force | Out-Null

  $script:ShapeId = 1

  $sldIds = ''
  $sldRels = ''
  $ctOverrides = ''
  for ($i = 0; $i -lt $n; $i++) {
    $num = $i + 1
    Write-Part $tmp "ppt/slides/slide$num.xml" (Build-Slide $slides[$i] $num $n $footer)
    Write-Part $tmp "ppt/slides/_rels/slide$num.xml.rels" @"
$XMLDECL
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="$NSR/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="$NSR/notesSlide" Target="../notesSlides/notesSlide$num.xml"/></Relationships>
"@
    $notes = ''
    if ($slides[$i].notes) { $notes = $slides[$i].notes }
    Write-Part $tmp "ppt/notesSlides/notesSlide$num.xml" (Build-Notes $notes $num)
    Write-Part $tmp "ppt/notesSlides/_rels/notesSlide$num.xml.rels" @"
$XMLDECL
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="$NSR/notesMaster" Target="../notesMasters/notesMaster1.xml"/><Relationship Id="rId2" Type="$NSR/slide" Target="../slides/slide$num.xml"/></Relationships>
"@
    $rid = "rId" + ($num + 2)
    $sldIds = $sldIds + "<p:sldId id=`"$(255 + $num)`" r:id=`"$rid`"/>"
    $sldRels = $sldRels + "<Relationship Id=`"$rid`" Type=`"$NSR/slide`" Target=`"slides/slide$num.xml`"/>"
    $ctOverrides = $ctOverrides + "<Override PartName=`"/ppt/slides/slide$num.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.presentationml.slide+xml`"/>"
    $ctOverrides = $ctOverrides + "<Override PartName=`"/ppt/notesSlides/notesSlide$num.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml`"/>"
  }

  Write-Part $tmp "ppt/theme/theme1.xml"              (Theme-Xml)
  Write-Part $tmp "ppt/slideMasters/slideMaster1.xml" (SlideMaster-Xml)
  Write-Part $tmp "ppt/slideLayouts/slideLayout1.xml" (SlideLayout-Xml)
  Write-Part $tmp "ppt/notesMasters/notesMaster1.xml" (NotesMaster-Xml)

  Write-Part $tmp "ppt/slideMasters/_rels/slideMaster1.xml.rels" @"
$XMLDECL
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="$NSR/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="$NSR/theme" Target="../theme/theme1.xml"/></Relationships>
"@
  Write-Part $tmp "ppt/slideLayouts/_rels/slideLayout1.xml.rels" @"
$XMLDECL
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="$NSR/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>
"@
  Write-Part $tmp "ppt/notesMasters/_rels/notesMaster1.xml.rels" @"
$XMLDECL
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="$NSR/theme" Target="../theme/theme1.xml"/></Relationships>
"@

  Write-Part $tmp "ppt/presentation.xml" @"
$XMLDECL
<p:presentation xmlns:a="$NSA" xmlns:r="$NSR" xmlns:p="$NSP" saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:notesMasterIdLst><p:notesMasterId r:id="rId2"/></p:notesMasterIdLst><p:sldIdLst>$sldIds</p:sldIdLst><p:sldSz cx="12192000" cy="6858000"/><p:notesSz cx="6858000" cy="9144000"/><p:defaultTextStyle><a:defPPr><a:defRPr lang="es-CL"/></a:defPPr></p:defaultTextStyle></p:presentation>
"@

  $themeRid = "rId" + ($n + 3)
  Write-Part $tmp "ppt/_rels/presentation.xml.rels" @"
$XMLDECL
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="$NSR/slideMaster" Target="slideMasters/slideMaster1.xml"/><Relationship Id="rId2" Type="$NSR/notesMaster" Target="notesMasters/notesMaster1.xml"/>$sldRels<Relationship Id="$themeRid" Type="$NSR/theme" Target="theme/theme1.xml"/></Relationships>
"@

  Write-Part $tmp "_rels/.rels" @"
$XMLDECL
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="$NSR/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="$NSR/extended-properties" Target="docProps/app.xml"/></Relationships>
"@

  Write-Part $tmp "docProps/core.xml" @"
$XMLDECL
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>$(Esc $deck.title)</dc:title><dc:subject>$(Esc $deck.subject)</dc:subject><dc:creator>$(Esc $deck.creator)</dc:creator><cp:keywords>$(Esc $deck.keywords)</cp:keywords><cp:lastModifiedBy>$(Esc $deck.creator)</cp:lastModifiedBy><cp:revision>1</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">2026-08-21T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-08-21T00:00:00Z</dcterms:modified></cp:coreProperties>
"@

  Write-Part $tmp "docProps/app.xml" @"
$XMLDECL
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>DIAT PUCV build-pptx.ps1</Application><Slides>$n</Slides><Company>$(Esc $deck.creator)</Company></Properties>
"@

  Write-Part $tmp "[Content_Types].xml" @"
$XMLDECL
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/notesMasters/notesMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>$ctOverrides<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>
"@

  New-OoxmlPackage $tmp $OutFile
  Remove-Item $tmp -Recurse -Force
  return $n
}

# ─── Entrada ─────────────────────────────────────────────────────────────────
$root = Split-Path $PSScriptRoot -Parent
$deckPath = Join-Path $root $DecksDir
$decks = @(Get-ChildItem -Path $deckPath -Filter "*.json" | Sort-Object Name)
if ($decks.Count -eq 0) {
  Write-Host "Sin archivos de deck en $DecksDir"
  exit 0
}
Write-Host "Generando presentaciones ($($decks.Count))..."
foreach ($d in $decks) {
  $meta = Get-Content -LiteralPath $d.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
  $out = Join-Path $root (Join-Path $OutDir $meta.filename)
  $count = Build-Deck $d.FullName $out
  Write-Host ("      {0}: {1} diapositivas" -f $meta.filename, $count)
}
Write-Host "Listo."
