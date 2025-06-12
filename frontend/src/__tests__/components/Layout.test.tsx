import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Layout from '../../components/Layout';

const theme = createTheme();

const renderWithProviders = (children: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  test('renders app title', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Issue Management System')).toBeInTheDocument();
  });

  test('renders navigation menu items', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Issues')).toBeInTheDocument();
    expect(screen.getByText('Create Issue')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  test('renders children content', () => {
    renderWithProviders(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  test('has proper navigation links', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const issuesLink = screen.getByRole('link', { name: /issues/i });
    const createLink = screen.getByRole('link', { name: /create issue/i });
    const statsLink = screen.getByRole('link', { name: /statistics/i });
    
    expect(dashboardLink).toHaveAttribute('href', '/');
    expect(issuesLink).toHaveAttribute('href', '/issues');
    expect(createLink).toHaveAttribute('href', '/create');
    expect(statsLink).toHaveAttribute('href', '/statistics');
  });
});
