import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Dashboard from '@/pages/Dashboard';
import IssueList from '@/pages/IssueList';
import IssueDetail from '@/pages/IssueDetail';
import CreateIssue from '@/pages/CreateIssue';
import Statistics from '@/pages/Statistics';
import Layout from '@/components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/issues" element={<IssueList />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/create" element={<CreateIssue />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
