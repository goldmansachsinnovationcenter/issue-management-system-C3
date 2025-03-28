import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, TextField, MenuItem, Button, Chip, InputLabel } from '@mui/material';

const CreateIssue: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    impactedApplication: '',
    reporterName: '',
    initialObservations: '',
    notificationEmails: '',
    priority: 'Medium',
    assignedTo: '',
    status: 'new'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      console.log('Issue created:', formData);
      setSubmitting(false);
      navigate('/issues');
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Issue
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Impacted Application"
                name="impactedApplication"
                value={formData.impactedApplication}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Reporter Name"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Initial Observations"
                name="initialObservations"
                value={formData.initialObservations}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Notification Emails (comma separated)"
                name="notificationEmails"
                value={formData.notificationEmails}
                onChange={handleChange}
                helperText="Enter email addresses separated by commas"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                select
                required
                fullWidth
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Assigned To"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                select
                required
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Issue'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateIssue;
