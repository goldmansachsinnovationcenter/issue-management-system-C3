import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Card,
  CardContent,
  Fab,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Edit, Save, Add } from '@mui/icons-material';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { issueApi } from '../services/api';
import { Issue, IssueStatus, IssuePriority, AddCommentRequest } from '../types/Issue';

const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<IssueStatus>(IssueStatus.OPEN);

  useEffect(() => {
    const fetchIssue = async () => {
      if (!id) return;
      
      try {
        const data = await issueApi.getIssue(id);
        setIssue(data);
        setNewStatus(data.status);
      } catch (error) {
        console.error('Failed to fetch issue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const handleStatusChange = async () => {
    if (!issue || newStatus === issue.status) {
      setEditingStatus(false);
      return;
    }

    setUpdating(true);
    try {
      const updatedIssue = await issueApi.updateIssue(issue.id, { status: newStatus });
      setIssue(updatedIssue);
      setEditingStatus(false);
    } catch (error) {
      console.error('Failed to update issue status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue || !newComment.trim() || !commentAuthor.trim()) return;

    setUpdating(true);
    try {
      const commentRequest: AddCommentRequest = {
        content: newComment.trim(),
        author: commentAuthor.trim(),
      };
      const updatedIssue = await issueApi.addComment(issue.id, commentRequest);
      setIssue(updatedIssue);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return 'primary';
      case IssueStatus.IN_PROGRESS:
        return 'warning';
      case IssueStatus.RESOLVED:
        return 'success';
      case IssueStatus.CLOSED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case IssuePriority.LOW:
        return 'default';
      case IssuePriority.MEDIUM:
        return 'info';
      case IssuePriority.HIGH:
        return 'warning';
      case IssuePriority.CRITICAL:
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!issue) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Issue not found
        </Typography>
        <Button onClick={() => navigate('/issues')} className="mt-4">
          Back to Issues
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Backdrop for loading states */}
      <Backdrop open={updating} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Fab
          size="small"
          onClick={() => navigate('/issues')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </Fab>
        <Typography variant="h4" component="h1">
          Issue Details
        </Typography>
      </Box>

      {/* Issue Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {issue.title}
        </Typography>
        
        <Box display="flex" gap={2} mb={3}>
          <Chip
            label={issue.status}
            color={getStatusColor(issue.status)}
          />
          <Chip
            label={issue.priority}
            color={getPriorityColor(issue.priority)}
          />
        </Box>

        <Typography variant="body1" paragraph>
          {issue.description}
        </Typography>

        <Box display="flex" gap={4} mb={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Assignee
            </Typography>
            <Typography variant="body1">{issue.assignee}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Application
            </Typography>
            <Typography variant="body1">{issue.application}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body1">
              {new Date(issue.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Updated
            </Typography>
            <Typography variant="body1">
              {new Date(issue.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {/* Status Update Section */}
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h6" gutterBottom>
            Update Status
          </Typography>
          {editingStatus ? (
            <Box display="flex" gap={2} alignItems="end">
              <Box flex={1}>
                <Label htmlFor="status-select">New Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as IssueStatus)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(IssueStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Box>
              <Fab
                color="primary"
                size="small"
                onClick={handleStatusChange}
                disabled={updating}
              >
                <Save />
              </Fab>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingStatus(false);
                  setNewStatus(issue.status);
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button
              onClick={() => setEditingStatus(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Change Status
            </Button>
          )}
        </Box>
      </Paper>

      {/* Comments Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Comments ({issue.comments.length})
        </Typography>

        {/* Existing Comments */}
        {issue.comments.length === 0 ? (
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            No comments yet. Be the first to add a comment!
          </Typography>
        ) : (
          <Box sx={{ mb: 3 }}>
            {issue.comments.map((comment) => (
              <Card key={comment.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {comment.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {comment.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Add Comment Form */}
        <Divider sx={{ mb: 3 }} />
        <Typography variant="subtitle1" gutterBottom>
          Add Comment
        </Typography>
        <form onSubmit={handleCommentSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box>
              <Label htmlFor="comment-author">Your Name</Label>
              <Input
                id="comment-author"
                placeholder="Enter your name"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                required
                className="mt-1"
              />
            </Box>
            <Box>
              <Label htmlFor="comment-content">Comment</Label>
              <Textarea
                id="comment-content"
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows={4}
                className="mt-1"
              />
            </Box>
            <Box>
              <Fab
                type="submit"
                color="primary"
                variant="extended"
                disabled={!newComment.trim() || !commentAuthor.trim() || updating}
              >
                <Add sx={{ mr: 1 }} />
                Add Comment
              </Fab>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default IssueDetail;
