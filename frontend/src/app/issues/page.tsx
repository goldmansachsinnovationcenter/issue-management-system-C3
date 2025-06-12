'use client';

import React, { useState, useEffect } from 'react';
import { Fab, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { Issue } from '@/types/Issue';

export default function IssueList() {
  const [issues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-purple-100 text-purple-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Issues</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Issues</h1>
        <Link href="/issues/create">
          <Fab color="primary" aria-label="create issue">
            <AddIcon />
          </Fab>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Issues
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Issues ({filteredIssues.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredIssues.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No issues found matching your criteria.</p>
              <Link href="/issues/create" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                Create your first issue
              </Link>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/issues/${issue.id}`} className="block">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                        {issue.title}
                      </h3>
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {issue.description}
                      </p>
                    </Link>
                    <div className="flex items-center space-x-4 mt-3">
                      <Chip
                        label={issue.status}
                        size="small"
                        className={getStatusColor(issue.status)}
                      />
                      <Chip
                        label={issue.priority}
                        size="small"
                        className={getPriorityColor(issue.priority)}
                      />
                      <span className="text-sm text-gray-500">
                        Assigned to: {issue.assignee}
                      </span>
                      <span className="text-sm text-gray-500">
                        App: {issue.application}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 ml-4">
                    <p>Created: {new Date(issue.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
