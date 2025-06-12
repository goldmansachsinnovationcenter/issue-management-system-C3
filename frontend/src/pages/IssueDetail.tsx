import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Chip, Divider, TextField, Fab, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, Backdrop, CircularProgress } from '@mui/material';
import { Issue, Comment } from '../types/Issue';
import SendIcon from '@mui/icons-material/Send';
import UpdateIcon from '@mui/icons-material/Update';

const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>('');
  const [commenterName, setCommenterName] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [commentSubmitting, setCommentSubmitting] = useState<boolean>(false);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    
    fetch(`http://localhost:5000/api/issues/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch issue');
        }
        return response.json();
      })
      .then(data => {
        setIssue(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching issue:', error);
        setLoading(false);
        setIssue({
          id: id || '1',
          subject: 'Login page not working',
          impactedApplication: 'User Portal',
          reporterName: 'John Doe',
          reportedTime: new Date().toISOString(),
          initialObservations: 'Users cannot log in to the portal. The login button is not responding when clicked.',
          notificationEmails: ['admin@example.com', 'support@example.com'],
          priority: 'High',
          assignedTo: 'Jane Smith',
          status: 'new',
          comments: [
            {
              id: '1',
              name: 'Jane Smith',
              text: 'I am looking into this issue. Will update soon.',
              timestamp: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        });
      });
  }, [id]);

  const handleCommentSubmit = () => {
    if (!newComment.trim() || !commenterName.trim() || !issue) return;
    
    setCommentSubmitting(true);
    
    const comment: Comment = {
      id: Date.now().toString(),
      name: commenterName,
      text: newComment,
      timestamp: new Date().toISOString()
    };
    
    fetch(`http://localhost:5000/api/issues/${issue.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: commenterName,
        text: newComment
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add comment');
        }
        return response.json();
      })
      .then(data => {
        setIssue({
          ...issue,
          comments: [...issue.comments, data]
        });
        
        setNewComment('');
        setCommentSubmitting(false);
      })
      .catch(error => {
        console.error('Error adding comment:', error);
        setIssue({
          ...issue,
          comments: [...issue.comments, comment]
        });
        setNewComment('');
        setCommentSubmitting(false);
      });
  };

  const handleStatusChange = (newStatusValue: 'new' | 'assigned' | 'closed' | 'rejected') => {
    if (!issue) return;
    
    setStatusUpdating(true);
    
    fetch(`http://localhost:5000/api/issues/${issue.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatusValue
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update status');
        }
        return response.json();
      })
      .then(data => {
        setIssue({
          ...issue,
          status: data.status
        });
        setNewStatus('');
        setStatusUpdating(false);
      })
      .catch(error => {
        console.error('Error updating status:', error);
        setIssue({
          ...issue,
          status: newStatusValue
        });
        setStatusUpdating(false);
      });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'assigned':
        return 'warning';
      case 'closed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading issue details...</Typography>;
  }

  if (!issue) {
    return <Typography>Issue not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Issue Details
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h5">{issue.subject}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ minWidth: '200px', flex: '1 1 45%' }}>
              <Typography variant="subtitle2">ID</Typography>
              <Typography variant="body1">{issue.id}</Typography>
            </Box>
            
            <Box sx={{ minWidth: '200px', flex: '1 1 45%' }}>
              <Typography variant="subtitle2">Status</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={issue.status} 
                  color={getStatusColor(issue.status) as any} 
                />
                <FormControl sx={{ minWidth: 120, mt: 1 }}>
                  <InputLabel id="status-select-label">Update Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    value={newStatus}
                    label="Update Status"
                    onChange={(e) => setNewStatus(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="assigned">Assigned</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
                <Fab 
                  variant="extended"
                  size="small"
                  color="secondary"
                  disabled={!newStatus || statusUpdating}
                  onClick={() => newStatus && handleStatusChange(newStatus as 'new' | 'assigned' | 'closed' | 'rejected')}
                  aria-label="update status"
                >
                  <UpdateIcon sx={{ mr: 1 }} />
                  {statusUpdating ? 'Updating...' : 'Update'}
                </Fab>
              </Box>
            </Box>
            
            <Box sx={{ minWidth: '200px', flex: '1 1 45%' }}>
              <Typography variant="subtitle2">Impacted Application</Typography>
              <Typography variant="body1">{issue.impactedApplication}</Typography>
            </Box>
            
            <Box sx={{ minWidth: '200px', flex: '1 1 45%' }}>
              <Typography variant="subtitle2">Priority</Typography>
              <Typography variant="body1">{issue.priority}</Typography>
            </Box>
            
            <Box sx={{ minWidth: '200px', flex: '1 1 45%' }}>
              <Typography variant="subtitle2">Reporter</Typography>
              <Typography variant="body1">{issue.reporterName}</Typography>
            </Box>
            
            <Box sx={{ minWidth: '200px', flex: '1 1 45%' }}>
              <Typography variant="subtitle2">Reported Time</Typography>
              <Typography variant="body1">
                {new Date(issue.reportedTime).toLocaleString()}
              </Typography>
            </Box>
            
            <Box sx={{ minWidth: '200px', flex: '1 1 45%' }}>
              <Typography variant="subtitle2">Assigned To</Typography>
              <Typography variant="body1">{issue.assignedTo}</Typography>
            </Box>
            
            <Box sx={{ minWidth: '200px', flex: '1 1 45%' }}>
              <Typography variant="subtitle2">Notification Emails</Typography>
              <Typography variant="body1">
                {issue.notificationEmails.join(', ')}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle2">Initial Observations</Typography>
            <Typography variant="body1" paragraph>
              {issue.initialObservations}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <List>
          {issue.comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No comments yet
            </Typography>
          ) : (
            issue.comments.map((comment: Comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">
                          {comment.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={comment.text}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add Comment
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                label="Your Name"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                margin="normal"
                required
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Comment"
                multiline
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                margin="normal"
                required
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Fab 
                variant="extended"
                color="primary"
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || !commenterName.trim() || commentSubmitting}
                aria-label="submit comment"
              >
                <SendIcon sx={{ mr: 1 }} />
                {commentSubmitting ? 'Submitting...' : 'Submit Comment'}
              </Fab>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={commentSubmitting || statusUpdating}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default IssueDetail;
