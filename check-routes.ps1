Write-Host "=== BRAINWISE NAVIGATION DIAGNOSTIC ===" -ForegroundColor Cyan
Write-Host ""

$routes = @(
    "/",
    "/dashboard", 
    "/chatbot",
    "/predictors/stroke",
    "/predictors/tumor", 
    "/predictors/alzheimers",
    "/tools",
    "/tools/visual-attention",
    "/tools/memory-game", 
    "/tools/pattern-recognition-test",
    "/tools/verbal-fluency-test",
    "/tools/word-memory-test",
    "/tools/sequence-memory-test", 
    "/tools/mental-math",
    "/tools/cognitive-assessment",
    "/tools/meditation-timer",
    "/tools/mood-tracker",
    "/daily-challenges",
    "/assessment-report",
    "/progress",
    "/progress/goals", 
    "/brain-health",
    "/research",
    "/stroke-prevention",
    "/health-metrics",
    "/help",
    "/contact", 
    "/faq",
    "/terms",
    "/privacy"
)

$missing = @()
$existing = @()

foreach ($route in $routes) {
    $path = "app" + $route.Replace("/", "\") + "\page.tsx"
    if ($route -eq "/") {
        $path = "app\page.tsx"
    }
    
    if (Test-Path $path) {
        Write-Host "✅ $route" -ForegroundColor Green
        $existing += $route
    } else {
        Write-Host "❌ $route (Missing: $path)" -ForegroundColor Red  
        $missing += $route
    }
}

Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Yellow
Write-Host "✅ Working routes: $($existing.Count)" -ForegroundColor Green
Write-Host "❌ Missing routes: $($missing.Count)" -ForegroundColor Red

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "Missing routes that need to be created:" -ForegroundColor Yellow
    foreach ($route in $missing) {
        Write-Host "  - $route" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== HUGGING FACE MODELS TEST ===" -ForegroundColor Cyan

$models = @(
    "https://abdullah1211-ml-stroke.hf.space/",
    "https://abdullah1211-ml-tumour.hf.space/", 
    "https://abdullah1211-ml-alzheimers.hf.space/"
)

foreach ($model in $models) {
    try {
        $response = Invoke-WebRequest -Uri $model -Method GET -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $model" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $model (Status: $($response.StatusCode))" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $model (Error: $($_.Exception.Message))" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Diagnostic complete!" -ForegroundColor Cyan 