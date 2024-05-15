import React from 'react';
import Switch from '@mui/material/Switch';

const Settings = ({ toggleTheme, isDarkMode }) => {
  return (
    <div>
      <h1>Settings</h1>
      <div>
        Toggle theme
        <Switch checked={isDarkMode} onChange={toggleTheme} />
      </div>
    </div>
  );
};

export default Settings;