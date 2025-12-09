# Product Requirements Document (PRD)

## Todo Application

**Version:** 1.0
**Last Updated:** December 2024
**Status:** Implemented

---

## 1. Overview

### 1.1 Product Summary

A full-stack todo application that allows users to manage tasks across multiple categories. The application provides a modern, responsive interface for creating, organizing, and tracking todos with category-based grouping.

### 1.2 Objective

Create a feature-rich task management application that demonstrates best practices in full-stack development using modern technologies including React, Redux Toolkit, Express.js, and TypeScript.

---

## 2. User Stories

### 2.1 Todo Management

| ID   | User Story                                                                          | Priority | Status |
| ---- | ----------------------------------------------------------------------------------- | -------- | ------ |
| US-1 | As a user, I want to create a new todo item with a title, description, and due date | High     | Done   |
| US-2 | As a user, I want to assign a category to each todo item                            | High     | Done   |
| US-3 | As a user, I want to view all my todo items grouped by their categories             | High     | Done   |
| US-4 | As a user, I want to mark a todo item as complete or incomplete                     | High     | Done   |
| US-5 | As a user, I want to edit the details of an existing todo item                      | High     | Done   |
| US-6 | As a user, I want to delete a todo item                                             | High     | Done   |

### 2.2 Category Management

| ID   | User Story                                                              | Priority | Status |
| ---- | ----------------------------------------------------------------------- | -------- | ------ |
| US-7 | As a user, I want to create new categories for organizing my todo items | High     | Done   |
| US-8 | As a user, I want to assign custom colors to categories                 | Medium   | Done   |
| US-9 | As a user, I want to delete categories                                  | Medium   | Done   |

### 2.3 Filtering & Sorting

| ID    | User Story                                                                                 | Priority | Status |
| ----- | ------------------------------------------------------------------------------------------ | -------- | ------ |
| US-10 | As a user, I want to filter todo items by their completion status (all, active, completed) | High     | Done   |
| US-11 | As a user, I want to sort todo items by due date or creation date                          | Medium   | Done   |

---

## 3. Functional Requirements

### 3.1 Todo Item

A todo item must contain:

- **id** (string, UUID): Unique identifier
- **title** (string, required): Task title (1-255 characters)
- **description** (string, optional): Task description (0-1000 characters)
- **dueDate** (string | null): ISO date string for due date
- **categoryId** (string | null): Reference to category
- **completed** (boolean): Completion status
- **createdAt** (string): ISO datetime of creation
- **updatedAt** (string): ISO datetime of last update

### 3.2 Category

A category must contain:

- **id** (string, UUID): Unique identifier
- **name** (string, required): Category name (1-100 characters)
- **color** (string, required): HSL color string (e.g., "hsl(152, 35%, 45%)")
- **icon** (string, optional): Icon identifier (future use)

### 3.3 API Operations

#### Todos

| Operation         | Endpoint                | Method |
| ----------------- | ----------------------- | ------ |
| List all todos    | `/api/todos`            | GET    |
| Get single todo   | `/api/todos/:id`        | GET    |
| Create todo       | `/api/todos`            | POST   |
| Update todo       | `/api/todos/:id`        | PATCH  |
| Delete todo       | `/api/todos/:id`        | DELETE |
| Toggle completion | `/api/todos/:id/toggle` | PATCH  |

#### Categories

| Operation           | Endpoint              | Method |
| ------------------- | --------------------- | ------ |
| List all categories | `/api/categories`     | GET    |
| Get single category | `/api/categories/:id` | GET    |
| Create category     | `/api/categories`     | POST   |
| Update category     | `/api/categories/:id` | PATCH  |
| Delete category     | `/api/categories/:id` | DELETE |

### 3.4 Business Rules

1. A todo can exist without a category (categoryId = null)
2. Deleting a category sets all associated todos' categoryId to null
3. Title is required for creating a todo
4. Name and color are required for creating a category
5. Completed todos should display with visual strikethrough
6. Overdue todos (past due date, not completed) should display warning indicator

---

## 4. Non-Functional Requirements

