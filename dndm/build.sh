#!/bin/bash
set -e

echo "🦀 Building D&D Campaign Manager (Rust Edition)"
echo "=============================================="

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install from https://rustup.rs/"
    exit 1
fi

# Build in release mode
echo "🔨 Building release binary..."
cargo build --release

# Copy to a convenient location (optional)
if [ -d "$HOME/.local/bin" ]; then
    echo "📦 Installing to ~/.local/bin/dndm-rust"
    cp target/release/dndm "$HOME/.local/bin/dndm-rust"
    echo "✅ Installed! You can now run 'dndm-rust' from anywhere"
    echo "   (Make sure ~/.local/bin is in your PATH)"
else
    echo "✅ Build complete! Binary is at: target/release/dndm"
    echo "   You can run it with: ./target/release/dndm"
fi

echo ""
echo "🎯 Quick start:"
echo "   ./target/release/dndm status    # Check service status"
echo "   ./target/release/dndm start     # Start all services"
echo "   ./target/release/dndm tui       # Interactive mode"
