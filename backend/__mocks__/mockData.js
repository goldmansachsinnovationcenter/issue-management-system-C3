const mockIssues = [
  {
    id: '1',
    title: 'Test Issue',
    status: 'new',
    priority: 'High',
    reporterName: 'Test Reporter',
    assignedTo: 'Test Assignee',
    impactedApplication: 'Test App',
    initialObservations: 'Test observations',
    notificationEmails: ['test@example.com'],
    createdAt: new Date('2023-01-01').toISOString()
  }
];

module.exports = {
  mockIssues
};
