import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Assegnazione Dispositivo",
      path: "/device-assignment", 
    },
    {
      text: "Gestione Dispositivi",
      path: "/device-management", 
    },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: "200vh",
        top: "64px",
        backgroundColor: "var(--neutro-100)",
        borderRight: "1px solid rgba(0,0,0,0.1)",
        flexShrink: 0,
        overflow: "hidden",
        textAlign: "left",
      }}
    >
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              color: "black",
              backgroundColor:
                location.pathname === item.path
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(12, 99, 179, 0.05)",
                borderLeft: "4px solid var(--blue-consob-600)",
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
