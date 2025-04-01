import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IssueList from '../IssueList';

global.fetch = jest.fn();

describe('IssueList Component', () => {
  const mockIssues = [
    {
      id: '1',
      subject: 'Test Issue 1',
      impactedApplication: 'Test App',
      reporterName: 'Test Reporter',
      reportedTime: new Date().toISOString(),
      initialObservations: 'Test observations',
      notificationEmails: ['test@example.com'],
      priority: 'High',
      assignedTo: 'Test Assignee',
      status: 'new',
      comments: []
    },
    {
      id: '2',
      subject: 'Test Issue 2',
      impactedApplication: 'Another App',
      reporterName: 'Another Reporter',
      reportedTime: new Date().toISOString(),
      initialObservations: 'More observations',
      notificationEmails: ['another@example.com'],
      priority: 'Medium',
      assignedTo: 'Another Assignee',
      status: 'assigned',
      comments: []
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <IssueList />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Loading issues...')).toBeInTheDocument();
  });

  it('should display issues after loading', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockIssues)
      })
    );
    
    render(
      <BrowserRouter>
        <IssueList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Loading issues...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Test Issue 2')).toBeInTheDocument();
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Another App')).toBeInTheDocument();
  });

  it('should display fallback issues when fetch fails', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.reject('Error')
      })
    );
    
    render(
      <BrowserRouter>
        <IssueList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Loading issues...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Login page not working')).toBeInTheDocument();
    expect(screen.getByText('Data not syncing')).toBeInTheDocument();
  });

  it('should render status chips with correct colors', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockIssues)
      })
    );
    
    render(
      <BrowserRouter>
        <IssueList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Loading issues...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText('assigned')).toBeInTheDocument();
  });
});
