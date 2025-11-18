import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "Telefonia FE" }) => {
  const navigate = useNavigate();

  return (
    <>
  
      <AppBar
        position="static"
        sx={{
          backgroundColor: "var(--neutro-100)",
          color: "black",
          height: "32px",
          justifyContent: "center",
          boxShadow: "none",
        }}
      >
        <Toolbar
          variant="dense"
          sx={{ minHeight: "32px !important", display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            color="inherit"
            sx={{ fontSize: "0.8rem", textTransform: "none" }}
            onClick={() => navigate("/help")}
          >
            Aiuto
          </Button>
          <Button
            color="inherit"
            sx={{ fontSize: "0.8rem", textTransform: "none" }}
            onClick={() => navigate("/menu-gestione")}
          >
            Menu Gestione
          </Button>
        </Toolbar>
      </AppBar>


      <AppBar
        position="static"
        color="primary"
        sx={{
          backgroundColor: "var(--blue-consob-600)",
          zIndex: 1000,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit">Home</Button>
            <Button color="inherit">Dashboard</Button>
            <Button color="inherit">Profilo</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
