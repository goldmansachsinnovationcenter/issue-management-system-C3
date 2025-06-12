# Issue Management System

A comprehensive web-based application for tracking and managing issues/tickets within an organization.

## Features

- **Issue Management**: Create, view, update, and delete issues
- **Comment System**: Collaborate through issue comments
- **Status Workflow**: Track issues through Open → In Progress → Resolved → Closed
- **Statistics Dashboard**: Visual analytics with charts and reports
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Tailwind CSS for styling
- shadcn/ui for form components
- Material-UI for Floating Action Buttons
- Chart.js for data visualization
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- RESTful API with '/api' prefix
- In-memory database with sample data

## Project Structure

```
/
├── frontend/          # React frontend application
├── backend/           # Express backend API
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd issue-management-system-C3
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

### Running the Application

1. Start the backend server (runs on port 8080)
```bash
cd backend
npm run dev
```

2. Start the frontend development server (runs on port 3000)
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/issues` - List all issues
- `GET /api/issues/:id` - Get issue details
- `POST /api/issues` - Create new issue
- `PATCH /api/issues/:id` - Update issue
- `POST /api/issues/:id/comments` - Add comment
- `GET /api/statistics` - Get dashboard statistics

## Development

This project follows Goldman Sachs Innovation Center standards:
- shadcn/ui components for all form elements
- Material-UI Floating Action Buttons for primary actions
- Tailwind CSS for styling and responsive design
- Backdrop components for action state transitions

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Internal Goldman Sachs Innovation Center project.