### 4.1 Performance

- API response time < 100ms for all operations
- Frontend initial load < 3 seconds
- Smooth animations at 60fps

### 4.2 Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Mobile responsive (320px - 1920px viewport)

### 4.3 Accessibility

- Keyboard navigable
- Screen reader compatible
- Color contrast WCAG AA compliant

---

## 5. Technical Architecture

### 5.1 Frontend Stack

| Technology    | Purpose           |
| ------------- | ----------------- |
| React 18      | UI framework      |
| TypeScript    | Type safety       |
| Redux Toolkit | State management  |
| Tailwind CSS  | Styling           |
| Shadcn/UI     | Component library |
| Vite          | Build tool        |
| Axios         | HTTP client       |
| Framer Motion | Animations        |

### 5.2 Backend Stack

| Technology   | Purpose       |
| ------------ | ------------- |
| Node.js      | Runtime       |
| Express.js 5 | Web framework |
| TypeScript   | Type safety   |
| Zod          | Validation    |
| UUID         | ID generation |

### 5.3 Infrastructure

| Component       | Technology     |
| --------------- | -------------- |
| Monorepo        | Turborepo      |
| Package Manager | npm workspaces |
| Code Formatting | Prettier       |
| Linting         | ESLint         |

### 5.4 Data Storage

- In-memory database (Map-based)
- Data persists during server runtime
- Resets on server restart (by design for demo purposes)

---

## 6. UI/UX Design

### 6.1 Layout

- Header with app title and action buttons
- Main content area with todo list grouped by category
- Modal dialogs for create/edit forms
- Floating action button on mobile

### 6.2 Color Scheme

- Primary: Sage green `hsl(152, 35%, 45%)`
- Background: Light neutral tones
- Dark mode: Full support

### 6.3 Key Interactions

- Click checkbox to toggle completion
- Hover to reveal edit/delete actions
- Click category header to collapse/expand group
- Filter buttons for status filtering
- Dropdown for sort options

---

## 7. Sample Data

### 7.1 Default Categories

| Name     | Color                             |
| -------- | --------------------------------- |
| Work     | `hsl(152, 35%, 45%)` - Sage green |
| Personal | `hsl(262, 52%, 55%)` - Purple     |
| Health   | `hsl(340, 65%, 55%)` - Pink       |
| Learning | `hsl(38, 92%, 50%)` - Orange      |

### 7.2 Sample Todos

| Title                   | Category | Status    |
| ----------------------- | -------- | --------- |
| Design new landing page | Work     | Active    |
| Buy groceries           | Personal | Active    |
| Review pull requests    | Work     | Completed |
| Morning yoga session    | Health   | Active    |
| Read 'Atomic Habits'    | Learning | Active    |

---

## 8. Future Enhancements

### 8.1 Phase 2 (Planned)

- [ ] User authentication
- [ ] Persistent database (PostgreSQL)
- [ ] Due date reminders/notifications
- [ ] Recurring todos
- [ ] Priority levels

### 8.2 Phase 3 (Planned)

- [ ] Drag-and-drop reordering
- [ ] Subtasks/checklists
- [ ] Labels/tags
- [ ] Search functionality
- [ ] Export/import data

### 8.3 Phase 4 (Planned)

- [ ] Collaboration/sharing
- [ ] Calendar view
- [ ] Statistics/analytics
- [ ] Mobile app (React Native)

---

## 9. Success Metrics

| Metric                   | Target  |
| ------------------------ | ------- |
| Page load time           | < 3s    |
| API response time        | < 100ms |
| Lighthouse Performance   | > 90    |
| Lighthouse Accessibility | > 90    |
| TypeScript coverage      | 100%    |

---

## 10. Glossary

| Term     | Definition                                                                  |
| -------- | --------------------------------------------------------------------------- |
| Todo     | A single task item with title, description, due date, and completion status |
| Category | A grouping mechanism for organizing todos                                   |
| Filter   | A way to show/hide todos based on criteria (status)                         |
| Sort     | A way to order todos (by date)                                              |
