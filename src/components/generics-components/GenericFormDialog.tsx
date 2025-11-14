import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";

interface FormField {
  label: string;
  type?: "text" | "date" | "textarea" | "select" | "autocomplete" | "custom";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  helperText?: string;
  
}

interface GenericFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onSave: () => void;
  editMode: boolean;
}

export const GenericFormDialog = ({
  open,
  onClose,
  title,
  fields,
  onSave,
}: GenericFormDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle
      sx={{
        backgroundColor: "var(--blue-consob-600)",
        color: "white",
        textAlign: "center",
      }}
    >
      {title}
    </DialogTitle>
    <DialogContent sx={{ pt: 4, m: 2 }}>
      {fields.map((field, index) => (
        <Box key={index} sx={{ mb: index < fields.length - 1 ? 2 : 0 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, display: "block" }}
          >
            {field.label} *
          </Typography>
          <TextField
            className="textFieldInput"
            fullWidth
            size="small"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            disabled={field.disabled}
            helperText={field.helperText}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "& fieldset": {
                  borderColor: field.disabled ? "action.disabled" : "divider",
                },
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  borderWidth: 1,
                },
              },
              "& .MuiInputBase-input": { py: 1 },
            }}
          />
        </Box>
      ))}
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button onClick={onClose}>Annulla</Button>
      <Button
        onClick={onSave}
        variant="contained"
        sx={{
          backgroundColor: "var(--blue-consob-600)",
          "&:hover": { backgroundColor: "var(--blue-consob-800)" },
        }}
      >
        Salva
      </Button>
    </DialogActions>
  </Dialog>
);