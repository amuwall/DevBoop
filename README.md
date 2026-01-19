# DevToolbox

A comprehensive Windows development toolbox application built with Electron, React, and Fluent UI.

## Features

- **Modular Architecture**: Built on a robust plugin system.
- **Modern UI**: Follows Windows 11 Fluent Design principles using `@fluentui/react-components`.
- **Core Tools**:
  - **Timestamp Converter**: Convert between Unix timestamps (seconds/milliseconds) and human-readable dates (Local/UTC).
- **Productivity**:
  - Multi-tab support for working with multiple tools simultaneously.
  - Dark/Light theme toggle.
  - Sidebar navigation.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Development

Start the app in development mode with hot-reload:

```bash
npm run dev
```

### Building for Production

Build the application for Windows:

```bash
npm run build
```

## Testing

Run unit tests:

```bash
npm run test
```

## Contributing

See [PLUGIN_DEV.md](PLUGIN_DEV.md) for instructions on how to create new tools.
