import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IssueList from '../../pages/IssueList';
import { issueApi } from '../../services/api';
import { Issue, IssueStatus, IssuePriority } from '../../types/Issue';

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
    description: 'Test description 1',
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

describe('IssueList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockedIssueApi.getIssues.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<IssueList />);
    
    expect(screen.getByText('Loading issues...')).toBeInTheDocument();
  });

  test('renders issues list', async () => {
    mockedIssueApi.getIssues.mockResolvedValue(mockIssues);
    
    renderWithProviders(<IssueList />);
    
    await waitFor(() => {
      expect(screen.getByText('Issues')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Test Issue 2')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('filters issues by search term', async () => {
    const user = userEvent.setup();
    mockedIssueApi.getIssues.mockResolvedValue(mockIssues);
    
    renderWithProviders(<IssueList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search by title, description, or assignee...');
    await user.type(searchInput, 'Test Issue 1');
    
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Issue 2')).not.toBeInTheDocument();
  });

  test('filters issues by status', async () => {
    const user = userEvent.setup();
    mockedIssueApi.getIssues.mockResolvedValue(mockIssues);
    
    renderWithProviders(<IssueList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    });
    
    const statusFilterTrigger = screen.getAllByRole('combobox')[0];
    await user.click(statusFilterTrigger);
    
    await waitFor(() => {
      const openOption = screen.getByRole('option', { name: 'Open' });
      expect(openOption).toBeInTheDocument();
    });
    
    const openOption = screen.getByRole('option', { name: 'Open' });
    await user.click(openOption);
    
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Issue 2')).not.toBeInTheDocument();
  });

  test('filters issues by priority', async () => {
    const user = userEvent.setup();
    mockedIssueApi.getIssues.mockResolvedValue(mockIssues);
    
    renderWithProviders(<IssueList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    });
    
    const priorityFilterTrigger = screen.getAllByRole('combobox')[1];
    await user.click(priorityFilterTrigger);
    
    await waitFor(() => {
      const highOption = screen.getByRole('option', { name: 'High' });
      expect(highOption).toBeInTheDocument();
    });
    
    const highOption = screen.getByRole('option', { name: 'High' });
    await user.click(highOption);
    
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Issue 2')).not.toBeInTheDocument();
  });

  test('renders empty state when no issues exist', async () => {
    mockedIssueApi.getIssues.mockResolvedValue([]);
    
    renderWithProviders(<IssueList />);
    
    await waitFor(() => {
      expect(screen.getByText('No issues found. Create your first issue!')).toBeInTheDocument();
    });
  });

  test('has create issue floating action button', async () => {
    mockedIssueApi.getIssues.mockResolvedValue(mockIssues);
    
    renderWithProviders(<IssueList />);
    
    await waitFor(() => {
      const createButton = screen.getByRole('link', { name: /create issue/i });
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveAttribute('href', '/create');
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedIssueApi.getIssues.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<IssueList />);
    
    await waitFor(() => {
      expect(screen.getByText('Issues')).toBeInTheDocument();
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch issues:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  test('issue rows are clickable and navigate to detail page', async () => {
    mockedIssueApi.getIssues.mockResolvedValue(mockIssues);
    
    renderWithProviders(<IssueList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    });
    
    const issueRow = screen.getByText('Test Issue 1').closest('a');
    expect(issueRow).toBeInTheDocument();
    expect(issueRow).toHaveAttribute('href', '/issues/1');
  });
});
