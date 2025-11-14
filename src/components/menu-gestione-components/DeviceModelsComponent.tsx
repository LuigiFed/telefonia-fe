import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Menu, MenuItem } from "@mui/material";
import axios from "axios";

import { DeleteConfirmModal } from "../generics-components/DeleteModal";
import { GenericFormDialog } from "../generics-components/GenericFormDialog";
import { GenericSearchHeader } from "../generics-components/GenericSearchHeaders";
import { GenericSearchFilters } from "../generics-components/GenericSearchFilters";
import { GenericTable } from "../generics-components/GenericTable";
import { SuccessModal } from "../generics-components/SuccessModal";

import "../../theme/default/MenuGestioneComponents.css";
import "../../theme/default/InputFields.css";

import { API } from "../../mock/mock/api/endpoints";
import type { DeviceModel } from "../../types/types";

function DeviceModelsComponent() {
  const [allDevices, setAllDevices] = useState<DeviceModel[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState({
    id: "",
    desModello: "",
  });

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newDevice, setNewDevice] = useState({ id: "", desModello: "" });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDeviceId, setMenuDeviceId] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isFiltered, setIsFiltered] = useState(false);

  const getDeviceData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.deviceModels.list);
      const data = res.data || [];
      setAllDevices(data);
      setFilteredDevices(data);
      setIsFiltered(false);
    } catch {
      console.error("Errore fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeviceData();
  }, []);

  const applySearch = () => {
    let results = [...allDevices];

    if (searchCriteria.id) {
      results = results.filter(d => d.id.toString().includes(searchCriteria.id.trim()));
    }
    if (searchCriteria.desModello) {
      results = results.filter(d =>
        d.desModello.toLowerCase().includes(searchCriteria.desModello.trim().toLowerCase())
      );
    }

    setFilteredDevices(results);
    setIsFiltered(true); 
  };

  const clearSearch = () => {
    setSearchCriteria({ id: "", desModello: "" });
    setFilteredDevices(allDevices);
    setIsFiltered(false); 
  };

  const openAddDialogFn = () => {
    setEditMode(false);
    setNewDevice({ id: "", desModello: "" });
    setOpenAddDialog(true);
  };

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setEditMode(false);
    setSelectedId(null);
    setNewDevice({ id: "", desModello: "" });
  };

  const handleSave = async () => {
    if (!newDevice.desModello?.trim()) {
      alert("La descrizione è obbligatoria.");
      return;
    }

    try {
      const payload = { desModello: newDevice.desModello };

      if (editMode && selectedId) {
        await axios.put(API.deviceModels.update.replace(":id", String(selectedId)), payload);
        setSuccessMessage("Modello modificato con successo!");
      } else {
        await axios.post(API.deviceModels.create, payload);
        setSuccessMessage("Modello aggiunto con successo!");
      }

      await getDeviceData();
      closeAddDialog();
      setSuccessModalOpen(true);
    } catch {
      alert("Errore durante il salvataggio.");
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | number
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuDeviceId(typeof id === "string" ? parseInt(id) : id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDeviceId(null);
  };

  const handleEdit = (device: DeviceModel) => {
    setEditMode(true);
    setSelectedId(device.id);
    setNewDevice({ id: device.id.toString(), desModello: device.desModello });
    setOpenAddDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = (id: number) => {
    setDeviceToDelete(id);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    const device = allDevices.find(d => d.id === menuDeviceId);
    if (!device) return;
    if (action === "edit") {
      handleEdit(device);
    } else {
      handleDeleteClick(device.id);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(API.deviceModels.delete.replace(":id", String(deviceToDelete)));
      await getDeviceData();
      setDeleteModalOpen(false);
      setSuccessMessage("Modello eliminato con successo!");
      setSuccessModalOpen(true);
    } catch {
      alert("Errore durante l'eliminazione.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="menu-gestione" style={{ marginLeft: 16, marginRight: 16 }}>
      {/* Header */}
      <GenericSearchHeader
        title="Cerca Modelli"
        onAddNew={openAddDialogFn}
        addButtonLabel="Aggiungi Nuovo Modello"
      />

      {/* Filtri */}
      <GenericSearchFilters
        fields={[
          {
            label: "ID",
            value: searchCriteria.id,
            onChange: v => setSearchCriteria({ ...searchCriteria, id: v }),
            minWidth: 120,
          },
          {
            label: "Descrizione",
            value: searchCriteria.desModello,
            onChange: v => setSearchCriteria({ ...searchCriteria, desModello: v }),
            minWidth: 200,
            flex: 1,
          },
        ]}
        onSearch={applySearch}
        onClear={clearSearch}
      />

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" color="var(--neutro-600)" sx={{ mt: 1 }}>
            Caricamento...
          </Typography>
        </Box>
      )}

      {/* Messaggio iniziale */}
      {!isFiltered && !loading && (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <Typography variant="body1">
            Inserisci i criteri di ricerca e premi <strong>Ricerca</strong>
          </Typography>
        </Box>
      )}

      {/* Tabella */}
      <GenericTable<DeviceModel>
        data={filteredDevices}
        columns={[
          { key: "id", label: "ID", width: "20%" },
          { key: "desModello", label: "Descrizione", width: "65%" },
          { key: "actions", label: "Azioni", width: "15%", align: "center" },
        ]}
        page={1}
        rowsPerPage={10}
        onPageChange={() => {}}
        onMenuClick={handleMenuClick}
        showList={isFiltered && !loading}   
        loading={loading}
        emptyMessage="Nessun modello trovato."
        isFiltered={isFiltered}
        totalCount={filteredDevices.length}
        itemName="modello"
      />

      {/* Menu Azioni */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" } }}
      >
        <MenuItem onClick={() => handleMenuAction("edit")}>Modifica</MenuItem>
        <MenuItem onClick={() => handleMenuAction("delete")} sx={{ color: "error.main" }}>
          Elimina
        </MenuItem>
        </Menu>

      {/* Dialog Aggiungi/Modifica */}
      <GenericFormDialog
        open={openAddDialog}
        onClose={closeAddDialog}
        title={editMode ? "Modifica Modello" : "Aggiungi Nuovo Modello"}
        fields={[
          {
            label: "ID",
            value: newDevice.id,
            onChange: () => {}, 
            disabled: true,
            helperText: editMode ? "Il ID non può essere modificato" : "",
          },
          {
            label: "Descrizione",
            value: newDevice.desModello,
            onChange: v => setNewDevice({ ...newDevice, desModello: v }),
          },
        ]}
        onSave={handleSave}
        editMode={editMode}
      />

      {/* Conferma Eliminazione */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        itemName="modello"
      />

      {/* Successo */}
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={successMessage}
      />
    </section>
  );
}

export default DeviceModelsComponent;