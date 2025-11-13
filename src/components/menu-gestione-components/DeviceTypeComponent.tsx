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
import { API } from "../../mock/mock/api/endpoints";
import type { DeviceType } from "../../types/types";


function DeviceTypeComponent() {
  const [allTypes, setAllTypes] = useState<DeviceType[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newType, setNewType] = useState({ ID: "", descrizione: "" });

  const [searchCriteria, setSearchCriteria] = useState({
    ID: "",
    descrizione: "",
  });

  const [showList, setShowList] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTypeId, setMenuTypeId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [isFiltered, setIsFiltered] = useState(false);
  const paginatedTypes = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredTypes.slice(start, end);
  }, [filteredTypes, page, rowsPerPage]);
   const displayTypes = (() => {
    const source = isFiltered ? filteredTypes : allTypes;
    return Array.isArray(source) ? source : [];
  })();

  async function getDeviceTypeData() {
    setLoading(true);
    try {
      const response = await axios.get(API.deviceTypes.list);
      const data = response.data || [];
      setAllTypes(data);
      setFilteredTypes(data);
      setIsFiltered(false);
    } catch (error) {
      console.error("Errore nel fetch:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDeviceTypeData();
  }, []);

  async function handleSave() {
    if (!newType.ID?.trim() || !newType.descrizione?.trim()) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }

    try {
      if (editMode) {
        await axios.put(API.deviceTypes.update.replace(":id", String(selectedId)), newType);
      } else {
        await axios.post(API.deviceTypes.create, newType);
      }
      await getDeviceTypeData();
      closeAddDialog();
    } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Errore durante il salvataggio.");
    }
  }

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setEditMode(false);
    setSelectedId(null);
    setNewType({ ID: "", descrizione: "" });
  };

  const handleDeleteClick = (id: number) => {
    setTypeToDelete(id);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!typeToDelete) return;

    setDeleting(true);
    try {
      const url = API.deviceTypes.delete.replace(":id", String(typeToDelete));
      await axios.delete(url);
      await getDeviceTypeData();
      setShowList(true);
    } catch (error) {
      console.error("Errore cancellazione:", error);
      alert("Errore durante l'eliminazione del tipo.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setTypeToDelete(null);
    }
  };

  function handleEdit(type: DeviceType) {
    setEditMode(true);
    setSelectedId(type.id);
    setNewType({ ID: type.id.toString(), descrizione: type.descrizione });
    setOpenAddDialog(true);
    handleMenuClose();
  }

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: number
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuTypeId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTypeId(null);
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    const type = allTypes.find((t) => t.id === menuTypeId);
    if (!type) return;
    if (action === "edit") handleEdit(type);
    else if (action === "delete") handleDeleteClick(type.id);
  };

  const applySearch = () => {
    let results = [...allTypes];

    if (searchCriteria.ID) {
      results = results.filter((t) =>
        t.id.toString().includes(searchCriteria.ID.trim())
      );
    }
    if (searchCriteria.descrizione) {
      const term = searchCriteria.descrizione.trim().toLowerCase();
      results = results.filter((t) =>
        t.descrizione.toLowerCase().includes(term)
      );
    }

    setFilteredTypes(results);
    setIsFiltered(true);
    setShowList(true);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchCriteria({ ID: "", descrizione: "" });
    setFilteredTypes(allTypes);
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
          Cerca Tipi{" "}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setEditMode(false);
            setNewType({ ID: "", descrizione: "" });
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
          Aggiungi Tipo
        </Button>
      </Box>

      {/* Filtri */}
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

          <Box sx={{ flex: 1, minWidth: 200 }}>
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
                {displayTypes.length === 1
                  ? "1 dispositivo"
                  : `${displayTypes.length} dispositivi`}
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
            {paginatedTypes.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                <Typography>Nessun modello trovato.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "var(--table-head)" }}>
                      <TableCell sx={{ width: "20%", fontWeight: "bold" }}>
                        ID
                      </TableCell>
                      <TableCell sx={{ width: "65%", fontWeight: "bold" }}>
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
                    {paginatedTypes.map((t) => (
                      <TableRow
                        key={t.id}
                        hover
                        sx={{
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <TableCell sx={{ color: "var(--neutro-600)" }}>
                          {t.id}
                        </TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>
                          {t.descrizione}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderLeft: "1px solid var(--neutro-200)" }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => handleMenuClick(e, t.id)}
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
              count={Math.ceil(filteredTypes.length / rowsPerPage)}
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

      {/* Menu Azioni */}
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
          {editMode ? "Modifica Tipo" : "Aggiungi Nuovo Tipo"}
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
            <TextField  className="textFieldInput"
              fullWidth
              size="small"
              value={newType.ID}
              onChange={(e) => setNewType({ ...newType, ID: e.target.value })}
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
              Descrizione *
            </Typography>
            <TextField className="textFieldInput"
              fullWidth
              size="small"
              value={newType.descrizione}
              onChange={(e) =>
                setNewType({ ...newType, descrizione: e.target.value })
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
            Sei sicuro di voler eliminare questo tipo di dispositivo?
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

export default DeviceTypeComponent;
