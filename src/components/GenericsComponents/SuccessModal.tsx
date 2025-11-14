import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
export const SuccessModal = ({
  open,
  onClose,
  message,
}: {
  open: boolean;
  onClose: () => void;
  message: string;
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogContent sx={{ textAlign: "center", py: 4 }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          bgcolor: "success.light",
          color: "success.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Operazione completata
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
      <Button
        onClick={onClose}
        variant="contained"
        sx={{
          minWidth: 120,
          backgroundColor: "var(--blue-consob-600)",
          "&:hover": { backgroundColor: "var(--blue-consob-800)" },
        }}
      >
        Chiudi
      </Button>
    </DialogActions>
  </Dialog>
);