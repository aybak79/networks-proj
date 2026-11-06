# Networks Project

This repository contains the frontend for the Link chat application. The frontend is a React application powered by Vite.

## Frontend quick start

### Prerequisites

- Node.js `20.19.0+` or `22.12.0+`
- npm (included with Node.js)
- Git, if you are cloning the repository

The supported frontend prerequisites and dependency overview are listed in [`client/requirements.md`](client/requirements.md).

### Install dependencies

From the repository root:

```bash
cd client
npm install
```

`npm install` uses [`client/package-lock.json`](client/package-lock.json) to install the exact locked dependency versions.

### Start the development server

```bash
npm run dev
```

Vite will print the local address in the terminal, normally:

```text
http://localhost:5173
```

Open that address in a browser. Vite provides hot module replacement, so most source changes appear immediately without restarting the server.

### Available commands

Run these commands from the `client` directory:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in `client/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the frontend source with ESLint |

### Current application mode

The frontend currently runs independently using mock conversations and messages from [`client/src/mock/data.js`](client/src/mock/data.js). You do not need to start the backend to preview the current UI.

Authentication and chat transport are not yet wired to backend APIs. The frontend service layer is located at [`client/src/services/chatService.js`](client/src/services/chatService.js), which is the intended integration point when backend endpoints are available.

### Recommended development workflow

1. Install Node.js and verify it:

   ```bash
   node --version
   npm --version
   ```

2. Install frontend dependencies:

   ```bash
   cd client
   npm install
   ```

3. Run the quality checks:

   ```bash
   npm run lint
   npm run build
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the URL printed by Vite and use the browser developer tools to inspect warnings or errors.

### Troubleshooting

**`npm` or `node` is not recognized**

Install Node.js, restart the terminal, and verify the installation with `node --version` and `npm --version`.

**Dependency or lockfile issues**

Run `npm install` from `client`, not from the repository root. If dependencies become incomplete, remove only `client/node_modules` and run `npm install` again.

**The page is blank or does not update**

Check the terminal running Vite and the browser console for errors. Confirm that the URL is the Vite URL printed after `npm run dev`.

## Project structure

```text
client/
├── src/
│   ├── components/   Reusable UI components
│   ├── pages/        Application pages and routes
│   ├── services/     Data and backend integration layer
│   ├── mock/         Temporary local demo data
│   └── styles/       Shared styling
├── package.json      Scripts and frontend dependencies
├── package-lock.json Locked dependency versions
└── vite.config.js    Vite configuration
```
