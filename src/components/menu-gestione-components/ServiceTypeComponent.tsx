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
import type { ServiceType } from "../../types/types";
import { API } from "../../mock/mock/api/endpoints";

function ServiceTypeComponent() {
  const [allServices, setAllServices] = useState<ServiceType[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newService, setNewService] = useState({ id: "", descrizione: "" });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuServiceId, setMenuServiceId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    id: "",
    descrizione: "",
  });
  const [showList, setShowList] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const paginatedServices = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredServices.slice(start, end);
  }, [filteredServices, page, rowsPerPage]);

  const displayServices = (() => {
    const source = isFiltered ? filteredServices : allServices;
    return Array.isArray(source) ? source : [];
  })();

  async function getServiceData() {
    setLoading(true);
    try {
      const response = await axios.get(API.serviceTypes.list);
      const data = response.data || [];
      setAllServices(data);
      setFilteredServices(data);
      setIsFiltered(false);
    } catch (error) {
      console.error("Errore nel fetch:", error);
      setIsFiltered(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getServiceData();
  }, []);

  async function handleSave() {
    if (!newService.descrizione?.trim()) {
      alert("Compila il campo descrizione.");
      return;
    }

    try {
      const payload = { descrizione: newService.descrizione };

      if (editMode && selectedId !== null) {
      await axios.put(API.serviceTypes.update.replace(":id", String(selectedId)),
  payload);
    } else {
      await axios.post(API.serviceTypes.create, payload);
    }


      await getServiceData();
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
    setNewService({ id: "", descrizione: "" });
  };

  const handleDeleteClick = (id: number) => {
    setServiceToDelete(id);
    setDeleteModalOpen(true);
    setDeleteError(null);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    setDeleting(true);
    setDeleteError(null);
    try {
    const url = API.serviceTypes.delete.replace(":id", String(serviceToDelete));
    await axios.delete(url);
      await getServiceData();
      setShowList(true);
    } catch (error) {
      console.error("Errore cancellazione:", error);
      alert("Errore durante l'eliminazione del tipo.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

  function handleEdit(service: ServiceType) {
    setEditMode(true);
    setSelectedId(service.id);
    setNewService({
      id: service.id.toString(),
      descrizione: service.descrizione,
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
    setMenuServiceId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuServiceId(null);
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    const service = allServices.find((d) => d.id === menuServiceId);
    if (!service) return;
    if (action === "edit") handleEdit(service);
    else if (action === "delete") handleDeleteClick(service.id);
  };

  const applySearch = () => {
    let results = [...allServices];

    if (searchCriteria.id) {
      results = results.filter((d) =>
        d.id.toString().includes(searchCriteria.id.trim())
      );
    }
    if (searchCriteria.descrizione) {
      const term = searchCriteria.descrizione.trim().toLowerCase();
      results = results.filter((d) =>
        d.descrizione.toLowerCase().includes(term)
      );
    }
    setFilteredServices(results);
    setIsFiltered(true);
    setShowList(true);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchCriteria({ id: "", descrizione: "" });
    setFilteredServices(allServices);
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
          Cerca Tipi di Servizio
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={() => {
              setEditMode(false);
              setNewService({ id: "", descrizione: "" });
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
            Aggiungi Nuovo Tipo Servizio
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
          <Box sx={{ minWidth: 120 }}>
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
        <Box className="loading-container">
          <CircularProgress color="primary" />
          <Typography variant="body1" color="var(--neutro-600)">
            Caricamento...
          </Typography>
        </Box>
      )}
      {isFiltered && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {displayServices.length === 1
            ? "1 tipo servizio"
            : `${displayServices.length} tipi servizio`}
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
            {paginatedServices.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                <Typography>Nessun tipo servizio trovato.</Typography>
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
                    {paginatedServices.map((s) => (
                      <TableRow
                        key={s.id}
                        hover
                        sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                      >
                        <TableCell sx={{ color: "var(--neutro-600)" }}>
                          {s.id}
                        </TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>
                          {s.descrizione}
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
              count={Math.ceil(filteredServices.length / rowsPerPage)}
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
          {editMode ? "Modifica Tipo Servizio" : "Aggiungi Nuovo Tipo Servizio"}
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
              value={newService.id}
              onChange={(e) =>
                setNewService({ ...newService, id: e.target.value })
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
              value={newService.descrizione}
              onChange={(e) =>
                setNewService({ ...newService, descrizione: e.target.value })
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Conferma Eliminazione</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Sei sicuro di voler eliminare questo tipo servizio?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Questa azione è <strong>irreversibile</strong>.
          </Typography>
          {deleteError && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {deleteError}
            </Typography>
          )}
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

export default ServiceTypeComponent;
