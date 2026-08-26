# ─────────────────────────────────────────────────────────────────────────────
# extract-runofshow.ps1 — deriva materials/runOfShow.json desde
# src/data/sessionPlan.ts.
#
# El cronograma vive en TypeScript porque allí se comprueban sus invariantes
# (90 minutos exactos, sin huecos) y allí lo consume la web. Los guiones y el
# manual se generan con PowerShell, que no puede importar TypeScript, así que
# este script extrae los datos en vez de duplicarlos a mano: si alguien cambia
# un bloque, los guiones cambian con él.
#
#   powershell -ExecutionPolicy Bypass -File scripts/extract-runofshow.ps1
# ─────────────────────────────────────────────────────────────────────────────
param(
  [string]$Source = "src/data/sessionPlan.ts",
  [string]$Out    = "materials/runOfShow.json"
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$src = Get-Content -LiteralPath (Join-Path $root $Source) -Raw -Encoding UTF8

# Quita comentarios de línea para que no interfieran con las expresiones.
$clean = [regex]::Replace($src, '(?m)^\s*//.*$', '')

# Toma el valor de una cadena TypeScript entre comillas simples, admitiendo
# saltos de línea antes del literal y comillas escapadas dentro.
function Get-Str([string]$text, [string]$key) {
  $m = [regex]::Match($text, "$key\s*:\s*\r?\n?\s*'((?:[^'\\]|\\.)*)'")
  if (-not $m.Success) { return $null }
  return $m.Groups[1].Value -replace "\\'", "'"
}

function Get-StrArray([string]$text, [string]$key) {
  $m = [regex]::Match($text, "$key\s*:\s*\[(.*?)\]", 'Singleline')
  if (-not $m.Success) { return @() }
  $items = [regex]::Matches($m.Groups[1].Value, "'((?:[^'\\]|\\.)*)'")
  return @($items | ForEach-Object { $_.Groups[1].Value -replace "\\'", "'" })
}

# Trocea el archivo por sesión.
$sessionChunks = [regex]::Matches($clean, 'sessionId:\s*(\d+)(.*?)(?=sessionId:\s*\d+|export const sessionPlans)', 'Singleline')
if ($sessionChunks.Count -eq 0) { throw "No se encontró ninguna sesión en $Source" }

$plans = @()
foreach ($sc in $sessionChunks) {
  $id = [int]$sc.Groups[1].Value
  $body = $sc.Groups[2].Value

  $spine = Get-Str $body 'spine'
  $criterion = Get-Str $body 'successCriterion'

  # Bloques: desde 'blocks: [' hasta 'contingencies:'
  $blocksPart = [regex]::Match($body, 'blocks:\s*\[(.*?)\],\s*contingencies:', 'Singleline')
  if (-not $blocksPart.Success) { throw "Sesión ${id}: no se pudo aislar el bloque de cronograma." }

  $blockMatches = [regex]::Matches($blocksPart.Groups[1].Value, '\{\s*\r?\n?\s*from:\s*(\d+),\s*to:\s*(\d+),(.*?)\n\s*\},', 'Singleline')
  $blocks = @()
  foreach ($bm in $blockMatches) {
    $inner = $bm.Groups[3].Value
    $blocks += [ordered]@{
      from   = [int]$bm.Groups[1].Value
      to     = [int]$bm.Groups[2].Value
      title  = Get-Str $inner 'title'
      owner  = Get-Str $inner 'owner'
      mode   = Get-Str $inner 'mode'
      detail = Get-Str $inner 'detail'
      needs  = Get-StrArray $inner 'needs'
      tool   = Get-Str $inner 'tool'
    }
  }

  # Contingencias
  $contPart = [regex]::Match($body, 'contingencies:\s*\[(.*?)\n\s*\],', 'Singleline')
  $contMatches = [regex]::Matches($contPart.Groups[1].Value, '\{(.*?)\},', 'Singleline')
  $conts = @()
  foreach ($cm in $contMatches) {
    $conts += [ordered]@{
      when = Get-Str $cm.Groups[1].Value 'when'
      then = Get-Str $cm.Groups[1].Value 'then'
    }
  }

  $total = 0
  foreach ($b in $blocks) { $total += ($b.to - $b.from) }
  if ($total -ne 90) {
    throw "Sesión ${id}: se extrajeron $($blocks.Count) bloques que suman $total minutos. Debe ser 90. Revisa el formato de sessionPlan.ts."
  }

  $plans += [ordered]@{
    sessionId       = $id
    spine           = $spine
    successCriterion = $criterion
    blocks          = $blocks
    contingencies   = $conts
  }
}

$outPath = Join-Path $root $Out
$dir = Split-Path $outPath -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$json = $plans | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($outPath, $json, (New-Object System.Text.UTF8Encoding($false)))

foreach ($p in $plans) {
  Write-Host ("  Sesión {0}: {1} bloques · {2} contingencias" -f $p.sessionId, $p.blocks.Count, $p.contingencies.Count)
}
Write-Host ("  OK  {0}" -f $Out)
