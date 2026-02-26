# Bolna Flow Builder

A single-page visual flow builder where users can construct flowcharts with conditional transitions and export them as JSON. Built as part of the **Bolna Interview Process**.

**Made by Aviraj Singh**

---

## What It Does

- **Canvas** — Add, drag, delete, and connect nodes visually with pan, zoom, and minimap support (powered by React Flow)
- **Node Editing** — Click any node to edit its ID, name, description, and manage outgoing edges with conditions and optional parameters
- **Live JSON Preview** — See the generated schema update in real-time with syntax highlighting, copy to clipboard, or download as `.json`
- **Validation** — Inline errors for duplicate IDs, missing fields, invalid edge targets, and disconnected nodes
- **Import** — Paste a JSON schema to reconstruct an entire flow on canvas

---

## Tech Stack

React 18 - UI framework 
React Flow 11 - Node-based canvas
Redux Toolkit - State management
Vite - Build tool & dev server

---

## Project Structure

```
src/
├── main.jsx                # Entry point — Redux Provider + ReactFlowProvider
├── App.jsx                 # Root layout
├── index.css               # Global styles + React Flow overrides
│
├── store/
│   ├── index.js            # Store configuration
│   ├── flowSlice.js        # Nodes, edges, start node, selection state
│   ├── uiSlice.js          # UI toggles (JSON panel, import modal, toast)
│   └── selectors.js        # Memoized selectors for validation & schema
│
└── components/
    ├── FlowCanvas.jsx      # React Flow canvas wrapper
    ├── FlowNode.jsx        # Custom node component
    ├── Sidebar.jsx          # Node editing panel
    ├── JsonPanel.jsx        # Live JSON preview
    ├── Toolbar.jsx          # Top action bar
    ├── ImportModal.jsx      # JSON import dialog
    └── Toast.jsx            # Notification banner
```

---

## How to Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173`.

---

## Schema

```json
{
  "start_node_id": "string",
  "nodes": [
    {
      "id": "string",
      "description": "string",
      "prompt": "string",
      "edges": [
        {
          "to_node_id": "string",
          "condition": "string",
          "parameters": { "key": "value" }
        }
      ]
    }
  ]
}
```