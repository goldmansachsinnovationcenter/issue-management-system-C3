import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from '../../pages/Dashboard';
import { issueApi } from '../../services/api';
import { Issue, Statistics, IssueStatus, IssuePriority } from '../../types/Issue';

jest.mock('../../services/api');
const mockedIssueApi = issueApi as jest.Mocked<typeof issueApi>;

const theme = createTheme();

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Test Issue 1',
    description: 'Test description',
    status: IssueStatus.OPEN,
    priority: IssuePriority.HIGH,
    assignee: 'John Doe',
    application: 'Test App',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    comments: []
  },
  {
    id: '2',
    title: 'Test Issue 2',
    description: 'Test description 2',
    status: IssueStatus.IN_PROGRESS,
    priority: IssuePriority.MEDIUM,
    assignee: 'Jane Smith',
    application: 'Test App 2',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    comments: []
  }
];

const mockStatistics: Statistics = {
  totalIssues: 10,
  statusCounts: {
    [IssueStatus.OPEN]: 3,
    [IssueStatus.IN_PROGRESS]: 4,
    [IssueStatus.RESOLVED]: 2,
    [IssueStatus.CLOSED]: 1
  },
  priorityCounts: {
    [IssuePriority.LOW]: 2,
    [IssuePriority.MEDIUM]: 4,
    [IssuePriority.HIGH]: 3,
    [IssuePriority.CRITICAL]: 1
  },
  applicationCounts: {
    'Test App': 5,
    'Test App 2': 5
  },
  assigneeCounts: {
    'John Doe': 6,
    'Jane Smith': 4
  }
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockedIssueApi.getIssues.mockImplementation(() => new Promise(() => {}));
    mockedIssueApi.getStatistics.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  test('renders dashboard with statistics and recent issues', async () => {
    mockedIssueApi.getIssues.mockResolvedValue(mockIssues);
    mockedIssueApi.getStatistics.mockResolvedValue(mockStatistics);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Test Issue 2')).toBeInTheDocument();
  });

  test('renders empty state when no issues exist', async () => {
    mockedIssueApi.getIssues.mockResolvedValue([]);
    mockedIssueApi.getStatistics.mockResolvedValue({
      ...mockStatistics,
      totalIssues: 0
    });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('No issues found. Create your first issue to get started.')).toBeInTheDocument();
    });
  });

  test('has create issue floating action button', async () => {
    mockedIssueApi.getIssues.mockResolvedValue(mockIssues);
    mockedIssueApi.getStatistics.mockResolvedValue(mockStatistics);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      const createButton = screen.getByRole('link', { name: /create issue/i });
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveAttribute('href', '/create');
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedIssueApi.getIssues.mockRejectedValue(new Error('API Error'));
    mockedIssueApi.getStatistics.mockRejectedValue(new Error('API Error'));

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch dashboard data:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
