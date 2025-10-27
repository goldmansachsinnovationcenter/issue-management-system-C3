import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Issue } from '../types/Issue';
import { API_BASE_URL } from '../config';
import { ErrorAlert } from '../components/ErrorAlert';

const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`${API_BASE_URL}/api/issues`)
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
        setError('Failed to load issues. Please try again later.');
        setLoading(false);
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
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/create"
        >
          Create New Issue
        </Button>
      </Box>
      
      <ErrorAlert error={error} onClose={() => setError(null)} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
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
        </Box>
      )}
    </Box>
  );
};

export default IssueList;
