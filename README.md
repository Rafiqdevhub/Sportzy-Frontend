# Sportzy Frontend

**Live Sports Match Updates & Real-Time Commentary Platform**

Sportzy is a modern, real-time sports tracking application built with React Router v7, TypeScript, and WebSockets. Experience live match updates, scores, and expert commentary with a beautiful, responsive UI.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [WebSocket Integration](#-websocket-integration)
- [State Management](#-state-management)
- [Development](#-development)
- [Docker Deployment](#-docker-deployment)

---

## Features

- **Real-Time Updates**: Live match scores and commentary via WebSockets
- **Multi-Sport Support**: Track football, basketball, cricket, and more
- **Live Scoreboards**: Dynamic score tracking with team information
- **Commentary System**: Event-by-event match commentary with timestamps
- **Modern UI**: Beautiful Tailwind CSS design with animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Type Safety**: Full TypeScript implementation for robust code
- **Fast Performance**: Built on Vite for lightning-fast HMR
- **Admin Panel**: Create and manage matches with ease
- **Automatic Reconnection**: WebSocket auto-reconnect with exponential backoff
- **Global State Management**: Zustand for efficient state handling
- **Optimistic Updates**: Instant UI feedback with error handling

---

## Tech Stack

### Core Technologies

- **React Router v7** - File-based routing with SSR support
- **TypeScript** - Type-safe development
- **Vite** - Next-generation build tool
- **Tailwind CSS v4** - Utility-first styling

### State & Data Management

- **Zustand** - Lightweight state management
- **WebSocket API** - Real-time communication
- **Fetch API** - RESTful API integration

### Additional Tools

- **React Error Boundary** - Graceful error handling
- **Node.js 20+** - Runtime environment

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20 or higher ([Download](https://nodejs.org/))
- **npm**: v10 or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))
- **Sportzy Backend**: The API server must be running (see [Backend Setup](#api-integration))

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/sportzy-frontend.git
cd sportzy-frontend
```

### 2. Install Dependencies

```bash
npm ci
```

> **Note**: Use `npm ci` for faster, more reliable installs in production environments.

---

## Environment Configuration

Create a `.env` or `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Production Example
# VITE_API_URL=https://api.sportzy.com
# VITE_WS_URL=wss://api.sportzy.com
```

### Environment Variables

| Variable       | Description          | Default                 | Required |
| -------------- | -------------------- | ----------------------- | -------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` | Yes      |
| `VITE_WS_URL`  | WebSocket server URL | `ws://localhost:8000`   | Yes      |

> **Important**: All Vite environment variables must be prefixed with `VITE_` to be exposed to the client.

---

## Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### Production Build

Build the application for production:

```bash
npm run build
```

This generates optimized static files in the `build/` directory.

### Start Production Server

Run the built application:

```bash
npm run start
```

### Type Checking

Verify TypeScript types without building:

```bash
npm run typecheck
```

---

## Project Structure

```
frontend/
├── app/                          # Application source code
│   ├── components/               # Reusable UI components
│   │   ├── Alert.tsx            # Alert/notification component
│   │   ├── CommentaryList.tsx   # Commentary display
│   │   ├── CreateMatchForm.tsx  # Match creation form
│   │   ├── ErrorBoundary.tsx    # Error boundary wrapper
│   │   ├── LoadingSpinner.tsx   # Loading indicator
│   │   ├── MatchCard.tsx        # Match display card
│   │   ├── ScoreBoard.tsx       # Live scoreboard
│   │   ├── UpdateScoreForm.tsx  # Score update form
│   │   └── layouts/             # Layout components
│   │       ├── Navbar.tsx       # Navigation bar
│   │       └── Footer.tsx       # Footer
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── index.ts             # Hook exports
│   │
│   ├── routes/                   # Application routes
│   │   ├── home.tsx             # Landing page
│   │   ├── matches.tsx          # Matches list
│   │   ├── matches.$id.tsx      # Match detail page
│   │   └── admin.tsx            # Admin panel
│   │
│   ├── services/                 # API & WebSocket services
│   │   ├── api.ts               # REST API client
│   │   └── websocket.ts         # WebSocket manager
│   │
│   ├── store/                    # State management
│   │   └── index.ts             # Zustand store
│   │
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts             # Type declarations
│   │
│   ├── utils/                    # Utility functions
│   │   └── config.ts            # App configuration
│   │
│   ├── app.css                   # Global styles
│   ├── root.tsx                  # Root component
│   └── routes.ts                 # Route configuration
│
├── build/                        # Production build output
│   ├── client/                  # Client-side bundles
│   └── server/                  # Server-side bundles
│
├── public/                       # Static assets
│
├── .env                          # Environment variables
├── Dockerfile                    # Docker configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── vite.config.ts               # Vite configuration
└── README.md                     # This file
```

---

## Docker Deployment

### Build Docker Image

```bash
docker build -t sportzy-frontend .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e VITE_API_URL=http://backend:8000 \
  -e VITE_WS_URL=ws://backend:8000 \
  sportzy-frontend
```

---

## Available Scripts

| Script              | Description                           |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start development server on port 3000 |
| `npm run build`     | Build for production                  |
| `npm run start`     | Start production server               |
| `npm run typecheck` | Check TypeScript types                |

---
