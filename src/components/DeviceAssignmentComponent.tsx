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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Grid } from "@mui/material";
import { MoreVert, Close } from "@mui/icons-material";
import axios from "axios";
import type {
  Assegnatario,
  Device,
  DeviceForm,
  DeviceModel,
  DeviceStatus,
  DeviceType,
  MobileProvider,
} from "../types/types";
import { API } from "../mock/mock/api/endpoints";

function DeviceAssignmentComponent() {
  const [assegnatarioSelezionato, setAssegnatarioSelezionato] =
    useState<Assegnatario | null>(null);
  const [loading, setLoading] = useState(false);

  const [devices, setDevices] = useState<Device[]>([]);
  const [newElement, setNew] = useState<DeviceForm>({
    id: null,
    asset: "",
    tipo: "",
    utenza: "",
    imei: "",
    seriale: "",
    modello: "",
    stato: "AS",
    dataInizio: "",
    dataFine: "",
    note: "",
    utenteId: null,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [mobileProviders, setMobileProviders] = useState<MobileProvider[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatus[]>([]);

  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    nominativo: "",
    codiceUtente: "",
    tipoUtente: "",
    unitaOrganizzativa: "",
  });
  const [searchResults, setSearchResults] = useState<Assegnatario[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  async function handleSelectData() {
    try {
      const [types, models, providers, statuses] = await Promise.all([
        axios.get<DeviceType[]>("/api/device-types"),
        axios.get<DeviceModel[]>("/api/v1/modello/all"),
        axios.get<MobileProvider[]>("/api/mobile-providers"),
        axios.get<DeviceStatus[]>("/api/device-statuses"),
      ]);

      setDeviceTypes(types.data);
      setDeviceModels(models.data);
      setMobileProviders(providers.data);
      setDeviceStatuses(statuses.data);
    } catch (err) {
      console.error("Errore caricamento menu:", err);
    }
  }

  useEffect(() => {
    handleSelectData();
  }, []);

  useEffect(() => {
    if (assegnatarioSelezionato) {
      handleAssegnazioni(assegnatarioSelezionato.id);
      setNew((prev) => ({
        ...prev,
        utenteId: Number(assegnatarioSelezionato.id),
      }));
    } else {
      setDevices([]);
      setNew((prev) => ({ ...prev, utenteId: null }));
    }
  }, [assegnatarioSelezionato]);

  async function handleAssegnazioni(idUtente: number) {
    try {
      setLoading(true);
      const res = await axios.get<Device[]>(
        `${API.assegnazioni.list}?utenteId=${idUtente}`
      );
      setDevices(res.data);
    } catch (err) {
      console.error("Errore caricamento assegnazioni:", err);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!newElement.asset || !newElement.tipo || !assegnatarioSelezionato) {
      return alert(
        "Compila tutti i campi obbligatori e seleziona un assegnatario."
      );
    }

    try {
      setLoading(true);

      const payload = {
        ...newElement,
        utenteId: assegnatarioSelezionato.id,
      };

      if (newElement.id) {
        await axios.put(
          API.assegnazioni.update.replace(":id", String(selectedId)),
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        await axios.post(API.assegnazioni.create, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      await handleAssegnazioni(assegnatarioSelezionato.id);
      resetForm();
      alert("Assegnazione salvata con successo!");
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
      tipo: "",
      utenza: "",
      imei: "",
      seriale: "",
      modello: "",
      stato: "AS",
      dataInizio: "",
      dataFine: "",
      note: "",
      utenteId: null,
    });
    setAssegnatarioSelezionato(null);
  }

  function handleOpenMenu(e: React.MouseEvent<HTMLButtonElement>, id: number) {
    setAnchorEl(e.currentTarget);
    setSelectedId(id);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
    setSelectedId(null);
  }

  async function handleDelete() {
    if (!selectedId) return;
    if (!confirm("Sei sicuro di voler eliminare questa assegnazione?")) return;

    try {
      const url = API.assegnazioni.delete.replace(":id", String(selectedId));
      await axios.delete(url);

      if (assegnatarioSelezionato) {
        await handleAssegnazioni(assegnatarioSelezionato.id);
      }

      alert("Assegnazione eliminata con successo!");
    } catch (err) {
      console.error("Errore eliminazione:", err);
      alert("Errore durante l'eliminazione");
    } finally {
      handleCloseMenu();
    }
  }

  function handleUpdate() {
    const d = devices.find((x) => x.id === selectedId);
    if (d) setNew(d);
    handleCloseMenu();
  }

  function handleOpenSearchDialog() {
    setOpenSearchDialog(true);
    setSearchResults([]);
    setSearchFilters({
      nominativo: "",
      codiceUtente: "",
      tipoUtente: "",
      unitaOrganizzativa: "",
    });
  }

  function handleCloseSearchDialog() {
    setOpenSearchDialog(false);
  }

  async function handleSearchAssegnatario() {
    try {
      setSearchLoading(true);

      const res = await axios.get<Assegnatario[]>(API.assegnatari.list);
      let filtered = res.data;

      if (searchFilters.nominativo) {
        const pattern = searchFilters.nominativo
          .replace(/%/g, ".*")
          .toLowerCase();
        const regex = new RegExp(pattern);
        filtered = filtered.filter((a) =>
          regex.test(`${a.nome} ${a.cognome}`.toLowerCase())
        );
      }

      if (searchFilters.codiceUtente) {
        const pattern = searchFilters.codiceUtente
          .replace(/%/g, ".*")
          .toLowerCase();
        const regex = new RegExp(pattern);
        filtered = filtered.filter((a) => regex.test(a.id.toString()));
      }

      if (searchFilters.tipoUtente) {
        const pattern = searchFilters.tipoUtente
          .replace(/%/g, ".*")
          .toLowerCase();
        const regex = new RegExp(pattern);
        filtered = filtered.filter((a) =>
          regex.test(a.tipoUtente.toLowerCase())
        );
      }

      if (searchFilters.unitaOrganizzativa) {
        const pattern = searchFilters.unitaOrganizzativa
          .replace(/%/g, ".*")
          .toLowerCase();
        const regex = new RegExp(pattern);
        filtered = filtered.filter((a) =>
          regex.test(a.unitaOrganizzativa.toLowerCase())
        );
      }

      setSearchResults(filtered);
    } catch (err) {
      console.error("Errore ricerca assegnatario:", err);
      alert("Errore durante la ricerca");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }

  function handleSelectAssegnatario(assegnatario: Assegnatario) {
    setAssegnatarioSelezionato(assegnatario);
    handleCloseSearchDialog();
  }

  function handleClearSearchFilters() {
    setSearchFilters({
      nominativo: "",
      codiceUtente: "",
      tipoUtente: "",
      unitaOrganizzativa: "",
    });
    setSearchResults([]);
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Gestione Assegnazione Dispositivi
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          1. Seleziona Assegnatario
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Assegnatario Selezionato"
            fullWidth
            size="small"
    
            value={
              assegnatarioSelezionato
                ? `${assegnatarioSelezionato.cognome} ${assegnatarioSelezionato.nome} (${assegnatarioSelezionato.id})`
                : ""
            }
            placeholder="Nessun assegnatario selezionato"
            disabled
            sx={{
              flex: "1 200px",
              "& .MuiInputBase-root": { backgroundColor: "#fff" },
              "& .Mui-disabled": { backgroundColor: "#f5f5f5" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleOpenSearchDialog}
            sx={{
              backgroundColor: "var(--blue-consob-600)",
              "&:hover": { backgroundColor: "var(--blue-consob-800)" },
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cerca Assegnatario
          </Button>

          {assegnatarioSelezionato && (
            <Button
              variant="outlined"
              onClick={() => setAssegnatarioSelezionato(null)}
              sx={{
                height: 40,
                color: "var(--blue-consob-600)",
                borderRadius: 1,
                textTransform: "none",
              }}
            >
              Rimuovi
            </Button>
          )}
        </Box>

        {assegnatarioSelezionato && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Dettagli Assegnatario
            </Typography>
            <Grid container spacing={2}>
              <Box
                sx={{ width: { xs: "100%", sm: "50%", md: "16.666%" }, px: 1 }}
              >
                <TextField
                  className="textFieldInput"
                  label="ID"
                  fullWidth
                  size="small"
                  value={assegnatarioSelezionato.id}
                  disabled
                />
              </Box>
              <Box
                sx={{ width: { xs: "100%", sm: "50%", md: "16.666%" }, px: 1 }}
              >
                <TextField
                  className="textFieldInput"
                  label="Nome"
                  fullWidth
                  size="small"
                  value={assegnatarioSelezionato.nome}
                  disabled
                />
              </Box>
              <Box
                sx={{ width: { xs: "100%", sm: "50%", md: "16.666%" }, px: 1 }}
              >
                <TextField
                  className="textFieldInput"
                  label="Cognome"
                  fullWidth
                  size="small"
                  value={assegnatarioSelezionato.cognome}
                  disabled
                />
              </Box>
              <Box sx={{ width: { xs: "100%", sm: "50%", md: "25%" }, px: 1 }}>
                <TextField
                  className="textFieldInput"
                  label="Tipo Utente"
                  fullWidth
                  size="small"
                  value={assegnatarioSelezionato.tipoUtente}
                  disabled
                />
              </Box>
              <Box sx={{ width: { xs: "100%", sm: "50%", md: "25%" }, px: 1 }}>
                <TextField
                  className="textFieldInput"
                  label="Unità Organizzativa"
                  fullWidth
                  size="small"
                  value={assegnatarioSelezionato.unitaOrganizzativa}
                  disabled
                />
              </Box>
              {assegnatarioSelezionato.note && (
                <Box sx={{ width: "100%", px: 1 }}>
                  <TextField
                    className="textFieldInput"
                    label="Note"
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    value={assegnatarioSelezionato.note}
                    disabled
                  />
                </Box>
              )}
            </Grid>
          </Box>
        )}
      </Paper>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          "& .MuiTextField-root": {
            backgroundColor: "#fff",
            "& .MuiInputBase-root": {
              height: 56,
              fontSize: "1rem",
              paddingRight: "8px",
            },
            "& .MuiInputLabel-root": { fontSize: "1rem" },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              height: "56px !important",
              fontSize: "1rem",
              paddingTop: "0 !important",
              paddingBottom: "0 !important",
            },
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          2. Assegna Dispositivo
        </Typography>

        <Grid container spacing={2}>
          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              label="Asset *"
              fullWidth
              size="small"
              value={newElement.asset}
              onChange={(e) => setNew({ ...newElement, asset: e.target.value })}
              disabled={!assegnatarioSelezionato}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              select
              size="small"
              label="Tipo Dispositivo *"
              fullWidth
              value={newElement.tipo}
              onChange={(e) => setNew({ ...newElement, tipo: e.target.value })}
              disabled={!assegnatarioSelezionato}
            >
              {Array.isArray(deviceTypes) &&
                deviceTypes.map((t) => (
                  <MenuItem key={t.id} value={t.descrizione}>
                    {t.descrizione}
                  </MenuItem>
                ))}
            </TextField>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              select
              label="Modello"
              fullWidth
              value={newElement.modello}
              onChange={(e) =>
                setNew({ ...newElement, modello: e.target.value })
              }
              disabled={!assegnatarioSelezionato}
            >
              {Array.isArray(deviceModels) &&
                deviceModels.map((m) => (
                  <MenuItem key={m.id} value={m.desModello}>
                    {m.desModello}
                  </MenuItem>
                ))}
            </TextField>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              label="Numero di Serie"
              fullWidth
              value={newElement.seriale}
              onChange={(e) =>
                setNew({ ...newElement, seriale: e.target.value })
              }
              disabled={!assegnatarioSelezionato}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              label="IMEI / ICCID"
              fullWidth
              value={newElement.imei}
              onChange={(e) => setNew({ ...newElement, imei: e.target.value })}
              disabled={!assegnatarioSelezionato}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              select
              label="Operatore / Utenza"
              fullWidth
              value={newElement.utenza}
              onChange={(e) =>
                setNew({ ...newElement, utenza: e.target.value })
              }
              disabled={!assegnatarioSelezionato}
            >
              {Array.isArray(mobileProviders) && mobileProviders.map((p) => (
                <MenuItem key={p.id} value={p.descrizione}>
                  {p.descrizione}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              select
              label="Stato"
              fullWidth
              value={newElement.stato}
              onChange={(e) => setNew({ ...newElement, stato: e.target.value })}
              disabled={!assegnatarioSelezionato}
            >
              {Array.isArray(deviceStatuses) && deviceStatuses.map((s) => (
                <MenuItem key={s.id} value={s.alias}>
                  {s.descrizione} ({s.alias})
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              label="Data Inizio"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newElement.dataInizio}
              onChange={(e) =>
                setNew({ ...newElement, dataInizio: e.target.value })
              }
              disabled={!assegnatarioSelezionato}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              label="Data Fine"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newElement.dataFine}
              onChange={(e) =>
                setNew({ ...newElement, dataFine: e.target.value })
              }
              disabled={!assegnatarioSelezionato}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "30.333%" }, px: 1 }}>
            <TextField
              label="Note"
              fullWidth
              size="small"
              multiline
              rows={2}
              value={newElement.note}
              onChange={(e) => setNew({ ...newElement, note: e.target.value })}
              disabled={!assegnatarioSelezionato}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputBase-inputMultiline": {
                  paddingTop: "12px",
                  paddingBottom: "12px",
                },
              }}
            />
          </Box>
        </Grid>

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            variant="outlined"
            onClick={resetForm}
            disabled={loading || !assegnatarioSelezionato}
          >
            Annulla
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || !assegnatarioSelezionato}
          >
            {newElement.id ? "Salva Modifica" : "Assegna Dispositivo"}
          </Button>
        </Box>
      </Paper>

      {assegnatarioSelezionato && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Storico Assegnazioni - {assegnatarioSelezionato.nome}{" "}
            {assegnatarioSelezionato.cognome}
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : devices.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center", py: 2 }}
            >
              Nessuna assegnazione trovata per questo utente.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Asset</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Modello</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Utenza</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>IMEI</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Serie</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Stato</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Data Inizio</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Data Fine</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Azioni
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {devices.map((d) => (
                    <TableRow
                      key={d.id!}
                      hover
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        cursor: "pointer",
                      }}
                    >
                      <TableCell>{d.asset}</TableCell>
                      <TableCell>{d.tipo}</TableCell>
                      <TableCell>{d.modello}</TableCell>
                      <TableCell>{d.utenza}</TableCell>
                      <TableCell>{d.imei}</TableCell>
                      <TableCell>{d.seriale}</TableCell>
                      <TableCell>{d.stato}</TableCell>
                      <TableCell>{d.dataInizio}</TableCell>
                      <TableCell>{d.dataFine || "-"}</TableCell>
                      <TableCell>{d.note}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => handleOpenMenu(e, d.id!)}
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
      )}

      <Dialog
        open={openSearchDialog}
        onClose={handleCloseSearchDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Ricerca Avanzata Assegnatario</Typography>
          <IconButton onClick={handleCloseSearchDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Utilizza il simbolo % come carattere jolly
          </Typography>

          <Grid container spacing={2}>
            <Box sx={{ width: { xs: "100%", md: "40%" }, px: 1 }}>
              <TextField
                label="Nominativo"
                fullWidth
                value={searchFilters.nominativo}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    nominativo: e.target.value,
                  })
                }
                placeholder="es: %rossi%"
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "40%" }, px: 1 }}>
              <TextField
                label="Codice Utente"
                fullWidth
                value={searchFilters.codiceUtente}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    codiceUtente: e.target.value,
                  })
                }
                placeholder="es: U%"
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "40%" }, px: 1 }}>
              <TextField
                label="Tipo Utente"
                fullWidth
                value={searchFilters.tipoUtente}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    tipoUtente: e.target.value,
                  })
                }
                placeholder="es: %dipendente%"
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "40%" }, px: 1 }}>
              <TextField
                label="Unità Organizzativa"
                fullWidth
                value={searchFilters.unitaOrganizzativa}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    unitaOrganizzativa: e.target.value,
                  })
                }
                placeholder="es: %IT%"
              />
            </Box>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSearchAssegnatario}
              disabled={searchLoading}
            >
              Cerca
            </Button>
            <Button variant="outlined" onClick={handleClearSearchFilters}>
              Pulisci Filtri
            </Button>
          </Box>

          {searchLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {!searchLoading && searchResults.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Risultati trovati: {searchResults.length}
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nominativo</TableCell>
                      <TableCell>Codice Utente</TableCell>
                      <TableCell>Tipo Utente</TableCell>
                      <TableCell>Unità Organizzativa</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell align="center">Azione</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults.map((assegnatario) => (
                      <TableRow key={assegnatario.id} hover>
                        <TableCell>
                          {assegnatario.nome} {assegnatario.cognome}
                        </TableCell>
                        <TableCell>{assegnatario.id}</TableCell>
                        <TableCell>{assegnatario.tipoUtente}</TableCell>
                        <TableCell>{assegnatario.unitaOrganizzativa}</TableCell>
                        <TableCell>{assegnatario.note}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleSelectAssegnatario(assegnatario)
                            }
                          >
                            Seleziona
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {!searchLoading &&
            searchResults.length === 0 &&
            (searchFilters.nominativo ||
              searchFilters.codiceUtente ||
              searchFilters.tipoUtente ||
              searchFilters.unitaOrganizzativa) && (
              <Typography
                sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
              >
                Nessun risultato trovato. Prova a modificare i criteri di
                ricerca.
              </Typography>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSearchDialog}>Chiudi</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleUpdate}>Modifica</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Elimina
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default DeviceAssignmentComponent;
