import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CreateIssue from '../../pages/CreateIssue';
import { issueApi } from '../../services/api';


jest.mock('../../services/api');
const mockedIssueApi = issueApi as jest.Mocked<typeof issueApi>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

describe('CreateIssue Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create issue form', () => {
    renderWithProviders(<CreateIssue />);
    
    expect(screen.getByText('Create New Issue')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    
    expect(screen.getByText('Priority *')).toBeInTheDocument();
    expect(screen.getByText('Assignee *')).toBeInTheDocument();
    expect(screen.getByText('Application *')).toBeInTheDocument();
    
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes).toHaveLength(3); // priority, assignee, application
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateIssue />);
    
    const submitButton = screen.getByRole('button', { name: /create issue/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Assignee is required')).toBeInTheDocument();
      expect(screen.getByText('Application is required')).toBeInTheDocument();
    });
  });

  test('allows typing in title field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateIssue />);
    
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Test Issue Title');
    
    expect(titleInput).toHaveValue('Test Issue Title');
  });

  test('allows typing in description field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateIssue />);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, 'This is a test description');
    
    expect(descriptionInput).toHaveValue('This is a test description');
  });

  test('shows validation errors when required fields are missing', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<CreateIssue />);
    
    await user.type(screen.getByLabelText(/title/i), 'Test Issue');
    await user.type(screen.getByLabelText(/description/i), 'This is a test issue description');
    
    const submitButton = screen.getByRole('button', { name: /create issue/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Assignee is required')).toBeInTheDocument();
      expect(screen.getByText('Application is required')).toBeInTheDocument();
    });
    
    expect(mockedIssueApi.createIssue).not.toHaveBeenCalled();
  });

  test('prevents submission when validation fails', async () => {
    const user = userEvent.setup();
    mockedIssueApi.createIssue.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<CreateIssue />);
    
    await user.type(screen.getByLabelText(/title/i), 'Test Issue');
    await user.type(screen.getByLabelText(/description/i), 'This is a test issue description');
    
    const submitButton = screen.getByRole('button', { name: /create issue/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Assignee is required')).toBeInTheDocument();
      expect(screen.getByText('Application is required')).toBeInTheDocument();
    });
    
    expect(mockedIssueApi.createIssue).not.toHaveBeenCalled();
  });

  test('shows validation errors instead of API errors when form is invalid', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedIssueApi.createIssue.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<CreateIssue />);
    
    await user.type(screen.getByLabelText(/title/i), 'Test Issue');
    await user.type(screen.getByLabelText(/description/i), 'This is a test issue description');
    
    const submitButton = screen.getByRole('button', { name: /create issue/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Assignee is required')).toBeInTheDocument();
      expect(screen.getByText('Application is required')).toBeInTheDocument();
    });
    
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('has back navigation button', () => {
    renderWithProviders(<CreateIssue />);
    
    const backIcon = screen.getByTestId('ArrowBackIcon');
    expect(backIcon).toBeInTheDocument();
    
    const backButton = backIcon.closest('button');
    expect(backButton).toBeInTheDocument();
  });
});
