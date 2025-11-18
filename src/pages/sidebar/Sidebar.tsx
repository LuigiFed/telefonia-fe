import React from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";

import "./Sidebar.css";
import CustomListItem from "./CustomListItem";

const links = [
  { text: "Assegnazione Dispositivo", url: "/device-assignment" },
  { text: "Gestione Dispositivi",     url: "/device-management" },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (url: string) => () => {
    navigate(url); 
  };

  return (
    <Drawer
      variant="permanent"
      className="col z-1"
      sx={{
        height: "100%",
        overflowX: "hidden",
        width: "18vw",
        "& .MuiDrawer-paper": {
          left: "4vw",
          width: "15vw",
          height: "100vh",
          position: "fixed",
          top: "7rem",
        },
      }}
    >
      <List color="primary">
        {links.map((link) => (
          <CustomListItem
            key={link.url}
            link={link}
            handleClick={handleClick(link.url)}
          />
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;