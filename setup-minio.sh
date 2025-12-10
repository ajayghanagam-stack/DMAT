#!/bin/bash

# MinIO Setup Script - Downloads and runs MinIO locally without Docker

MINIO_DIR="./minio-storage"
MINIO_BIN_DIR="./bin"
MINIO_BINARY="$MINIO_BIN_DIR/minio"

# Detect OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Map architecture names
if [ "$ARCH" = "x86_64" ]; then
    ARCH="amd64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    ARCH="arm64"
fi

# Create directories
mkdir -p "$MINIO_BIN_DIR"
mkdir -p "$MINIO_DIR"

# Download MinIO if not exists
if [ ! -f "$MINIO_BINARY" ]; then
    echo "Downloading MinIO for $OS-$ARCH..."

    if [ "$OS" = "darwin" ]; then
        DOWNLOAD_URL="https://dl.min.io/server/minio/release/darwin-$ARCH/minio"
    elif [ "$OS" = "linux" ]; then
        DOWNLOAD_URL="https://dl.min.io/server/minio/release/linux-$ARCH/minio"
    else
        echo "Unsupported OS: $OS"
        exit 1
    fi

    curl -o "$MINIO_BINARY" "$DOWNLOAD_URL"
    chmod +x "$MINIO_BINARY"
    echo "MinIO downloaded successfully!"
else
    echo "MinIO binary already exists at $MINIO_BINARY"
fi

# Export MinIO credentials
export MINIO_ROOT_USER=minioadmin
export MINIO_ROOT_PASSWORD=minioadmin123

# Run MinIO
echo ""
echo "Starting MinIO server..."
echo "API: http://localhost:9000"
echo "Console: http://localhost:9001"
echo "Username: minioadmin"
echo "Password: minioadmin123"
echo ""

"$MINIO_BINARY" server "$MINIO_DIR" --console-address ":9001"
