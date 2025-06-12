import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid, Card, CardContent, Box, Fab } from '@mui/material';
import { Add, BugReport, Assignment, TrendingUp, People } from '@mui/icons-material';
import { issueApi } from '../services/api';
import { Issue, Statistics } from '../types/Issue';

const Dashboard: React.FC = () => {
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [issues, stats] = await Promise.all([
          issueApi.getIssues(),
          issueApi.getStatistics(),
        ]);
        
        const sortedIssues = issues.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentIssues(sortedIssues.slice(0, 5));
        setStatistics(stats);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome to the Issue Management System
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <BugReport color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Issues
                  </Typography>
                  <Typography variant="h4">
                    {statistics?.totalIssues || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Open Issues
                  </Typography>
                  <Typography variant="h4">
                    {statistics?.statusCounts?.Open || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h4">
                    {statistics?.statusCounts?.['In Progress'] || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Resolved
                  </Typography>
                  <Typography variant="h4">
                    {statistics?.statusCounts?.Resolved || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Issues */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Issues
          </Typography>
          {recentIssues.length === 0 ? (
            <Typography color="text.secondary">
              No issues found. Create your first issue to get started.
            </Typography>
          ) : (
            <Box>
              {recentIssues.map((issue) => (
                <Box
                  key={issue.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  component={Link}
                  to={`/issues/${issue.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    {issue.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {issue.status} • {issue.priority} • Assigned to {issue.assignee}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created {new Date(issue.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button for Create Issue */}
      <Fab
        color="primary"
        aria-label="create issue"
        component={Link}
        to="/create"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Dashboard;
