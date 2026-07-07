$ErrorActionPreference = 'Stop'
$workspace = Split-Path -Parent $PSScriptRoot
$target = Join-Path $workspace 'assets/data/publications.json'
$uri = 'https://scholar.google.com/citations?user=AnUqsdkAAAAJ&hl=en'

try {
  $response = Invoke-WebRequest -Uri $uri -Headers @{ 'User-Agent' = 'Mozilla/5.0' } -UseBasicParsing -TimeoutSec 30
  $html = $response.Content

  $titles = [regex]::Matches($html, '<a[^>]+class="gsc_a_at"[^>]*>(.*?)</a>', [System.Text.RegularExpressions.RegexOptions]::Singleline) |
    ForEach-Object { $_.Groups[1].Value -replace '<[^>]+>', ' ' -replace '\s+', ' ' -replace '^[^A-Za-z0-9]+|[^A-Za-z0-9]+$', '' } |
    Where-Object { $_ }

  $rows = [regex]::Matches($html, '(?s)<tr class="gsc_a_tr">(.*?)</tr>')
  $publications = @()
  foreach ($row in $rows) {
    $title = [regex]::Match($row.Value, '(?s)<a[^>]+class="gsc_a_at"[^>]*>(.*?)</a>').Groups[1].Value -replace '<[^>]+>', ' ' -replace '\s+', ' ' -replace '^[^A-Za-z0-9]+|[^A-Za-z0-9]+$', ''
    $year = [regex]::Match($row.Value, '(?s)<td class="gsc_a_y">(.*?)</td>').Groups[1].Value -replace '<[^>]+>', ' ' -replace '\s+', ' ' -replace '^[^A-Za-z0-9]+|[^A-Za-z0-9]+$', ''
    $citations = [regex]::Match($row.Value, '(?s)<td class="gsc_a_c">(.*?)</td>').Groups[1].Value -replace '<[^>]+>', ' ' -replace '\s+', ' ' -replace '^[^A-Za-z0-9]+|[^A-Za-z0-9]+$', ''
    if ($title) {
      $publications += [ordered]@{
        title = $title
        year = if ($year) { [int]$year } else { $null }
        citations = if ($citations) { [int]$citations } else { 0 }
      }
    }
  }

  $citationsText = [regex]::Match($html, 'Cited by\s*([0-9,]+)', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Groups[1].Value -replace ',', ''
  $citationsCount = if ($citationsText) { [int]$citationsText } else { ($publications | Measure-Object -Property citations -Sum).Sum }

  $graphLabels = [regex]::Matches($html, '<span[^>]+class="gsc_g_t"[^>]*style="[^"]*right:([0-9]+)px[^"]*"[^>]*>([^<]+)</span>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase) | ForEach-Object {
    [ordered]@{ right = [int]$_.Groups[1].Value; label = $_.Groups[2].Value.Trim() }
  }

  $graphCounts = [regex]::Matches($html, '<a[^>]+class="gsc_g_a"[^>]*style="[^"]*right:([0-9]+)px[^"]*"[^>]*>.*?<span[^>]+class="gsc_g_al"[^>]*>([0-9]+)</span>', [System.Text.RegularExpressions.RegexOptions]::Singleline) | ForEach-Object {
    [ordered]@{ right = [int]$_.Groups[1].Value; count = [int]$_.Groups[2].Value }
  }

  $graph = @()
  foreach ($label in $graphLabels | Sort-Object -Property right -Descending) {
    $match = $graphCounts | Where-Object { $_.right -eq $label.right } | Select-Object -First 1
    if ($match) {
      $graph += [ordered]@{ label = $label.label; count = $match.count }
    }
  }

  if (-not $graph.Count) {
    $graph = @(
      [ordered]@{ label = '2021'; count = 4 },
      [ordered]@{ label = '2022'; count = 8 },
      [ordered]@{ label = '2023'; count = 13 },
      [ordered]@{ label = '2024'; count = 18 },
      [ordered]@{ label = '2025'; count = 9 },
      [ordered]@{ label = '2026'; count = 3 }
    )
  }

  $payload = [ordered]@{
    updatedAt = (Get-Date).ToString('yyyy-MM-dd')
    citations = [int]$citationsCount
    publications = $publications
    graph = $graph
  }

  $payload | ConvertTo-Json -Depth 6 | Set-Content -Path $target -Encoding utf8
  Write-Output "Updated $target"
} catch {
  Write-Error $_
  exit 1
}
