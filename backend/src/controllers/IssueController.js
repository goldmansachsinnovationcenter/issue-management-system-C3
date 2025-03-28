const issueService = require('../services/IssueService');

class IssueController {
  getAllIssues(req, res) {
    try {
      const issues = issueService.getAllIssues();
      res.status(200).json(issues);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving issues', error: error.message });
    }
  }

  getIssueById(req, res) {
    try {
      const id = req.params.id;
      const issue = issueService.getIssueById(id);
      
      if (!issue) {
        return res.status(404).json({ message: `Issue with id ${id} not found` });
      }
      
      res.status(200).json(issue);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving issue', error: error.message });
    }
  }

  createIssue(req, res) {
    try {
      const issueData = req.body;
      
      const requiredFields = ['subject', 'impactedApplication', 'reporterName', 'initialObservations', 'priority', 'assignedTo'];
      const missingFields = requiredFields.filter(field => !issueData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: 'Missing required fields', 
          missingFields 
        });
      }
      
      const newIssue = issueService.createIssue(issueData);
      res.status(201).json(newIssue);
    } catch (error) {
      res.status(500).json({ message: 'Error creating issue', error: error.message });
    }
  }

  updateIssueStatus(req, res) {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      if (!status || !['new', 'assigned', 'closed', 'rejected'].includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status value. Must be one of: new, assigned, closed, rejected' 
        });
      }
      
      const updatedIssue = issueService.updateIssueStatus(id, status);
      
      if (!updatedIssue) {
        return res.status(404).json({ message: `Issue with id ${id} not found` });
      }
      
      res.status(200).json(updatedIssue);
    } catch (error) {
      res.status(500).json({ message: 'Error updating issue status', error: error.message });
    }
  }

  addComment(req, res) {
    try {
      const issueId = req.params.id;
      const commentData = req.body;
      
      if (!commentData.name || !commentData.text) {
        return res.status(400).json({ 
          message: 'Missing required fields. Name and text are required for comments.' 
        });
      }
      
      const newComment = issueService.addComment(issueId, commentData);
      
      if (!newComment) {
        return res.status(404).json({ message: `Issue with id ${issueId} not found` });
      }
      
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
  }

  getStatistics(req, res) {
    try {
      const statistics = issueService.getStatistics();
      res.status(200).json(statistics);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving statistics', error: error.message });
    }
  }
}

module.exports = new IssueController();
