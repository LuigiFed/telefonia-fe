import React, { useState, useEffect } from "react";
import {
  Paper,
  CircularProgress,
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
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Pagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import "../../theme/default/MenuGestioneComponents.css";
import "../../theme/default/InputFields.css";
import axios from "axios";
import { API } from "../../mock/mock/api/endpoints";
import type { MobileProvider } from "../../types/types";


function MobileProvidersComponent() {
  const [allProviders, setAllProviders] = useState<MobileProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<MobileProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newProvider, setNewProvider] = useState({ id: "", descrizione: "" });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuProviderId, setMenuProviderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    id: "",
    codice: "",
    descrizione: "",
  });
  const [showList, setShowList] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const paginatedProviders = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredProviders.slice(start, end);
  }, [filteredProviders, page, rowsPerPage]);

  const displayProviders = (() => {
    const source = isFiltered ? filteredProviders : allProviders;
    return Array.isArray(source) ? source : [];
  })();

  async function getProviderData() {
    setLoading(true);
    try {
      const response =  await axios.get(API.mobileProviders.list);
      const data = response.data || [];
      setAllProviders(data);
      setFilteredProviders(data);
      setIsFiltered(false);
    } catch (error) {
      console.error("Errore nel fetch dei provider:", error);
      setIsFiltered(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProviderData();
  }, []);

  async function handleSave() {
    // if (!newProvider.codice?.trim() || !newProvider.descrizione?.trim()) {
    //   alert("Compila tutti i campi obbligatori.");
    //   return;
    // }

    try {
      const payload = {
        //codice: newProvider.codice,
        descrizione: newProvider.descrizione,
      };

      if (editMode && selectedId !== null) {
      await axios.put(API.mobileProviders.update.replace(":id", String(selectedId)),
  payload);
    } else {
      await axios.post(API.mobileProviders.create, payload);
    }

      await getProviderData();
      closeAddDialog();
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
      alert("Errore durante il salvataggio del provider.");
    }
  }

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setEditMode(false);
    setSelectedId(null);
    setNewProvider({ id: "", descrizione: "" });
  };

  const handleDeleteClick = (id: number) => {
    setProviderToDelete(id);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!providerToDelete) return;

    setDeleting(true);
    try {
    const url = API.mobileProviders.delete.replace(":id", String(providerToDelete));
    await axios.delete(url);
      await getProviderData();
      setShowList(true);
    } catch (error) {
      console.error("Errore nella cancellazione:", error);
      alert("Errore durante l'eliminazione del modello.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setProviderToDelete(null);
    }
  };

  function handleEdit(provider: MobileProvider) {
    setEditMode(true);
    setSelectedId(provider.id);
    setNewProvider({
      id: provider.id.toString(),
    //  codice: provider.codice,
      descrizione: provider.descrizione,
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
    setMenuProviderId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProviderId(null);
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    const provider = allProviders.find((p) => p.id === menuProviderId);
    if (!provider) return;
    if (action === "edit") handleEdit(provider);
    else if (action === "delete") handleDeleteClick(provider.id);
  };

  const applySearch = () => {
    let results = [...allProviders];

    if (searchCriteria.id) {
      results = results.filter((p) =>
        p.id.toString().includes(searchCriteria.id.trim())
      );
    }
    if (searchCriteria.codice) {
      results = results.filter((p) =>
        p.codice.toLowerCase().includes(searchCriteria.codice.trim().toLowerCase())
      );
    }
    if (searchCriteria.descrizione) {
      const term = searchCriteria.descrizione.trim().toLowerCase();
      results = results.filter((p) =>
        p.descrizione.toLowerCase().includes(term)
      );
    }

    setFilteredProviders(results);
    setIsFiltered(true);
    setShowList(true);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchCriteria({ id: "", codice: "", descrizione: "" });
    setFilteredProviders(allProviders);
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
        className="header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" className="title" sx={{ mb: 2 }}>
          Cerca Provider Mobile
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={() => {
              setEditMode(false);
              setNewProvider({ id: "", descrizione: "" });
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
            Aggiungi Nuovo Provider
          </Button>
        </Box>
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
          <Box sx={{ minWidth: 100 }}>
            <Typography
              variant="body2"
              color="var(--neutro-800)"
              sx={{ mb: 0.5, display: "block" }}
            >
              ID
            </Typography>
            <TextField
              className="textFieldInput"
              size="small"
              value={searchCriteria.id}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, id: e.target.value })
              }
              variant="outlined"
              sx={{
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
          
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography
              variant="body2"
              color="var(--neutro-800)"
              sx={{ mb: 0.5, display: "block" }}
            >
              Descrizione
            </Typography>
            <TextField
              className="textFieldInput"
              size="small"
              value={searchCriteria.descrizione}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  descrizione: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
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

      {loading && (
        <Box className="loading-container" sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" color="var(--neutro-600)" sx={{ mt: 2 }}>
            Caricamento...
          </Typography>
        </Box>
      )}

      {isFiltered && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {displayProviders.length === 1
            ? "1 provider trovato"
            : `${displayProviders.length} provider trovati`}
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
            {paginatedProviders.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                <Typography>Nessun provider trovato.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "var(--table-head)" }}>
                      <TableCell sx={{ width: "15%", fontWeight: "bold" }}>
                        ID
                      </TableCell>
          
                      <TableCell sx={{ width: "50%", fontWeight: "bold" }}>
                        Descrizione
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
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
                    {paginatedProviders.map((p) => (
                      <TableRow
                        key={p.id}
                        hover
                        sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                      >
                        <TableCell sx={{ color: "var(--neutro-600)" }}>
                          {p.id}
                        </TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>
                          {p.descrizione}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderLeft: "1px solid var(--neutro-200)" }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => handleMenuClick(e, p.id)}
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
              count={Math.ceil(filteredProviders.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="small"
              showFirstButton
              showLastButton
              sx={{ "& .MuiPaginationItem-root": { borderRadius: "8px" } }}
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
          {editMode ? "Modifica Provider" : "Aggiungi Nuovo Provider"}
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
            <TextField
              className="textFieldInput"
              fullWidth
              value={newProvider.id}
              onChange={(e) =>
                setNewProvider({ ...newProvider, id: e.target.value })
              }
              disabled={editMode}
              variant="outlined"
              size="small"
              helperText={editMode ? "Il ID non può essere modificato" : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: editMode ? "action.disabled" : "divider",
                  },
                },
              }}
            />
          </Box>

      

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block" }}
            >
              Descrizione *
            </Typography>
            <TextField
              className="textFieldInput"
              fullWidth
              value={newProvider.descrizione}
              onChange={(e) =>
                setNewProvider({ ...newProvider, descrizione: e.target.value })
              }
              variant="outlined"
              size="small"
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
            }}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Conferma Eliminazione</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Sei sicuro di voler eliminare questo provider?
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

export default MobileProvidersComponent;