import axios from 'axios';
import { Issue, CreateIssueRequest, UpdateIssueRequest, AddCommentRequest, Statistics } from '@/types/Issue';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const issueApi = {
  getIssues: async (): Promise<Issue[]> => {
    const response = await api.get<Issue[]>('/issues');
    return response.data;
  },

  getIssue: async (id: string): Promise<Issue> => {
    const response = await api.get<Issue>(`/issues/${id}`);
    return response.data;
  },

  createIssue: async (issue: CreateIssueRequest): Promise<Issue> => {
    const response = await api.post<Issue>('/issues', issue);
    return response.data;
  },

  updateIssue: async (id: string, updates: UpdateIssueRequest): Promise<Issue> => {
    const response = await api.patch<Issue>(`/issues/${id}`, updates);
    return response.data;
  },

  addComment: async (issueId: string, comment: AddCommentRequest): Promise<Issue> => {
    const response = await api.post<Issue>(`/issues/${issueId}/comments`, comment);
    return response.data;
  },

  getStatistics: async (): Promise<Statistics> => {
    const response = await api.get<Statistics>('/statistics');
    return response.data;
  },
};

export default api;
