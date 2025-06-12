import { Router } from 'express'
import { IssueController } from '../controllers/IssueController'

const router = Router()

router.get('/issues', IssueController.getAllIssues)
router.get('/issues/:id', IssueController.getIssueById)
router.post('/issues', IssueController.createIssue)
router.patch('/issues/:id', IssueController.updateIssue)
router.post('/issues/:id/comments', IssueController.addComment)
router.get('/statistics', IssueController.getStatistics)

export default router
