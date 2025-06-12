import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IssueDetail from '../../pages/IssueDetail';
import { issueApi } from '../../services/api';
import { Issue, IssueStatus, IssuePriority } from '../../types/Issue';

jest.mock('../../services/api');
const mockedIssueApi = issueApi as jest.Mocked<typeof issueApi>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

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

const mockIssue: Issue = {
  id: '1',
  title: 'Test Issue',
  description: 'This is a test issue description',
  status: IssueStatus.OPEN,
  priority: IssuePriority.HIGH,
  assignee: 'John Doe',
  application: 'Test App',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  comments: [
    {
      id: '1',
      issueId: '1',
      author: 'Jane Smith',
      content: 'This is a test comment',
      createdAt: '2023-01-01T12:00:00Z'
    }
  ]
};

describe('IssueDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockedIssueApi.getIssue.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<IssueDetail />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders issue details', async () => {
    mockedIssueApi.getIssue.mockResolvedValue(mockIssue);
    
    renderWithProviders(<IssueDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Issue')).toBeInTheDocument();
    });
    
    expect(screen.getByText('This is a test issue description')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  test('renders comments', async () => {
    mockedIssueApi.getIssue.mockResolvedValue(mockIssue);
    
    renderWithProviders(<IssueDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });

  test('allows status updates', async () => {
    const user = userEvent.setup();
    const updatedIssue = { ...mockIssue, status: IssueStatus.IN_PROGRESS };
    
    mockedIssueApi.getIssue.mockResolvedValue(mockIssue);
    mockedIssueApi.updateIssue.mockResolvedValue(updatedIssue);
    
    renderWithProviders(<IssueDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Issue')).toBeInTheDocument();
    });
    
    const changeStatusButton = screen.getByRole('button', { name: /change status/i });
    await user.click(changeStatusButton);
    
    await waitFor(() => {
      const statusSelect = screen.getByRole('combobox');
      expect(statusSelect).toBeInTheDocument();
    });
    
    const statusSelect = screen.getByRole('combobox');
    await user.click(statusSelect);
    
    const inProgressOption = screen.getByText('In Progress');
    await user.click(inProgressOption);
    
    const saveIcon = screen.getByTestId('SaveIcon');
    const saveFab = saveIcon.closest('button');
    await user.click(saveFab!);
    
    await waitFor(() => {
      expect(mockedIssueApi.updateIssue).toHaveBeenCalledWith('1', {
        status: IssueStatus.IN_PROGRESS
      });
    });
  });

  test('allows adding comments', async () => {
    const user = userEvent.setup();
    const issueWithNewComment = {
      ...mockIssue,
      comments: [
        ...mockIssue.comments,
        {
          id: '2',
          issueId: '1',
          author: 'Test User',
          content: 'New test comment',
          createdAt: '2023-01-01T13:00:00Z'
        }
      ]
    };
    
    mockedIssueApi.getIssue.mockResolvedValue(mockIssue);
    mockedIssueApi.addComment.mockResolvedValue(issueWithNewComment);
    
    renderWithProviders(<IssueDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Issue')).toBeInTheDocument();
    });
    
    const authorInput = screen.getByLabelText(/your name/i);
    const commentInput = screen.getByLabelText(/comment/i);
    
    await user.type(authorInput, 'Test User');
    await user.type(commentInput, 'New test comment');
    
    const addButton = screen.getByRole('button', { name: /add comment/i });
    await user.click(addButton);
    
    await waitFor(() => {
      expect(mockedIssueApi.addComment).toHaveBeenCalledWith('1', {
        author: 'Test User',
        content: 'New test comment'
      });
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedIssueApi.getIssue.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<IssueDetail />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch issue:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  test('has back navigation button', async () => {
    mockedIssueApi.getIssue.mockResolvedValue(mockIssue);
    
    renderWithProviders(<IssueDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Issue')).toBeInTheDocument();
    });
    
    const backIcon = screen.getByTestId('ArrowBackIcon');
    expect(backIcon).toBeInTheDocument();
    
    const backButton = backIcon.closest('button');
    expect(backButton).toBeInTheDocument();
  });


});
