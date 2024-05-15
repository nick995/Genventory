import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import NavBar from './components/NavBar';
import './App.css';
import './index.css';
import AllelesTable from './components/AllelesTable';
import PlasmidsTable from './components/PlasmidsTable';
import LocationPlasmidsTable from './components/LocationPlasmidsTable';
import StrainsTable from './components/StrainsTable';
// import ThawRequestsTable from './components/ThawRequestsTable';
// import FreezeRequestsTable from './components/FreezeRequestsTable';
import LocationStrainsTable from './components/LocationStrainsTable';
import WelcomeCard from './components/WelcomeCard';
import EditPlasmidPage from './components/EditPlasmidPage';
import CreatePlasmidPage from './components/CreatePlasmidPage';
import EditAllelePage from './components/EditAllelePage';
import CreateAllelePage from './components/CreateAllelePage';
import EditStrainPage from './components/EditStrainPage';
import CreateStrainPage from './components/CreateStrainPage';
import FreezeTasks from './components/FreezeTasks';
import ThawTasks from './components/ThawTasks';
import LayoutWithNavBar from './components/LayoutWithNavBar';
//  =================login feature=================
import Register from './components/login/register';
import Login from './components/login/login';
import Logout from './components/login/logout';
import ProtectiveRoutes from './components/auth/ProtectiveRoutes';
//  =================login feature=================
import ImportTable from './components/ImportTable';
import Settings from './components/Settings';
import { ColorModeContext } from './components/ColorModeContext';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });



const App = () => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            {/* <div className="main-content"> */}
            <LayoutWithNavBar pathname={location.pathname}>
              <Routes>
                <Route path="/" element={<ProtectiveRoutes> <WelcomeCard /> </ProtectiveRoutes>} />
                {/* All other routes nested under /model */}
                <Route path="/dashboard" element={<ProtectiveRoutes> <WelcomeCard /> </ProtectiveRoutes>} />
                <Route path="/model" element={<Outlet />}>

                  <Route path="alleles" element={<ProtectiveRoutes><StyledEngineProvider injectFirst><Outlet /></StyledEngineProvider> </ProtectiveRoutes>}>
                    <Route index element={<AllelesTable />} />
                    <Route path="edit/:id" element={<EditAllelePage />} />
                    <Route path="create" element={<CreateAllelePage />} />
                  </Route>
                  <Route path="plasmids" element={<ProtectiveRoutes> <StyledEngineProvider injectFirst><Outlet /></StyledEngineProvider> </ProtectiveRoutes>}>
                    <Route index element={<PlasmidsTable />} />
                    <Route path="edit/:id" element={<EditPlasmidPage />} />
                    <Route path="create" element={<CreatePlasmidPage />} />
                  </Route>
                  <Route path="locationplasmids" element={<LocationPlasmidsTable />} />
                  <Route path="strains" element={<ProtectiveRoutes> <StyledEngineProvider injectFirst><Outlet /></StyledEngineProvider> </ProtectiveRoutes>}>
                    <Route index element={<StrainsTable />} />
                    <Route path="edit/:id" element={<EditStrainPage />} />
                    <Route path="create" element={<CreateStrainPage />} />
                  </Route>
                  {/* <Route path="thawrequests" element={<ThawRequestsTable />} />
                  <Route path="freezerequests" element={<FreezeRequestsTable />} /> */}
                  <Route path="locationstrains" element={<LocationStrainsTable />} />
                  <Route path="freezetasks" element={<ProtectiveRoutes> <FreezeTasks /> </ProtectiveRoutes>} />
                  <Route path="thawtasks" element={<ProtectiveRoutes> <ThawTasks /> </ProtectiveRoutes>} />
                  <Route path="import" element={<ProtectiveRoutes> <ImportTable /> </ProtectiveRoutes>} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<ProtectiveRoutes><WelcomeCard /> </ProtectiveRoutes>} />
              </Routes>
              {/* </div> */}
            </LayoutWithNavBar>
            {/* </div> */}
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
