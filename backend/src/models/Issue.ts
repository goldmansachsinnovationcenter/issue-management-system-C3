export interface Issue {
  id: string
  title: string
  description: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  assignee: string
  reporter: string
  application: string
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

export interface Comment {
  id: string
  issueId: string
  author: string
  content: string
  createdAt: string
}

export interface CreateIssueRequest {
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  assignee: string
  application: string
}

export interface UpdateIssueRequest {
  status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  assignee?: string
}

export interface CreateCommentRequest {
  content: string
  author: string
}

export interface Statistics {
  statusCounts: Record<string, number>
  priorityCounts: Record<string, number>
  applicationCounts: Record<string, number>
  assigneeCounts: Record<string, number>
  totalIssues: number
  openIssues: number
  resolvedIssues: number
}
