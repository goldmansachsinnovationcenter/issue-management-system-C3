import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Fab,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { issueApi } from '../services/api';
import { Issue, IssueStatus, IssuePriority } from '../types/Issue';

const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueApi.getIssues();
        setIssues(data);
        setFilteredIssues(data);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, priorityFilter]);

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return 'primary';
      case IssueStatus.IN_PROGRESS:
        return 'warning';
      case IssueStatus.RESOLVED:
        return 'success';
      case IssueStatus.CLOSED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case IssuePriority.LOW:
        return 'default';
      case IssuePriority.MEDIUM:
        return 'info';
      case IssuePriority.HIGH:
        return 'warning';
      case IssuePriority.CRITICAL:
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading issues...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Issues
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="end">
          <Grid item xs={12} md={4}>
            <Label htmlFor="search">Search Issues</Label>
            <Input
              id="search"
              placeholder="Search by title, description, or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Label htmlFor="status-filter">Filter by Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.values(IssueStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Grid>

          <Grid item xs={12} md={4}>
            <Label htmlFor="priority-filter">Filter by Priority</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {Object.values(IssuePriority).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Grid>
        </Grid>
      </Paper>

      {/* Issues Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Application</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIssues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    {issues.length === 0 ? 'No issues found. Create your first issue!' : 'No issues match your filters.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredIssues.map((issue) => (
                <TableRow
                  key={issue.id}
                  component={Link}
                  to={`/issues/${issue.id}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {issue.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {issue.description.length > 50
                        ? `${issue.description.substring(0, 50)}...`
                        : issue.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={issue.status}
                      color={getStatusColor(issue.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={issue.priority}
                      color={getPriorityColor(issue.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{issue.assignee}</TableCell>
                  <TableCell>{issue.application}</TableCell>
                  <TableCell>
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(issue.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default IssueList;
