import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Fab,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { issueApi } from '../services/api';
import { CreateIssueRequest, IssuePriority } from '../types/Issue';

interface FormData {
  title: string;
  description: string;
  priority: IssuePriority;
  assignee: string;
  application: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  priority?: string;
  assignee?: string;
  application?: string;
}

const CreateIssue: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: IssuePriority.MEDIUM,
    assignee: '',
    application: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.assignee.trim()) {
      errors.assignee = 'Assignee is required';
    }

    if (!formData.application.trim()) {
      errors.application = 'Application is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const issueRequest: CreateIssueRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        assignee: formData.assignee.trim(),
        application: formData.application.trim(),
      };

      const newIssue = await issueApi.createIssue(issueRequest);
      navigate(`/issues/${newIssue.id}`);
    } catch (error) {
      console.error('Failed to create issue:', error);
    } finally {
      setLoading(false);
    }
  };

  const commonApplications = [
    'Web Portal',
    'Mobile App',
    'API Gateway',
    'Database',
    'Authentication Service',
    'Payment System',
    'Reporting System',
    'Other',
  ];

  const commonAssignees = [
    'John Smith',
    'Sarah Johnson',
    'Mike Chen',
    'Emily Davis',
    'David Wilson',
    'Lisa Anderson',
    'Tom Brown',
    'Other',
  ];

  return (
    <Box>
      {/* Backdrop for loading states */}
      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Fab
          size="small"
          onClick={() => navigate('/issues')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </Fab>
        <Typography variant="h4" component="h1">
          Create New Issue
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Title */}
            <Box>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter issue title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`mt-1 ${formErrors.title ? 'border-red-500' : ''}`}
              />
              {formErrors.title && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {formErrors.title}
                </Typography>
              )}
            </Box>

            {/* Description */}
            <Box>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className={`mt-1 ${formErrors.description ? 'border-red-500' : ''}`}
              />
              {formErrors.description && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {formErrors.description}
                </Typography>
              )}
            </Box>

            {/* Priority */}
            <Box>
              <Label htmlFor="priority">Priority *</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleInputChange('priority', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IssuePriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Box>

            {/* Assignee */}
            <Box>
              <Label htmlFor="assignee">Assignee *</Label>
              <Select 
                value={formData.assignee} 
                onValueChange={(value) => handleInputChange('assignee', value)}
              >
                <SelectTrigger className={`mt-1 ${formErrors.assignee ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {commonAssignees.map((assignee) => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.assignee && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {formErrors.assignee}
                </Typography>
              )}
            </Box>

            {/* Application */}
            <Box>
              <Label htmlFor="application">Application *</Label>
              <Select 
                value={formData.application} 
                onValueChange={(value) => handleInputChange('application', value)}
              >
                <SelectTrigger className={`mt-1 ${formErrors.application ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {commonApplications.map((app) => (
                    <SelectItem key={app} value={app}>
                      {app}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.application && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {formErrors.application}
                </Typography>
              )}
            </Box>

            {/* Submit Button */}
            <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/issues')}
              >
                Cancel
              </Button>
              <Fab
                type="submit"
                color="primary"
                variant="extended"
                disabled={loading}
              >
                <Save sx={{ mr: 1 }} />
                Create Issue
              </Fab>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateIssue;
