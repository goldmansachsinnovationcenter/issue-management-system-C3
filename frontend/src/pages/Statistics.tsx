import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Issue } from '../types/Issue';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Statistics: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
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
        },
        {
          id: '3',
          subject: 'Report generation fails',
          impactedApplication: 'Analytics Dashboard',
          reporterName: 'Mike Wilson',
          reportedTime: new Date().toISOString(),
          initialObservations: 'Cannot generate monthly reports',
          notificationEmails: ['reports@example.com'],
          priority: 'Medium',
          assignedTo: 'Sarah Lee',
          status: 'closed',
          comments: []
        },
        {
          id: '4',
          subject: 'UI glitch in profile page',
          impactedApplication: 'User Portal',
          reporterName: 'Emma Davis',
          reportedTime: new Date().toISOString(),
          initialObservations: 'Profile picture not displaying correctly',
          notificationEmails: ['ui@example.com'],
          priority: 'Low',
          assignedTo: 'Tom Jackson',
          status: 'rejected',
          comments: []
        },
        {
          id: '5',
          subject: 'Payment processing error',
          impactedApplication: 'E-commerce Platform',
          reporterName: 'Chris Martin',
          reportedTime: new Date().toISOString(),
          initialObservations: 'Customers unable to complete payment',
          notificationEmails: ['payments@example.com'],
          priority: 'Critical',
          assignedTo: 'Jane Smith',
          status: 'assigned',
          comments: []
        }
      ]);
      setLoading(false);
    }, 1000);
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
    return <Typography>Loading statistics...</Typography>;
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
