# Todo Application

A full-stack todo application with category management, built with modern technologies using **Turborepo** for monorepo management.

## Tech Stack

### Monorepo

- **Turborepo** for build orchestration and caching

### Frontend (`apps/web`)

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Tailwind CSS** with Shadcn/UI components
- **Vite** for build tooling
- **Framer Motion** for animations

### Backend (`apps/api`)

- **Node.js** with Express.js
- **TypeScript**
- **Zod** for validation
- **In-memory database** (no external DB required)

## Features

- Create, edit, and delete todos
- Create and manage categories with custom colors
- Mark todos as complete/incomplete
- Filter todos by status (all, active, completed)
- Sort todos by due date or creation date
- Group todos by category
- Responsive design with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+
- npm 10+

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd todo
```

2. Install all dependencies from the root:

```bash
npm install
```

### Running the Application

Start both frontend and backend with a single command:

```bash
npm run dev
```

This will start:

- Backend API at `http://localhost:3001`
- Frontend at `http://localhost:8080`

### Other Commands

```bash
# Run only the API
npm run dev:api

# Run only the web app
npm run dev:web

# Build all apps
npm run build

# Lint all apps
npm run lint

# Clean all builds and node_modules
npm run clean
```

## API Documentation

### Swagger UI

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:3001/api-docs
- **OpenAPI JSON**: http://localhost:3001/api-docs.json

### Postman Collection

Import `apps/api/postman-collection.json` into Postman for ready-to-use API requests with collection variables.

## API Endpoints

### Categories

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/categories`     | Get all categories    |
| GET    | `/api/categories/:id` | Get category by ID    |
| POST   | `/api/categories`     | Create a new category |
| PATCH  | `/api/categories/:id` | Update a category     |
| DELETE | `/api/categories/:id` | Delete a category     |

### Todos

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/api/todos`            | Get all todos          |
| GET    | `/api/todos/:id`        | Get todo by ID         |
| POST   | `/api/todos`            | Create a new todo      |
| PATCH  | `/api/todos/:id`        | Update a todo          |
| DELETE | `/api/todos/:id`        | Delete a todo          |
| PATCH  | `/api/todos/:id/toggle` | Toggle todo completion |

## Project Structure

```
todo/
├── apps/
│   ├── api/                    # @todo/api - Backend Express API
│   │   ├── src/
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── database/       # In-memory database
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── repositories/   # Data access layer
│   │   │   ├── routes/         # API routes
│   │   │   ├── services/       # Business logic
│   │   │   ├── types/          # TypeScript interfaces
│   │   │   ├── utils/          # Utility functions
│   │   │   └── validators/     # Zod validation schemas
│   │   └── package.json
│   │
│   └── web/                    # @todo/web - Frontend React app
│       ├── src/
│       │   ├── api/            # API service layer
│       │   ├── components/     # React components
│       │   ├── hooks/          # Custom hooks
│       │   ├── pages/          # Page components
│       │   ├── store/          # Redux store and slices
│       │   └── types/          # TypeScript interfaces
│       └── package.json
│
├── package.json                # Root workspace config
├── turbo.json                  # Turborepo configuration
└── README.md
```

## Sample Data

The application comes pre-seeded with sample categories and todos:

**Categories:**

- Work (sage green)
- Personal (purple)
- Health (pink)
- Learning (orange)

**Sample Todos:**

- Design new landing page (Work)
- Buy groceries (Personal)
- Review pull requests (Work - completed)
- Morning yoga session (Health)
- Read 'Atomic Habits' (Learning)

## Turborepo Benefits

- **Parallel execution**: Both apps start simultaneously with `npm run dev`
- **Build caching**: Unchanged packages skip rebuilding
- **Dependency awareness**: Proper build ordering based on package dependencies
- **Unified commands**: Single entry point for all workspace operations
