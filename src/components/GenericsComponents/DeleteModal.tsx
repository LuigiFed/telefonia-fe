import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  deleting,
  itemName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
  itemName: string;
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Conferma Eliminazione
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body1">
        Sei sicuro di voler eliminare questo {itemName}?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Questa azione è <strong>irreversibile</strong>.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={deleting}>
        Annulla
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={onConfirm}
        disabled={deleting}
      >
        {deleting ? "Eliminazione..." : "Elimina"}
      </Button>
    </DialogActions>
  </Dialog>
);