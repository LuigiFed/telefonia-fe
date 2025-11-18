import { ListItem, ListItemButton, ListItemText, styled } from "@mui/material";
import React from "react";

type CustomListItemProps = {
  link: any;
  handleClick: React.MouseEventHandler<HTMLDivElement>;
};

export default function CustomListItem({
  link,
  handleClick,
}: Readonly<CustomListItemProps>) {
  return (
    <ListItem
      className="list-item"
      key={link.text}
      disablePadding
      sx={{ display: "block" }}
    >
      <ListItemButtonUiKit
        disableRipple
        selected={link.url === window.location.pathname.split("/")[1]}
        onClick={handleClick}
      >
        <ListItemText className="font-list-item fs-4" primary={link.text} />
      </ListItemButtonUiKit>
    </ListItem>
  );
}

const ListItemButtonUiKit = styled(ListItemButton)(() => ({
  alignItems: "stretch",
  height: "60px",
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "#E4F0F7",
  },
  "&.Mui-selected": {
    backgroundColor: "#E4F0F7",
    border: "solid",
    borderWidth: "0px 0px 0px 2px",
    borderColor: "#134DCE",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#E4F0F7",
  },
}));
