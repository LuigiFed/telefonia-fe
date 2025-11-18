import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./pages/Header/Header";
import Sidebar from "./pages/sidebar/Sidebar";
import MenuGestione from "./pages/menu-gestione/MenuGestione";
import DeviceAssignmentComponent from "./components/DeviceAssignmentComponent";
import DeviceManagementComponent from "./components/DeviceManagementComponent";
import { UserRoleProvider } from "./context/UserRoleContext";

function App() {
  return (
    <UserRoleProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/menu-gestione/*" element={<MenuGestione />} />

     
          <Route
            path="/*"
            element={
              <div className="container-fluid g-0">
                <div className="row g-0">
                  <Sidebar />
                  <div className="col">
                    <div className="p-4">
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <div className="text-center mt-5">
                              <h4 className="text-muted">
                                Seleziona una voce dal menu
                              </h4>
                            </div>
                          }
                        />
                        <Route path="/device-assignment" element={<DeviceAssignmentComponent />} />
                        <Route path="/device-management" element={<DeviceManagementComponent />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserRoleProvider>
  );
}

export default App;