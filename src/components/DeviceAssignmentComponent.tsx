import React, { useState, useEffect, useMemo } from "react";
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
  Autocomplete,
  Select,
  FormControl,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import type {
  Assegnatario,
  Device,
  DeviceForm,
  DeviceManagement,
  DeviceStatus,
  DeviceType,
  DeviceModel,
  MobileProvider,
} from "../types/types";
import { API } from "../mock/mock/api/endpoints";

function DeviceAssignmentComponent() {
  // RIFERIMENTI
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [mobileProviders, setMobileProviders] = useState<MobileProvider[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatus[]>([]);

  // ASSEGNATARI
  const [allAssegnatari, setAllAssegnatari] = useState<Assegnatario[]>([]);
  const [filteredAssegnatari, setFilteredAssegnatari] = useState<Assegnatario[]>([]);
  const [assegnatarioSelezionato, setAssegnatarioSelezionato] = useState<Assegnatario | null>(null);

  // ASSEGNAZIONI
  const [assegnazioni, setAssegnazioni] = useState<Device[]>([]);
  const [loadingAssegnazioni, setLoadingAssegnazioni] = useState(false);

  // DISPOSITIVI (DEVICE MANAGEMENT)
  const [allDispositivi, setAllDispositivi] = useState<DeviceManagement[]>([]);
  const [filteredDispositivi, setFilteredDispositivi] = useState<DeviceManagement[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceManagement | null>(null);

  // FILTRI ASSEGNATARIO
  const [searchAssegnatario, setSearchAssegnatario] = useState({
    nominativo: "",
    codiceUtente: "",
    tipoUtente: "",
    unitaOrganizzativa: "",
  });

  // FILTRI DISPOSITIVO (MODALE "Assegna")
  const [searchDispositivo, setSearchDispositivo] = useState({
    asset: "",
    tipo: null as DeviceType | null,
    modello: null as DeviceModel | null,
    gestore: null as MobileProvider | null,
    numeroTelefono: "",
    sede: "",
    fornitore: "",
    stato: null as DeviceStatus | null,
  });

  // FORM DI ASSEGNAZIONE
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [newAssegnazione, setNewAssegnazione] = useState<DeviceForm>({
    id: null,
    asset: "",
    tipo: "",
    utenza: "",
    imei: "",
    seriale: "",
    modello: "",
    stato: "Assegnato",
    dataInizio: "",
    dataFine: "",
    note: "",
    utenteId: null,
  });

  // MENU AZIONI
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuId, setMenuId] = useState<number | null>(null);

  // PAGINAZIONE
  const [page, setPage] = useState(1);
  const [devicePage, setDevicePage] = useState(1);
  const rowsPerPage = 10;
  const deviceRowsPerPage = 5;

  const paginatedAssegnazioni = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return assegnazioni.slice(start, start + rowsPerPage);
  }, [assegnazioni, page]);

  const paginatedDispositivi = useMemo(() => {
    const start = (devicePage - 1) * deviceRowsPerPage;
    return filteredDispositivi.slice(start, start + deviceRowsPerPage);
  }, [filteredDispositivi, devicePage]);

  // CARICAMENTO DATI
  async function loadReferences() {
    try {
      const [
        typesRes,
        modelsRes,
        providersRes,
        statusesRes,
        assegnatariRes,
        dispositiviRes,
      ] = await Promise.all([
        axios.get<DeviceType[]>(API.deviceTypes.list),
        axios.get<DeviceModel[]>(API.deviceModels.list),
        axios.get<MobileProvider[]>(API.mobileProviders.list),
        axios.get<DeviceStatus[]>(API.deviceStatuses.list),
        axios.get<Assegnatario[]>(API.assegnatari.list),
        axios.get<DeviceManagement[]>(API.deviceManagement.list),
      ]);

      setDeviceTypes(typesRes.data);
      setDeviceModels(modelsRes.data);
      setMobileProviders(providersRes.data);
      setDeviceStatuses(statusesRes.data);
      setAllAssegnatari(assegnatariRes.data);
      setAllDispositivi(dispositiviRes.data);
    } catch (err) {
      console.error("Errore caricamento riferimenti:", err);
    }
  }

  useEffect(() => {
    loadReferences();
  }, []);

  useEffect(() => {
    if (assegnatarioSelezionato) {
      loadAssegnazioni(assegnatarioSelezionato.id);
    } else {
      setAssegnazioni([]);
      setPage(1);
    }
  }, [assegnatarioSelezionato]);
  useEffect(() => {
  if (selectedDevice && !editMode) {
    setNewAssegnazione((prev) => ({
      ...prev,
      asset: selectedDevice.asset,
      tipo: selectedDevice.dispositivo,
      modello: selectedDevice.modello,
      utenza: `${selectedDevice.gestore} ${selectedDevice.numeroTelefono || ""}`.trim(),
      imei: selectedDevice.imei || "",
      seriale: selectedDevice.numeroSerie || "",
      deviceManagementId: selectedDevice.id,
    }));
  }
}, [selectedDevice, editMode]);

  async function loadAssegnazioni(utenteId: number) {
    setLoadingAssegnazioni(true);
    try {
      const res = await axios.get<Device[]>(`${API.assegnazioni.list}?utenteId=${utenteId}`);
      setAssegnazioni(res.data);
    } catch (err) {
      console.error("Errore caricamento assegnazioni:", err);
      setAssegnazioni([]);
    } finally {
      setLoadingAssegnazioni(false);
    }
  }

  // RICERCA ASSEGNATARIO
  const applySearchAssegnatario = () => {
    const term = searchAssegnatario.nominativo?.trim() || "";
    
    if (!term) {
      setFilteredAssegnatari([]);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const hasWildcard = lowerTerm.includes("%");
    const cleanTerm = lowerTerm.replace(/%/g, "");

    const results = allAssegnatari.filter((a) => {
      const fullName = `${a.nome} ${a.cognome}`.toLowerCase();
      const idStr = a.id.toString();

     
      if (hasWildcard) {
        return fullName.includes(cleanTerm) || idStr.includes(cleanTerm);
      }

     
      return fullName.startsWith(cleanTerm) || idStr.startsWith(cleanTerm);
    });

    setFilteredAssegnatari(results.slice(0, 50)); 
  };

  const clearSearchAssegnatario = () => {
    setSearchAssegnatario({ nominativo: "", codiceUtente: "", tipoUtente: "", unitaOrganizzativa: "" });
    setFilteredAssegnatari([]);
    setAssegnatarioSelezionato(null);
  };

  // RICERCA DISPOSITIVI (SOLO IN ASSEGNA)
  const applySearchDispositivo = () => {
    let results = [...allDispositivi];
    const s = searchDispositivo;

    if (s.asset) results = results.filter((d) => d.asset.toLowerCase().includes(s.asset.toLowerCase()));
    if (s.tipo) results = results.filter((d) => d.dispositivo === s.tipo?.descrizione);
    if (s.modello) results = results.filter((d) => d.modello === s.modello?.desModello);
    if (s.gestore) results = results.filter((d) => d.gestore === s.gestore?.descrizione);
    if (s.numeroTelefono) results = results.filter((d) => d.numeroTelefono.includes(s.numeroTelefono));
    if (s.sede) results = results.filter((d) => d.sede.toLowerCase().includes(s.sede.toLowerCase()));
    if (s.fornitore) results = results.filter((d) => d.fornitore.toLowerCase().includes(s.fornitore.toLowerCase()));
    if (s.stato) results = results.filter((d) => d.stato === s.stato?.descrizione);

    setFilteredDispositivi(results);
    setDevicePage(1);
  };

  const clearSearchDispositivo = () => {
    setSearchDispositivo({
      asset: "",
      tipo: null,
      modello: null,
      gestore: null,
      numeroTelefono: "",
      sede: "",
      fornitore: "",
      stato: null,
    });
    setFilteredDispositivi([]);
    setDevicePage(1);
  };

  // AZIONI
  const openAddDialogHandler = () => {
    if (!assegnatarioSelezionato) {
      alert("Seleziona prima un assegnatario.");
      return;
    }
    setEditMode(false);
    setSelectedId(null);
    setSelectedDevice(null);
    setNewAssegnazione({
      id: null,
      asset: "",
      tipo: "",
      utenza: "",
      imei: "",
      seriale: "",
      modello: "",
      stato: "Assegnato",
      dataInizio: "",
      dataFine: "",
      note: "",
      utenteId: assegnatarioSelezionato.id,
    });
    clearSearchDispositivo();
    setOpenAddDialog(true);
  };

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedDevice(null);
  };

 const handleSave = async () => {
  if (!editMode && (!selectedDevice || !newAssegnazione.dataInizio)) {
    alert("Seleziona un dispositivo e compila la data di inizio.");
    return;
  }

  if (editMode && !newAssegnazione.dataInizio) {
    alert("La data di inizio è obbligatoria.");
    return;
  }

  try {
    const payload: DeviceForm = {
      ...newAssegnazione,
      asset: selectedDevice!.asset,
      tipo: selectedDevice!.dispositivo,
      modello: selectedDevice!.modello,
      utenza: `${selectedDevice!.gestore} ${selectedDevice!.numeroTelefono || ""}`.trim(),
      imei: selectedDevice!.imei || "",
      seriale: selectedDevice!.numeroSerie || "",
      deviceManagementId: selectedDevice!.id,
    };

    if (editMode && selectedId) {
      await axios.put(API.assegnazioni.update.replace(":id", String(selectedId)), payload);
      setSuccessMessage("Modifica salvata con successo!");
    } else {
      await axios.post(API.assegnazioni.create, payload);
      setSuccessMessage("Dispositivo assegnato con successo!");
    }

    
    if (!editMode && selectedDevice) {
      await axios.put(API.deviceManagement.update.replace(":id", String(selectedDevice.id)), {
        ...selectedDevice,
        stato: "Assegnato",
      });
    }

    await loadAssegnazioni(assegnatarioSelezionato!.id);
    

    setSuccessModalOpen(true);
    setOpenAddDialog(false); 

  } catch (err) {
    console.error("Errore salvataggio:", err);
    alert("Errore durante il salvataggio.");
  }
};

  const handleEdit = (assegnazione: Device) => {
    const device = allDispositivi.find((d) => d.asset === assegnazione.asset);
    setEditMode(true);
    setSelectedId(assegnazione.id!);
    setSelectedDevice(device || null);
    setNewAssegnazione({ ...assegnazione });
    setOpenAddDialog(true);
    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };
  

  return (
    <section className="menu-gestione" style={{ margin: "16px" }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" className="title">Gestione Assegnazione Dispositivi</Typography>
        <Button
          variant="contained"
          onClick={openAddDialogHandler}
          disabled={!assegnatarioSelezionato}
          sx={{
            backgroundColor: "var(--blue-consob-600)",
            "&:hover": { backgroundColor: "var(--blue-consob-800)" },
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Assegna Dispositivo
        </Button>
      </Box>

      {/* 1. RICERCA ASSEGNATARIO */}
   

       <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "var(--neutro-800)" }}>
          1. Cerca e Seleziona Assegnatario
        </Typography>

       
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5 }}>
              Cerca per Nominativo o ID (usa % per la ricerca parziale):
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="es. de car% o 123"
              value={searchAssegnatario.nominativo}
              onChange={(e) => setSearchAssegnatario({ ...searchAssegnatario, nominativo: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && applySearchAssegnatario()}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } , }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            variant="outlined"
            onClick={applySearchAssegnatario}
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
            onClick={clearSearchAssegnatario}
            sx={{ height: 40, minWidth: 80 }}
          >
            Pulisci
          </Button>
        </Box>

        <Collapse in={filteredAssegnatari.length > 0}>
          <Paper elevation={3} sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
            <TableContainer>
  <Table size="small">
    <TableHead>
      <TableRow sx={{ backgroundColor: "var(--table-head)" }}>
        <TableCell sx={{ fontWeight: 600, color: "var(--neutro-800)" }}>Nominativo</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "var(--neutro-800)" }}>ID</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "var(--neutro-800)" }}>Tipo</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "var(--neutro-800)" }}>Unità</TableCell>
        <TableCell align="center" sx={{ fontWeight: 600, color: "var(--neutro-800)" }}>
          Seleziona
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredAssegnatari.slice(0, 5).map((a) => (
        <TableRow
          key={a.id}
          hover
          sx={{
            backgroundColor: assegnatarioSelezionato?.id === a.id ? "action.selected" : "inherit",
            cursor: "pointer",
          }}
          onClick={() => setAssegnatarioSelezionato(a)}
        >
          <TableCell sx={{ fontWeight: 400, color: "var(--neutro-700)" }}>
            {a.nome} {a.cognome}
          </TableCell>
          <TableCell sx={{ fontWeight: 400, color: "var(--neutro-700)" }}>
            {a.id}
          </TableCell>
          <TableCell sx={{ fontWeight: 400, color: "var(--neutro-700)" }}>
            {a.tipoUtente}
          </TableCell>
          <TableCell sx={{ fontWeight: 400, color: "var(--neutro-700)" }}>
            {a.unitaOrganizzativa}
          </TableCell>
          <TableCell align="center">
            <Button
              size="small"
              variant={assegnatarioSelezionato?.id === a.id ? "contained" : "outlined"}
              onClick={(e) => {
                e.stopPropagation();
                setAssegnatarioSelezionato(a);
              }}
              disabled={assegnatarioSelezionato?.id === a.id}
            >
              {assegnatarioSelezionato?.id === a.id ? "Selezionato" : "Seleziona"}
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
          </Paper>
        </Collapse>

        {assegnatarioSelezionato && (
          <Box sx={{ p: 2, borderRadius: 1, mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Assegnatario Selezionato</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1 }}>
              {[
                { label: "ID", value: assegnatarioSelezionato.id },
                { label: "Nome", value: assegnatarioSelezionato.nome },
                { label: "Cognome", value: assegnatarioSelezionato.cognome },
                { label: "Tipo", value: assegnatarioSelezionato.tipoUtente },
                { label: "Unità", value: assegnatarioSelezionato.unitaOrganizzativa },
              ].map((item) => (
                <Box key={item.label}>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* STORICO ASSEGNAZIONI */}
      {assegnatarioSelezionato ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "var(--neutro-800)" }}>
            2. Storico Assegnazioni di {assegnatarioSelezionato.nome} {assegnatarioSelezionato.cognome}
          </Typography>

          {loadingAssegnazioni ? (
            <Box sx={{ textAlign: "center", py: 3 }}><CircularProgress /></Box>
          ) : assegnazioni.length === 0 ? (
            <Typography sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
              Nessuna assegnazione trovata per questo utente.
            </Typography>
          ) : (
            <Paper elevation={3} sx={{ borderRadius: "12px", overflow: "hidden" }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "var(--table-head)" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Asset</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Modello</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Utenza</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Stato</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Inizio</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Fine</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Note</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", borderLeft: "1px solid var(--neutro-200)" }}>Azioni</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAssegnazioni.map((d) => (
                      <TableRow key={d.id!} hover>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>{d.asset}</TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>{d.tipo}</TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>{d.modello}</TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>{d.utenza}</TableCell>
                        <TableCell>{d.stato}</TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>{d.dataInizio}</TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>{d.dataFine || "—"}</TableCell>
                        <TableCell sx={{ color: "var(--neutro-600)" }}>{d.note || "—"}</TableCell>
                        <TableCell align="center" sx={{ borderLeft: "1px solid var(--neutro-200)" }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => handleMenuClick(e, d.id!)}
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
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <Pagination
                  count={Math.ceil(assegnazioni.length / rowsPerPage)}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  size="small"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Paper>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <Typography variant="h6" color="inherit">
            Seleziona un assegnatario per visualizzare lo storico delle assegnazioni.
          </Typography>
        </Box>
      )}

      {/* DIALOG ASSEGNAZIONE */}
      <Dialog open={openAddDialog} onClose={closeAddDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ backgroundColor: "var(--blue-consob-600)", color: "white", textAlign: "center" }}>
          {editMode ? "Modifica Assegnazione" : "Assegna Dispositivo"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 , m:2}}>
          {/* ASSEGNAZIONE NUOVA */}
          {!editMode && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Ricerca Dispositivo</Typography>

              {/* RICERCA DISPOSITIVO*/}
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", mb: 3 }}>
                <Box>
                  <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Asset</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    value={searchDispositivo.asset}
                    onChange={(e) => setSearchDispositivo({ ...searchDispositivo, asset: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Tipo</Typography>
                  <Autocomplete
                    options={deviceTypes}
                    getOptionLabel={(o) => o.descrizione}
                    value={searchDispositivo.tipo}
                    onChange={(_, v) => setSearchDispositivo({ ...searchDispositivo, tipo: v })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Modello</Typography>
                  <Autocomplete
                    options={deviceModels}
                    getOptionLabel={(o) => o.desModello}
                    value={searchDispositivo.modello}
                    onChange={(_, v) => setSearchDispositivo({ ...searchDispositivo, modello: v })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Gestore</Typography>
                  <Autocomplete
                    options={mobileProviders}
                    getOptionLabel={(o) => o.descrizione}
                    value={searchDispositivo.gestore}
                    onChange={(_, v) => setSearchDispositivo({ ...searchDispositivo, gestore: v })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Telefono</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    value={searchDispositivo.numeroTelefono}
                    onChange={(e) => setSearchDispositivo({ ...searchDispositivo, numeroTelefono: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Sede</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    value={searchDispositivo.sede}
                    onChange={(e) => setSearchDispositivo({ ...searchDispositivo, sede: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Fornitore</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    value={searchDispositivo.fornitore}
                    onChange={(e) => setSearchDispositivo({ ...searchDispositivo, fornitore: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Stato</Typography>
                  <Autocomplete
                    options={deviceStatuses}
                    getOptionLabel={(o) => o.descrizione}
                    value={searchDispositivo.stato}
                    onChange={(_, v) => setSearchDispositivo({ ...searchDispositivo, stato: v })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
                      />
                    )}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <Button variant="outlined" onClick={applySearchDispositivo}>Cerca</Button>
                <Button onClick={clearSearchDispositivo}>Pulisci</Button>
              </Box>

              {/* LISTA DISPOSITIVI */}
              {filteredDispositivi.length > 0 ? (
                <Paper elevation={3} sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "var(--table-head)" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>Asset</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Modello</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>IMEI</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Seriale</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Telefono</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Sede</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Gestore</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Fornitore</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Stato</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>Seleziona</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedDispositivi.map((d) => (
                          <TableRow
                            key={d.id}
                            hover
                            selected={selectedDevice?.id === d.id}
                            sx={{ cursor: "pointer" }}
                            onClick={() => setSelectedDevice(d)}
                          >
                            <TableCell>{d.asset}</TableCell>
                            <TableCell>{d.dispositivo}</TableCell>
                            <TableCell>{d.modello}</TableCell>
                            <TableCell>{d.imei}</TableCell>
                            <TableCell>{d.numeroSerie}</TableCell>
                            <TableCell>{d.numeroTelefono || "—"}</TableCell>
                            <TableCell>{d.sede}</TableCell>
                            <TableCell>{d.gestore}</TableCell>
                            <TableCell>{d.fornitore}</TableCell>
                            <TableCell>{d.stato}</TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant={selectedDevice?.id === d.id ? "contained" : "outlined"}
                                onClick={(e) => { e.stopPropagation(); setSelectedDevice(d); }}
                              >
                                {selectedDevice?.id === d.id ? "Selezionato" : "Seleziona"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <Pagination
                      count={Math.ceil(filteredDispositivi.length / deviceRowsPerPage)}
                      page={devicePage}
                      onChange={(_, v) => setDevicePage(v)}
                      size="small"
                    />
                  </Box>
                </Paper>
              ) : (
                <Typography sx={{ textAlign: "center", py: 2, color: "text.secondary", fontStyle: "italic" }}>
                  Esegui una ricerca per visualizzare i dispositivi.
                </Typography>
              )}
            </>
          )}

          {/* MODIFICA ASSEGNAZIONE */}
          {editMode && selectedDevice && (
            <Paper sx={{ p: 2, bgcolor: "var(--blue-consob-50)", borderRadius: 1, mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Dispositivo Assegnato</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 1 }}>
                {[
                  { label: "Asset", value: selectedDevice.asset },
                  { label: "Tipo", value: selectedDevice.dispositivo },
                  { label: "Modello", value: selectedDevice.modello },
                  { label: "IMEI", value: selectedDevice.imei },
                  { label: "Seriale", value: selectedDevice.numeroSerie },
                  { label: "Telefono", value: selectedDevice.numeroTelefono || "—" },
                  { label: "Sede", value: selectedDevice.sede },
                  { label: "Gestore", value: selectedDevice.gestore },
                ].map((i) => (
                  <Box key={i.label}>
                    <Typography variant="caption" color="text.secondary">{i.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{i.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {/* DETTAGLI ASSEGNAZIONE */}
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: "var(--neutro-800)" }}>
            {editMode ? "Modifica Dettagli" : "Dettagli Assegnazione"}
          </Typography>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <Box>
              <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Stato</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newAssegnazione.stato}
                  onChange={(e) => setNewAssegnazione({ ...newAssegnazione, stato: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
                >
                  {deviceStatuses.map((s) => (
                    <MenuItem key={s.id} value={s.descrizione}>{s.descrizione}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>
                Data Inizio <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newAssegnazione.dataInizio}
                onChange={(e) => setNewAssegnazione({ ...newAssegnazione, dataInizio: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Data Fine</Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newAssegnazione.dataFine || ""}
                onChange={(e) => setNewAssegnazione({ ...newAssegnazione, dataFine: e.target.value || null })}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="var(--neutro-800)" sx={{ mb: 0.5, fontWeight: 500 }}>Note</Typography>
              <TextField
                size="small"
                fullWidth
                multiline
                rows={2}
                value={newAssegnazione.note || ""}
                onChange={(e) => setNewAssegnazione({ ...newAssegnazione, note: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "var(--neutro-100)" } }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeAddDialog}>Annulla</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!editMode ? (!selectedDevice || !newAssegnazione.dataInizio) : !newAssegnazione.dataInizio}
            sx={{
              backgroundColor: "var(--blue-consob-600)",
              "&:hover": { backgroundColor: "var(--blue-consob-800)" },
            }}
          >
            {editMode ? "Salva Modifiche" : "Assegna"}
          </Button>
        </DialogActions>
      </Dialog>
{/* MODALE DI SUCCESSO */}
<Dialog open={successModalOpen} onClose={() => setSuccessModalOpen(false)} maxWidth="xs" fullWidth>
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
      {/* MENU AZIONI */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <MenuItem onClick={() => {
          const assegnazione = assegnazioni.find((a) => a.id === menuId);
          if (assegnazione) handleEdit(assegnazione);
        }}>
          Modifica
        </MenuItem>
      </Menu>
    </section>
  );
}

export default DeviceAssignmentComponent;