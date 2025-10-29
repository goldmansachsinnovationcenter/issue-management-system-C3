export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface Comment {
  id: string;
  name: string;
  text: string;
  timestamp: string;
  userId?: string;
}

export interface Issue {
  id: string;
  subject: string;
  impactedApplication: string;
  reporterName: string;
  reportedTime: string;
  initialObservations: string;
  notificationEmails: string[];
  priority: string;
  assignedTo: string;
  status: 'new' | 'assigned' | 'closed' | 'rejected';
  comments: Comment[];
  userId?: string;
}
