#!/bin/bash

# ============================================================================
# Sportzy Frontend - Docker Build & Deployment Script
# ============================================================================
# Usage: ./docker-build.sh [command] [options]
# Commands: build, run, stop, clean, logs, push
# ============================================================================

set -e

# Configuration
IMAGE_NAME="sportzy-frontend"
CONTAINER_NAME="sportzy-frontend"
PORT="3000"
REGISTRY=""  # Set to your registry (e.g., "your-registry.com")
VERSION="${1:-latest}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# Helper Functions
# ============================================================================

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# ============================================================================
# Main Functions
# ============================================================================

build_image() {
    print_header "Building Docker Image"
    
    if [ -z "$VERSION" ] || [ "$VERSION" == "--no-cache" ]; then
        VERSION="latest"
    fi
    
    local BUILD_CMD="docker build -t ${IMAGE_NAME}:${VERSION} ."
    
    # Check for --no-cache flag
    if [[ "$@" == *"--no-cache"* ]]; then
        BUILD_CMD="${BUILD_CMD} --no-cache"
        print_warning "Building without cache..."
    fi
    
    print_info "Building: ${IMAGE_NAME}:${VERSION}"
    eval "$BUILD_CMD"
    
    print_success "Image built successfully: ${IMAGE_NAME}:${VERSION}"
    
    # Also tag as latest if not already latest
    if [ "$VERSION" != "latest" ]; then
        docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
        print_success "Also tagged as: ${IMAGE_NAME}:latest"
    fi
    
    # Show image info
    print_info "Image details:"
    docker images | grep ${IMAGE_NAME}
}

run_container() {
    print_header "Running Docker Container"
    
    # Check if container already running
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_warning "Container ${CONTAINER_NAME} already exists"
        read -p "Stop and remove it? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker stop ${CONTAINER_NAME} 2>/dev/null || true
            docker rm ${CONTAINER_NAME}
            print_success "Container removed"
        else
            return 1
        fi
    fi
    
    print_info "Starting container with environment variables..."
    
    docker run -d \
        -p ${PORT}:3000 \
        -e VITE_API_URL="${VITE_API_URL:-http://localhost:8000}" \
        -e VITE_WS_URL="${VITE_WS_URL:-ws://localhost:8000}" \
        -e NODE_ENV="${NODE_ENV:-production}" \
        --name ${CONTAINER_NAME} \
        --restart unless-stopped \
        ${IMAGE_NAME}:${VERSION}
    
    print_success "Container started: ${CONTAINER_NAME}"
    print_info "Application available at: http://localhost:${PORT}"
    
    # Wait for health check
    print_info "Waiting for application to be ready..."
    sleep 5
    
    if docker ps | grep -q ${CONTAINER_NAME}; then
        print_success "Container is running"
        docker ps | grep ${CONTAINER_NAME}
    else
        print_error "Container failed to start"
        docker logs ${CONTAINER_NAME}
        exit 1
    fi
}

stop_container() {
    print_header "Stopping Docker Container"
    
    if docker ps | grep -q ${CONTAINER_NAME}; then
        print_info "Stopping container: ${CONTAINER_NAME}"
        docker stop ${CONTAINER_NAME}
        print_success "Container stopped"
    else
        print_warning "Container is not running"
    fi
}

show_logs() {
    print_header "Container Logs"
    
    if [ -z "$2" ]; then
        docker logs -f ${CONTAINER_NAME}
    else
        docker logs --tail=$2 -f ${CONTAINER_NAME}
    fi
}

clean_up() {
    print_header "Cleaning Up Docker Resources"
    
    # Stop container
    if docker ps -a | grep -q ${CONTAINER_NAME}; then
        print_info "Removing container: ${CONTAINER_NAME}"
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm ${CONTAINER_NAME}
    fi
    
    # Remove image
    if docker images | grep -q ${IMAGE_NAME}; then
        print_info "Removing image: ${IMAGE_NAME}"
        docker rmi -f ${IMAGE_NAME}:${VERSION} 2>/dev/null || true
    fi
    
    # Prune unused resources
    print_info "Pruning unused Docker resources..."
    docker system prune -f
    
    print_success "Cleanup completed"
}

push_to_registry() {
    print_header "Pushing Image to Registry"
    
    if [ -z "$REGISTRY" ]; then
        print_error "Registry not configured. Set REGISTRY variable in script."
        return 1
    fi
    
    local FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${VERSION}"
    
    print_info "Tagging image: ${FULL_IMAGE}"
    docker tag ${IMAGE_NAME}:${VERSION} ${FULL_IMAGE}
    
    print_info "Pushing to registry..."
    docker push ${FULL_IMAGE}
    
    print_success "Image pushed: ${FULL_IMAGE}"
}

show_status() {
    print_header "Container Status"
    
    if docker ps -a | grep -q ${CONTAINER_NAME}; then
        docker ps -a | grep ${CONTAINER_NAME}
    else
        print_warning "Container not found"
    fi
    
    print_info "Available images:"
    docker images | grep ${IMAGE_NAME} || print_warning "No images found"
}

show_help() {
    cat <<EOF
${BLUE}Sportzy Frontend - Docker Build & Deployment Script${NC}

${GREEN}Usage:${NC}
    ./docker-build.sh [command] [options]

${GREEN}Commands:${NC}
    build           Build Docker image
    run             Build and run container
    stop            Stop running container
    logs            Show container logs (tail -f)
    logs N          Show last N lines of logs
    status          Show container and image status
    clean           Remove container and image
    push            Push image to registry (requires REGISTRY set)
    help            Show this help message

${GREEN}Examples:${NC}
    # Build image with version tag
    ./docker-build.sh build v1.0.0

    # Build without cache
    ./docker-build.sh build latest --no-cache

    # Run container with custom API URL
    VITE_API_URL=https://api.example.com ./docker-build.sh run

    # Show container logs
    ./docker-build.sh logs

    # Show last 50 lines of logs
    ./docker-build.sh logs 50

    # Stop and cleanup
    ./docker-build.sh clean

${GREEN}Environment Variables:${NC}
    VITE_API_URL      Backend API URL (default: http://localhost:8000)
    VITE_WS_URL       WebSocket URL (default: ws://localhost:8000)
    NODE_ENV          Node environment (default: production)
    REGISTRY          Docker registry for push command

${GREEN}Configuration:${NC}
    Edit the script to customize:
    - IMAGE_NAME
    - CONTAINER_NAME
    - PORT
    - REGISTRY

EOF
}

# ============================================================================
# Main Script Logic
# ============================================================================

COMMAND="${1:-help}"

case "${COMMAND}" in
    build)
        build_image "$@"
        ;;
    run)
        build_image
        run_container
        ;;
    stop)
        stop_container
        ;;
    logs)
        show_logs "$@"
        ;;
    status)
        show_status
        ;;
    clean)
        clean_up
        ;;
    push)
        push_to_registry
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: ${COMMAND}"
        echo ""
        show_help
        exit 1
        ;;
esac
