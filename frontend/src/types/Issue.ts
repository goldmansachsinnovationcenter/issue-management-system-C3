export enum IssueStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

export enum IssuePriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Comment {
  id: string;
  issueId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: string;
  application: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  priority: IssuePriority;
  assignee: string;
  application: string;
}

export interface UpdateIssueRequest {
  status?: IssueStatus;
  priority?: IssuePriority;
  assignee?: string;
}

export interface AddCommentRequest {
  content: string;
  author: string;
}

export interface Statistics {
  statusCounts: Record<IssueStatus, number>;
  priorityCounts: Record<IssuePriority, number>;
  applicationCounts: Record<string, number>;
  assigneeCounts: Record<string, number>;
  totalIssues: number;
}
