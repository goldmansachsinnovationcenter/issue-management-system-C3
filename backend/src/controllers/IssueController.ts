import { Request, Response } from 'express'
import { IssueService } from '../services/IssueService'
import { CreateIssueRequest, UpdateIssueRequest, CreateCommentRequest } from '../models/Issue'

const issueService = IssueService.getInstance()

export class IssueController {
  static getAllIssues(req: Request, res: Response): void {
    try {
      const issues = issueService.getAllIssues()
      res.json(issues)
    } catch (error) {
      console.error('Error getting all issues:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static getIssueById(req: Request, res: Response): void {
    try {
      const { id } = req.params
      const issue = issueService.getIssueById(id as string)
      
      if (!issue) {
        res.status(404).json({ error: 'Issue not found' })
        return
      }

      res.json(issue)
    } catch (error) {
      console.error('Error getting issue by id:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static createIssue(req: Request, res: Response): void {
    try {
      const createRequest: CreateIssueRequest = req.body

      if (!createRequest.title || !createRequest.description || !createRequest.assignee || !createRequest.application) {
        res.status(400).json({ error: 'Missing required fields' })
        return
      }

      const newIssue = issueService.createIssue(createRequest)
      res.status(201).json(newIssue)
    } catch (error) {
      console.error('Error creating issue:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static updateIssue(req: Request, res: Response): void {
    try {
      const { id } = req.params
      const updateRequest: UpdateIssueRequest = req.body

      const updatedIssue = issueService.updateIssue(id as string, updateRequest)
      
      if (!updatedIssue) {
        res.status(404).json({ error: 'Issue not found' })
        return
      }

      res.json(updatedIssue)
    } catch (error) {
      console.error('Error updating issue:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static addComment(req: Request, res: Response): void {
    try {
      const { id } = req.params
      const commentRequest: CreateCommentRequest = req.body

      if (!commentRequest.content || !commentRequest.author) {
        res.status(400).json({ error: 'Missing required fields' })
        return
      }

      const updatedIssue = issueService.addComment(id as string, commentRequest)
      
      if (!updatedIssue) {
        res.status(404).json({ error: 'Issue not found' })
        return
      }

      res.json(updatedIssue)
    } catch (error) {
      console.error('Error adding comment:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static getStatistics(req: Request, res: Response): void {
    try {
      const statistics = issueService.getStatistics()
      res.json(statistics)
    } catch (error) {
      console.error('Error getting statistics:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
