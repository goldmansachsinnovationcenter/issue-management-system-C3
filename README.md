# Issue Management System

A standalone application for tracking and managing issues/tickets with React frontend and Node.js backend.

## Features

- **Issue Tracking**: View and manage all reported issues in a centralized dashboard
- **Issue Creation**: Create new issues through the UI with all required details:
  - Subject
  - Impacted application
  - Reporter name
  - Reported time (auto-generated)
  - Initial observations
  - Notification emails (comma-separated)
  - Priority (Low, Medium, High, Critical)
  - Assigned to
  - Status
- **Issue Details**: View comprehensive information about each issue
- **Commenting System**: Any user can add comments to tickets with their name, comment text, and timestamp
- **Status Management**: Update issue status (new, assigned, closed, rejected)
- **Statistics Dashboard**: Visual representation of issues by status, priority, application, and assignee
- **RESTful API**: Create and manage issues programmatically through API endpoints

## Project Structure

```
issue-management-system-C3/
├── frontend/                 # React frontend with TypeScript
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components (Dashboard, IssueList, IssueDetail, CreateIssue, Statistics)
│   │   └── types/            # TypeScript type definitions
│   ├── package.json          # Frontend dependencies
│   └── webpack.config.js     # Webpack configuration
└── backend/                  # Node.js backend
    ├── src/                  # Source code
    │   ├── controllers/      # Request handlers for API endpoints
    │   ├── models/           # Data models (Issue, Comment)
    │   ├── routes/           # API routes
    │   ├── services/         # Business logic with in-memory database
    │   └── index.js          # Entry point
    └── package.json          # Backend dependencies
```

## Technology Stack

- **Frontend**: 
  - React with TypeScript
  - Material-UI for component styling
  - React Router for navigation
  - Chart.js for statistics visualization
- **Backend**: 
  - Node.js with Express
  - RESTful API architecture
- **Database**: 
  - In-memory database (configurable to switch to other databases)

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
- `GET /api/issues/statistics/all` - Get statistics on issues by status, priority, application, and assignee

## Issue Data Structure

```javascript
{
  "id": "unique-id",
  "subject": "Issue title",
  "impactedApplication": "Application name",
  "reporterName": "Reporter's name",
  "reportedTime": "ISO timestamp",
  "initialObservations": "Initial description of the issue",
  "notificationEmails": ["email1@example.com", "email2@example.com"],
  "priority": "High/Medium/Low/Critical",
  "assignedTo": "Assignee name",
  "status": "new/assigned/closed/rejected",
  "comments": [
    {
      "id": "comment-id",
      "name": "Commenter name",
      "text": "Comment text",
      "timestamp": "ISO timestamp"
    }
  ]
}
```

## Database Configuration

The application uses an in-memory database by default. To configure a different database:

1. Modify the `IssueService.js` file in the backend
2. Implement the required data access methods for your chosen database
3. Update the service to use your new database implementation

The system is designed with a service layer that abstracts the data storage, making it easy to switch to a persistent database like MongoDB, MySQL, or PostgreSQL.

## License

This project is licensed under the MIT License.
