import { Router } from 'express';
import { IssueController } from '../controllers/IssueController.js';

const router = Router();

router.get('/', IssueController.getAllIssues);

router.get('/:id', IssueController.getIssueById);

router.post('/', IssueController.createIssue);

router.patch('/:id', IssueController.updateIssue);

router.post('/:id/comments', IssueController.addComment);

export default router;
