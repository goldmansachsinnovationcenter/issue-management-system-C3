const issueService = require('../IssueService');
const Issue = require('../../models/Issue');
const { v4: uuidv4 } = require('uuid');

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid')
}));

jest.mock('../../models/Issue', () => {
  return jest.fn().mockImplementation((id, subject, impactedApplication, reporterName, reportedTime, initialObservations, notificationEmails, priority, assignedTo, status = 'new') => {
    return {
      id,
      subject,
      impactedApplication,
      reporterName,
      reportedTime,
      initialObservations,
      notificationEmails,
      priority,
      assignedTo,
      status,
      comments: [],
      addComment: jest.fn(),
      updateStatus: jest.fn().mockImplementation((newStatus) => {
        if (['new', 'assigned', 'closed', 'rejected'].includes(newStatus)) {
          this.status = newStatus;
          return true;
        }
        return false;
      })
    };
  });
});

describe('IssueService', () => {
  beforeEach(() => {
    Issue.mockClear();
    jest.spyOn(issueService, 'getAllIssues').mockReturnValue([]);
  });

  describe('createIssue', () => {
    it('should create a new issue with the provided data', () => {
      const issueData = {
        subject: 'New Issue',
        status: 'new',
        priority: 'Medium',
        reporterName: 'John Doe',
        assignedTo: 'Jane Smith',
        impactedApplication: 'Test Application',
        initialObservations: 'This is a test issue',
        notificationEmails: ['john@example.com', 'jane@example.com']
      };

      const result = issueService.createIssue(issueData);

      expect(Issue).toHaveBeenCalledWith(
        expect.any(String),
        issueData.subject,
        issueData.impactedApplication,
        issueData.reporterName,
        expect.any(String),
        issueData.initialObservations,
        issueData.notificationEmails,
        issueData.priority,
        issueData.assignedTo,
        issueData.status
      );
      
      expect(result).toEqual(expect.objectContaining({
        subject: issueData.subject,
        status: issueData.status,
        priority: issueData.priority
      }));
    });
  });

  describe('updateIssueStatus', () => {
    it('should update the status of an issue if it exists and the status is valid', () => {
      const testIssue = {
        id: 'test-id-123',
        status: 'new',
        updateStatus: jest.fn().mockReturnValue(true)
      };
      
      jest.spyOn(issueService, 'getIssueById').mockReturnValue(testIssue);

      const newStatus = 'assigned';
      const result = issueService.updateIssueStatus('test-id-123', newStatus);

      expect(issueService.getIssueById).toHaveBeenCalledWith('test-id-123');
      
      expect(testIssue.updateStatus).toHaveBeenCalledWith(newStatus);
      
      expect(result).not.toBeNull();
    });

    it('should return null if the issue does not exist', () => {
      jest.spyOn(issueService, 'getIssueById').mockReturnValue(null);

      const result = issueService.updateIssueStatus('non-existent-id', 'assigned');

      expect(issueService.getIssueById).toHaveBeenCalledWith('non-existent-id');
      
      expect(result).toBeNull();
    });
  });
});
