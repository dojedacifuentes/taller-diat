# ─────────────────────────────────────────────────────────────────────────────
# lib-tsjson.ps1 — convierte un literal de array u objeto TypeScript en JSON.
#
# Por qué existe: el contenido del taller vive en src/data/*.ts, porque es lo
# que consume la web y porque allí se comprueban sus invariantes. Los guiones,
# el manual y las presentaciones se generan con PowerShell, que no puede
# importar TypeScript. En vez de duplicar el contenido a mano —con la garantía
# de que un día divergiría— se extrae de la fuente.
#
# Alcance deliberadamente limitado: literales de datos. Cadenas con comillas
# simples, dobles o backtick sin interpolación, números, booleanos, null,
# arrays, objetos, comentarios de línea y de bloque, y comas finales. No
# interpreta expresiones ni llamadas a funciones: si alguien las añade a un
# archivo de datos, la conversión falla en vez de adivinar.
# ─────────────────────────────────────────────────────────────────────────────

# Extrae el texto del literal asignado a `export const <Name>`.
function Get-TsLiteral([string]$source, [string]$name) {
  $m = [regex]::Match($source, "export\s+const\s+$name\s*(?::[^=]*)?=\s*")
  if (-not $m.Success) { throw "No se encontró 'export const $name' en el archivo." }
  $start = $m.Index + $m.Length
  $open = $source[$start]
  if ($open -ne '[' -and $open -ne '{') {
    throw "'$name' no es un literal de array u objeto (empieza por '$open')."
  }
  $close = if ($open -eq '[') { ']' } else { '}' }

  $depth = 0
  $i = $start
  $inStr = $false
  $quote = [char]0
  while ($i -lt $source.Length) {
    $c = $source[$i]
    if ($inStr) {
      if ($c -eq '\') { $i += 2; continue }
      if ($c -eq $quote) { $inStr = $false }
    } else {
      if ($c -eq "'" -or $c -eq '"' -or $c -eq '`') { $inStr = $true; $quote = $c }
      elseif ($c -eq '/' -and $i + 1 -lt $source.Length -and $source[$i + 1] -eq '/') {
        while ($i -lt $source.Length -and $source[$i] -ne "`n") { $i++ }
        continue
      }
      elseif ($c -eq $open) { $depth++ }
      elseif ($c -eq $close) {
        $depth--
        if ($depth -eq 0) { return $source.Substring($start, $i - $start + 1) }
      }
    }
    $i++
  }
  throw "El literal '$name' no está cerrado."
}

# Convierte el literal TypeScript en JSON válido.
function ConvertFrom-TsLiteral([string]$literal) {
  $sb = New-Object System.Text.StringBuilder
  $i = 0
  $n = $literal.Length

  while ($i -lt $n) {
    $c = $literal[$i]

    # Comentario de línea
    if ($c -eq '/' -and $i + 1 -lt $n -and $literal[$i + 1] -eq '/') {
      while ($i -lt $n -and $literal[$i] -ne "`n") { $i++ }
      continue
    }
    # Comentario de bloque
    if ($c -eq '/' -and $i + 1 -lt $n -and $literal[$i + 1] -eq '*') {
      $i += 2
      while ($i + 1 -lt $n -and -not ($literal[$i] -eq '*' -and $literal[$i + 1] -eq '/')) { $i++ }
      $i += 2
      continue
    }

    # Cadena: se relee y se reemite entre comillas dobles.
    if ($c -eq "'" -or $c -eq '"' -or $c -eq '`') {
      $quote = $c
      $i++
      $val = New-Object System.Text.StringBuilder
      while ($i -lt $n -and $literal[$i] -ne $quote) {
        if ($literal[$i] -eq '\') {
          $next = $literal[$i + 1]
          switch ($next) {
            "'" { [void]$val.Append("'") }
            '"' { [void]$val.Append('"') }
            '\' { [void]$val.Append('\') }
            'n' { [void]$val.Append("`n") }
            't' { [void]$val.Append("`t") }
            '`' { [void]$val.Append('`') }
            default { [void]$val.Append($next) }
          }
          $i += 2
          continue
        }
        [void]$val.Append($literal[$i])
        $i++
      }
      $i++  # comilla de cierre
      $escaped = $val.ToString().Replace('\', '\\').Replace('"', '\"').Replace("`r", '').Replace("`n", '\n').Replace("`t", '\t')
      [void]$sb.Append('"' + $escaped + '"')
      continue
    }

    # Clave sin comillas: identificador seguido de ':'
    if ([char]::IsLetter($c) -or $c -eq '_' -or $c -eq '$') {
      $j = $i
      while ($j -lt $n -and ([char]::IsLetterOrDigit($literal[$j]) -or $literal[$j] -eq '_' -or $literal[$j] -eq '$')) { $j++ }
      $word = $literal.Substring($i, $j - $i)
      $k = $j
      while ($k -lt $n -and [char]::IsWhiteSpace($literal[$k])) { $k++ }
      if ($k -lt $n -and $literal[$k] -eq ':') {
        [void]$sb.Append('"' + $word + '":')
        $i = $k + 1
        continue
      }
      if ($word -in @('true', 'false', 'null')) {
        [void]$sb.Append($word)
        $i = $j
        continue
      }
      if ($word -eq 'as') {
        # 'as const' y similares: se descartan.
        $i = $j
        while ($i -lt $n -and [char]::IsWhiteSpace($literal[$i])) { $i++ }
        while ($i -lt $n -and [char]::IsLetterOrDigit($literal[$i])) { $i++ }
        continue
      }
      # Referencia con punto (p. ej. schedule.time). Se resuelve contra la tabla
      # que haya dejado quien llama; así un dato puede reutilizar otro sin que
      # este conversor tenga que evaluar TypeScript.
      if ($j -lt $n -and $literal[$j] -eq '.') {
        $k2 = $j
        while ($k2 -lt $n -and ([char]::IsLetterOrDigit($literal[$k2]) -or $literal[$k2] -eq '.' -or $literal[$k2] -eq '_')) { $k2++ }
        $ref = $literal.Substring($i, $k2 - $i)
        if ($Global:TS_RESOLVE -and $Global:TS_RESOLVE.ContainsKey($ref)) {
          $v = [string]$Global:TS_RESOLVE[$ref]
          [void]$sb.Append('"' + $v.Replace('\', '\\').Replace('"', '\"') + '"')
          $i = $k2
          continue
        }
        throw "Referencia '$ref' sin resolver. Añádela a `$Global:TS_RESOLVE antes de importar."
      }
      throw "Token no soportado en el literal: '$word'. Los archivos de datos solo pueden contener valores literales."
    }

    [void]$sb.Append($c)
    $i++
  }

  # Comas finales antes de } o ]
  $json = $sb.ToString()
  $json = [regex]::Replace($json, ',\s*([}\]])', '$1')
  return $json
}

# Atajo: archivo + nombre del export -> objeto de PowerShell.
function Import-TsData([string]$Path, [string]$Name) {
  $src = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
  $literal = Get-TsLiteral $src $Name
  $json = ConvertFrom-TsLiteral $literal
  try {
    return ($json | ConvertFrom-Json)
  } catch {
    throw "No se pudo convertir '$Name' de $Path a JSON: $($_.Exception.Message)"
  }
}
