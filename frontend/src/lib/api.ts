import type { Issue, Comment, IssueStatistics } from '../types/Issue';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getAllIssues() {
  return apiRequest<Issue[]>('/issues');
}

export async function getIssueById(id: string) {
  return apiRequest<Issue>(`/issues/${id}`);
}

export async function createIssue(issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) {
  return apiRequest<Issue>('/issues', {
    method: 'POST',
    body: JSON.stringify(issue),
  });
}

export async function updateIssue(id: string, updates: Partial<Issue>) {
  return apiRequest<Issue>(`/issues/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteIssue(id: string) {
  return apiRequest<void>(`/issues/${id}`, {
    method: 'DELETE',
  });
}

export async function getIssueComments(issueId: string) {
  return apiRequest<Comment[]>(`/issues/${issueId}/comments`);
}

export async function addComment(issueId: string, comment: Omit<Comment, 'id' | 'issueId' | 'createdAt'>) {
  return apiRequest<Comment>(`/issues/${issueId}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
  });
}

export async function getStatistics() {
  return apiRequest<IssueStatistics>('/statistics');
}
