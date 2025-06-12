import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { issueApi } from '../services/api';
import { Statistics as StatisticsType, IssueStatus, IssuePriority } from '../types/Issue';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await issueApi.getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const getStatusCounts = () => {
    if (!statistics) return { labels: [], data: [] };
    
    const labels = Object.keys(statistics.statusCounts);
    const data = Object.values(statistics.statusCounts);
    
    return { labels, data };
  };

  const getPriorityCounts = () => {
    if (!statistics) return { labels: [], data: [] };
    
    const labels = Object.keys(statistics.priorityCounts);
    const data = Object.values(statistics.priorityCounts);
    
    return { labels, data };
  };

  const getApplicationCounts = () => {
    if (!statistics) return { labels: [], data: [] };
    
    const labels = Object.keys(statistics.applicationCounts);
    const data = Object.values(statistics.applicationCounts);
    
    return { labels, data };
  };

  const getAssigneeCounts = () => {
    if (!statistics) return { labels: [], data: [] };
    
    const labels = Object.keys(statistics.assigneeCounts);
    const data = Object.values(statistics.assigneeCounts);
    
    return { labels, data };
  };

  const statusData = {
    labels: getStatusCounts().labels,
    datasets: [
      {
        label: 'Issues by Status',
        data: getStatusCounts().data,
        backgroundColor: [
          '#3b82f6', // Blue for Open
          '#f59e0b', // Yellow for In Progress
          '#10b981', // Green for Resolved
          '#6b7280', // Gray for Closed
        ],
        borderColor: [
          '#2563eb',
          '#d97706',
          '#059669',
          '#4b5563',
        ],
        borderWidth: 1,
      },
    ],
  };

  const priorityData = {
    labels: getPriorityCounts().labels,
    datasets: [
      {
        label: 'Issues by Priority',
        data: getPriorityCounts().data,
        backgroundColor: [
          '#6b7280', // Gray for Low
          '#3b82f6', // Blue for Medium
          '#f59e0b', // Orange for High
          '#ef4444', // Red for Critical
        ],
        borderColor: [
          '#4b5563',
          '#2563eb',
          '#d97706',
          '#dc2626',
        ],
        borderWidth: 1,
      },
    ],
  };

  const applicationData = {
    labels: getApplicationCounts().labels,
    datasets: [
      {
        label: 'Issues by Application',
        data: getApplicationCounts().data,
        backgroundColor: [
          '#8b5cf6',
          '#06b6d4',
          '#84cc16',
          '#f97316',
          '#ec4899',
          '#14b8a6',
          '#f59e0b',
          '#6366f1',
        ],
        borderWidth: 1,
      },
    ],
  };

  const assigneeData = {
    labels: getAssigneeCounts().labels,
    datasets: [
      {
        label: 'Issues by Assignee',
        data: getAssigneeCounts().data,
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading statistics...</Typography>
      </Box>
    );
  }

  if (!statistics) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Failed to load statistics
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Statistics & Analytics
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Overview of issue management metrics and trends
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Issues
              </Typography>
              <Typography variant="h4" color="primary">
                {statistics.totalIssues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Open Issues
              </Typography>
              <Typography variant="h4" color="warning.main">
                {statistics.statusCounts[IssueStatus.OPEN] || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4" color="info.main">
                {statistics.statusCounts[IssueStatus.IN_PROGRESS] || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Resolved
              </Typography>
              <Typography variant="h4" color="success.main">
                {statistics.statusCounts[IssueStatus.RESOLVED] || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Issues by Status
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut data={statusData} options={doughnutOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Issues by Priority
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut data={priorityData} options={doughnutOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Application Distribution */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Issues by Application
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={applicationData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Assignee Workload */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Issues by Assignee
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={assigneeData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;
