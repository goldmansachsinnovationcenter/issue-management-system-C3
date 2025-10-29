const express = require('express');
const router = express.Router();
const issueController = require('../controllers/IssueController');
const { authenticate } = require('../middleware/auth');

router.get('/', issueController.getAllIssues);

router.get('/:id', issueController.getIssueById);

router.post('/', authenticate, issueController.createIssue);

router.patch('/:id/status', authenticate, issueController.updateIssueStatus);

router.post('/:id/comments', authenticate, issueController.addComment);

router.get('/statistics/all', issueController.getStatistics);

module.exports = router;
