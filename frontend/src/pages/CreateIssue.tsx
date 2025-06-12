import React from 'react';
import { Container, Typography, TextField, MenuItem, Box } from '@mui/material';
import { EnhancedForm, validators } from '../components/EnhancedForm';
import { useToast } from '../components/ToastProvider';

const CreateIssue: React.FC = () => {
  const { success, error } = useToast();

  const validationRules = {
    title: [
      { validator: validators.required, message: 'Title is required' },
      { validator: validators.minLength(3), message: 'Title must be at least 3 characters' },
      { validator: validators.maxLength(100), message: 'Title must not exceed 100 characters' },
    ],
    description: [
      { validator: validators.required, message: 'Description is required' },
      { validator: validators.minLength(10), message: 'Description must be at least 10 characters' },
    ],
    priority: [
      { validator: validators.required, message: 'Priority is required' },
    ],
    assignee: [
      { validator: validators.email, message: 'Please enter a valid email address' },
    ],
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      success('Issue created successfully!');
    } catch (err) {
      error(`Failed to create issue: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Issue
      </Typography>
      
      <EnhancedForm
        onSubmit={handleSubmit}
        validationRules={validationRules}
        showFab={true}
      >
        <TextField
          name="title"
          label="Issue Title"
          fullWidth
          margin="normal"
          required
          helperText="Enter a descriptive title for the issue"
        />
        
        <TextField
          name="description"
          label="Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
          helperText="Provide detailed information about the issue"
        />
        
        <TextField
          name="priority"
          label="Priority"
          select
          fullWidth
          margin="normal"
          required
          helperText="Select the priority level"
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="critical">Critical</MenuItem>
        </TextField>
        
        <TextField
          name="assignee"
          label="Assignee Email"
          type="email"
          fullWidth
          margin="normal"
          helperText="Email address of the person to assign this issue to (optional)"
        />
        
        <TextField
          name="dueDate"
          label="Due Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          helperText="Optional due date for the issue"
        />
      </EnhancedForm>
    </Container>
  );
};

export default CreateIssue;
