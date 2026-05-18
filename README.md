# Talk-to-Graph Frontend

A chat-based web interface for querying semantic (JSON-LD / RDF) data with differential privacy protection. Built with **React 19**, **TypeScript**, and **Vite 6**.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| [Node.js](https://nodejs.org/) | ≥ 20 |
| [Talk-to-Graph Service](https://github.com/OwnYourData/talk-to-graph-service) (backend) | running on port `8000` |

> [!IMPORTANT]
> The backend must be running **before** you start the frontend.
> Follow the setup instructions in the [talk-to-graph-service README](https://github.com/OwnYourData/talk-to-graph-service#readme) to install dependencies, configure your `.env` (LLM provider, API key, privacy budget, …), and start the Flask server on `http://localhost:8000`.

---

## Quick Start

```bash
# 1 — Clone the repository
git clone <this-repo-url>
cd talk-to-data-frontend

# 2 — Install dependencies
npm install

# 3 — Create your local environment file
cp .env.example .env          # Unix / macOS / Git Bash
# copy .env.example .env      # Windows CMD

# 4 — Start the development server
npm run dev
```

The app opens automatically at **http://localhost:5173**.

---

## Environment Variables

All environment variables are prefixed with `VITE_` so that Vite exposes them to the browser at build time.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | *(empty — uses the Vite dev proxy)* | Base URL of the Talk-to-Graph backend API. Leave **empty** during local development (see [Proxy](#proxy-during-development) below). Set to the full backend URL (e.g. `https://api.example.com`) for production builds. |

Create a `.env` file in the project root (a template is provided in `.env.example`):

```dotenv
# .env
VITE_API_URL=
```

> [!TIP]
> For **local development** you can leave `VITE_API_URL` empty. The Vite dev server proxies all `/api/*` requests to `http://localhost:8000` automatically, so no CORS issues will occur.

---

## Proxy During Development

The Vite config (`vite.config.ts`) ships with a built-in reverse proxy:

```ts
proxy: {
    '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
    },
},
```

This means every request from the frontend to `/api/…` is forwarded to the backend on port **8000**. You do **not** need to configure CORS on the backend during local development.

If the backend runs on a different host or port, either:
- update the `target` in `vite.config.ts`, **or**
- set `VITE_API_URL` in your `.env` to the full backend URL (e.g. `http://192.168.1.50:8000`) and configure [CORS](https://flask-cors.readthedocs.io/) on the backend.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with hot-reload (default: port 5173) |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally for verification |

---

## Docker Deployment

A multi-stage `Dockerfile` (Node build → Nginx serve) is included:

```bash
# Build the image
docker build -t talk-to-graph-frontend .

# Run the container
docker run -p 8080:80 talk-to-graph-frontend
```

Because Vite inlines environment variables at **build time**, pass `VITE_API_URL` as a build argument:

```bash
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  -t talk-to-graph-frontend .
```

---

## Project Structure

```
src/
├── api/                   # Typed fetch-based API client
│   └── client.ts
├── components/
│   ├── layout/            # AppShell, Header
│   ├── chat/              # ChatWindow, MessageBubble, ChatInput
│   ├── data/              # DataUploadPanel, FileUploader, JsonEditor, OntologyUrlInput
│   ├── privacy/           # BudgetIndicator, BudgetResetButton, EpsilonSelector
│   └── results/           # ResultTable, SparqlViewer
├── hooks/                 # Custom hooks (useChat, useBudget, useDataUpload)
├── types/                 # Shared TypeScript interfaces
├── styles/                # Global CSS design system
├── App.tsx                # Root component
└── main.tsx               # Entry point
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Vanilla CSS (custom properties) |
| Icons | Lucide React |
| Fonts | Inter, JetBrains Mono (Google Fonts) |
| Deployment | Docker (Nginx) |

---

## Backend Reference

This frontend is designed to work with the **Talk-to-Graph Service** backend:

👉 **https://github.com/OwnYourData/talk-to-graph-service**

Refer to the backend repo for:
- LLM provider configuration (`LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL`)
- Privacy budget settings (`EPSILON_TOTAL`, `EPSILON_BASE`, `MIN_GROUP_SIZE`)
- API endpoint documentation

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Network Error" / requests fail** | Make sure the backend is running on `http://localhost:8000` and reachable. |
| **CORS errors in the console** | Leave `VITE_API_URL` empty so the Vite proxy handles requests; or enable CORS on the backend (`flask-cors`). |
| **Environment variable not picked up** | Restart the dev server after changing `.env`. Vite only reads env files on startup. |
| **Port 5173 already in use** | Stop the other process or change the port in `vite.config.ts`. |
