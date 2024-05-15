// ThemeContext.js
import { createContext, useContext, useState } from 'react';
import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({
  palette: {
    mode: 'dark', // default light theme
  },
});

const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
