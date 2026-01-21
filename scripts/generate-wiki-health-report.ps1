param(
  [string]$WikiRoot = (Join-Path (Join-Path $PSScriptRoot '..') 'wiki'),
  [string]$OutputPath = (Join-Path (Join-Path (Join-Path $PSScriptRoot '..') 'wiki') 'DOCUMENTATION-HEALTH-REPORT.md'),
  [int]$MaxBrokenLinks = 200,
  [int]$TopTodoFiles = 25
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Normalize-LinkPath {
  param([string]$raw)

  if ($null -eq $raw) { return $null }

  $link = $raw.Trim()
  if ($link.StartsWith('<') -and $link.EndsWith('>')) {
    $link = $link.Trim('<', '>')
  }

  # Strip title portion: (path "title")
  # Keep only first token if there are spaces
  if ($link -match '^(?<path>[^\s]+)\s+".*"\s*$') {
    $link = $Matches['path']
  }

  # Strip query/fragment
  $link = $link.Split('#')[0]
  $link = $link.Split('?')[0]

  return $link.Trim()
}

function Resolve-LinkTarget {
  param(
    [string]$SourceFileFullPath,
    [string]$Link
  )

  $sourceDir = Split-Path -Parent $SourceFileFullPath

  $clean = $Link.Replace('\\', '/').Replace('\', '/')

  # Ignore empty or pure fragment
  if ([string]::IsNullOrWhiteSpace($clean)) { return $null }

  # Root-relative within wiki (treat as wiki-root)
  if ($clean.StartsWith('/')) {
    $cleanRel = $clean.TrimStart('/')
    return (Join-Path $WikiRoot $cleanRel)
  }

  # Standard markdown: everything else is relative to the source file
  # (including "file.md", "./file.md", "../file.md")
  return (Join-Path $sourceDir $clean)
}

function Candidate-Targets {
  param([string]$ResolvedPath)

  if ($null -eq $ResolvedPath) { return @() }

  $p = $ResolvedPath

  $candidates = New-Object System.Collections.Generic.List[string]
  $candidates.Add($p)

  $leaf = Split-Path -Leaf $p

  if ($leaf.EndsWith('/')) {
    $candidates.Add((Join-Path $p 'README.md'))
    $candidates.Add((Join-Path $p 'index.md'))
  } else {
    $ext = [System.IO.Path]::GetExtension($p)
    if ([string]::IsNullOrWhiteSpace($ext)) {
      $candidates.Add($p + '.md')
      $candidates.Add((Join-Path $p 'README.md'))
      $candidates.Add((Join-Path $p 'index.md'))
    }
  }

  return $candidates.ToArray() | Select-Object -Unique
}

$wikiRootFull = (Resolve-Path $WikiRoot).Path

$outputFull = $OutputPath
try {
  $outputFull = (Resolve-Path -LiteralPath $OutputPath).Path
} catch {
  # Ignore when the output file doesn't exist yet
}

$mdFiles = Get-ChildItem -Path $wikiRootFull -Recurse -Filter *.md -File |
  Where-Object { $_.FullName -ne $outputFull }

$linkRegex = '\[[^\]]+\]\((?<url>[^)]+)\)'

function Get-MarkdownLinkMatches {
  param(
    [System.IO.FileInfo]$File
  )

  $inFence = $false
  $fenceMarker = $null

  $rel = $File.FullName.Substring($wikiRootFull.Length + 1).Replace('\\', '/')
  $lines = @(Get-Content -LiteralPath $File.FullName)

  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]

    # Track fenced code blocks (``` or ~~~). Skip matching while in a fence.
    if ($line -match '^\s*(?<marker>```|~~~)') {
      $marker = $Matches['marker']

      if (-not $inFence) {
        $inFence = $true
        $fenceMarker = $marker
      } elseif ($fenceMarker -eq $marker) {
        $inFence = $false
        $fenceMarker = $null
      }

      continue
    }

    if ($inFence) { continue }

    # Skip indented code blocks (common in wikifull.md SQL snippets)
    if ($line -match '^(\t|\s{4,})') { continue }

    foreach ($m in [regex]::Matches($line, $linkRegex)) {
      [pscustomobject]@{
        SourcePath = $File.FullName
        SourceRel  = $rel
        Line       = ($i + 1)
        RawUrl     = $m.Groups['url'].Value
      }
    }
  }
}

$allLinkMatches = foreach ($file in $mdFiles) {
  Get-MarkdownLinkMatches -File $file
}

$broken = New-Object System.Collections.Generic.List[object]

