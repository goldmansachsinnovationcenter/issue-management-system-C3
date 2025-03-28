import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ width: { xs: '100%', sm: '30%', md: '30%' } }}>
          <StyledLink to="/issues">
            <Card sx={{ '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Issues
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage all issues
                </Typography>
              </CardContent>
            </Card>
          </StyledLink>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '30%', md: '30%' } }}>
          <StyledLink to="/create">
            <Card sx={{ '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Create Issue
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Report a new issue
                </Typography>
              </CardContent>
            </Card>
          </StyledLink>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '30%', md: '30%' } }}>
          <StyledLink to="/statistics">
            <Card sx={{ '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View issue statistics
                </Typography>
              </CardContent>
            </Card>
          </StyledLink>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
