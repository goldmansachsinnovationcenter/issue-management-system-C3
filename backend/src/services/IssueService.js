const { v4: uuidv4 } = require('uuid');
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');

let issues = [];

class IssueService {
  constructor() {
    this.initSampleData();
  }

  initSampleData() {
    const issue1 = new Issue(
      '1',
      'Login page not working',
      'User Portal',
      'John Doe',
      new Date().toISOString(),
      'Users cannot log in to the portal',
      ['admin@example.com'],
      'High',
      'Jane Smith'
    );

    const issue2 = new Issue(
      '2',
      'Data not syncing',
      'Mobile App',
      'Alice Johnson',
      new Date().toISOString(),
      'Data not syncing between devices',
      ['tech@example.com'],
      'Medium',
      'Bob Brown',
      'assigned'
    );

    issue1.addComment({
      id: '1',
      name: 'Jane Smith',
      text: 'Looking into this issue now.',
      timestamp: new Date().toISOString()
    });

    issues.push(issue1);
    issues.push(issue2);
  }

  getAllIssues() {
    return issues;
  }

  getIssueById(id) {
    return issues.find(issue => issue.id === id);
  }

  createIssue(issueData) {
    const id = uuidv4();
    const reportedTime = new Date().toISOString();
    const status = issueData.status || 'new';

    const newIssue = new Issue(
      id,
      issueData.subject,
      issueData.impactedApplication,
      issueData.reporterName,
      reportedTime,
      issueData.initialObservations,
      issueData.notificationEmails,
      issueData.priority,
      issueData.assignedTo,
      status
    );

    issues.push(newIssue);
    return newIssue;
  }

  updateIssueStatus(id, status) {
    const issue = this.getIssueById(id);
    if (!issue) return null;

    const success = issue.updateStatus(status);
    return success ? issue : null;
  }

  addComment(issueId, commentData) {
    const issue = this.getIssueById(issueId);
    if (!issue) return null;

    const comment = new Comment(
      uuidv4(),
      commentData.name,
      commentData.text,
      new Date().toISOString()
    );

    issue.addComment(comment);
    return comment;
  }

  getStatistics() {
    const totalIssues = issues.length;
    
    const statusCounts = {
      new: 0,
      assigned: 0,
      closed: 0,
      rejected: 0
    };
    
    const priorityCounts = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };
    
    const applicationCounts = {};
    
    const assigneeCounts = {};
    
    issues.forEach(issue => {
      statusCounts[issue.status]++;
      
      priorityCounts[issue.priority]++;
      
      if (applicationCounts[issue.impactedApplication]) {
        applicationCounts[issue.impactedApplication]++;
      } else {
        applicationCounts[issue.impactedApplication] = 1;
      }
      
      if (assigneeCounts[issue.assignedTo]) {
        assigneeCounts[issue.assignedTo]++;
      } else {
        assigneeCounts[issue.assignedTo] = 1;
      }
    });
    
    return {
      totalIssues,
      statusCounts,
      priorityCounts,
      applicationCounts,
      assigneeCounts
    };
  }

  setDatabaseImplementation(dbImplementation) {
    console.log('Switching database implementation is not yet implemented');
  }
}

module.exports = new IssueService();
