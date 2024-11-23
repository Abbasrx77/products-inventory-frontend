import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { logout } from '../../features/auth/authSlice';
import { RootState, AppDispatch } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Navbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        handleClose();
        navigate('/login');
    };

    return (
        <AppBar position="fixed" sx={{ width: '100%' }}>
        <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Inventaire des Produits
                </Typography>

                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {user?.prenom} {user?.nom}
                        </Typography>
                        <IconButton size="large" onClick={handleMenu} color="inherit">
                            <AccountCircle />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Connexion
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            Inscription
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};