import React from "react";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import DeviceModelsComponent from "../../components/menu-gestione-components/DeviceModelsComponent";
import DeviceTypeComponent from "../../components/menu-gestione-components/DeviceTypeComponent";
import DeviceStatusComponent from "../../components/menu-gestione-components/DeviceStatusComponent";
import MobileProvidersComponent from "../../components/menu-gestione-components/MobileProvidersComponent";
import ServiceTypeComponent from "../../components/menu-gestione-components/ServiceTypeComponent";
import ConventionComponent from "../../components/menu-gestione-components/ConventionComponent";
import DeviceAssignmentComponent from "../../components/DeviceAssignmentComponent";
import Sidebar from "../sidebar/Sidebar";

const MenuGestione: React.FC = () => {
  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "1vw",
          mt: "var(--header-height, 32px)",
          p: 4,
          overflow: "auto",
        }}
      >
        <Routes>
          <Route
            index
            element={
              <Box sx={{ textAlign: "center", mt: 8 }}>
                <h3>Seleziona una voce dal menu gestione in alto a destra</h3>
              </Box>
            }
          />

          <Route path="device-models" element={<DeviceModelsComponent />} />
          <Route path="device-types" element={<DeviceTypeComponent />} />
          <Route path="device-status" element={<DeviceStatusComponent />} />
          <Route
            path="mobile-providers"
            element={<MobileProvidersComponent />}
          />
          <Route path="service-type" element={<ServiceTypeComponent />} />
          <Route path="convention" element={<ConventionComponent />} />
          <Route
            path="device-assignment"
            element={<DeviceAssignmentComponent />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default MenuGestione;
