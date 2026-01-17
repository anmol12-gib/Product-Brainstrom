# Product Brainstrom

A **high-performance, real-time collaborative whiteboard application** built with **React, TypeScript, and WebSockets**. This platform allows multiple users to brainstorm, design, and visualize ideas on a **synchronized canvas** simultaneously.


---

## Live Deployment

* **Frontend (Vercel):** [https://product-brainstrom-588t-3cx83nepf-anmols-projects-0c0aea06.vercel.app/](https://product-brainstrom-588t-3cx83nepf-anmols-projects-0c0aea06.vercel.app/)

---

## Key Features

### Real-time Collaboration

All board objects—including **shapes, paths, and notes**—are synchronized instantly across all active sessions using **Socket.io**.

### Live Cursor Tracking

See the **real-time mouse positions** of all collaborators on the canvas.

### Presence Management

Automatic detection of users **joining or leaving** the workspace, ensuring an accurate collaborator list.

### Drawing Engine

Supports **freehand drawing** with real-time path updates for smooth sketching.

### Shape Library

Create and manipulate geometric primitives such as:

* Rectangles
* Circles
* Triangles
* Other basic shapes

### Note System

Collaborative **sticky notes and text elements** for brainstorming and documentation.

### Object Transformation

Select, drag, resize, and modify existing objects on the board.

### Infinite Canvas Feel

Smooth **panning and zooming** for navigating large, unrestricted board spaces.

### State Management

Robust **undo and redo** functionality powered by a history stack.

---

## Technical Stack

### Frontend

* **React.js** with **TypeScript** (type safety)
* **Zustand** for centralized, local-first state management
* **Tailwind CSS** for responsive and performant UI

### Real-time Engine

* **Socket.io** for bidirectional WebSocket communication

### Build Tool

* **Vite** for fast development and optimized production builds

### Backend

* **Node.js** server for broadcasting real-time events

---

## Project Structure

```text
src/
├── canvas/
│   ├── Interaction/     # User interactions (draw, select, transform)
│   ├── Render/          # Canvas rendering logic
│   └── Collaboration/   # Real-time sync and presence handling
│
├── store/
│   ├── boardStore.ts    # Global board state (Zustand)
│   ├── history.ts       # Undo/redo history stack
│   └── socket.ts        # Socket.io event listeners
│
├── hooks/
│   ├── useViewport.ts   # Zoom and pan logic
│   └── useCoordinates.ts# Coordinate transformations
│
server.js                # Node.js Socket.io backend
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

#### Frontend

```bash
npm install
```

#### Backend

```bash
cd server
npm install
```

### 3. Start the Socket.io Server

```bash
node server.js
```

### 4. Start the Frontend Development Server

```bash
npm run dev
```

### 5. Test Real-time Collaboration

Open the application in **multiple browser tabs or devices** to verify real-time synchronization.

---

## Use Cases

* Team brainstorming sessions
* UI/UX wireframing
* Technical architecture diagrams
* Remote collaboration and teaching

---

## License

This project is licensed under the **MIT License**.

---

## Contributions

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or submit an issue.
