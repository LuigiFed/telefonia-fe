import { Box, Typography, Button } from "@mui/material";

interface GenericSearchHeaderProps {
  title: string;
  onAddNew: () => void;
  addButtonLabel: string;
  addButtonDisabled?: boolean;
}

export const GenericSearchHeader = ({title,onAddNew,addButtonLabel,addButtonDisabled = false}: GenericSearchHeaderProps) => (
  <Box sx={{display: "flex",justifyContent: "space-between",alignItems: "center",mb: 3}}>
    <Typography variant="h6" className="title">{title}</Typography>
    <Button variant="contained" onClick={onAddNew} disabled={addButtonDisabled}
      sx={{backgroundColor: "var(--blue-consob-600)", "&:hover": { backgroundColor: "var(--blue-consob-800)" },borderRadius: 1,
        textTransform: "none",fontWeight: 500}}>
      {addButtonLabel}
    </Button>
  </Box>
);