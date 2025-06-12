import { Router } from 'express';
import { IssueController } from '../controllers/IssueController.js';

const router = Router();

router.get('/', IssueController.getStatistics);

export default router;
