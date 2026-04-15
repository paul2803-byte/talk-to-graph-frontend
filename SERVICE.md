# Talk-to-Data Frontend

A modern single-page application that provides a chat-based interface for querying semantic (JSON-LD) data with differential privacy protection.

---

## Overview

This frontend application enables users to:

1. **Upload** JSON-LD semantic data (via file upload or a JSON editor)
2. **Configure** the SOYA ontology URL for the dataset
3. **Ask** natural-language questions about the data through a chat interface
4. **View** differentially private answers, raw query results, and SPARQL queries
5. **Monitor** the global privacy budget in real-time

The service communicates with a Flask-based backend that handles SPARQL query generation, differential privacy mechanisms, and natural language response generation. See [`api.md`](./api.md) for the full API reference.

---

## Tech Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Framework   | React 19 + TypeScript            |
| Build tool  | Vite 6                          |
| Styling     | Vanilla CSS (custom properties)  |
| Icons       | Lucide React                     |
| Fonts       | Inter, JetBrains Mono (Google Fonts) |
| Deployment  | Docker (Nginx) / Kubernetes      |

---

## Architecture

```
src/
├── api/                   # Typed fetch-based API client
│   └── client.ts
├── components/
│   ├── layout/            # AppShell, Header
│   ├── chat/              # ChatWindow, MessageBubble, ChatInput
│   ├── data/              # DataUploadPanel, FileUploader, JsonEditor, OntologyUrlInput
│   ├── privacy/           # BudgetIndicator, BudgetResetButton
│   └── results/           # ResultTable, SparqlViewer
├── hooks/                 # Custom hooks (useChat, useBudget, useDataUpload)
├── types/                 # Shared TypeScript interfaces
├── styles/                # Global CSS design system
├── App.tsx                # Root component
└── main.tsx               # Entry point
```

### Key Design Decisions

- **No CSS framework** — Vanilla CSS with custom properties gives full design control and zero runtime overhead.
- **Discriminated union types** — API responses use TypeScript discriminated unions on the `status` field for type-safe error handling.
- **Hooks-based state management** — Three custom hooks (`useChat`, `useBudget`, `useDataUpload`) encapsulate all business logic. No external state library needed at this scale.
- **Data sent per request** — JSON-LD data is not persisted server-side; it is included in every API request.

---

## Environment Variables

| Variable       | Default                  | Description                    |
|----------------|--------------------------|--------------------------------|
| `VITE_API_URL` | `http://localhost:8000`  | Base URL of the Talk-to-Data backend |

Create a `.env` file (see `.env.example`) or set variables in your shell.

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- The Talk-to-Data backend running (see backend repo)

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev
```

### Production Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

---

## Docker Deployment

A multi-stage Dockerfile is included for Kubernetes / container deployments:

```bash
# Build the image
docker build -t talk-to-data-frontend .

# Run the container
docker run -p 80:80 talk-to-data-frontend
```

Set `VITE_API_URL` at **build time** (Vite inlines env vars during build):

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t talk-to-data-frontend .
```

---

## CORS Configuration

During local development the frontend (port 5173) and backend (port 8000) run on different origins. The backend must allow cross-origin requests by adding `flask-cors`:

```python
from flask_cors import CORS
CORS(app)
```

In a Kubernetes deployment, this can be handled at the ingress level instead.

---

## Limitations

- **No persistent sessions** — Session state (conversation history, session ID) is held in React state and lost on page refresh.
- **No authentication** — The UI is currently open / unauthenticated.
- **No server-side data storage** — JSON-LD data is sent with every request; large datasets may impact performance.

---

## Future Extensions

- Persistent session management (local storage or server-side)
- Authentication & authorization
- Data source presets / saved datasets
- Export conversation history
- Advanced result visualization (charts, graphs)
- Multi-language support
