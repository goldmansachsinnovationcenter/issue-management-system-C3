import { useEffect, useState } from 'react'
import { Typography, Box, CircularProgress, Grid } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Statistics } from '@/types/Issue'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics')
      if (response.ok) {
        const data = await response.json()
        setStatistics(data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusCounts = () => {
    if (!statistics) return { labels: [], data: [] }
    const labels = Object.keys(statistics.statusCounts)
    const data = Object.values(statistics.statusCounts)
    return { labels, data }
  }

  const getPriorityCounts = () => {
    if (!statistics) return { labels: [], data: [] }
    const labels = Object.keys(statistics.priorityCounts)
    const data = Object.values(statistics.priorityCounts)
    return { labels, data }
  }

  const getApplicationCounts = () => {
    if (!statistics) return { labels: [], data: [] }
    const labels = Object.keys(statistics.applicationCounts)
    const data = Object.values(statistics.applicationCounts)
    return { labels, data }
  }

  const getAssigneeCounts = () => {
    if (!statistics) return { labels: [], data: [] }
    const labels = Object.keys(statistics.assigneeCounts)
    const data = Object.values(statistics.assigneeCounts)
    return { labels, data }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  const statusData = {
    labels: getStatusCounts().labels,
    datasets: [
      {
        data: getStatusCounts().data,
        backgroundColor: [
          '#f44336', // Red for Open
          '#ff9800', // Orange for In Progress
          '#4caf50', // Green for Resolved
          '#9e9e9e', // Gray for Closed
        ],
        borderWidth: 2,
      },
    ],
  }

  const priorityData = {
    labels: getPriorityCounts().labels,
    datasets: [
      {
        data: getPriorityCounts().data,
        backgroundColor: [
          '#f44336', // Red for Critical
          '#ff9800', // Orange for High
          '#2196f3', // Blue for Medium
          '#4caf50', // Green for Low
        ],
        borderWidth: 2,
      },
    ],
  }

  const applicationData = {
    labels: getApplicationCounts().labels,
    datasets: [
      {
        label: 'Issues by Application',
        data: getApplicationCounts().data,
        backgroundColor: '#1976d2',
        borderColor: '#1565c0',
        borderWidth: 1,
      },
    ],
  }

  const assigneeData = {
    labels: getAssigneeCounts().labels,
    datasets: [
      {
        label: 'Issues by Assignee',
        data: getAssigneeCounts().data,
        backgroundColor: '#dc004e',
        borderColor: '#c51162',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
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
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
          Statistics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visual analytics and insights about your issues
        </Typography>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics?.totalIssues || 0}</div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{statistics?.openIssues || 0}</div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics?.resolvedIssues || 0}</div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {statistics?.totalIssues ? 
                  Math.round((statistics.resolvedIssues / statistics.totalIssues) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <CardTitle>Issues by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Doughnut data={statusData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <CardTitle>Issues by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Doughnut data={priorityData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <CardTitle>Issues by Application</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Bar data={applicationData} options={barChartOptions} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <CardTitle>Issues by Assignee</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Bar data={assigneeData} options={barChartOptions} />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
