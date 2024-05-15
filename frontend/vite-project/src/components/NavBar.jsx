import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ColorModeContext } from './ColorModeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const getNavLinkClass = (isActive) => {
    return isActive ? 'nav-link active' : 'nav-link';
};

const NavBar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const iconColor = 'white';

    return (
        <div className="nav-bar">
            <div className='logo-container'>
                <a href='/'>
                    <img
                        src='finall.png'
                        alt='Logo'
                    />
                </a>
            </div>
            <div className="header">
                MAIN MENU
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => getNavLinkClass(isActive)}
                        >
                            <span className="material-symbols-outlined">grid_view</span> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/model/strains"
                            className={({ isActive }) => getNavLinkClass(isActive)}
                        >
                            <span className="material-symbols-outlined">microbiology</span> Strains
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/model/alleles"
                            className={({ isActive }) => getNavLinkClass(isActive)}
                        >
                            <span className="material-symbols-outlined">genetics</span> Alleles
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/model/plasmids"
                            className={({ isActive }) => getNavLinkClass(isActive)}
                        >
                            <span className="material-icons">blur_circular</span> Plasmids
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/model/freezetasks"
                            className={({ isActive }) => getNavLinkClass(isActive)}
                        >
                            <span className="material-icons">ac_unit</span> Freeze Tasks
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/model/thawtasks"
                            className={({ isActive }) => getNavLinkClass(isActive)}
                        >
                            <span className="material-icons">local_fire_department</span> Thaw Tasks
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/model/import"
                            className={({ isActive }) => getNavLinkClass(isActive)}
                        >
                            <span className="material-icons">upload_file</span> Import
                        </NavLink>
                    </li>

                </ul>
            </nav>
            {/* <div className="settings">
                <NavLink
                    to="/model/settings"
                    className={({ isActive }) => getNavLinkClass(isActive)}
                >
                    <span className="material-icons">settings</span>Settings
                </NavLink>
            </div> */}
            <div className="toggle-dark">
                <Box display="flex" alignItems="center" justifyContent="center">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={theme.palette.mode === 'dark'}
                                onChange={colorMode.toggleColorMode}
                                name="modeSwitch"
                                color="default"
                            />
                        }
                        label={
                            <IconButton color="inherit" aria-label="toggle light/dark theme">
                                <Brightness4Icon style={{ color: iconColor }} />
                            </IconButton>
                        }
                        labelPlacement="start"
                    />
                </Box>
            </div>

            <div className="logout">
                <NavLink
                    to="/logout"
                    className={({ isActive }) => getNavLinkClass(isActive)}
                >
                    <span className="material-icons">logout</span>Sign Out
                </NavLink>
            </div>
        </div>
    );
};

export default NavBar;
