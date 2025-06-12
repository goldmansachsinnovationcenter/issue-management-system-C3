# Issue Management System

A comprehensive web-based application for tracking and managing issues/tickets within an organization.

## Overview

The Issue Management System enables users to create, view, update, and comment on issues. It serves IT support teams, developers, and stakeholders who need to track and resolve problems across different applications.

## Features

- View all issues in a sortable, filterable list
- Create new issues with comprehensive form validation
- View detailed information about individual issues
- Add comments to facilitate collaboration
- Update issue status through workflow management
- Visualize issue statistics through interactive charts
- Responsive design for desktop and mobile devices

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- shadcn/ui component library
- Tailwind CSS for styling
- React Router for navigation
- Chart.js for data visualization

### Backend
- Node.js with Express
- TypeScript
- In-memory database (configurable)
- RESTful API architecture

## Project Structure

```
/
├── frontend/          # React frontend application
├── backend/           # Express backend API
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd issue-management-system-C3
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:8080

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:3000

## API Endpoints

- `GET /api/issues` - Retrieve all issues
- `GET /api/issues/:id` - Get specific issue
- `POST /api/issues` - Create new issue
- `PATCH /api/issues/:id` - Update issue status
- `POST /api/issues/:id/comments` - Add comment
- `GET /api/statistics` - Get issue statistics

## Development

The application follows modern React patterns with functional components and hooks. All components are fully typed with TypeScript for better development experience and code reliability.

## License

Copyright Goldman Sachs Innovation Center
