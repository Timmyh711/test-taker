# Test Taker

A production-quality Ubuntu desktop application for taking tests from JSON files. Built with **Tauri**, **React**, **TypeScript**, and **Editorial Design Language**.

Test Taker provides a professional testing environment inspired by prestigious print examinations (Oxford/Cambridge, SAT) — featuring a sophisticated literary aesthetic with serif typography, minimal design, dark mode, question navigation, autosave, optional timers, and rich content rendering including Markdown and LaTeX.

## Features

- **Editorial Design Language** — Premium serif typography, sharp borders, sophisticated print-inspired aesthetic
- Import tests via pasted or uploaded JSON
- JSON validation with detailed error messages
- Eight question types: multiple choice, true/false, multiple select, short answer, numeric, matching, ordering, drag-and-drop
- Markdown and LaTeX rendering (KaTeX)
- Rich text editors for open-ended responses
- Drag-and-drop ordering questions
- Question flagging and status tracking
- Autosave with resume/discard on reopen
- Optional countdown timer (tamper-resistant via stored timestamps)
- Review screen before submission
- Output JSON with responses and metadata
- Copy, download, and save response JSON
- Full light/dark mode support
- Fully offline — no server required

## Prerequisites (Ubuntu)

Install system dependencies for Tauri:

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

Install Rust:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

Install Node.js 20+ (via [nvm](https://github.com/nvm-sh/nvm) or your preferred method).

## Development

```bash
cd test-taker
npm install
npm run tauri dev
```

## Build

Build the frontend only:

```bash
npm run build
```

Build the `.deb` package:

```bash
npm run tauri build
```

The `.deb` file will be generated at:

```
src-tauri/target/release/bundle/deb/test-taker_*.deb
```

## Installation (Ubuntu)

### Automated Installation

Run the provided installation script (requires `sudo` access):

```bash
./install.sh
```

This script will:
1. Install all system dependencies for Tauri
2. Install Rust (if not already installed)
3. Install Node.js dependencies
4. Build the application
5. Create and install the `.deb` package
6. Launch the application

### Manual Installation

If you prefer to install manually:

```bash
# Install system dependencies
sudo apt update
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

# Build the application
npm install
npm run build
npm run tauri build

# Install the .deb package
sudo dpkg -i src-tauri/target/release/bundle/deb/test-taker_*.deb
sudo apt-get install -f -y

# Launch
test-taker
```

### Uninstall

```bash
sudo apt remove test-taker
```
sudo apt-get install -f   # resolve any missing dependencies
```

Launch from your application menu or run:

```bash
test-taker
```

## Usage

1. Launch Test Taker
2. Paste or upload a test JSON file (see `examples/sample-test.json`)
3. Answer questions using the sidebar to navigate
4. Flag questions for review as needed
5. Click **Submit Test** to open the review screen
6. Confirm submission to generate response JSON
7. Copy, download, or save the output JSON

If you close the app mid-test, you will be prompted to resume or discard your progress on next launch.

## Project Structure

```
test-taker/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/              # React hooks
│   ├── types/              # TypeScript types
│   ├── utils/              # Validation, storage, timer logic
│   └── theme/              # MUI dark theme
├── src-tauri/              # Tauri Rust backend
├── examples/               # Sample test and response JSON
├── test-schema.json        # Formal JSON Schema
├── json_docs.md            # JSON format documentation
└── ARCHITECTURE.md         # Architecture documentation
```

## Documentation

- [JSON Format Reference](json_docs.md) — complete field documentation
- [Architecture](ARCHITECTURE.md) — system design and data flow
- [JSON Schema](test-schema.json) — machine-readable schema

## Example Files

- `examples/sample-test.json` — demo test with all question types
- `examples/sample-response.json` — example completed response output

## License

MIT
