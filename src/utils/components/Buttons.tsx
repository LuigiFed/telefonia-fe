import Button, { buttonClasses } from "@mui/material/Button";
import {
  createTheme,
  ListItemButton,
  Menu,
  MenuItem,
  styled,
  Tooltip,
} from "@mui/material";
import IconButtonMui from "@mui/material/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
import { type MouseEventHandler, type ReactNode, useState } from "react";
import theme from "../../theme/default/theme";

export type ButtonProps = {
  iconButton?: ReactNode;
  textButton?: string;
};

export type BackButtonProps = ButtonProps & {
  prevUrl: string;
  variant: "text" | "outlined" | "contained" | undefined;
};

export type NavigationButtonProps = ButtonProps & {
  url: string;
  location: any;
  disabled?: boolean;
};

export type TagButtonProps = NavigationButtonProps & {
  label: string;
};

export type AddFieldButtonProps = {
  onClick: MouseEventHandler;
  textButton: string;
};

export type FormProps = {
  onClick: MouseEventHandler;
  textButton: string;
  disabled?: boolean;
  iconButton?: ReactNode;
};

export type DropDownButtonProps = {
  label: string;
  actions: Action[];
  iconButton: ReactNode;
};

export type Action = {
  label: string;
  onClick: () => void;
  className?: string;
};

export const customTheme = createTheme({
  palette: {
    primary: {
      main: "#0C63B3",
      dark: "#093A67",
      contrastText: "#ffffff",
    },
  },
});

export const NavigationButtonStyle = styled(Button)({
  textTransform: "none",
  color: customTheme.palette.primary.contrastText,
  fontSize: 14,
  fontWeight: 400,
  [`& .${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
    fontSize: "14px",
  },
});

export function NavigationButton({
  iconButton,
  textButton,
  url,
  location,
  disabled,
}: NavigationButtonProps) {
  const navigate = useNavigate();
  return (
    <ConfirmButtonText
      disabled={disabled}
      disableTouchRipple
      variant="text"
      color="primary"
      endIcon={iconButton}
      onClick={() => navigate(url, { state: { from: location.pathname } })}
    >
      {textButton}
    </ConfirmButtonText>
  );
}

export const ConfirmButton = styled(Button)({
  textTransform: "none",
  color: customTheme.palette.primary.contrastText,
  backgroundColor: customTheme.palette.primary.main,
  fontFamily: '"Titillium Web", sans-serif',
  fontSize: 14,
  fontWeight: 600,
  padding: "20px",
  height: "40px",
  margin: 0,
  [`& .${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
    fontSize: "16px",
  },
  ":hover": {
    backgroundColor: customTheme.palette.primary.dark,
  },
  ":disabled": {
    backgroundColor: customTheme.palette.grey[300],
    color: customTheme.palette.grey[600],
    boxShadow: "none",
    cursor: "not-allowed",
  },
});

export const ConfirmButtonOutlined = styled(Button)({
  textTransform: "none",
  color: customTheme.palette.primary.main,
  backgroundColor: customTheme.palette.primary.contrastText,
  borderWidth: "1.5px",
  borderColor: customTheme.palette.primary.main,
  fontFamily: '"Titillium Web", sans-serif',
  fontSize: 14,
  fontWeight: 600,
  height: "40px",
  padding: "16px",
  [`& .${buttonClasses.endIcon} > *:nth-of-type(1)`]: {
    fontSize: "16px",
  },
  ":hover": {
    backgroundColor: "#A7D2FB",
    borderColor: "#A7D2FB",
  },
  "&.show": {
    backgroundColor: "#A7D2FB",
    borderColor: "#A7D2FB",
  },
});

export const ConfirmButtonText = styled(Button)({
  textTransform: "none",
  color: customTheme.palette.primary.main,
  fontFamily: '"Titillium Web", sans-serif',
  fontSize: 14,
  fontWeight: 600,
  height: "40px",
  padding: "16px",
  [`& .${buttonClasses.endIcon} > *:nth-of-type(1)`]: {
    fontSize: "16px",
  },
  ":hover": {
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: customTheme.palette.text.primary,
    textDecoration: "underline",
  },
  "&.Mui-disabled": {
    color: customTheme.palette.text.primary,
  },
  "&.show": {
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: customTheme.palette.text.primary,
    textDecoration: "underline",
  },
});

export const MapButton = styled(ListItemButton)({
  justifyContent: "space-between",
  alignItems: "center",
  display: "flex",
  width: "100%",
  borderRadius: "0px",
  borderBottom: `1px solid ${theme.palette.secondary.main}`,
  textTransform: "none",
  color: customTheme.palette.text.primary,
  fontFamily: '"Titillium Web", sans-serif',
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: "white !important",
  height: "40px",
  ".Mui-selected": {
    borderBottom: `2px solid ${customTheme.palette.text.primary}`,
    color: customTheme.palette.primary.main,
  },
  ":hover": {
    backgroundColor: "white",
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    color: customTheme.palette.primary.main,
  },
  ":focus": {
    backgroundColor: "white",
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    color: customTheme.palette.primary.main,
  },
});

// import SearchIcon from "@mui/icons-material/Search";

export function SearchButton() {
  return (
    <ConfirmButtonOutlined disableTouchRipple variant="outlined" type="submit">
      Applica filtri
    </ConfirmButtonOutlined>
  );
}

export function RedirectButton({
  textButton,
  url,
  location,
}: NavigationButtonProps) {
  const navigate = useNavigate();
  return (
    <ConfirmButton
      disableTouchRipple
      color="primary"
      onClick={() => navigate(url, { state: { from: location.pathname } })}
    >
      {textButton}
    </ConfirmButton>
  );
}

export function IconButton({
  label,
  iconButton,
  url,
  location,
}: TagButtonProps) {
  const navigate = useNavigate();
  return (
    <Tooltip title={label}>
      <IconButtonMui
        sx={{ color: customTheme.palette.primary.dark }}
        onClick={() => navigate(url, { state: { from: location.pathname } })}
      >
        {" "}
        {iconButton}{" "}
      </IconButtonMui>
    </Tooltip>
  );
}

export function ResetButton({
  handleReset,
  label,
}: Readonly<{
  handleReset: MouseEventHandler<HTMLButtonElement>;
  label?: string;
}>) {
  return (
    <ConfirmButtonText disableTouchRipple variant="text" onClick={handleReset}>
      {label ?? "Pulisci campi"}
    </ConfirmButtonText>
  );
}

export function BackButton({ prevUrl, variant, textButton }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      {variant === "outlined" ? (
        <ConfirmButtonOutlined
          disableTouchRipple
          variant="outlined"
          onClick={() =>
            navigate(prevUrl, { state: { from: location.pathname } })
          }
        >
          {textButton ?? "Torna indietro"}
        </ConfirmButtonOutlined>
      ) : (
        <ConfirmButtonText
          disableTouchRipple
          variant="text"
          onClick={() =>
            navigate(prevUrl, { state: { from: location.pathname } })
          }
        >
          {textButton ?? "Torna indietro"}
        </ConfirmButtonText>
      )}
    </>
  );
}

