import * as React from 'react';

// Create a context with a default toggle function
export const ColorModeContext = React.createContext({
    toggleColorMode: () => { },
});
