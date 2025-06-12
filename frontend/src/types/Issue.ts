export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  reporter: string;
  application: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  issueId: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface IssueStatistics {
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  applicationCounts: Record<string, number>;
  assigneeCounts: Record<string, number>;
}
