'use client';

import React, { useState } from 'react';
import { Fab, Backdrop, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter } from 'next/navigation';
import { Issue } from '@/types/Issue';

export default function CreateIssue() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open' as Issue['status'],
    priority: 'Medium' as Issue['priority'],
    assignee: '',
    reporter: '',
    application: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.assignee.trim()) {
      newErrors.assignee = 'Assignee is required';
    }
    if (!formData.reporter.trim()) {
      newErrors.reporter = 'Reporter is required';
    }
    if (!formData.application.trim()) {
      newErrors.application = 'Application is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push('/issues');
    } catch (error) {
      console.error('Error creating issue:', error);
      setErrors({ submit: 'Failed to create issue. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Issue</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter issue title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the issue in detail"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Assignee and Reporter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
                Assignee *
              </label>
              <input
                type="text"
                id="assignee"
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.assignee ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter assignee name"
              />
              {errors.assignee && <p className="text-red-500 text-sm mt-1">{errors.assignee}</p>}
            </div>
            <div>
              <label htmlFor="reporter" className="block text-sm font-medium text-gray-700 mb-2">
                Reporter *
              </label>
              <input
                type="text"
                id="reporter"
                value={formData.reporter}
                onChange={(e) => handleInputChange('reporter', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.reporter ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter reporter name"
              />
              {errors.reporter && <p className="text-red-500 text-sm mt-1">{errors.reporter}</p>}
            </div>
          </div>

          {/* Application */}
          <div>
            <label htmlFor="application" className="block text-sm font-medium text-gray-700 mb-2">
              Application *
            </label>
            <input
              type="text"
              id="application"
              value={formData.application}
              onChange={(e) => handleInputChange('application', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.application ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter application name"
            />
            {errors.application && <p className="text-red-500 text-sm mt-1">{errors.application}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Fab
              type="submit"
              color="primary"
              variant="extended"
              disabled={loading}
              aria-label="save issue"
            >
              <SaveIcon className="mr-2" />
              {loading ? 'Creating...' : 'Create Issue'}
            </Fab>
          </div>
        </form>
      </div>

      {/* Loading Backdrop */}
      <Backdrop open={loading} style={{ zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
