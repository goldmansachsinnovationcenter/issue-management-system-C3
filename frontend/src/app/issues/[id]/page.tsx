'use client';

import React, { useState, useEffect } from 'react';
import { Fab, Chip, Backdrop, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useParams, useRouter } from 'next/navigation';
import { Issue, Comment } from '@/types/Issue';

export default function IssueDetail() {
  const params = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editData, setEditData] = useState<Partial<Issue>>({});

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



  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !issue) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const comment: Comment = {
        id: Date.now().toString(),
        issueId: issue.id,
        author: 'Current User',
        content: newComment,
        createdAt: new Date(),
      };
      
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!issue) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIssue({ ...issue, ...editData, updatedAt: new Date() });
      setIsEditing(false);
      setEditData({});
    } catch (error) {
      console.error('Error updating issue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const mockIssue: Issue = {
        id: params.id as string,
        title: 'Sample Issue Title',
        description: 'This is a sample issue description that demonstrates the issue detail view functionality.',
        status: 'Open',
        priority: 'Medium',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        application: 'Sample App',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16'),
      };
      
      const mockComments: Comment[] = [
        {
          id: '1',
          issueId: params.id as string,
          author: 'Jane Smith',
          content: 'I encountered this issue while testing the application.',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          issueId: params.id as string,
          author: 'John Doe',
          content: 'I will investigate this issue and provide an update soon.',
          createdAt: new Date('2024-01-16'),
        },
      ];
      
      setIssue(mockIssue);
      setComments(mockComments);
      setEditData(mockIssue);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading && !issue) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Issue Not Found</h1>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editData.title || ''}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              issue.title
            )}
          </h1>
          <p className="text-gray-600">Issue #{issue.id}</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <Fab
              color="primary"
              aria-label="save changes"
              onClick={handleSaveEdit}
              disabled={loading}
            >
              <SaveIcon />
            </Fab>
          ) : (
            <Fab
              color="primary"
              aria-label="edit issue"
              onClick={() => setIsEditing(true)}
            >
              <EditIcon />
            </Fab>
          )}
        </div>
      </div>

      {/* Issue Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            {isEditing ? (
              <textarea
                rows={6}
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              {isEditing ? (
                <select
                  value={editData.status || issue.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as Issue['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              ) : (
                <Chip
                  label={issue.status}
                  className={getStatusColor(issue.status)}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              {isEditing ? (
                <select
                  value={editData.priority || issue.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value as Issue['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              ) : (
                <Chip
                  label={issue.priority}
                  className={getPriorityColor(issue.priority)}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.assignee || ''}
                  onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{issue.assignee}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reporter</label>
              <p className="text-gray-900">{issue.reporter}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.application || ''}
                  onChange={(e) => setEditData({ ...editData, application: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{issue.application}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
              <p className="text-gray-900">{new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Updated</label>
              <p className="text-gray-900">{new Date(issue.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Comments ({comments.length})</h2>
        </div>
        <div className="p-6">
          {/* Existing Comments */}
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">{comment.author}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Add Comment
              </label>
              <textarea
                id="comment"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your comment..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Comment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading Backdrop */}
      <Backdrop open={loading} style={{ zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
