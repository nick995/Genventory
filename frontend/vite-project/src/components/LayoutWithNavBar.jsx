//LayoutWithNavBar.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar.jsx';

const LayoutWithNavBar = ({ children }) => {
    const location = useLocation();
    const showNavBar = !['/login', '/register'].includes(location.pathname);

    const isLoggedIn = true;
    const applyPadding = isLoggedIn && !['/login', '/register'].includes(location.pathname);
    const contentClass = `main-content ${applyPadding ? 'padding-content' : ''}`;

    return (

        <div className={contentClass}>
            {showNavBar && <NavBar />}
            {children}
        </div>
    );
};

export default LayoutWithNavBar;