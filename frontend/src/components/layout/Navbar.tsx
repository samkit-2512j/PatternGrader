import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  styled,
  useTheme,
  Avatar,
  ListItemIcon,
  Tooltip,
  Fade
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.5rem',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  textFillColor: 'transparent',
  filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.2))',
  cursor: 'pointer',
}));

const MenuButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

const ProfileButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
}));

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <StyledAppBar>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LogoText variant="h6" onClick={() => navigate('/')}>
            DesignDojo
          </LogoText>

          <Box sx={{ ml: 4 }}>
            <MenuButton
              color="inherit"
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/learn')}
            >
              Learn
            </MenuButton>
            <MenuButton
              color="inherit"
              startIcon={<EmojiEventsIcon />}
              onClick={() => navigate('/challenges')}
            >
              Challenges
            </MenuButton>
          </Box>
        </Box>

        <Box>
          <Tooltip title="Account settings">
            <ProfileButton
              onClick={handleProfileClick}
              size="small"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '1rem',
                }}
              >
                {currentUser?.username?.[0].toUpperCase() || 'U'}
              </Avatar>
            </ProfileButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '& .MuiMenuItem-root': {
                  py: 1.5,
                },
              },
            }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 