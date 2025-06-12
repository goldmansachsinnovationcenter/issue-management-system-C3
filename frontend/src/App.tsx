import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { ToastProvider } from './components/ToastProvider';
import CreateIssue from './pages/CreateIssue';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0071b3',
    },
    secondary: {
      main: '#6c757d',
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Issue Management System
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<CreateIssue />} />
              <Route path="/create" element={<CreateIssue />} />
            </Routes>
          </Container>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
