# Frontend Requirements

This document describes what is required to install, run, and validate the Link frontend.

## Runtime requirements

- Node.js `20.19.0+` or `22.12.0+`
- npm included with Node.js
- A modern browser such as Chrome, Edge, Firefox, or Safari
- Approximately 250 MB of free disk space for the installed frontend dependencies

Verify the installed tools before setup:

```bash
node --version
npm --version
```

## Installation

Run the following commands from this directory:

```bash
npm install
```

The project uses `package-lock.json` to keep dependency versions consistent between installations.

## Frontend dependencies

The dependency manifest is [`package.json`](package.json). The main runtime dependencies are:

- React and React DOM for the user interface
- React Router for page navigation
- Lucide React for interface icons
- Inter font resources for typography

Development tooling includes Vite, the React Vite plugin, and ESLint.

## Useful commands

| Command | Result |
| --- | --- |
| `npm run dev` | Starts the development server with hot reload |
| `npm run lint` | Runs ESLint checks |
| `npm run build` | Produces a deployable build in `dist/` |
| `npm run preview` | Serves the `dist/` build locally for verification |

## Current limitations

The frontend currently uses mock data from `src/mock/data.js`. Login, registration, conversation loading, and message sending are placeholders until the corresponding backend APIs and WebSocket message contract are available.
