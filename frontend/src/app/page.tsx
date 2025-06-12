'use client';

import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    { label: 'Total Issues', value: '0', color: 'bg-blue-500' },
    { label: 'Open Issues', value: '0', color: 'bg-green-500' },
    { label: 'In Progress', value: '0', color: 'bg-yellow-500' },
    { label: 'Resolved', value: '0', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/issues/create">
          <Fab color="primary" aria-label="create issue">
            <AddIcon />
          </Fab>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${stat.color} mr-3`}></div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Issues</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <p>No issues found. Create your first issue to get started!</p>
            <Link href="/issues/create" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Create Issue
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/issues"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">📋</span>
            <div>
              <h3 className="font-medium text-gray-900">View All Issues</h3>
              <p className="text-sm text-gray-600">Browse and manage all issues</p>
            </div>
          </Link>
          <Link
            href="/issues/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">➕</span>
            <div>
              <h3 className="font-medium text-gray-900">Create Issue</h3>
              <p className="text-sm text-gray-600">Report a new issue</p>
            </div>
          </Link>
          <Link
            href="/statistics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">📈</span>
            <div>
              <h3 className="font-medium text-gray-900">View Statistics</h3>
              <p className="text-sm text-gray-600">Analyze issue trends</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
