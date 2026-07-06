#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "Test Taker Installation Script"
echo "=========================================="
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  IS_LINUX=true
else
  IS_LINUX=false
fi

if [ "$IS_LINUX" = true ]; then
  echo "==> Installing Tauri system dependencies..."
  # apt update can fail if third-party repos are misconfigured; continue anyway
  sudo apt update || echo "WARNING: apt update had errors (broken third-party repos). Continuing with cached indexes..."

  sudo apt install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libgtk-3-dev
fi

# Check for Node.js
if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js is not installed. Please install Node.js 18+ first."
  exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Check for Rust
if ! command -v rustc &>/dev/null; then
  echo "==> Installing Rust..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source "$HOME/.cargo/env"
fi

echo "Rust version: $(rustc --version)"

echo ""
echo "==> Installing npm dependencies..."
if ! npm install; then
  echo "ERROR: npm install failed."
  exit 1
fi

echo "==> Compiling TypeScript..."
if ! npm run build; then
  echo "ERROR: TypeScript compilation failed."
  exit 1
fi

echo ""
echo "==> Building Test Taker .deb package..."
source "$HOME/.cargo/env" 2>/dev/null || true

if ! npm run tauri -- build; then
  echo "ERROR: Tauri build failed."
  exit 1
fi

echo ""
echo "==> Locating .deb package..."
DEB=$(find src-tauri/target/release/bundle/deb -name '*.deb' 2>/dev/null | head -1)
if [ -z "$DEB" ]; then
  echo "ERROR: .deb package not found after build."
  echo "Build directory contents:"
  find src-tauri/target/release/bundle -type f 2>/dev/null || echo "No build artifacts found"
  exit 1
fi

echo "Found: $DEB"

if [ "$IS_LINUX" = true ]; then
  echo ""
  echo "==> Installing .deb package..."
  if ! sudo dpkg -i "$DEB"; then
    echo "dpkg failed, attempting to fix dependencies..."
    sudo apt-get install -f -y
    exit 1
  fi
  sudo apt-get install -f -y

  echo ""
  echo "=========================================="
  echo "✓ Test Taker installed successfully!"
  echo "=========================================="
  echo ""
  echo "To launch the app:"
  echo "  • From your application menu (Activities)"
  echo "  • Or run: test-taker"
  echo ""
else
  echo ""
  echo "=========================================="
  echo "✓ Build complete!"
  echo "=========================================="
  echo "Package location: $DEB"
  echo "Note: Automatic installation is only supported on Linux."
  echo ""
fi
