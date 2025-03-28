const express = require('express');
const router = express.Router();
const issueController = require('../controllers/IssueController');

router.get('/', issueController.getAllIssues);

router.get('/:id', issueController.getIssueById);

router.post('/', issueController.createIssue);

router.patch('/:id/status', issueController.updateIssueStatus);

router.post('/:id/comments', issueController.addComment);

router.get('/statistics/all', issueController.getStatistics);

module.exports = router;
