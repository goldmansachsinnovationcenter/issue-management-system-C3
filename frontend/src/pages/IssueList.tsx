import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Typography, 
  Box, 
  Chip, 
  CircularProgress,
  Fab
} from '@mui/material'
import { Add } from '@mui/icons-material'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Issue } from '@/types/Issue'

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

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues')
      if (response.ok) {
        const data = await response.json()
        setIssues(data)
      }
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateIssue = () => {
    navigate('/create')
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            Issues
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all issues in the system
          </Typography>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Issues ({issues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <Typography variant="body1" color="text.secondary">
                No issues found. Create your first issue to get started.
              </Typography>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <Link 
                        to={`/issues/${issue.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        #{issue.id.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/issues/${issue.id}`}
                        className="text-gray-900 hover:text-blue-600"
                      >
                        {issue.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={issue.status}
                        color={getStatusColor(issue.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={issue.priority}
                        color={getPriorityColor(issue.priority) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{issue.assignee}</TableCell>
                    <TableCell>{issue.application}</TableCell>
                    <TableCell>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Fab
        color="primary"
        aria-label="create issue"
        onClick={handleCreateIssue}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>
    </div>
  )
}
