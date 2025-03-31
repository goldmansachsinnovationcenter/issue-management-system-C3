import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Statistics as StatisticsType } from '../types/Statistics';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch('http://localhost:5000/api/issues/statistics/all')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        return response.json();
      })
      .then(data => {
        setStatistics(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
        setError('Failed to load statistics. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Loading statistics...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!statistics) {
    return <Typography>No statistics available.</Typography>;
  }

  const statusData = {
    labels: Object.keys(statistics.statusCounts),
    datasets: [
      {
        data: Object.values(statistics.statusCounts),
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
    labels: Object.keys(statistics.priorityCounts),
    datasets: [
      {
        data: Object.values(statistics.priorityCounts),
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
    labels: Object.keys(statistics.applicationCounts),
    datasets: [
      {
        label: 'Issues by Application',
        data: Object.values(statistics.applicationCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const assigneeData = {
    labels: Object.keys(statistics.assigneeCounts),
    datasets: [
      {
        label: 'Issues by Assignee',
        data: Object.values(statistics.assigneeCounts),
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
        Total Issues: {statistics.totalIssues}
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
