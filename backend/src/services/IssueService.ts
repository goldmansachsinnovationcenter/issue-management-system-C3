import { v4 as uuidv4 } from 'uuid'
import { Issue, Comment, CreateIssueRequest, UpdateIssueRequest, CreateCommentRequest, Statistics } from '../models/Issue'

export class IssueService {
  private static instance: IssueService
  private issues: Issue[] = []

  static getInstance(): IssueService {
    if (!IssueService.instance) {
      IssueService.instance = new IssueService()
    }
    return IssueService.instance
  }

  initSampleData(): void {
    const sampleIssues: Issue[] = [
      {
        id: uuidv4(),
        title: 'Login page not loading correctly',
        description: 'Users are reporting that the login page takes too long to load and sometimes shows a blank screen. This is affecting user experience and preventing access to the application.',
        status: 'Open',
        priority: 'High',
        assignee: 'John Smith',
        reporter: 'Jane Doe',
        application: 'Web Portal',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        comments: [
          {
            id: uuidv4(),
            issueId: '',
            author: 'Jane Doe',
            content: 'This issue is blocking multiple users from accessing the system.',
            createdAt: new Date(Date.now() - 43200000).toISOString(),
          }
        ]
      },
      {
        id: uuidv4(),
        title: 'Database connection timeout',
        description: 'The application is experiencing intermittent database connection timeouts during peak hours. This is causing data retrieval failures and impacting system performance.',
        status: 'In Progress',
        priority: 'Critical',
        assignee: 'Mike Johnson',
        reporter: 'Sarah Wilson',
        application: 'API Service',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        comments: [
          {
            id: uuidv4(),
            issueId: '',
            author: 'Mike Johnson',
            content: 'Investigating the connection pool configuration. Will update soon.',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          }
        ]
      },
      {
        id: uuidv4(),
        title: 'Email notifications not being sent',
        description: 'Users are not receiving email notifications for important system events. The email service appears to be functioning but notifications are not being delivered.',
        status: 'Resolved',
        priority: 'Medium',
        assignee: 'Lisa Chen',
        reporter: 'Tom Brown',
        application: 'Notification Service',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        comments: [
          {
            id: uuidv4(),
            issueId: '',
            author: 'Lisa Chen',
            content: 'Fixed the SMTP configuration issue. Notifications are now working properly.',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          }
        ]
      }
    ]

    sampleIssues.forEach(issue => {
      issue.comments.forEach(comment => {
        comment.issueId = issue.id
      })
    })

    this.issues = sampleIssues
  }

  getAllIssues(): Issue[] {
    return this.issues.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getIssueById(id: string): Issue | undefined {
    return this.issues.find(issue => issue.id === id)
  }

  createIssue(createRequest: CreateIssueRequest): Issue {
    const newIssue: Issue = {
      id: uuidv4(),
      title: createRequest.title,
      description: createRequest.description,
      status: 'Open',
      priority: createRequest.priority,
      assignee: createRequest.assignee,
      reporter: 'Current User',
      application: createRequest.application,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    }

    this.issues.push(newIssue)
    return newIssue
  }

  updateIssue(id: string, updateRequest: UpdateIssueRequest): Issue | undefined {
    const issueIndex = this.issues.findIndex(issue => issue.id === id)
    if (issueIndex === -1) {
      return undefined
    }

    const currentIssue = this.issues[issueIndex]
    if (!currentIssue) {
      return undefined
    }

    const updatedIssue: Issue = {
      ...currentIssue,
      status: updateRequest.status ?? currentIssue.status,
      assignee: updateRequest.assignee ?? currentIssue.assignee,
      updatedAt: new Date().toISOString()
    }

    this.issues[issueIndex] = updatedIssue
    return updatedIssue
  }

  addComment(issueId: string, commentRequest: CreateCommentRequest): Issue | undefined {
    const issue = this.getIssueById(issueId)
    if (!issue) {
      return undefined
    }

    const newComment: Comment = {
      id: uuidv4(),
      issueId: issueId,
      author: commentRequest.author,
      content: commentRequest.content,
      createdAt: new Date().toISOString()
    }

    issue.comments.push(newComment)
    issue.updatedAt = new Date().toISOString()

    return issue
  }

  getStatistics(): Statistics {
    const statusCounts: Record<string, number> = {}
    const priorityCounts: Record<string, number> = {}
    const applicationCounts: Record<string, number> = {}
    const assigneeCounts: Record<string, number> = {}

    this.issues.forEach(issue => {
      statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1
      priorityCounts[issue.priority] = (priorityCounts[issue.priority] || 0) + 1
      applicationCounts[issue.application] = (applicationCounts[issue.application] || 0) + 1
      assigneeCounts[issue.assignee] = (assigneeCounts[issue.assignee] || 0) + 1
    })

    const totalIssues = this.issues.length
    const openIssues = statusCounts['Open'] || 0
    const resolvedIssues = statusCounts['Resolved'] || 0

    return {
      statusCounts,
      priorityCounts,
      applicationCounts,
      assigneeCounts,
      totalIssues,
      openIssues,
      resolvedIssues
    }
  }
}
