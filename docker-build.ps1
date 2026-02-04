# ============================================================================
# Sportzy Frontend - Docker Build & Deployment Script (Windows PowerShell)
# ============================================================================
# Usage: .\docker-build.ps1 [command] [options]
# Commands: build, run, stop, clean, logs, push
# ============================================================================

param(
    [string]$Command = "help",
    [string]$Version = "latest",
    [switch]$NoCache
)

# Configuration
$ImageName = "sportzy-frontend"
$ContainerName = "sportzy-frontend"
$Port = "3000"
$Registry = ""  # Set to your registry (e.g., "your-registry.com")

# Color helper functions
function Write-ColorOutput($Color, $Message) {
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header($Message) {
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
}

function Write-Success($Message) {
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom($Message) {
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning-Custom($Message) {
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Info($Message) {
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# ============================================================================
# Build Image
# ============================================================================
function Build-Image {
    param(
        [string]$ImageVersion = "latest",
        [switch]$NoCache
    )
    
    Write-Header "Building Docker Image"
    
    Write-Info "Building: ${ImageName}:${ImageVersion}"
    
    $BuildCmd = "docker build -t ${ImageName}:${ImageVersion} ."
    if ($NoCache) {
        $BuildCmd += " --no-cache"
        Write-Warning-Custom "Building without cache..."
    }
    
    Invoke-Expression $BuildCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Image built successfully: ${ImageName}:${ImageVersion}"
        
        if ($ImageVersion -ne "latest") {
            docker tag ${ImageName}:${ImageVersion} ${ImageName}:latest
            Write-Success "Also tagged as: ${ImageName}:latest"
        }
        
        Write-Info "Image details:"
        docker images | Select-String $ImageName
    } else {
        Write-Error-Custom "Build failed with exit code $LASTEXITCODE"
        exit 1
    }
}

# ============================================================================
# Run Container
# ============================================================================
function Run-Container {
    param(
        [string]$ImageVersion = "latest"
    )
    
    Write-Header "Running Docker Container"
    
    # Check if container already exists
    $ExistingContainer = docker ps -a --format "{{.Names}}" 2>$null | Where-Object { $_ -eq $ContainerName }
    
    if ($ExistingContainer) {
        Write-Warning-Custom "Container $ContainerName already exists"
        $Response = Read-Host "Stop and remove it? (y/n)"
        if ($Response -eq "y") {
            docker stop $ContainerName 2>$null
            docker rm $ContainerName
            Write-Success "Container removed"
        } else {
            return
        }
    }
    
    $ApiUrl = $env:VITE_API_URL -or "http://localhost:8000"
    $WsUrl = $env:VITE_WS_URL -or "ws://localhost:8000"
    $NodeEnv = $env:NODE_ENV -or "production"
    
    Write-Info "Starting container with environment variables..."
    Write-Info "API URL: $ApiUrl"
    Write-Info "WebSocket URL: $WsUrl"
    
    docker run -d `
        -p ${Port}:3000 `
        -e VITE_API_URL="$ApiUrl" `
        -e VITE_WS_URL="$WsUrl" `
        -e NODE_ENV="$NodeEnv" `
        --name $ContainerName `
        --restart unless-stopped `
        ${ImageName}:${ImageVersion}
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Container started: $ContainerName"
        Write-Info "Application available at: http://localhost:${Port}"
        
        Write-Info "Waiting for application to be ready..."
        Start-Sleep -Seconds 5
        
        $Running = docker ps | Select-String $ContainerName
        if ($Running) {
            Write-Success "Container is running"
            docker ps | Select-String $ContainerName
        } else {
            Write-Error-Custom "Container failed to start"
            docker logs $ContainerName
            exit 1
        }
    } else {
        Write-Error-Custom "Failed to start container"
        exit 1
    }
}

# ============================================================================
# Stop Container
# ============================================================================
function Stop-Container {
    Write-Header "Stopping Docker Container"
    
    $Running = docker ps | Select-String $ContainerName
    
    if ($Running) {
        Write-Info "Stopping container: $ContainerName"
        docker stop $ContainerName
        Write-Success "Container stopped"
    } else {
        Write-Warning-Custom "Container is not running"
    }
}

# ============================================================================
# Show Logs
# ============================================================================
function Show-Logs {
    param(
        [string]$TailLines = ""
    )
    
    Write-Header "Container Logs"
    
    if ($TailLines) {
        docker logs --tail=$TailLines -f $ContainerName
    } else {
        docker logs -f $ContainerName
    }
}

# ============================================================================
# Clean Up
# ============================================================================
function Clean-Up {
    Write-Header "Cleaning Up Docker Resources"
    
    $Container = docker ps -a --format "{{.Names}}" 2>$null | Where-Object { $_ -eq $ContainerName }
    if ($Container) {
        Write-Info "Removing container: $ContainerName"
        docker stop $ContainerName 2>$null
        docker rm $ContainerName
    }
    
    $Image = docker images --format "{{.Repository}}" 2>$null | Where-Object { $_ -eq $ImageName }
    if ($Image) {
        Write-Info "Removing image: $ImageName"
        docker rmi -f ${ImageName}:${Version} 2>$null
    }
    
    Write-Info "Pruning unused Docker resources..."
    docker system prune -f
    
    Write-Success "Cleanup completed"
}

# ============================================================================
# Push to Registry
# ============================================================================
function Push-ToRegistry {
    Write-Header "Pushing Image to Registry"
    
    if (-not $Registry) {
        Write-Error-Custom "Registry not configured. Set `$Registry variable in script."
        return
    }
    
    $FullImage = "${Registry}/${ImageName}:${Version}"
    
    Write-Info "Tagging image: $FullImage"
    docker tag ${ImageName}:${Version} $FullImage
    
    Write-Info "Pushing to registry..."
    docker push $FullImage
    
    Write-Success "Image pushed: $FullImage"
}

# ============================================================================
# Show Status
# ============================================================================
function Show-Status {
    Write-Header "Container Status"
    
    $Container = docker ps -a | Select-String $ContainerName
    if ($Container) {
        $Container
    } else {
        Write-Warning-Custom "Container not found"
    }
    
    Write-Info "Available images:"
    $Images = docker images | Select-String $ImageName
    if ($Images) {
        $Images
    } else {
        Write-Warning-Custom "No images found"
    }
}

# ============================================================================
# Show Help
# ============================================================================
function Show-Help {
    Write-Host @"
`r`n$(Write-ColorOutput Blue "Sportzy Frontend - Docker Build & Deployment Script (PowerShell)")

$(Write-ColorOutput Green "Usage:")
    .\docker-build.ps1 [command] [options]

$(Write-ColorOutput Green "Commands:")
    build           Build Docker image
    run             Build and run container
    stop            Stop running container
    logs            Show container logs (follow mode)
    status          Show container and image status
    clean           Remove container and image
    push            Push image to registry
    help            Show this help message

$(Write-ColorOutput Green "Examples:")
    # Build image with version tag
    .\docker-build.ps1 -Command build -Version v1.0.0

    # Build without cache
    .\docker-build.ps1 -Command build -NoCache

    # Run container with custom API URL
    `$env:VITE_API_URL = "https://api.example.com"
    .\docker-build.ps1 -Command run

    # Show container logs
    .\docker-build.ps1 -Command logs

    # Stop and cleanup
    .\docker-build.ps1 -Command clean

$(Write-ColorOutput Green "Environment Variables:")
    VITE_API_URL      Backend API URL (default: http://localhost:8000)
    VITE_WS_URL       WebSocket URL (default: ws://localhost:8000)
    NODE_ENV          Node environment (default: production)

$(Write-ColorOutput Green "Configuration:")
    Edit the script to customize:
    - `$ImageName
    - `$ContainerName
    - `$Port
    - `$Registry

`r`n"
}

# ============================================================================
# Main Script Logic
# ============================================================================

switch ($Command.ToLower()) {
    "build" {
        Build-Image -ImageVersion $Version -NoCache:$NoCache
    }
    "run" {
        Build-Image -ImageVersion $Version -NoCache:$NoCache
        Run-Container -ImageVersion $Version
    }
    "stop" {
        Stop-Container
    }
    "logs" {
        Show-Logs -TailLines $Version
    }
    "status" {
        Show-Status
    }
    "clean" {
        Clean-Up
    }
    "push" {
        Push-ToRegistry
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error-Custom "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
