import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Typography,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Fab,
  Backdrop
} from '@mui/material'
import { ArrowBack, Comment as CommentIcon } from '@mui/icons-material'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Issue, Comment } from '@/types/Issue'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'error'
    case 'In Progress':
      return 'warning'
    case 'Resolved':
      return 'success'
    case 'Closed':
      return 'default'
    default:
      return 'default'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'error'
    case 'High':
      return 'warning'
    case 'Medium':
      return 'info'
    case 'Low':
      return 'success'
    default:
      return 'default'
  }
}

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showCommentDialog, setShowCommentDialog] = useState(false)

  useEffect(() => {
    if (id) {
      fetchIssue(id)
    }
  }, [id])

  const fetchIssue = async (issueId: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`)
      if (response.ok) {
        const data = await response.json()
        setIssue(data)
      }
    } catch (error) {
      console.error('Error fetching issue:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!issue) return

    setUpdatingStatus(true)
    try {
      const response = await fetch(`/api/issues/${issue.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedIssue = await response.json()
        setIssue(updatedIssue)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (!issue || !newComment.trim()) return

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/issues/${issue.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          author: 'Current User',
        }),
      })

      if (response.ok) {
        const updatedIssue = await response.json()
        setIssue(updatedIssue)
        setNewComment('')
        setShowCommentDialog(false)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (!issue) {
    return (
      <div className="text-center py-8">
        <Typography variant="h6" color="text.secondary">
          Issue not found
        </Typography>
        <Button onClick={() => navigate('/issues')} className="mt-4">
          Back to Issues
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/issues')}
        >
          <ArrowBack className="mr-2 h-4 w-4" />
          Back to Issues
        </Button>
        <Typography variant="h4" component="h1">
          Issue #{issue.id.slice(0, 8)}
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{issue.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body1" className="whitespace-pre-wrap">
                {issue.description}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments ({issue.comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {issue.comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Be the first to add a comment.
                </Typography>
              ) : (
                <div className="space-y-4">
                  {issue.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <Typography variant="subtitle2" fontWeight="bold">
                          {comment.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </div>
                      <Typography variant="body2" className="whitespace-pre-wrap">
                        {comment.content}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={issue.status}
                  onValueChange={handleStatusChange}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <div className="mt-1">
                  <Chip
                    label={issue.priority}
                    color={getPriorityColor(issue.priority) as any}
                    size="small"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Assignee</Label>
                <Typography variant="body2" className="mt-1">
                  {issue.assignee}
                </Typography>
              </div>

              <div>
                <Label className="text-sm font-medium">Reporter</Label>
                <Typography variant="body2" className="mt-1">
                  {issue.reporter}
                </Typography>
              </div>

              <div>
                <Label className="text-sm font-medium">Application</Label>
                <Typography variant="body2" className="mt-1">
                  {issue.application}
                </Typography>
              </div>

              <Divider />

              <div>
                <Label className="text-sm font-medium">Created</Label>
                <Typography variant="body2" className="mt-1">
                  {new Date(issue.createdAt).toLocaleString()}
                </Typography>
              </div>

              <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <Typography variant="body2" className="mt-1">
                  {new Date(issue.updatedAt).toLocaleString()}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Fab
        color="primary"
        aria-label="add comment"
        onClick={() => setShowCommentDialog(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <CommentIcon />
      </Fab>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showCommentDialog}
        onClick={() => setShowCommentDialog(false)}
      >
        <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>Add Comment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Enter your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCommentDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || submittingComment}
              >
                {submittingComment ? 'Adding...' : 'Add Comment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Backdrop>
    </div>
  )
}
