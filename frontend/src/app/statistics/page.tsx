'use client';

import React, { useState, useEffect } from 'react';
import { IssueStatistics } from '@/types/Issue';

export default function Statistics() {
  const [statistics, setStatistics] = useState<IssueStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  const getStatusCounts = () => {
    return statistics?.statusCounts || {};
  };

  const getPriorityCounts = () => {
    return statistics?.priorityCounts || {};
  };

  const getApplicationCounts = () => {
    return statistics?.applicationCounts || {};
  };

  const getAssigneeCounts = () => {
    return statistics?.assigneeCounts || {};
  };

  useEffect(() => {
    setTimeout(() => {
      const mockStatistics: IssueStatistics = {
        statusCounts: {
          'Open': 5,
          'In Progress': 3,
          'Resolved': 8,
          'Closed': 12,
        },
        priorityCounts: {
          'Low': 10,
          'Medium': 12,
          'High': 5,
          'Critical': 1,
        },
        applicationCounts: {
          'Web App': 15,
          'Mobile App': 8,
          'API Service': 5,
        },
        assigneeCounts: {
          'John Doe': 8,
          'Jane Smith': 6,
          'Bob Johnson': 4,
          'Alice Brown': 10,
        },
      };
      
      setStatistics(mockStatistics);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const priorityCounts = getPriorityCounts();
  const applicationCounts = getApplicationCounts();
  const assigneeCounts = getAssigneeCounts();

  const totalIssues = Object.values(statusCounts).reduce((sum: number, count: number) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{totalIssues}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts['Open'] || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts['In Progress'] || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts['Resolved'] || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Issues by Status</h2>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = totalIssues > 0 ? ((count as number) / totalIssues) * 100 : 0;
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'Open': return 'bg-green-500';
                  case 'In Progress': return 'bg-yellow-500';
                  case 'Resolved': return 'bg-purple-500';
                  case 'Closed': return 'bg-gray-500';
                  default: return 'bg-gray-500';
                }
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStatusColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count as number}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Issues by Priority</h2>
          <div className="space-y-3">
            {Object.entries(priorityCounts).map(([priority, count]) => {
              const percentage = totalIssues > 0 ? ((count as number) / totalIssues) * 100 : 0;
              const getPriorityColor = (priority: string) => {
                switch (priority) {
                  case 'Critical': return 'bg-red-500';
                  case 'High': return 'bg-orange-500';
                  case 'Medium': return 'bg-blue-500';
                  case 'Low': return 'bg-gray-500';
                  default: return 'bg-gray-500';
                }
              };
              
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{priority}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count as number}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Application Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Issues by Application</h2>
          <div className="space-y-3">
            {Object.entries(applicationCounts).map(([application, count], index) => {
              const percentage = totalIssues > 0 ? ((count as number) / totalIssues) * 100 : 0;
              const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-amber-500'];
              const color = colors[index % colors.length];
              
              return (
                <div key={application} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{application}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count as number}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignee Workload */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Issues by Assignee</h2>
          <div className="space-y-3">
            {Object.entries(assigneeCounts).map(([assignee, count], index) => {
              const percentage = totalIssues > 0 ? ((count as number) / totalIssues) * 100 : 0;
              const colors = ['bg-cyan-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500'];
              const color = colors[index % colors.length];
              
              return (
                <div key={assignee} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{assignee}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count as number}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalIssues}</p>
              <p className="text-sm text-gray-600">Total Issues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{statusCounts['Open'] || 0}</p>
              <p className="text-sm text-gray-600">Open Issues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{priorityCounts['Critical'] || 0}</p>
              <p className="text-sm text-gray-600">Critical Issues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{statusCounts['Resolved'] || 0}</p>
              <p className="text-sm text-gray-600">Resolved Issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
