# Issue Management System

A standalone application for tracking and managing issues/tickets with React frontend and Node.js backend.

## Features

- Create and track issues with detailed information
- Add comments to issues
- Update issue status
- View statistics on issues
- RESTful API for programmatic access

## Project Structure

```
issue-management-system-C3/
├── frontend/                 # React frontend
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   └── types/            # TypeScript type definitions
│   ├── package.json          # Frontend dependencies
│   └── webpack.config.js     # Webpack configuration
└── backend/                  # Node.js backend
    ├── src/                  # Source code
    │   ├── controllers/      # Request handlers
    │   ├── models/           # Data models
    │   ├── routes/           # API routes
    │   ├── services/         # Business logic
    │   └── index.js          # Entry point
    └── package.json          # Backend dependencies
```

## Technology Stack

- **Frontend**: React, Material-UI, React Router, Chart.js
- **Backend**: Node.js, Express
- **Database**: In-memory (configurable to switch to other databases)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/issue-management-system-C3.git
cd issue-management-system-C3
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server
```
cd backend
npm start
```

2. Start the frontend development server
```
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get issue by ID
- `POST /api/issues` - Create a new issue
- `PATCH /api/issues/:id/status` - Update issue status
- `POST /api/issues/:id/comments` - Add a comment to an issue
- `GET /api/issues/statistics/all` - Get statistics

## Database Configuration

The application uses an in-memory database by default. To configure a different database, modify the `IssueService.js` file in the backend.

## License

This project is licensed under the MIT License.
