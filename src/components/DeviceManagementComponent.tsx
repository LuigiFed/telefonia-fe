import { useState, useEffect, useMemo } from "react";
import PrintIcon from "@mui/icons-material/Print";
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
  Select,
  FormControl,
  Tooltip,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import type {
  DeviceManagement,
  DeviceFormManagement,
  DeviceModel,
  DeviceType,
  MobileProvider,
  DeviceStatus,
  Convention,
  DeviceExportRequest,
} from "../types/types";
import { API } from "../mock/mock/api/endpoints";
import { DeviceExportService } from "../mock/mock/DeviceExportSercive";
import { serviceType } from "../mock/mock/data";

function DeviceManagementComponent() {
  const [allDevices, setAllDevices] = useState<DeviceManagement[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceManagement[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newDevice, setNewDevice] = useState<DeviceFormManagement>({
    id: null,
    asset: "",
    imei: "",
    numeroSerie: "",
    idInventario: "",
    dispositivo: "",
    modello: "",
    numeroTelefono: "",
    sede: "",
    fornitore: "",
    gestore: "",
    servizio: "",
    convenzione: "",
    note: "",
    inizio: "",
    fine: "",
    stato: "",
  });

  // Riferimenti
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [mobileProviders, setMobileProviders] = useState<MobileProvider[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatus[]>([]);
  const [conventions, setConventions] = useState<Convention[]>([]);

  // Paginazione
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Filtri
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<
    Partial<DeviceManagement>
  >({});
  const [showList, setShowList] = useState(false);

  // Eliminazione
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<DeviceManagement | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  // Modal di successo
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Paginazione memoizzata
  const paginatedDevices = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredDevices.slice(start, end);
  }, [filteredDevices, page, rowsPerPage]);

  const displayDevices = useMemo(() => {
    const source = isFiltered ? filteredDevices : allDevices;
    return Array.isArray(source) ? source : [];
  }, [isFiltered, filteredDevices, allDevices]);

  // Caricamento dati
  async function getDeviceData() {
    setLoading(true);
    try {
      const [
        devicesRes,
        typesRes,
        modelsRes,
        providersRes,
        statusesRes,
        conventionsRes,
      ] = await Promise.all([
        axios.get(API.deviceManagement.list),
        axios.get<DeviceType[]>(API.deviceTypes.list),
        axios.get<DeviceModel[]>(API.deviceModels.list),
        axios.get<MobileProvider[]>(API.mobileProviders.list),
        axios.get<DeviceStatus[]>(API.deviceStatuses.list),
        axios.get<Convention[]>(API.convention.list),
      ]);

      const devices = Array.isArray(devicesRes.data) ? devicesRes.data : [];
      setAllDevices(devices);
      setFilteredDevices(devices);
      setIsFiltered(false);

      setDeviceTypes(typesRes.data);
      setDeviceModels(modelsRes.data);
      setMobileProviders(providersRes.data);
      setDeviceStatuses(statusesRes.data);
      setConventions(conventionsRes.data);
    } catch (error) {
      console.error("Errore nel caricamento dati:", error);
      setAllDevices([]);
      setFilteredDevices([]);
      setIsFiltered(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!loading && allDevices.length > 0 && !showList) {
      setShowList(true);
    }
  }, [loading, allDevices.length, showList]);

  useEffect(() => {
    getDeviceData();
  }, []);

  // Salvataggio
  async function handleSave() {
    if (!newDevice.asset?.trim() || !newDevice.dispositivo?.trim()) {
      alert("Compila i campi obbligatori: Asset e Dispositivo.");
      return;
    }

    try {
      const payload = { ...newDevice };

      if (editMode && selectedId !== null) {
        await axios.put(
          API.deviceManagement.update.replace(":id", String(selectedId)),
          payload
        );
        setSuccessMessage("Dispositivo modificato con successo!");
      } else {
        await axios.post(API.deviceManagement.create, payload);
        setSuccessMessage("Dispositivo aggiunto con successo!");
      }

      await getDeviceData();
      closeAddDialog();

      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Errore durante il salvataggio del dispositivo.");
    }
  }

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setEditMode(false);
    setSelectedId(null);
    setNewDevice({
      id: null,
      asset: "",
      imei: "",
      numeroSerie: "",
      idInventario: "",
      dispositivo: "",
      modello: "",
      numeroTelefono: "",
      sede: "",
      fornitore: "",
      gestore: "",
      servizio: "",
      convenzione: "",
      note: "",
      inizio: "",
      fine: "",
      stato: "",
    });
  };

  // Azioni menu
  // const handleMenuClick = (
  //   event: React.MouseEvent<HTMLElement>,
  //   id: number
  // ) => {
  //   event.stopPropagation();
  //   setAnchorEl(event.currentTarget);
  //   setMenuDeviceId(id);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  //   setMenuDeviceId(null);
  // };

  const handleEdit = (device: DeviceManagement) => {
    if (!device) return;

    setEditMode(true);
    setSelectedId(device.id);
    setNewDevice({ ...device });
    setOpenAddDialog(true);
  };

  const handleDeleteClick = (device: DeviceManagement) => {
    if (!device) return;

    setDeviceToDelete(device);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;
    setDeleting(true);
    try {
      const url = API.deviceManagement.delete.replace(
        ":id",
        String(deviceToDelete.id)
      );
      await axios.delete(url);

      await getDeviceData();
      setShowList(true);

      setDeleteModalOpen(false);
      setDeviceToDelete(null);

      setSuccessMessage("Dispositivo eliminato con successo!");
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Errore eliminazione:", error);
      alert("Errore durante l'eliminazione del dispositivo.");
    } finally {
      setDeleting(false);
    }
  };

  // Ricerca
  const applySearch = () => {
    let results = [...allDevices];
    const s = searchCriteria;

    if (s.asset?.trim())
      results = results.filter((d) =>
        d.asset.toLowerCase().includes(s.asset!.trim().toLowerCase())
      );
    if (s.imei?.trim())
      results = results.filter((d) =>
        d.imei?.toLowerCase().includes(s.imei!.trim().toLowerCase())
      );
    if (s.numeroSerie?.trim())
      results = results.filter((d) =>
        d.numeroSerie
          ?.toLowerCase()
          .includes(s.numeroSerie!.trim().toLowerCase())
      );
    if (s.idInventario?.trim())
      results = results.filter((d) =>
        d.idInventario
          ?.toLowerCase()
          .includes(s.idInventario!.trim().toLowerCase())
      );
    if (s.dispositivo?.trim())
      results = results.filter((d) =>
        d.dispositivo
          .toLowerCase()
          .includes(s.dispositivo!.trim().toLowerCase())
      );
    if (s.modello?.trim())
      results = results.filter((d) =>
        d.modello.toLowerCase().includes(s.modello!.trim().toLowerCase())
      );
    if (s.numeroTelefono?.trim())
      results = results.filter((d) =>
        d.numeroTelefono?.includes(s.numeroTelefono!.trim())
      );
    if (s.sede?.trim())
      results = results.filter((d) =>
        d.sede?.toLowerCase().includes(s.sede!.trim().toLowerCase())
      );
    if (s.fornitore?.trim())
      results = results.filter((d) =>
        d.fornitore?.toLowerCase().includes(s.fornitore!.trim().toLowerCase())
      );
    if (s.gestore?.trim())
      results = results.filter((d) =>
        d.gestore.toLowerCase().includes(s.gestore!.trim().toLowerCase())
      );
    if (s.servizio?.trim())
      results = results.filter((d) =>
        d.servizio.toLowerCase().includes(s.servizio!.trim().toLowerCase())
      );
    if (s.note?.trim())
      results = results.filter((d) =>
        (d.note || "").toLowerCase().includes(s.note!.trim().toLowerCase())
      );
    if (s.inizio) results = results.filter((d) => d.inizio === s.inizio);
    if (s.fine) results = results.filter((d) => d.fine === s.fine);
    if (s.stato) results = results.filter((d) => d.stato === s.stato);

    setFilteredDevices(results);
    setIsFiltered(true);
    setShowList(true);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchCriteria({});
    setFilteredDevices(allDevices);
    setIsFiltered(false);
    setShowList(false);
    setPage(1);
  };

  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const [exportFilters, setExportFilters] = useState<DeviceExportRequest>({
    ddtInizio: "",
    ddtFine: "",
    tipoDispositivoId: undefined,
    modelloId: undefined,
    gestoreId: undefined,
    statoId: undefined,
    convenzioneId: "",
    codTipoServizio: "",
    codSede: "",
    includeOpen: true,
  });
  return (
    <section className="menu-gestione" style={{ margin: "16px" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 10,
        }}
      >
        <Typography variant="h6" className="title">
          Gestione Dispositivi
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* STAMPA */}
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => setExportDialogOpen(true)}
            sx={{
              borderColor: "var(--blue-consob-600)",
              color: "var(--blue-consob-600)",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "var(--blue-consob-50)",
                borderColor: "var(--blue-consob-800)",
              },
            }}
          >
           Stampa
          </Button>

          {/* AGGIUNGI DISPOSITIVO */}
          <Button
            variant="contained"
            onClick={() => {
              setEditMode(false);
              closeAddDialog();
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
            Aggiungi Nuovo Dispositivo
          </Button>
        </Box>
      </Box>

      {/* Filtri di ricerca */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "flex-end",
            mb: 3,
          }}
        >
          {/* Asset */}
          <Box sx={{ minWidth: 150, flex: "1 1 150px" }}>
            <Typography
              variant="body2"
              color="var(--neutro-800)"
              sx={{ mb: 0.5 }}
            >
              Asset
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={searchCriteria.asset || ""}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, asset: e.target.value })
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

          {/* IMEI */}
          <Box sx={{ minWidth: 150, flex: "1 1 150px" }}>
            <Typography
              variant="body2"
              color="var(--neutro-800)"
              sx={{ mb: 0.5 }}
            >
              IMEI
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={searchCriteria.imei || ""}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, imei: e.target.value })
              }
              variant="outlined"
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

          {/* Dispositivo */}
          <Box sx={{ minWidth: 150, flex: "1 1 150px" }}>
            <Typography
              variant="body2"
              color="var(--neutro-800)"
              sx={{ mb: 0.5 }}
            >
              Dispositivo
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={searchCriteria.dispositivo || ""}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  dispositivo: e.target.value,
                })
              }
              variant="outlined"
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

          {/* Modello */}
          <Box sx={{ minWidth: 150, flex: "1 1 150px" }}>
            <Typography
              variant="body2"
              color="var(--neutro-800)"
              sx={{ mb: 0.5 }}
            >
              Modello
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={searchCriteria.modello || ""}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  modello: e.target.value,
                })
              }
              variant="outlined"
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

          {/* Pulsanti */}
          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            <Button
              variant="outlined"
              onClick={applySearch}
              sx={{
                height: 40,
                minWidth: 100,
                backgroundColor: "var(--neutro-100)",
                color: "var(--blue-consob-600)",
                borderRadius: 1,
                borderColor: "var(--blue-consob-600)",
                textTransform: "none",
                fontWeight: 500,
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
                minWidth: 100,
                color: "var(--blue-consob-600)",
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "var(--neutro-200)",
                },
              }}
            >
              Pulisci
            </Button>
          </Box>
        </Box>
      </Box>

      {loading && (
        <Box className="loading-container" sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" color="var(--neutro-600)" sx={{ mt: 1 }}>
            Caricamento...
          </Typography>
        </Box>
      )}

      {isFiltered && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {displayDevices.length === 1
            ? "1 dispositivo"
            : `${displayDevices.length} dispositivi`}
        </Typography>
      )}

      <Collapse in={showList && !loading} timeout="auto" unmountOnExit>
        <Box sx={{ maxWidth: 1400, mx: "auto", px: 2, mb: 4 }}>
          {paginatedDevices.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              <Typography>Nessun dispositivo trovato.</Typography>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: "var(--table-head, #f5f7fa)" }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>Asset</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>IMEI</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Dispositivo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Convenzione</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Modello</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Numero Serie</TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, width: 120 }}
                    >
                      Azioni
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDevices.map((d) => (
                    <TableRow
                      key={d.id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <TableCell>{d.asset}</TableCell>
                      <TableCell>{d.imei || "—"}</TableCell>
                      <TableCell>{d.dispositivo || "—"}</TableCell>
                      <TableCell>{d.convenzione || "—"}</TableCell>
                      <TableCell>{d.modello || "—"}</TableCell>
                      <TableCell>{d.numeroSerie || "—"}</TableCell>

                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {/* MODIFICA */}
                          <Tooltip title="Modifica dispositivo" arrow>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(d)}
                              sx={{
                                bgcolor: "background.default",
                                "&:hover": { bgcolor: "primary.100" },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* ELIMINA */}
                          <Tooltip title="Elimina dispositivo" arrow>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(d)}
                              sx={{
                                bgcolor: "background.default",
                                "&:hover": { bgcolor: "error.100" },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={Math.ceil(filteredDevices.length / rowsPerPage)}
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

      <Dialog
        open={openAddDialog}
        onClose={closeAddDialog}
        maxWidth="lg"
        fullWidth
        sx={{ zIndex: 1501 }}
      >
        <DialogTitle
          className="row blue-band align-items-center"
          sx={{
            backgroundColor: "var(--blue-consob-600)",
            color: "white",
            textAlign: "center",
          }}
        >
          {editMode ? "Modifica Dispositivo" : "Aggiungi Nuovo Dispositivo"}
        </DialogTitle>
        <DialogContent sx={{ pt: 4, m: 2 }}>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            {/* Asset */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Asset <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={newDevice.asset}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, asset: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Dispositivo */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Dispositivo <span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newDevice.dispositivo}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, dispositivo: e.target.value })
                  }
                  MenuProps={{
                    disablePortal: false,
                    sx: { zIndex: 1600 },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                >
                  {deviceTypes.map((t) => (
                    <MenuItem key={t.id} value={t.desTipoDispositivo}>
                      {t.desTipoDispositivo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* IMEI */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                IMEI
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={newDevice.imei}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, imei: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Numero Serie */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Numero Serie
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={newDevice.numeroSerie}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, numeroSerie: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Modello */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Modello
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newDevice.modello}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, modello: e.target.value })
                  }
                  MenuProps={{
                    disablePortal: false,
                    sx: { zIndex: 1600 },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                >
                  {deviceModels.map((m) => (
                    <MenuItem key={m.id} value={m.desModello}>
                      {m.desModello}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Numero Telefono */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Numero Telefono
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={newDevice.numeroTelefono}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, numeroTelefono: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Sede */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Sede
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={newDevice.sede}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, sede: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* ID Inventario */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                ID Inventario
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={newDevice.idInventario}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, idInventario: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Fornitore */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Fornitore
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={newDevice.fornitore}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, fornitore: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Gestore */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Gestore
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newDevice.gestore}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, gestore: e.target.value })
                  }
                  MenuProps={{
                    disablePortal: false,
                    sx: { zIndex: 1600 },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                >
                  {mobileProviders.map((p) => (
                    <MenuItem key={p.id} value={p.desGestore}>
                      {p.desGestore}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Servizio */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Servizio
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newDevice.servizio}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, servizio: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                  MenuProps={{
                    disablePortal: false,
                    sx: { zIndex: 1600 },
                  }}
                >
                  {deviceStatuses.map((s) => (
                    <MenuItem key={s.id} value={s.desStato}>
                      {s.desStato}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Convenzione */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Convenzione
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newDevice.convenzione}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, convenzione: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                  MenuProps={{
                    disablePortal: false,
                    sx: { zIndex: 1600 },
                  }}
                >
                  {conventions.map((c) => (
                    <MenuItem key={c.convenzione} value={c.convenzione}>
                      {c.convenzione}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Data Inizio */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Data Inizio
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={newDevice.inizio}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, inizio: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Data Fine */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Data Fine
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={newDevice.fine}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, fine: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Note */}
            <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Note
              </Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                value={newDevice.note}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, note: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>
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
      {/* MODALE DI SUCCESSO */}
      <Dialog
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
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
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Operazione completata
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {successMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setSuccessModalOpen(false)}
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

      {/* DIALOG ESPORTA CSV DISPOSITIVI - STILE CORRETTO */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{ zIndex: 1501 }}
      >
        <DialogTitle
          className="row blue-band align-items-center"
          sx={{
            backgroundColor: "var(--blue-consob-600)",
            color: "white",
            textAlign: "center",
          }}
        >
          Esporta Dispositivi in CSV
        </DialogTitle>

        <DialogContent sx={{ pt: 4, m: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Applica filtri per esportare solo i dispositivi desiderati. Lascia
            vuoto per esportare tutto.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "1fr 1fr 1fr",
              },
            }}
          >
            {/* Data Inizio */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Data Inizio
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={exportFilters.ddtInizio || ""}
                onChange={(e) =>
                  setExportFilters({
                    ...exportFilters,
                    ddtInizio: e.target.value || undefined,
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Data Fine */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Data Fine
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={exportFilters.ddtFine || ""}
                onChange={(e) =>
                  setExportFilters({
                    ...exportFilters,
                    ddtFine: e.target.value || undefined,
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Tipo Dispositivo */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Tipo Dispositivo
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={exportFilters.tipoDispositivoId || ""}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      tipoDispositivoId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  displayEmpty
                  MenuProps={{ disablePortal: false, sx: { zIndex: 1600 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                >
                  {deviceTypes.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.desTipoDispositivo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Modello */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Modello
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={exportFilters.modelloId || ""}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      modelloId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  displayEmpty
                  MenuProps={{ disablePortal: false, sx: { zIndex: 1600 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                >
                  {deviceModels.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.desModello}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Gestore */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Gestore
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={exportFilters.gestoreId || ""}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      gestoreId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  displayEmpty
                  MenuProps={{ disablePortal: false, sx: { zIndex: 1600 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                >
                  {mobileProviders.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.desGestore}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Stato */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Stato
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={exportFilters.statoId || ""}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      statoId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  displayEmpty
                  MenuProps={{ disablePortal: false, sx: { zIndex: 1600 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                >
                  {deviceStatuses.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.desStato}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Convenzione */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Convenzione
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={exportFilters.convenzioneId || ""}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      convenzioneId: e.target.value || undefined,
                    })
                  }
                  displayEmpty
                  MenuProps={{ disablePortal: false, sx: { zIndex: 1600 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                >
                  {conventions.map((c) => (
                    <MenuItem key={c.convenzione} value={c.convenzione}>
                      {c.convenzione}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Tipo Servizio */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Tipo Servizio
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={exportFilters.codTipoServizio || ""}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      codTipoServizio: e.target.value as "F" | "D" | "FD" | "",
                    })
                  }
                  displayEmpty
                  MenuProps={{ disablePortal: false, sx: { zIndex: 1600 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--neutro-100)",
                    },
                  }}
                >
                  {serviceType.map((s) => (
                    <MenuItem key={s.codTipoServizio} value={s.codTipoServizio}>
                      {s.codTipoServizio}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Sede */}
            <Box>
              <Typography
                variant="body2"
                color="var(--neutro-800)"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Sede (es. RM)
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={exportFilters.codSede || ""}
                onChange={(e) =>
                  setExportFilters({
                    ...exportFilters,
                    codSede: e.target.value.toUpperCase(),
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--neutro-100)",
                  },
                }}
              />
            </Box>

            {/* Checkbox - Includi aperti */}
            <Box
              sx={{
                gridColumn: { xs: "1 / -1" },
                display: "flex",
                alignItems: "center",
                mt: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportFilters.includeOpen ?? true}
                    onChange={(e) =>
                      setExportFilters({
                        ...exportFilters,
                        includeOpen: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    color="var(--neutro-800)"
                    sx={{ fontWeight: 500 }}
                  >
                    Includi dispositivi senza data fine (aperti)
                  </Typography>
                }
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setExportDialogOpen(false)}>Annulla</Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={async () => {
              setExportDialogOpen(false);
              DeviceExportService.setData(filteredDevices);
              const success = await DeviceExportService.exportCsv(
                exportFilters
              );

              if (success) {
                setSuccessMessage("Esportazione CSV completata con successo!");
                setSuccessModalOpen(true);
              }
            }}
            sx={{
              backgroundColor: "var(--blue-consob-600)",
              "&:hover": { backgroundColor: "var(--blue-consob-800)" },
            }}
          >
            Scarica CSV
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Conferma Eliminazione */}
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
    </section>
  );
}

export default DeviceManagementComponent;
