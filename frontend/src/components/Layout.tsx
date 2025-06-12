import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box, Container, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material'
import { Dashboard, List as ListIcon, Add, BarChart, BugReport } from '@mui/icons-material'

interface LayoutProps {
  children: ReactNode
}

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Issues', icon: <ListIcon />, path: '/issues' },
  { text: 'Create Issue', icon: <Add />, path: '/create' },
  { text: 'Statistics', icon: <BarChart />, path: '/statistics' },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <BugReport sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div">
            Issue Management System
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  )
}
