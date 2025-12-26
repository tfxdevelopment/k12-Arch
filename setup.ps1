# K12 Architecture Documentation - Setup Script
# Installs all dependencies for .NET Aspire + Angular/NX workspace

param(
    [switch]$SkipDotnet,
    [switch]$SkipNode,
    [switch]$SkipDocker
)

Write-Host "🚀 K12 Architecture Documentation - Setup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# 1. Check and install .NET SDK
if (-not $SkipDotnet) {
    Write-Host "📦 Checking .NET SDK..." -ForegroundColor Yellow
    if (Test-Command dotnet) {
        $dotnetVersion = dotnet --version
        Write-Host "✅ .NET SDK $dotnetVersion found" -ForegroundColor Green

        # Check for .NET 9.0
        if ($dotnetVersion -notlike "9.*") {
            Write-Host "⚠️  .NET 9.0 is required. Current version: $dotnetVersion" -ForegroundColor Red
            Write-Host "   Download from: https://dotnet.microsoft.com/download/dotnet/9.0" -ForegroundColor Yellow
        }

        # Install Aspire workload
        Write-Host "📦 Installing .NET Aspire workload..." -ForegroundColor Yellow
        dotnet workload install aspire --skip-sign-check
        Write-Host "✅ .NET Aspire workload installed" -ForegroundColor Green
    } else {
        Write-Host "❌ .NET SDK not found" -ForegroundColor Red
        Write-Host "   Download from: https://dotnet.microsoft.com/download/dotnet/9.0" -ForegroundColor Yellow
        exit 1
    }
}

# 2. Check and install Node.js
if (-not $SkipNode) {
    Write-Host ""
    Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
    if (Test-Command node) {
        $nodeVersion = node --version
        Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green

        # Check npm
        if (Test-Command npm) {
            $npmVersion = npm --version
            Write-Host "✅ npm $npmVersion found" -ForegroundColor Green
        }

        # Install global packages
        Write-Host "📦 Installing global npm packages..." -ForegroundColor Yellow
        npm install -g @angular/cli@latest nx@latest @analogjs/platform
        Write-Host "✅ Global packages installed (Angular CLI, NX, Analogjs)" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js not found" -ForegroundColor Red
        Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
}

# 3. Check Docker
if (-not $SkipDocker) {
    Write-Host ""
    Write-Host "📦 Checking Docker..." -ForegroundColor Yellow
    if (Test-Command docker) {
        $dockerVersion = docker --version
        Write-Host "✅ Docker $dockerVersion found" -ForegroundColor Green

        # Check if Docker is running
        $dockerRunning = docker ps 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Docker is running" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Docker is not running. Please start Docker Desktop." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  Docker not found (optional for local development)" -ForegroundColor Yellow
        Write-Host "   Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    }
}

# 4. Install Dapr CLI
Write-Host ""
Write-Host "📦 Installing Dapr CLI..." -ForegroundColor Yellow
if (Test-Command dapr) {
    $daprVersion = dapr version --client-only 2>$null
    Write-Host "✅ Dapr CLI found" -ForegroundColor Green
} else {
    Write-Host "📥 Downloading Dapr CLI..." -ForegroundColor Yellow
    powershell -Command "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"
    Write-Host "✅ Dapr CLI installed" -ForegroundColor Green
}

# Initialize Dapr (for local development)
Write-Host "📦 Initializing Dapr..." -ForegroundColor Yellow
dapr init
Write-Host "✅ Dapr initialized" -ForegroundColor Green

# 5. Restore .NET dependencies
Write-Host ""
Write-Host "📦 Restoring .NET dependencies..." -ForegroundColor Yellow
dotnet restore K12.sln
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ .NET dependencies restored" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to restore .NET dependencies" -ForegroundColor Red
    exit 1
}

# 6. Create Angular/NX workspace (if not exists)
Write-Host ""
if (-not (Test-Path "docs-site")) {
    Write-Host "📦 Creating Angular/NX workspace with Analogjs..." -ForegroundColor Yellow
    npx create-nx-workspace@latest docs-site --preset=@analogjs/platform --appName=documentation --style=scss --no-interactive
    Write-Host "✅ Angular/NX workspace created" -ForegroundColor Green
} else {
    Write-Host "✅ Angular/NX workspace already exists" -ForegroundColor Green

    # Install dependencies
    Write-Host "📦 Installing Angular/NX dependencies..." -ForegroundColor Yellow
    cd docs-site
    npm install
    cd ..
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# 7. Create MCP servers directory (if not exists)
Write-Host ""
if (-not (Test-Path ".mcp-servers")) {
    Write-Host "📦 Creating MCP servers directory..." -ForegroundColor Yellow
    mkdir .mcp-servers
    Write-Host "✅ MCP servers directory created" -ForegroundColor Green
}

# 8. Summary
Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review the README-ASPIRE.md for detailed instructions"
Write-Host "  2. Run the Aspire AppHost:"
Write-Host "     cd src/K12.AppHost"
Write-Host "     dotnet run"
Write-Host "  3. Access the Aspire Dashboard at https://localhost:17241"
Write-Host "  4. Access the Documentation Site at http://localhost:4200"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "  - Aspire: https://learn.microsoft.com/dotnet/aspire/"
Write-Host "  - Analogjs: https://analogjs.org/"
Write-Host "  - NX: https://nx.dev/"
Write-Host "  - Dapr: https://dapr.io/"
Write-Host ""
