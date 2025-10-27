import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Issue } from '../types/Issue';
import { API_BASE_URL } from '../config';
import { ErrorAlert } from '../components/ErrorAlert';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Statistics: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`${API_BASE_URL}/api/issues/statistics/all`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        return response.json();
      })
      .then(data => {
        return fetch(`${API_BASE_URL}/api/issues`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch issues');
            }
            return response.json();
          })
          .then(issues => {
            setIssues(issues);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
        setError('Failed to load statistics. Please try again later.');
        setLoading(false);
      });
  }, []);

  const getStatusCounts = () => {
    const statusCounts = {
      new: 0,
      assigned: 0,
      closed: 0,
      rejected: 0
    };
    
    issues.forEach(issue => {
      statusCounts[issue.status as keyof typeof statusCounts]++;
    });
    
    return statusCounts;
  };

  const getPriorityCounts = () => {
    const priorityCounts = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };
    
    issues.forEach(issue => {
      priorityCounts[issue.priority as keyof typeof priorityCounts]++;
    });
    
    return priorityCounts;
  };

  const getApplicationCounts = () => {
    const appCounts: Record<string, number> = {};
    
    issues.forEach(issue => {
      if (appCounts[issue.impactedApplication]) {
        appCounts[issue.impactedApplication]++;
      } else {
        appCounts[issue.impactedApplication] = 1;
      }
    });
    
    return appCounts;
  };

  const getAssigneeCounts = () => {
    const assigneeCounts: Record<string, number> = {};
    
    issues.forEach(issue => {
      if (assigneeCounts[issue.assignedTo]) {
        assigneeCounts[issue.assignedTo]++;
      } else {
        assigneeCounts[issue.assignedTo] = 1;
      }
    });
    
    return assigneeCounts;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  const statusCounts = getStatusCounts();
  const priorityCounts = getPriorityCounts();
  const applicationCounts = getApplicationCounts();
  const assigneeCounts = getAssigneeCounts();

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const priorityData = {
    labels: Object.keys(priorityCounts),
    datasets: [
      {
        data: Object.values(priorityCounts),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const applicationData = {
    labels: Object.keys(applicationCounts),
    datasets: [
      {
        label: 'Issues by Application',
        data: Object.values(applicationCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const assigneeData = {
    labels: Object.keys(assigneeCounts),
    datasets: [
      {
        label: 'Issues by Assignee',
        data: Object.values(assigneeCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Issue Statistics
      </Typography>
      
      <ErrorAlert error={error} onClose={() => setError(null)} />
      
      <Typography variant="h6" gutterBottom>
        Total Issues: {issues.length}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              Issues by Status
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Pie data={statusData} />
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              Issues by Priority
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Pie data={priorityData} />
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
              Issues by Application
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={applicationData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
              Issues by Assignee
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={assigneeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Statistics;
