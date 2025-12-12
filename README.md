# Student & Tutor Support System (SE-WEB)

## Overview

This project is a comprehensive **Student & Tutor Support System** designed to bridge the gap between students and academic tutors. It facilitates consultation booking, course requests, contest management, and real-time feedback.

The application is built as a **monorepo** containing both the Frontend (React/Vite) and Backend (Node.js/Express) codebases, orchestrated via Docker.

## 🚀 Key Features

### 🎓 For Students

- **Find Tutors**: Search for tutors by name or expertise.
- **Consultation Booking**: Schedule sessions with tutors.
- **Feedback System**: Rate and review finished sessions.
- **Course Requests**: Request new courses or tutoring topics.
- **Q&A**: Ask questions and view answers.
- **Contests**: Register and participate in academic contests.
- **Resource Library**: Access study materials.
- **Notifications**: Real-time updates on booking status and system announcements.

### 👨‍🏫 For Tutors

- **Session Management**: View and manage upcoming consultation sessions.
- **Requests & Approvals**: Accept or decline student requests.
- **Contest Management**: Oversee contests and participant lists.
- **Q&A Moderation**: Answer student queries.
- **Notifications**: Receive alerts for new bookings and messages.

### 🛠️ For Administrators (CoD/CTSV)

- **Dashboard & Reporting**: View system statistics (Sessions, Active Users, etc.) via interactive charts.
- **Course Management**: approve/reject course requests.
- **User Management**: Manage student and tutor accounts.
- **Scholarships**: Evaluate and process scholarship applications.

## 💻 Technology Stack

### Frontend

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Architecture**: Mobile-first, Responsive Design
- **Components**: [Radix UI](https://www.radix-ui.com/), Shadcn UI, Lucide React (Icons)
- **Charts**: Recharts
- **State/Routing**: React Router DOM, React Hook Form
- **Notifications**: Sonner (Toasts)

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
- **Security**: bcryptjs for password hashing, CORS enabled

### Infrastructure

- **Containerization**: Docker & Docker Compose

## 📂 Project Structure

```text
SE-WEB/
├── src/                    # Frontend Source Code
│   ├── components/         # React Components (grouped by feature/role)
│   │   ├── auth/           # Login & SSO
│   │   ├── student/        # Student-specific screens
│   │   ├── tutor/          # Tutor-specific screens
│   │   ├── shared/         # Shared components (Reports, Q&A)
│   │   └── ui/             # Reusable UI primitives (Buttons, Cards, etc.)
│   ├── contexts/           # React Context (Auth, Layout)
│   ├── hooks/              # Custom Hooks
│   ├── routes/             # App Routing & Route Protection
│   └── utils/              # API helpers & formatters
├── server/                 # Backend Source Code
│   ├── controllers/        # Business Logic (Feedback, Reports, Tutors, etc.)
│   ├── db/models/          # Mongoose Schemas
│   ├── middleware/         # Auth & Validation Middleware
│   ├── routes/             # API Endpoints
│   ├── scripts/            # Database Seeding scripts
│   └── services/           # Reusable services
├── docker-compose.yml      # Docker Orchestration
└── package.json            # Dependencies
```

## 🛠️ Installation & Setup

### Option 1: Docker (Recommended)

Run the entire stack (Frontend, Backend, MongoDB) with a single command.

1.  **Prerequisites**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
2.  **Start the App**:
    ```bash
    docker-compose up -d --build
    ```
3.  **Access**:

    - **Frontend**: `http://localhost:5173`
    - **Backend**: `http://localhost:3001`
    - **MongoDB**: `localhost:27017`
    - **Mongo Admin**: `admin` / `password`

4.  **Seed the Database** (Optional):
    Populate the database with demo data (Students, Tutors, Courses, etc.):
    ```bash
    docker-compose exec backend npm run seed
    ```

### Option 2: Manual Setup

#### 1. Backend

```bash
cd server
npm install
# Create .env based on .env.example
npm run dev
```

#### 2. Frontend

```bash
# In project root
npm install
npm run dev
```

## 🔐 Support & Demo Credentials

The database is automatically seeded (via `server/scripts/seed.js`) with the following accounts:

| Role              | Username (Student ID) | Password   |
| :---------------- | :-------------------- | :--------- |
| **Student**       | `student`             | `password` |
| **Tutor**         | `tutor`               | `password` |
| **CoD (Manager)** | `cod`                 | `password` |
| **CTSV (Admin)**  | `ctsv`                | `password` |

> **Note**: For testing "Find Tutor" or "Notifications", please log in as `student` to send requests and `tutor` to view them.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
