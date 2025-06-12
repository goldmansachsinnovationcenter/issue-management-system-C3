import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Fab, Backdrop, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Issue } from '../types/Issue';
import AddIcon from '@mui/icons-material/Add';

const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    
    fetch('http://localhost:5000/api/issues')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch issues');
        }
        return response.json();
      })
      .then(data => {
        setIssues(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching issues:', error);
        setLoading(false);
        setIssues([
          {
            id: '1',
            subject: 'Login page not working',
            impactedApplication: 'User Portal',
            reporterName: 'John Doe',
            reportedTime: new Date().toISOString(),
            initialObservations: 'Users cannot log in to the portal',
            notificationEmails: ['admin@example.com'],
            priority: 'High',
            assignedTo: 'Jane Smith',
            status: 'new',
            comments: []
          },
          {
            id: '2',
            subject: 'Data not syncing',
            impactedApplication: 'Mobile App',
            reporterName: 'Alice Johnson',
            reportedTime: new Date().toISOString(),
            initialObservations: 'Data not syncing between devices',
            notificationEmails: ['tech@example.com'],
            priority: 'Medium',
            assignedTo: 'Bob Brown',
            status: 'assigned',
            comments: []
          }
        ]);
      });
  }, []);

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Issues</Typography>
        <Fab 
          variant="extended"
          color="primary" 
          component={Link} 
          to="/create"
          aria-label="create new issue"
        >
          <AddIcon sx={{ mr: 1 }} />
          Create New Issue
        </Fab>
      </Box>
      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Application</TableCell>
                <TableCell>Reporter</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>{issue.id}</TableCell>
                  <TableCell>{issue.subject}</TableCell>
                  <TableCell>{issue.impactedApplication}</TableCell>
                  <TableCell>{issue.reporterName}</TableCell>
                  <TableCell>{issue.priority}</TableCell>
                  <TableCell>{issue.assignedTo}</TableCell>
                  <TableCell>
                    <Chip 
                      label={issue.status} 
                      color={getStatusColor(issue.status) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      component={Link} 
                      to={`/issues/${issue.id}`}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default IssueList;
