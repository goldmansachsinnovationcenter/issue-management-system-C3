import { v4 as uuidv4 } from 'uuid';
import { Issue, Comment, IssueStatus, IssuePriority, CreateIssueRequest, UpdateIssueRequest, AddCommentRequest, Statistics } from '../types/Issue.js';

class InMemoryDatabase {
  private issues: Issue[] = [];
  private comments: Comment[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    const sampleIssues: Issue[] = [
      {
        id: uuidv4(),
        title: 'Login page not loading correctly',
        description: 'Users are experiencing issues when trying to access the login page. The page appears blank and does not respond to user input.',
        status: IssueStatus.OPEN,
        priority: IssuePriority.HIGH,
        assignee: 'John Smith',
        application: 'Web Portal',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        comments: []
      },
      {
        id: uuidv4(),
        title: 'Database connection timeout',
        description: 'The application is experiencing intermittent database connection timeouts during peak hours, causing slow response times.',
        status: IssueStatus.IN_PROGRESS,
        priority: IssuePriority.CRITICAL,
        assignee: 'Sarah Johnson',
        application: 'Database',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        comments: []
      },
      {
        id: uuidv4(),
        title: 'Mobile app crashes on startup',
        description: 'The mobile application crashes immediately after startup on Android devices running version 12 and above.',
        status: IssueStatus.RESOLVED,
        priority: IssuePriority.HIGH,
        assignee: 'Mike Chen',
        application: 'Mobile App',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        comments: []
      },
      {
        id: uuidv4(),
        title: 'API rate limiting not working',
        description: 'The API gateway is not properly enforcing rate limits, allowing excessive requests from certain clients.',
        status: IssueStatus.OPEN,
        priority: IssuePriority.MEDIUM,
        assignee: 'Emily Davis',
        application: 'API Gateway',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        comments: []
      },
      {
        id: uuidv4(),
        title: 'Payment processing delays',
        description: 'Credit card payments are taking longer than usual to process, causing customer complaints.',
        status: IssueStatus.CLOSED,
        priority: IssuePriority.HIGH,
        assignee: 'David Wilson',
        application: 'Payment System',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
        updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        comments: []
      }
    ];

    const sampleComments: Comment[] = [
      {
        id: uuidv4(),
        issueId: sampleIssues[0].id,
        author: 'Lisa Anderson',
        content: 'I can reproduce this issue on Chrome and Firefox. It seems to be related to the recent CSS changes.',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: uuidv4(),
        issueId: sampleIssues[1].id,
        author: 'Tom Brown',
        content: 'Working on optimizing the database queries. Should have a fix ready by tomorrow.',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: uuidv4(),
        issueId: sampleIssues[2].id,
        author: 'Mike Chen',
        content: 'Fixed the compatibility issue with Android 12+. The update has been deployed to the app store.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];

    this.issues = sampleIssues;
    this.comments = sampleComments;

    this.issues.forEach(issue => {
      issue.comments = this.comments.filter(comment => comment.issueId === issue.id);
    });
  }

  getAllIssues(): Issue[] {
    return this.issues.map(issue => ({
      ...issue,
      comments: this.comments.filter(comment => comment.issueId === issue.id)
    }));
  }

  getIssueById(id: string): Issue | undefined {
    const issue = this.issues.find(issue => issue.id === id);
    if (!issue) return undefined;

    return {
      ...issue,
      comments: this.comments.filter(comment => comment.issueId === issue.id)
    };
  }

  createIssue(issueData: CreateIssueRequest): Issue {
    const newIssue: Issue = {
      id: uuidv4(),
      title: issueData.title,
      description: issueData.description,
      status: IssueStatus.OPEN,
      priority: issueData.priority,
      assignee: issueData.assignee,
      application: issueData.application,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };

    this.issues.push(newIssue);
    return newIssue;
  }

  updateIssue(id: string, updates: UpdateIssueRequest): Issue | undefined {
    const issueIndex = this.issues.findIndex(issue => issue.id === id);
    if (issueIndex === -1) return undefined;

    const updatedIssue = {
      ...this.issues[issueIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.issues[issueIndex] = updatedIssue;

    return {
      ...updatedIssue,
      comments: this.comments.filter(comment => comment.issueId === id)
    };
  }

  addComment(issueId: string, commentData: AddCommentRequest): Issue | undefined {
    const issue = this.issues.find(issue => issue.id === issueId);
    if (!issue) return undefined;

    const newComment: Comment = {
      id: uuidv4(),
      issueId,
      author: commentData.author,
      content: commentData.content,
      createdAt: new Date().toISOString()
    };

    this.comments.push(newComment);

    const issueIndex = this.issues.findIndex(issue => issue.id === issueId);
    this.issues[issueIndex].updatedAt = new Date().toISOString();

    return {
      ...this.issues[issueIndex],
      comments: this.comments.filter(comment => comment.issueId === issueId)
    };
  }

  getStatistics(): Statistics {
    const statusCounts = {} as Record<IssueStatus, number>;
    const priorityCounts = {} as Record<IssuePriority, number>;
    const applicationCounts = {} as Record<string, number>;
    const assigneeCounts = {} as Record<string, number>;

    Object.values(IssueStatus).forEach(status => {
      statusCounts[status] = 0;
    });

    Object.values(IssuePriority).forEach(priority => {
      priorityCounts[priority] = 0;
    });

    this.issues.forEach(issue => {
      statusCounts[issue.status]++;
      priorityCounts[issue.priority]++;
      
      applicationCounts[issue.application] = (applicationCounts[issue.application] || 0) + 1;
      assigneeCounts[issue.assignee] = (assigneeCounts[issue.assignee] || 0) + 1;
    });

    return {
      statusCounts,
      priorityCounts,
      applicationCounts,
      assigneeCounts,
      totalIssues: this.issues.length
    };
  }
}

export const database = new InMemoryDatabase();
