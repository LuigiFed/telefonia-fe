import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  InputAdornment,
  Collapse,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  CircularProgress,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import "../../theme/default/MenuGestioneComponents.css";
import "../../theme/default/InputFields.css";
import axios from "axios";
import type { DeviceStatus } from "../../types/types";
import { API } from "../../mock/mock/api/endpoints";


function DeviceStatusComponent() {
  const [allStatuses, setAllStatuses] = useState<DeviceStatus[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<DeviceStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState({
    ID: "",
    descrizione: "",
    alias: "",
  });

  const [searchCriteria, setSearchCriteria] = useState({
    ID: "",
    descrizione: "",
    alias: "",
  });

  const [showList, setShowList] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuStatusId, setMenuStatusId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [isFiltered, setIsFiltered] = useState(false);

  const paginatedStatuses = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStatuses.slice(start, end);
  }, [filteredStatuses, page, rowsPerPage]);
    const displayStatuses = (() => {
    const source = isFiltered ? filteredStatuses : allStatuses;
    return Array.isArray(source) ? source : [];
  })();

  async function getStatusData() {
    setLoading(true);
    try {
      const res = await axios.get(API.deviceStatuses.list);
      const data = res.data || [];
      setAllStatuses(data);
      setFilteredStatuses(data);
      setIsFiltered(false);
    } catch (err) {
      console.error("Errore fetch:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStatusData();
  }, []);

  async function handleSave() {
    if (
      !newStatus.ID?.trim() ||
      !newStatus.descrizione?.trim() ||
      !newStatus.alias?.trim()
    ) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }

   try {
  if (editMode) {
       await axios.put(API.deviceStatuses.update.replace(":id", String(selectedId)),
      {
        codice: newStatus.ID,
        descrizione: newStatus.descrizione,
        alias: newStatus.alias,
      }
    );
  } else {
    await axios.post(API.deviceStatuses.create, {
      codice: newStatus.ID,
      descrizione: newStatus.descrizione,
      alias: newStatus.alias,
    });
  }
      await getStatusData();
      closeAddDialog();
    } catch (err) {
      console.error("Errore salvataggio:", err);
      alert("Errore durante il salvataggio.");
    }
  }

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setEditMode(false);
    setSelectedId(null);
    setNewStatus({ ID: "", descrizione: "", alias: "" });
  };

  const handleDeleteClick = (id: number) => {
    setStatusToDelete(id);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!statusToDelete) return;

    setDeleting(true);
    try {
       const url = API.deviceStatuses.delete.replace(":id", String(statusToDelete));
    await axios.delete(url);
      await getStatusData();
      setShowList(true);
    } catch (err) {
      console.error("Errore cancellazione:", err);
      alert("Errore durante l'eliminazione dello stato.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setStatusToDelete(null);
    }
  };

  function handleEdit(status: DeviceStatus) {
    setEditMode(true);
    setSelectedId(status.id);
    setNewStatus({
      ID: status.codice,
      descrizione: status.descrizione,
      alias: status.alias,
    });
    setOpenAddDialog(true);
    handleMenuClose();
  }

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: number
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuStatusId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuStatusId(null);
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    const status = allStatuses.find((s) => s.id === menuStatusId);
    if (!status) return;
    if (action === "edit") handleEdit(status);
    else if (action === "delete") handleDeleteClick(status.id);
  };

  const applySearch = () => {
    let results = [...allStatuses];

    if (searchCriteria.ID) {
      results = results.filter((s) =>
        s.codice.toLowerCase().includes(searchCriteria.ID.trim().toLowerCase())
      );
    }
    if (searchCriteria.descrizione) {
      results = results.filter((s) =>
        s.descrizione
          .toLowerCase()
          .includes(searchCriteria.descrizione.trim().toLowerCase())
      );
    }
    if (searchCriteria.alias) {
      results = results.filter((s) =>
        s.alias
          .toLowerCase()
          .includes(searchCriteria.alias.trim().toLowerCase())
      );
    }

    setFilteredStatuses(results);
    setIsFiltered(true);
    setShowList(true);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchCriteria({ ID: "", descrizione: "", alias: "" });
    setFilteredStatuses(allStatuses);
    setIsFiltered(false);
    setShowList(false);
    setPage(1);
  };

  return (
    <section
      className="menu-gestione"
      style={{ marginLeft: 16, marginRight: 16 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" className="title" sx={{ mb: 2 }}>
          {" "}
          Cerca Stati{" "}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setEditMode(false);
            setNewStatus({ ID: "", descrizione: "", alias: "" });
            setOpenAddDialog(true);
          }}
          sx={{
            backgroundColor: "var(--blue-consob-600)",
            "&:hover": { backgroundColor: "var(--blue-consob-800)" },
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Aggiungi Stato
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <Box sx={{ minWidth: 120 }}>
            <Typography
              variant="body2"
              color="var(--neutro-800)"
              sx={{ mb: 0.5, display: "block" }}
            >
              ID
            </Typography>
            <TextField className="textFieldInput"
              size="small"
              value={searchCriteria.ID}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, ID: e.target.value })
              }
              variant="outlined"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  backgroundColor: "var(--neutro-100)",
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 1,
                  },
                },
                "& .MuiInputBase-input": { py: 1 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Typography
              variant="body2"
              color="var(--neutro-800)"
              sx={{ mb: 0.5, display: "block" }}
            >
              Descrizione
            </Typography>
            <TextField className="textFieldInput"
              size="small"
              value={searchCriteria.descrizione}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  descrizione: e.target.value,
                })
              }
              variant="outlined"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  backgroundColor: "var(--neutro-100)",
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 1,
                  },
                },
                "& .MuiInputBase-input": { py: 1 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ minWidth: 120 }}>
            <Typography
              variant="body2"
              color="var(--neutro-800)"
              sx={{ mb: 0.5, display: "block" }}
            >
              Alias
            </Typography>
            <TextField className="textFieldInput"
              size="small"
              value={searchCriteria.alias}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, alias: e.target.value })
              }
              variant="outlined"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  backgroundColor: "var(--neutro-100)",
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 1,
                  },
                },
                "& .MuiInputBase-input": { py: 1 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={applySearch}
              sx={{
                height: 40,
                backgroundColor: "var(--neutro-100)",
                color: "var(--blue-consob-600)",
                borderRadius: 1,
                borderColor: "var(--blue-consob-600)",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "var(--blue-consob-800)",
                  color: "white",
                  borderColor: "var(--blue-consob-800)",
                },
              }}
            >
              Ricerca
            </Button>
            <Button
              onClick={clearSearch}
              sx={{
                height: 40,
                color: "var(--blue-consob-600)",
                borderRadius: 1,
                textTransform: "none",
              }}
            >
              Pulisci Filtri
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" color="var(--neutro-600)" sx={{ mt: 1 }}>
            Caricamento...
          </Typography>
        </Box>
      )}
        {isFiltered && (
             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
               {displayStatuses.length === 1
                 ? "1 dispositivo"
                 : `${displayStatuses.length} dispositivi`}
             </Typography>
           )}
      <Collapse in={showList && !loading} timeout="auto" unmountOnExit>
        <Box sx={{ maxWidth: 900, mx: "auto", px: 2, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {paginatedStatuses.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                <Typography>Nessun modello trovato.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "var(--table-head)" }}>
                      <TableCell sx={{ fontWeight: 600, width: "25%" }}>
                        ID
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, width: "45%" }}>
                        Descrizione
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, width: "25%" }}>
                        Alias
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          textAlign: "center",
                          width: "15%",
                          borderLeft: "1px solid var(--neutro-200)",
                        }}
                      >
                        Azioni
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedStatuses.map((s) => (
                      <TableRow
                        key={s.id}
                        hover
                        sx={{
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <TableCell sx={{ color: "var(--neutro-600)" }}>
                          {s.id}
                        </TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>
                          {s.descrizione}
                        </TableCell>
                          <TableCell sx={{ color: "var(--neutro-600)" }}>
                          {s.alias}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderLeft: "1px solid var(--neutro-200)" }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => handleMenuClick(e, s.id)}
                            endIcon={<MoreVertIcon fontSize="small" />}
                          >
                            Azioni
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={Math.ceil(filteredStatuses.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="small"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>
        </Box>
      </Collapse>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
        }}
      >
        <MenuItem onClick={() => handleMenuAction("edit")}>Modifica</MenuItem>
        <MenuItem
          onClick={() => handleMenuAction("delete")}
          sx={{ color: "error.main" }}
        >
          Elimina
        </MenuItem>
      </Menu>

      {/* Dialog Aggiungi/Modifica */}
      <Dialog
        open={openAddDialog}
        onClose={closeAddDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "var(--blue-consob-600)",
            color: "white",
            textAlign: "center",
          }}
        >
          {editMode ? "Modifica Stato" : "Aggiungi Nuovo Stato"}
        </DialogTitle>
        <DialogContent sx={{ pt: 4, m: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block" }}
            >
              ID *
            </Typography>
            <TextField className="textFieldInput"
              fullWidth
              size="small"
              value={newStatus.ID}
              onChange={(e) =>
                setNewStatus({ ...newStatus, ID: e.target.value })
              }
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "& fieldset": { borderColor: "divider" },
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
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block" }}
            >
              Descrizione *
            </Typography>
            <TextField className="textFieldInput"
              fullWidth
              size="small"
              value={newStatus.descrizione}
              onChange={(e) =>
                setNewStatus({ ...newStatus, descrizione: e.target.value })
              }
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "& fieldset": { borderColor: "divider" },
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
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block" }}
            >
              Alias *
            </Typography>
            <TextField className="textFieldInput"
              fullWidth
              size="small"
              value={newStatus.alias}
              onChange={(e) =>
                setNewStatus({ ...newStatus, alias: e.target.value })
              }
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "& fieldset": { borderColor: "divider" },
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeAddDialog}>Annulla</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "var(--blue-consob-600)",
              "&:hover": { backgroundColor: "var(--blue-consob-800)" },
              borderRadius: 1,
            }}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Eliminazione */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Conferma Eliminazione
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Sei sicuro di voler eliminare questo stato?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Questa azione è <strong>irreversibile</strong>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} disabled={deleting}>
            Annulla
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Eliminazione..." : "Elimina"}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default DeviceStatusComponent;