foreach ($lm in $allLinkMatches) {
  $url = Normalize-LinkPath $lm.RawUrl
  if ([string]::IsNullOrWhiteSpace($url)) { continue }

  # Avoid false positives from SQL identifier patterns that look like markdown links
  # e.g. `[Enrollment].[Table]([Id])` becomes a match with url like `[Id]`.
  if ($url -match '^\[[^\]]+\](\s+DESC)?$') { continue }

  $lower = $url.ToLowerInvariant()

  if ($lower.StartsWith('http://') -or $lower.StartsWith('https://') -or $lower.StartsWith('mailto:')) { continue }
  if ($lower.StartsWith('#')) { continue }
  if ($lower.StartsWith('javascript:')) { continue }

  $resolved = Resolve-LinkTarget -SourceFileFullPath $lm.SourcePath -Link $url
  if ($null -eq $resolved) { continue }

  $found = $false
  foreach ($candidate in Candidate-Targets $resolved) {
    try {
      if (Test-Path -LiteralPath $candidate) { $found = $true; break }
    } catch {
      # Ignore invalid path edge cases and treat as not found
    }
  }

  if (-not $found) {
    $broken.Add([pscustomobject]@{
      Source = $lm.SourceRel
      Line = $lm.Line
      Link = $url
    })
  }

  if ($broken.Count -ge $MaxBrokenLinks) { break }
}

$todoPattern = '\bTBD\b|\bTODO\b|\bFIXME\b|\[K12-XXX\]|\[K12-XXXX\]'

function Get-MarkerCount {
  param(
    [System.IO.FileInfo]$File,
    [string]$Pattern
  )

  $inFence = $false
  $fenceMarker = $null
  $count = 0

  $lines = @(Get-Content -LiteralPath $File.FullName)
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]

    if ($line -match '^\s*(?<marker>```|~~~)') {
      $marker = $Matches['marker']
      if (-not $inFence) {
        $inFence = $true
        $fenceMarker = $marker
      } elseif ($fenceMarker -eq $marker) {
        $inFence = $false
        $fenceMarker = $null
      }
      continue
    }

    if ($inFence) { continue }
    if ($line -match '^(\t|\s{4,})') { continue }

    $count += [regex]::Matches($line, $Pattern).Count
  }

  return $count
}

$todoCounts = $mdFiles |
  ForEach-Object {
    $matchCount = Get-MarkerCount -File $_ -Pattern $todoPattern
    if ($matchCount -gt 0) {
      [pscustomobject]@{
        Path = $_.FullName.Substring($wikiRootFull.Length + 1).Replace('\\', '/')
        Count = $matchCount
      }
    }
  } |
  Where-Object { $null -ne $_ } |
  Sort-Object -Property @{ Expression = 'Count'; Descending = $true }, @{ Expression = 'Path'; Descending = $false }

$totalTodo = ($todoCounts | Measure-Object -Property Count -Sum).Sum
if ($null -eq $totalTodo) { $totalTodo = 0 }

$reportDate = Get-Date -Format 'yyyy-MM-dd'

$brokenCount = $broken.Count

$code = [char]96

$brokenTable = if ($brokenCount -eq 0) {
  "No broken internal links detected."
} else {
  $rows = $broken | ForEach-Object {
    $srcCell = "{0}:{1}" -f $_.Source, $_.Line
    "| $code$srcCell$code | $code$($_.Link)$code |"
  }

  @(
    "| Source File | Broken Link |",
    "|------------|------------|"
  ) + $rows
}

$todoTable = if ($todoCounts.Count -eq 0) {
  "No TBD/TODO/FIXME/K12 placeholders detected."
} else {
  $top = $todoCounts | Select-Object -First $TopTodoFiles
  $rows = $top | ForEach-Object { "| $code$($_.Path)$code | $($_.Count) |" }

  @(
    "| File | Marker Count |",
    "|------|--------------|"
  ) + $rows
}

$md = @()
$md += "# K12 Architecture Documentation Health Report"
$md += ""
$md += "**Report Date:** $reportDate"
$md += "**Generated by:** scripts/generate-wiki-health-report.ps1"
$md += "**Repository:** K12-Arch"
$md += ""
$md += "---"
$md += ""
$md += "## Executive Summary"
$md += ""
$md += "| Metric | Value |"
$md += "|--------|-------|"
$md += "| Total Wiki Markdown Files | $($mdFiles.Count) |"
$md += "| Broken Internal Links (detected) | $brokenCount |"
$md += "| TODO/FIXME/TBD/K12 placeholders (total matches) | $totalTodo |"
$md += ""
$md += "---"
$md += ""
$md += "## Broken Links"
$md += ""
$md += $brokenTable
$md += ""
$md += "---"
$md += ""
$md += "## Incompleteness Markers"
$md += ""
$md += "Top files by count (TBD/TODO/FIXME/[K12-XXX]/[K12-XXXX]):"
$md += ""
$md += $todoTable
$md += ""

$mdText = ($md -join "`n") + "`n"

$destDir = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $destDir)) {
  New-Item -ItemType Directory -Path $destDir | Out-Null
}

Set-Content -Path $OutputPath -Value $mdText -Encoding UTF8

Write-Host "Generated: $OutputPath" -ForegroundColor Green
Write-Host "Broken links: $brokenCount" -ForegroundColor Green
Write-Host "Marker matches: $totalTodo" -ForegroundColor Green
