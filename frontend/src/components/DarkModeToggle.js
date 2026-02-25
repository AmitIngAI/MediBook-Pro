import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { DarkModeContext } from '../App';

const DarkModeToggle = () => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

    return (
        <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
        </Tooltip>
    );
};

export default DarkModeToggle;