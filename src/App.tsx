import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./theme/default/styles.css";
import theme from "./theme/default/theme";
import { Header } from "./components/Header";
import Sidebar from "./components/sidebar/Sidebar";
import MenuGestione from "./pages/menu-gestione/MenuGestione";
import DeviceAssignmentComponent from "./components/DeviceAssignmentComponent";
import DeviceManagementComponent from "./components/DeviceManagementComponent";





function  App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
       
          <Route path="/menu-gestione/*" element={<MenuGestione />} />

       
          <Route
            path="/*"
            element={
              <Box
                sx={{
                  minHeight: "100vh",          
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",        
                }}
              >
                <Header />

                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    overflow: "hidden",        
                  }}
                >
              
                  <Box
                    component="nav"
                    sx={{
                      width: { sm: 240 },
                      flexShrink: 0,
                      bgcolor: "background.paper",
                      borderRight: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Sidebar />
                  </Box>

              
                  <Box
                    component="main"
                    className="main-content"
                    sx={{
                      flex: 1,
                      p: 3,
                      overflow: "auto",     
                      bgcolor: "background.default",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <Routes>
                      {/* Home */}
                      <Route
                        index
                        element={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                            }}
                          >
                            <Typography variant="h4" color="text.secondary">
                              Seleziona una voce dal menu
                            </Typography>
                          </Box>
                        }
                      />

                      <Route path="device-assignment" element={<DeviceAssignmentComponent />} />
                      <Route path="device-management" element={<DeviceManagementComponent />} />
                    </Routes>
                  </Box>
                </Box>
              </Box>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;