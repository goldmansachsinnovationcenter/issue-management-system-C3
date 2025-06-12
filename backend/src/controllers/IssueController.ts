import { Request, Response } from 'express';
import { database } from '../models/Database.js';
import { CreateIssueRequest, UpdateIssueRequest, AddCommentRequest } from '../types/Issue.js';

export class IssueController {
  static async getAllIssues(req: Request, res: Response) {
    try {
      const issues = database.getAllIssues();
      res.json(issues);
    } catch (error) {
      console.error('Error fetching issues:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getIssueById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const issue = database.getIssueById(id);
      
      if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      res.json(issue);
    } catch (error) {
      console.error('Error fetching issue:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createIssue(req: Request, res: Response) {
    try {
      const issueData: CreateIssueRequest = req.body;

      if (!issueData.title || !issueData.description || !issueData.assignee || !issueData.application) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newIssue = database.createIssue(issueData);
      res.status(201).json(newIssue);
    } catch (error) {
      console.error('Error creating issue:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateIssue(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates: UpdateIssueRequest = req.body;

      const updatedIssue = database.updateIssue(id, updates);
      
      if (!updatedIssue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      res.json(updatedIssue);
    } catch (error) {
      console.error('Error updating issue:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async addComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const commentData: AddCommentRequest = req.body;

      if (!commentData.content || !commentData.author) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const updatedIssue = database.addComment(id, commentData);
      
      if (!updatedIssue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      res.json(updatedIssue);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getStatistics(req: Request, res: Response) {
    try {
      const statistics = database.getStatistics();
      res.json(statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
