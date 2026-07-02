# TaskForge Pro — Enterprise Task Management Platform

TaskForge Pro is a production-grade enterprise task management platform built using a modern, robust full-stack architecture. It features a scalable, layered backend (Controller-Service-Repository) and a premium, highly animated front-end React dashboard with role-based access control (RBAC).

---

## Technical Stack & Architecture

### Backend Stack
- **Core**: Node.js, Express.js, TypeScript (strict mode)
- **Database**: MongoDB & Mongoose (indexing, soft-delete query hooks)
- **Security**: JWT Authentication, Bcryptjs password hashing, Helmet, CORS, Express Rate Limit, Express Validator/Zod
- **Infrastructure**: Centralized error mapping, Winston logging (Console & File), Swagger UI (Swagger JSDoc at `/api/docs`)

### Frontend Stack
- **Core**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v3 (custom theme colors, glassmorphism, responsive grid layouts)
- **Animations**: Framer Motion (motion v12+ using cubic bezier transitions)
- **Icons**: Lucide React

---

## Directory Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Environment configuration (dotenv) & Swagger/Winston setup
│   │   ├── database/        # Mongoose connection wrapper
│   │   ├── constants/       # Role, status, and priority enum constants
│   │   ├── utils/           # Custom error classes, security helpers, and apiResponse formatters
│   │   ├── models/          # Mongoose Schemas (User & Task)
│   │   ├── repositories/    # Database queries isolation layer (BaseRepository, UserRepository, TaskRepository)
│   │   ├── services/        # Business logic layer (AuthService, TaskService)
│   │   ├── controllers/     # Request/Response handlers
│   │   ├── validators/      # Zod input validation schemas
│   │   ├── middlewares/     # Authentication, RBAC, Rate Limiting, request/error loggers
│   │   ├── routes/          # Express route mappings
│   │   ├── seed/            # SUPER_ADMIN database seeder
│   │   ├── app.ts           # Express Application definition
│   │   └── server.ts        # Server entry with graceful shutdown & signal handlers
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # RoleHierarchyPanel, AuthModal, TaskDashboard
│   │   ├── context/         # AuthContext (session state, auto-logout interceptors)
│   │   ├── services/        # Axios API wrapper with request/response JWT injection
│   │   ├── index.css        # Tailwind configurations, custom scrollbars, and keyframe animations
│   │   ├── App.tsx          # Router layout connecting landing and dashboard
│   │   └── main.tsx         # App bootstrap
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── package.json
```

---

## Detailed Features

### 1. Robust Layered Architecture
Each layer adheres to single responsibility:
- **Repository**: Isolates database queries. Includes soft-delete queries through query middleware and custom pagination.
- **Service**: Executes core business transactions (password comparisons, token generation, permission verification).
- **Controller**: Manages HTTP responses, maps inputs, and forwards to services.

### 2. Centralized Error Handling & Logging
- **Centralized Errors**: Extends standard `Error` class into `AppError` subclasses (e.g. `NotFoundError`, `ConflictError`, `ValidationError`, `RateLimitError`).
- **Winston Logger**: Formats logs as JSON with request IDs and writes them to console and separate log files (`logs/error.log`, `logs/combined.log`).

### 3. Role-Based Access Control (RBAC)
Three defined permission tiers:
- **USER**: Read-only access. Can view the task dashboard, search/filter/sort/paginate tasks, but cannot create, edit, or delete.
- **ADMIN**: Read and Write access. Can create, edit, and soft-delete tasks.
- **SUPER_ADMIN**: Absolute system control. Seeded automatically on startup.

### 4. Interactive SVG Role Permission Curves
- Features fluid connection curves representing permission paths on the landing page, utilizing `<animateMotion>` to represent active data/permission flow packets moving dynamically along paths.
- Elements scale responsively and support spring-loaded hover states.

---

## Setup & Running the Application

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or on a cloud instance

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` (copy from `.env.example` if needed):
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/taskforge
   JWT_SECRET=super_secret_jwt_key_taskforge_pro
   JWT_EXPIRES_IN=1d
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Note: On launch, the system automatically seeds a `SUPER_ADMIN` account if it does not exist.*
5. Build the application:
   ```bash
   npm run build
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Build the static bundle:
   ```bash
   npm run build
   ```

---

## API Documentation
Once the backend is running, access the interactive OpenAPI/Swagger Swagger-UI docs at:
**[http://localhost:5000/api/docs](http://localhost:5000/api/docs)**
## Admin details :
   email: admin@company.com
   password: Admin@12345
