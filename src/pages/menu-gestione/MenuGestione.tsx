import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import DeviceTypeComponent from "../../components/menu-gestione-components/DeviceTypeComponent";
import DeviceModelsComponent from "../../components/menu-gestione-components/DeviceModelsComponent";
import DeviceStatusComponent from "../../components/menu-gestione-components/DeviceStatusComponent";
import MobileProvidersComponent from "../../components/menu-gestione-components/MobileProvidersComponent";
import ServiceTypeComponent from "../../components/menu-gestione-components/ServiceTypeComponent";
import DeviceAssignmentComponent from "../../components/DeviceAssignmentComponent";



const menuItems = [
  { title: "Modelli Dispositivi", path: "device-models" },
  { title: "Tipi Dispositivi", path: "device-types" },
  { title: "Stato Dispositivi", path: "device-status" },
  { title: "Gestori Telefonia", path: "mobile-providers" },
  {title : "Tipologie Servizio" , path : "service-type"},
];

const MenuGestione: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const currentPath = pathParts[pathParts.length - 1];
    if (menuItems.some((item) => item.path === currentPath)) {
      setSelected(currentPath);
    }
  }, [location]);

  const handleClick = (path: string) => {
    setSelected(path);
    navigate(`/menu-gestione/${path}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--blue-consob-600)",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            marginLeft: 2,
            color: "var(--neutro-100)",
            "&:hover": {
              backgroundColor: "#90caf9",
              color: "var(--neutro-100)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            flex: 1,
          }}
        >
          {menuItems.map((item) => (
            <Box
              key={item.path}
              onClick={() => handleClick(item.path)}
              sx={{
                padding: "16px 24px",
                cursor: "pointer",
                borderTop:
                  selected === item.path
                    ? "4px solid #1976d2"
                    : "4px solid transparent",
                transition: "border-top 0.3s",
                "&:hover": {
                  borderTop: "4px solid #90caf9",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: selected === item.path ? 600 : 400,
                  color: selected === item.path ? "var(--neutro-100)" : "var(--neutro-200)",
                }}
              >
                {item.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Routes>
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
          <Route path="device-models" element={<DeviceModelsComponent />} />
          <Route path="device-types" element={<DeviceTypeComponent />} />
          <Route path="device-status" element={<DeviceStatusComponent />} />
          <Route path="mobile-providers" element={<MobileProvidersComponent />} />
          <Route path="device-assignment" element={<DeviceAssignmentComponent />} />
          <Route path="service-type" element={<ServiceTypeComponent/>} />

        
        </Routes>
      </Box>
    </Box>
  );
};

export default MenuGestione;
