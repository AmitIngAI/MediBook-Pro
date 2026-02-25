import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import { Home, DarkMode, LightMode, LocalHospital } from '@mui/icons-material';
import { DarkModeContext } from '../App';

const Navbar = ({ title }) => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

    return (
        <AppBar position="static" sx={{ mb: 3 }}>
            <Toolbar>
                {/* Home Button */}
                <Tooltip title="Go to Home">
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                    >
                        <Home />
                    </IconButton>
                </Tooltip>

                {/* Logo */}
                <LocalHospital sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {title || 'MediBook Pro'}
                </Typography>

                {/* Dark Mode Toggle */}
                <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                    <IconButton color="inherit" onClick={toggleDarkMode}>
                        {darkMode ? <LightMode /> : <DarkMode />}
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;