export function BackForm({ onClick, textButton }: Readonly<FormProps>) {
  return (
    <ConfirmButtonOutlined
      disableTouchRipple
      variant="outlined"
      onClick={onClick}
    >
      {textButton}
    </ConfirmButtonOutlined>
  );
}

export function SubmitFormButton({
  onClick,
  textButton,
  disabled,
  iconButton,
}: Readonly<FormProps>) {
  return (
    <ConfirmButton
      disableTouchRipple
      color="primary"
      disabled={disabled}
      onClick={onClick}
      startIcon={iconButton}
    >
      {textButton}
    </ConfirmButton>
  );
}

/*export function AddFieldButton({
  onClick,
  textButton,
}: Readonly<AddFieldButtonProps>) {
  return (
    <ConfirmButtonOutlined
      disableTouchRipple
      variant="outlined"
      onClick={onClick}
    >
      Aggiungi {textButton}
    </ConfirmButtonOutlined>
  );
}*/

export function AddFieldButton({
  onClick,
  textButton,
}: Readonly<AddFieldButtonProps>) {
  const isString = typeof textButton === "string";

  return (
    <ConfirmButtonOutlined
      disableTouchRipple
      variant="outlined"
      onClick={onClick}
    >
      {isString ? `Aggiungi ${textButton}` : textButton}
    </ConfirmButtonOutlined>
  );
}


export function DropdownButton({
  label,
  actions,
  iconButton,
}: DropDownButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <ConfirmButtonText
        disableTouchRipple
        variant="text"
        onClick={handleClick}
        endIcon={iconButton}
        aria-controls={anchorEl ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
      >
        {label}
      </ConfirmButtonText>
      {dropdownMenu(anchorEl, handleClose, actions)}
    </>
  );
}

export function DropdownTableButton({
  label,
  actions,
  iconButton,
}: DropDownButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ConfirmButtonOutlined
        disableTouchRipple
        variant="outlined"
        onClick={handleClick}
        endIcon={iconButton}
        aria-controls={anchorEl ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
      >
        {label}
      </ConfirmButtonOutlined>
      {dropdownMenu(anchorEl, handleClose, actions)}
    </>
  );
}

const dropdownMenu = (
  anchorEl: HTMLElement | null,
  handleClose: () => void,
  actions: Action[]
) => (
  <Menu
    id="dropdown-menu"
    anchorEl={anchorEl}
    open={!!anchorEl}
    onClose={handleClose}
    slotProps={{
      paper: {
        sx: {
          color: customTheme.palette.primary.main,
          fontWeight: "600",
          minWidth: 300,
        },
      },
    }}
    sx={{ zIndex: 3000 }}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
  >
    {actions.map((action, index) => (
      <MenuItem
        sx={{ font: theme.typography.body2, fontWeight: "600" }}
        key={index}
        onClick={() => {
          handleClose();
          action.onClick();
        }}
      >
        {action.label}
      </MenuItem>
    ))}
  </Menu>
);
