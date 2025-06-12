import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, TextField, MenuItem, Fab, Backdrop, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

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
  const [formErrors, setFormErrors] = useState({
    subject: false,
    impactedApplication: false,
    reporterName: false,
    initialObservations: false,
    notificationEmails: false,
    assignedTo: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: false
      });
    }
  };

  const validateForm = () => {
    const errors = {
      subject: !formData.subject.trim(),
      impactedApplication: !formData.impactedApplication.trim(),
      reporterName: !formData.reporterName.trim(),
      initialObservations: !formData.initialObservations.trim(),
      notificationEmails: !formData.notificationEmails.trim(),
      assignedTo: !formData.assignedTo.trim()
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setShowBackdrop(true);
    
    const formattedData = {
      ...formData,
      notificationEmails: formData.notificationEmails.split(',').map(email => email.trim())
    };
    
    fetch('http://localhost:5000/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create issue');
        }
        return response.json();
      })
      .then(data => {
        console.log('Issue created:', data);
        setSubmitting(false);
        setShowBackdrop(false);
        navigate('/issues');
      })
      .catch(error => {
        console.error('Error creating issue:', error);
        setSubmitting(false);
        setShowBackdrop(false);
      });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Issue
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <TextField
                required
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                error={formErrors.subject}
                helperText={formErrors.subject ? "Subject is required" : ""}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                <TextField
                  required
                  fullWidth
                  label="Impacted Application"
                  name="impactedApplication"
                  value={formData.impactedApplication}
                  onChange={handleChange}
                  error={formErrors.impactedApplication}
                  helperText={formErrors.impactedApplication ? "Application name is required" : ""}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                <TextField
                  required
                  fullWidth
                  label="Reporter Name"
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleChange}
                  error={formErrors.reporterName}
                  helperText={formErrors.reporterName ? "Reporter name is required" : ""}
                />
              </Box>
            </Box>
            
            <Box>
              <TextField
                required
                fullWidth
                label="Initial Observations"
                name="initialObservations"
                value={formData.initialObservations}
                onChange={handleChange}
                error={formErrors.initialObservations}
                helperText={formErrors.initialObservations ? "Initial observations are required" : ""}
                multiline
                rows={4}
              />
            </Box>
            
            <Box>
              <TextField
                required
                fullWidth
                label="Notification Emails (comma separated)"
                name="notificationEmails"
                value={formData.notificationEmails}
                onChange={handleChange}
                error={formErrors.notificationEmails}
                helperText={formErrors.notificationEmails ? "At least one email is required" : "Enter email addresses separated by commas"}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
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
              </Box>
              
              <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
                <TextField
                  required
                  fullWidth
                  label="Assigned To"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  error={formErrors.assignedTo}
                  helperText={formErrors.assignedTo ? "Assignee name is required" : ""}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
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
              </Box>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Fab
                type="submit"
                variant="extended"
                color="primary"
                size="large"
                disabled={submitting}
                aria-label="create issue"
              >
                <SaveIcon sx={{ mr: 1 }} />
                {submitting ? 'Creating...' : 'Create Issue'}
              </Fab>
            </Box>
          </Box>
        </form>
      </Paper>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default CreateIssue;
