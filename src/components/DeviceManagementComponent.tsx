import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axios, { AxiosError } from "axios";
import type {
  DeviceFormManagement,
  DeviceManagement,
  DeviceModel,
  Reference,
} from "../types/types";
import { API } from "../mock/mock/api/endpoints";

function DeviceManagementComponent() {
  const [devices, setDevices] = useState<DeviceManagement[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceManagement[]>(
    []
  );
  const [isFiltered, setIsFiltered] = useState(false);

  const [newElement, setNew] = useState<DeviceFormManagement>({
    id:  null, 
    asset: "",
    email: "",
    tipo: "",
    modello: "",
    numeroTelefono: "",
    sede: "",
    idInventario: "",
    fornitore: "",
    gestore: "",
    note: "",
    inizio: "",
    servizio: "",
  });

  const [deviceTypes, setDeviceTypes] = useState<Reference[]>([]);
  const [deviceModels, setDeviceModels] = useState<Reference[]>([]);
  const [mobileProviders, setMobileProviders] = useState<Reference[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<
    Partial<DeviceManagement>
  >({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceManagement | null>(
    null
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<DeviceManagement | null>(
    null
  );


  useEffect(() => {
    async function handleReference() {
      try {
        const [types, models, providers, statuses] = await Promise.all([
          axios.get<Reference[]>("/api/device-types"),
          axios.get<DeviceModel[]>("/api/v1/modello/all"),
          axios.get<Reference[]>("/api/mobile-providers"),
          axios.get<Reference[]>("/api/device-statuses"),
        ]);

        setDeviceTypes(types.data);
        const mappedModels: Reference[] = models.data.map((m) => ({
          id: m.id,
          descrizione: m.desModello,
        }));
        setDeviceModels(mappedModels);
        setMobileProviders(providers.data);
        setDeviceStatuses(statuses.data);
      } catch (err) {
        console.error("Errore caricamento dati di riferimento:", err);
      }
    }
    handleReference();
  }, []);

  useEffect(() => {
    console.log("useEffect: avvio handleLoadDevice");
    handleLoadDevice();
  }, []);

  async function handleLoadDevice() {
  try {
    console.log("INIZIO CARICAMENTO DISPOSITIVI...");
    setLoading(true);
    const res = await axios.get(API.deviceManagement.list);
    console.log("RISPOSTA API:", res.data);
    const data = Array.isArray(res.data) ? res.data : [];
    console.log("DATI NORMALIZZATI:", data);
    setDevices(data);
    setFilteredDevices(data);
    setIsFiltered(false);
  } catch (err) {
    console.error("Errore caricamento dispositivi:", err);
    setDevices([]);
    setFilteredDevices([]);
    setIsFiltered(false);
  } finally {
    setLoading(false);
    console.log("FINE CARICAMENTO");
  }
}

  const handleAdd = () => {
    resetForm();
    setOpenForm(true);
  };

  const handleEdit = () => {
    if (!selectedId) return;
    const device = devices.find((d) => d.id === selectedId);
    if (!device) {
      alert("Dispositivo non trovato.");
      handleCloseMenu();
      return;
    }
    setNew({ ...device });
    setOpenForm(true);
    handleCloseMenu();
  };

 async function handleSave() {
  if (!newElement.asset || !newElement.tipo) {
    alert("Compila i campi obbligatori!");
    return;
  }

  try {
    setLoading(true);

    if (newElement.id) {
      // Update
        await axios.put(API.deviceManagement.update.replace(":id", String(selectedId)),
        newElement
      );
    } else {
      // Create
      await axios.post(API.deviceManagement.create, newElement);
    }

    await handleLoadDevice();
    resetForm();
    setOpenForm(false);
    alert("Dispositivo salvato con successo!");
  } catch (err) {
    console.error("Errore salvataggio:", err);
    alert("Errore durante il salvataggio");
  } finally {
    setLoading(false);
  }
}


  function resetForm() {
    setNew({
      id: null,
      asset: "",
      email: "",
      tipo: "",
      modello: "",
      numeroTelefono: "",
      sede: "",
      idInventario: "",
      fornitore: "",
      gestore: "",
      note: "",
      inizio: "",
      servizio: "",
    });
  }

  function handleOpenMenu(e: React.MouseEvent<HTMLButtonElement>, id: number) {
    setAnchorEl(e.currentTarget);
    setSelectedId(id);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
    setSelectedId(null);
  }

  const handleOpenDeleteModal = () => {
    if (!selectedId) return;
    const device = devices.find((d) => d.id === selectedId);
    if (!device) {
      alert("Dispositivo non trovato.");
      handleCloseMenu();
      return;
    }
    setDeviceToDelete(device);
    setDeleteModalOpen(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;
    setDeleting(true);
    try {
       const url = API.deviceManagement.delete.replace(":id", String(deviceToDelete.id));
      await axios.delete(url);
      const id = deviceToDelete.id;

      setDevices((prev) => prev.filter((d) => d.id !== id));
      if (isFiltered) {
        setFilteredDevices((prev) => prev.filter((d) => d.id !== id));
      }

      alert(`Dispositivo "${deviceToDelete.asset}" eliminato con successo!`);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      let errorMsg = "Errore durante l'eliminazione.";
      if (axiosErr.response?.data?.message)
        errorMsg += `\nDettaglio: ${axiosErr.response.data.message}`;
      else if (axiosErr.response?.status === 404)
        errorMsg += "\nDispositivo non trovato sul server.";
      alert(errorMsg);
      await handleLoadDevice();
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeviceToDelete(null);
    }
  };

const handleApplySearch = () => {
  console.log("APPLY SEARCH - criteria:", searchCriteria);
  console.log("APPLY SEARCH - base devices:", devices.length);

  const base = displayDevices.length > 0 ? displayDevices : devices;
  let temp: DeviceManagement[] = [...base];

  const sc = searchCriteria;

  if ((sc.asset ?? "").trim()) {
    const val = (sc.asset ?? "").trim().toLowerCase();
    temp = temp.filter(d => d.asset.toLowerCase().includes(val));
  }
  if ((sc.email ?? "").trim()) {
    const val = (sc.email ?? "").trim().toLowerCase();
    temp = temp.filter(d => d.email?.toLowerCase().includes(val));
  }
  if ((sc.numeroTelefono ?? "").trim()) {
    temp = temp.filter(d => d.numeroTelefono?.includes((sc.numeroTelefono ?? "").trim()));
  }
  if ((sc.sede ?? "").trim()) {
    const val = (sc.sede ?? "").trim().toLowerCase();
    temp = temp.filter(d => d.sede?.toLowerCase().includes(val));
  }
  if ((sc.idInventario ?? "").trim()) {
    const val = (sc.idInventario ?? "").trim().toLowerCase();
    temp = temp.filter(d => d.idInventario?.toLowerCase().includes(val));
  }
  if ((sc.fornitore ?? "").trim()) {
    const val = (sc.fornitore ?? "").trim().toLowerCase();
    temp = temp.filter(d => d.fornitore?.toLowerCase().includes(val));
  }
  if ((sc.note ?? "").trim()) {
    const val = (sc.note ?? "").trim().toLowerCase();
    temp = temp.filter(d => (d.note || "").toLowerCase().includes(val));
  }
  if (sc.inizio) temp = temp.filter(d => d.inizio === sc.inizio);
  if (sc.tipo) temp = temp.filter(d => d.tipo === sc.tipo);
  if (sc.modello) temp = temp.filter(d => d.modello === sc.modello);
  if (sc.gestore) temp = temp.filter(d => d.gestore === sc.gestore);
  if (sc.servizio) temp = temp.filter(d => d.servizio === sc.servizio);

  console.log("APPLY SEARCH - result:", temp.length);

  setFilteredDevices(temp);
  setIsFiltered(temp.length < devices.length);
  setOpenSearch(false);
};

  const handleClearFilters = () => {
    setSearchCriteria({});
    setFilteredDevices(devices);
    setIsFiltered(false);
  };

  const handleRowClick = (device: DeviceManagement) => {
    setSelectedDevice(device);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedDevice(null);
  };

  const displayDevices = (() => {
    const source = isFiltered ? filteredDevices : devices;
    return Array.isArray(source) ? source : [];
  })();

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto", position: "relative" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Gestione Dispositivi Telefonia Mobile
      </Typography>

      <Paper sx={{ p: 3, overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Elenco Dispositivi
          </Typography>
          <Box>
            <Button
              startIcon={<SearchIcon />}
              onClick={() => {
                setSearchCriteria({}); 
                setOpenSearch(true);
              }}
              sx={{
                backgroundColor: "var(--blue-consob-600)",
                color: "white",
                "&:hover": { backgroundColor: "var(--blue-consob-800)" },
              }}
            >
              Ricerca
            </Button>
            {isFiltered && (
              <Button sx={{ ml: 1 }} onClick={handleClearFilters}>
                Pulisci
              </Button>
            )}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {displayDevices.length === 1
            ? "1 dispositivo"
            : `${displayDevices.length} dispositivi`}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : displayDevices.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 2 }}>
            {isFiltered
              ? "Nessun dispositivo corrisponde ai criteri di ricerca."
              : "Nessun dispositivo trovato."}
          </Typography>
        ) : (
          <TableContainer sx={{ maxHeight: "calc(100vh - 280px)" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow  sx={{ "& .MuiTableCell-root": { width: "2%" } }}>
                  <TableCell>
                    <strong>Asset</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tipo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Modello</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Telefono</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Gestore</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Azioni</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody    sx={{ "& .MuiTableCell-root": { fontWeight: "normal" } }}>
                {displayDevices.map((d) => (
                  <TableRow
                    key={d.id!}
                    hover
                    onClick={() => handleRowClick(d)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{d.asset}</TableCell>
                    <TableCell>{d.tipo}</TableCell>
                    <TableCell>{d.modello}</TableCell>
                    <TableCell>{d.numeroTelefono || "—"}</TableCell>
                    <TableCell>{d.gestore}</TableCell>
                    <TableCell
                      align="center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMenu(e, d.id!);
                        }}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

  
      <Dialog
        open={detailOpen}
        onClose={handleCloseDetail}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Dettagli Dispositivo: <strong>{selectedDevice?.asset}</strong>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDevice && (
            <Box sx={{ display: "grid", gap: 2, fontSize: "0.975rem" }}>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Email
                </Typography>
                <Typography fontWeight={500}>
                  {selectedDevice.email || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Tipo
                </Typography>
                <Typography fontWeight={500}>{selectedDevice.tipo}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Modello
                </Typography>
                <Typography fontWeight={500}>
                  {selectedDevice.modello}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Numero Telefono
                </Typography>
                <Typography fontWeight={500}>
                  {selectedDevice.numeroTelefono || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Sede
                </Typography>
                <Typography fontWeight={500}>
                  {selectedDevice.sede || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  ID Inventario
                </Typography>
                <Typography fontWeight={500}>
                  {selectedDevice.idInventario || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Fornitore
                </Typography>
                <Typography fontWeight={500}>
                  {selectedDevice.fornitore || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Gestore
                </Typography>
                <Typography fontWeight={500}>
                  {selectedDevice.gestore}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Servizio
                </Typography>
                <Typography fontWeight={500}>
                  {selectedDevice.servizio || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Data Inizio
                </Typography>
                <Typography fontWeight={500}>
                  {selectedDevice.inizio || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize="0.875rem">
                  Note
                </Typography>
                <Typography fontWeight={500} sx={{ whiteSpace: "pre-wrap" }}>
                  {selectedDevice.note || "—"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Chiudi</Button>
        </DialogActions>
      </Dialog>

      {/* FAB AGGIUNGI */}
      <Fab
        color="primary"
        aria-label="aggiungi"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "var(--blue-consob-600)",
          "&:hover": { backgroundColor: "var(--blue-consob-800)" },
        }}
        onClick={handleAdd}
      >
        <AddIcon />
      </Fab>

      {/* MENU AZIONI */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
        }}
      >
        <MenuItem onClick={handleEdit}>Modifica</MenuItem>
        <MenuItem onClick={handleOpenDeleteModal} sx={{ color: "error.main" }}>
          Elimina
        </MenuItem>
      </Menu>

      {/* MODALE FORM (Aggiungi/Modifica) */}
      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          resetForm();
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {newElement.id
            ? "Modifica Dispositivo"
            : "Aggiungi Nuovo Dispositivo"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1.5} sx={{ mt: 1 }}>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Asset *"
                fullWidth
                value={newElement.asset}
                onChange={(e) =>
                  setNew({ ...newElement, asset: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                select
                label="Tipo Dispositivo *"
                fullWidth
                value={newElement.tipo}
                onChange={(e) =>
                  setNew({ ...newElement, tipo: e.target.value })
                }
              >
                {deviceTypes.map((t) => (
                  <MenuItem key={t.id} value={t.descrizione}>
                    {t.descrizione}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                select
                label="Modello"
                fullWidth
                value={newElement.modello}
                onChange={(e) =>
                  setNew({ ...newElement, modello: e.target.value })
                }
              >
                {deviceModels.map((m) => (
                  <MenuItem key={m.id} value={m.descrizione}>
                    {m.descrizione}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Email"
                fullWidth
                value={newElement.email}
                onChange={(e) =>
                  setNew({ ...newElement, email: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Numero di Telefono"
                fullWidth
                value={newElement.numeroTelefono}
                onChange={(e) =>
                  setNew({ ...newElement, numeroTelefono: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Sede"
                fullWidth
                value={newElement.sede}
                onChange={(e) =>
                  setNew({ ...newElement, sede: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="ID Inventario"
                fullWidth
                value={newElement.idInventario}
                onChange={(e) =>
                  setNew({ ...newElement, idInventario: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Fornitore"
                fullWidth
                value={newElement.fornitore}
                onChange={(e) =>
                  setNew({ ...newElement, fornitore: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                select
                label="Gestore"
                fullWidth
                value={newElement.gestore}
                onChange={(e) =>
                  setNew({ ...newElement, gestore: e.target.value })
                }
              >
                {mobileProviders.map((p) => (
                  <MenuItem key={p.id} value={p.descrizione}>
                    {p.descrizione}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                select
                label="Servizio"
                fullWidth
                value={newElement.servizio}
                onChange={(e) =>
                  setNew({ ...newElement, servizio: e.target.value })
                }
              >
                {deviceStatuses.map((s) => (
                  <MenuItem key={s.id} value={s.descrizione}>
                    {s.descrizione}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Data Inizio"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newElement.inizio}
                onChange={(e) =>
                  setNew({ ...newElement, inizio: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Note"
                fullWidth
                multiline
                rows={2}
                value={newElement.note}
                onChange={(e) =>
                  setNew({ ...newElement, note: e.target.value })
                }
              />
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenForm(false);
              resetForm();
            }}
            disabled={loading}
          >
            Annulla
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              backgroundColor: "var(--blue-consob-600)",
              "&:hover": { backgroundColor: "var(--blue-consob-800)" },
            }}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODALE RICERCA */}
      <Dialog
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Ricerca Avanzata</DialogTitle>
        <DialogContent>
          <Grid container spacing={1.5} sx={{ mt: 1 }}>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Asset"
                fullWidth
                value={searchCriteria.asset || ""}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    asset: e.target.value,
                  })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                select
                label="Tipo Dispositivo"
                fullWidth
                value={searchCriteria.tipo || ""}
                onChange={(e) =>
                  setSearchCriteria({ ...searchCriteria, tipo: e.target.value })
                }
              >
                <MenuItem value="">
                  <em>Tutti</em>
                </MenuItem>
                {deviceTypes.map((t) => (
                  <MenuItem key={t.id} value={t.descrizione}>
                    {t.descrizione}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                select
                label="Modello"
                fullWidth
                value={searchCriteria.modello || ""}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    modello: e.target.value,
                  })
                }
              >
                <MenuItem value="">
                  <em>Tutti</em>
                </MenuItem>
                {deviceModels.map((m) => (
                  <MenuItem key={m.id} value={m.descrizione}>
                    {m.descrizione}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Email"
                fullWidth
                value={searchCriteria.email || ""}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    email: e.target.value,
                  })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Numero di Telefono"
                fullWidth
                value={searchCriteria.numeroTelefono || ""}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    numeroTelefono: e.target.value,
                  })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Sede"
                fullWidth
                value={searchCriteria.sede || ""}
                onChange={(e) =>
                  setSearchCriteria({ ...searchCriteria, sede: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="ID Inventario"
                fullWidth
                value={searchCriteria.idInventario || ""}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    idInventario: e.target.value,
                  })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Fornitore"
                fullWidth
                value={searchCriteria.fornitore || ""}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    fornitore: e.target.value,
                  })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                select
                label="Gestore"
                fullWidth
                value={searchCriteria.gestore || ""}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    gestore: e.target.value,
                  })
                }
              >
                <MenuItem value="">
                  <em>Tutti</em>
                </MenuItem>
                {mobileProviders.map((p) => (
                  <MenuItem key={p.id} value={p.descrizione}>
                    {p.descrizione}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                select
                label="Servizio"
                fullWidth
                value={searchCriteria.servizio || ""}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    servizio: e.target.value,
                  })
                }
              >
                <MenuItem value="">
                  <em>Tutti</em>
                </MenuItem>
                {deviceStatuses.map((s) => (
                  <MenuItem key={s.id} value={s.descrizione}>
                    {s.descrizione}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Data Inizio"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={searchCriteria.inizio || ""}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    inizio: e.target.value,
                  })
                }
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 0.75 }}>
              <TextField
                label="Note"
                fullWidth
                multiline
                rows={2}
                value={searchCriteria.note || ""}
                onChange={(e) =>
                  setSearchCriteria({ ...searchCriteria, note: e.target.value })
                }
              />
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchCriteria({})}>Pulisci</Button>
          <Button onClick={() => setOpenSearch(false)}>Chiudi</Button>
          <Button
            variant="contained"
            onClick={handleApplySearch}
            sx={{
              backgroundColor: "var(--blue-consob-600)",
              "&:hover": { backgroundColor: "var(--blue-consob-800)" },
            }}
          >
            Applica Filtro
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODALE CONFERMA ELIMINAZIONE */}
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
            Sei sicuro di voler eliminare il dispositivo{" "}
            <strong>{deviceToDelete?.asset}</strong>?
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
    </Box>
  );
};

export default DeviceManagementComponent;
