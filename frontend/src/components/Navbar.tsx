import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingBag as ShoppingBagIcon,
  Inventory as InventoryIcon,
  ReceiptLong as ReceiptLongIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

interface Props {
  children: React.ReactNode;
}

const Navbar: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Painel Geral', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Clientes', path: '/customers', icon: <PeopleIcon /> },
    { label: 'Produtos', path: '/products', icon: <ShoppingBagIcon /> },
    { label: 'Estoque', path: '/inventory', icon: <InventoryIcon /> },
    { label: 'Vendas', path: '/sales', icon: <ReceiptLongIcon /> },
    { label: 'Relatórios', path: '/reports', icon: <BarChartIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexGroup: 1, flexDirection: 'column', bgcolor: '#161314' }}>
      <Toolbar sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF43A3 0%, #F58634 100%)',
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.4rem',
              fontWeight: 700,
              letterSpacing: '.05rem',
              color: '#ffffff',
            }}
          >
            MORENA CONCEPT
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            color: '#FF43A3',
            mt: 0.5,
            pl: 5,
          }}
        >
          Imagine a Place
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: '16px',
                  py: 1.5,
                  px: 2.5,
                  color: isActive ? '#FF43A3' : 'text.secondary',
                  background: isActive ? 'rgba(255, 67, 163, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 67, 163, 0.15)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? '#FF43A3' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
      
      {user && (
        <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {user.role}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              py: 1,
              fontSize: '0.8rem',
              borderColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                borderColor: '#FF43A3',
                color: '#FF43A3',
                backgroundColor: 'rgba(255,67,163,0.05)',
              },
            }}
          >
            Sair
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'rgba(22, 19, 20, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: { md: 'flex-end' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { md: 'none' },
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              fontWeight: 700,
            }}
          >
            MORENA CONCEPT
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(255, 255, 255, 0.05)' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(255, 255, 255, 0.05)' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 5 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          bgcolor: '#161314',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Navbar;
