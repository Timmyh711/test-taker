#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

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

if ! command -v rustc &>/dev/null; then
  echo "==> Installing Rust..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source "$HOME/.cargo/env"
fi

echo "==> Installing npm dependencies..."
npm install

echo "==> Building Test Taker .deb package..."
source "$HOME/.cargo/env" 2>/dev/null || true
npm run tauri build

DEB=$(find src-tauri/target/release/bundle/deb -name '*.deb' | head -1)
if [ -z "$DEB" ]; then
  echo "ERROR: .deb package not found after build."
  exit 1
fi

echo "==> Installing $DEB ..."
sudo dpkg -i "$DEB"
sudo apt-get install -f -y

echo ""
echo "Test Taker installed successfully!"
echo "Launch from your application menu or run: test-taker"
