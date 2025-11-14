import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Menu, MenuItem } from "@mui/material";
import axios from "axios";

import { DeleteConfirmModal } from "../GenericsComponents/DeleteModal";
import { GenericFormDialog } from "../GenericsComponents/GenericFormDialog";
import { GenericSearchHeader } from "../GenericsComponents/GenericSearchHeaders";
import { GenericSearchFilters } from "../GenericsComponents/GenericSearchFilters";
import { GenericTable } from "../GenericsComponents/GenericTable";
import { SuccessModal } from "../GenericsComponents/SuccessModal";

import "../../theme/default/MenuGestioneComponents.css";
import "../../theme/default/InputFields.css";

import { API } from "../../mock/mock/api/endpoints";
import type { ServiceType } from "../../types/types";

function ServiceTypeComponent() {
  const [allServices, setAllServices] = useState<ServiceType[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState({
    id: "",
    descrizione: "",
  });

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newService, setNewService] = useState({ id: "", descrizione: "" });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuServiceId, setMenuServiceId] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isFiltered, setIsFiltered] = useState(false);

  const getServiceData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.serviceTypes.list);
      const data = res.data || [];
      setAllServices(data);
      setFilteredServices(data);
      setIsFiltered(false);
    } catch {
      console.error("Errore fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServiceData();
  }, []);

  const applySearch = () => {
    let results = [...allServices];

    if (searchCriteria.id) {
      results = results.filter(s => s.id.toString().includes(searchCriteria.id.trim()));
    }
    if (searchCriteria.descrizione) {
      results = results.filter(s =>
        s.descrizione.toLowerCase().includes(searchCriteria.descrizione.trim().toLowerCase())
      );
    }

    setFilteredServices(results);
    setIsFiltered(true);
  };

  const clearSearch = () => {
    setSearchCriteria({ id: "", descrizione: "" });
    setFilteredServices(allServices);
    setIsFiltered(false);
  };

  const openAddDialogFn = () => {
    setEditMode(false);
    setNewService({ id: "", descrizione: "" });
    setOpenAddDialog(true);
  };

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setEditMode(false);
    setSelectedId(null);
    setNewService({ id: "", descrizione: "" });
  };

  const handleSave = async () => {
    if (!newService.descrizione?.trim()) {
      alert("Compila il campo descrizione.");
      return;
    }

    try {
      const payload = { descrizione: newService.descrizione };

      if (editMode && selectedId) {
        await axios.put(API.serviceTypes.update.replace(":id", String(selectedId)), payload);
        setSuccessMessage("Servizio modificato con successo!");
      } else {
        await axios.post(API.serviceTypes.create, payload);
        setSuccessMessage("Servizio aggiunto con successo!");
      }

      await getServiceData();
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
    setMenuServiceId(typeof id === "string" ? parseInt(id) : id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuServiceId(null);
  };

  const handleEdit = (service: ServiceType) => {
    setEditMode(true);
    setSelectedId(service.id);
    setNewService({
      id: service.id.toString(),
      descrizione: service.descrizione,
    });
    setOpenAddDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = (id: number) => {
    setServiceToDelete(id);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    const service = allServices.find(s => s.id === menuServiceId);
    if (!service) return;
    if (action === "edit") {
      handleEdit(service);
    } else {
      handleDeleteClick(service.id);
    }
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(API.serviceTypes.delete.replace(":id", String(serviceToDelete)));
      await getServiceData();
      setDeleteModalOpen(false);
      setSuccessMessage("Servizio eliminato con successo!");
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
        title="Cerca Tipi di Servizio"
        onAddNew={openAddDialogFn}
        addButtonLabel="Aggiungi Nuovo Tipo Servizio"
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
            value: searchCriteria.descrizione,
            onChange: v => setSearchCriteria({ ...searchCriteria, descrizione: v }),
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
      <GenericTable<ServiceType>
        data={filteredServices}
        columns={[
          { key: "id", label: "ID", width: "20%" },
          { key: "descrizione", label: "Descrizione", width: "65%" },
          { key: "actions", label: "Azioni", width: "15%", align: "center" },
        ]}
        page={1}
        rowsPerPage={10}
        onPageChange={() => {}}
        onMenuClick={handleMenuClick}
        showList={isFiltered && !loading}
        loading={loading}
        emptyMessage="Nessun tipo servizio trovato."
        isFiltered={isFiltered}
        totalCount={filteredServices.length}
        itemName="tipo servizio"
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
        title={editMode ? "Modifica Tipo Servizio" : "Aggiungi Nuovo Tipo Servizio"}
        fields={[
          {
            label: "ID",
            value: newService.id,
            onChange: () => {},
            disabled: true,
            helperText: editMode ? "Il ID non può essere modificato" : "",
          },
          {
            label: "Descrizione",
            value: newService.descrizione,
            onChange: v => setNewService({ ...newService, descrizione: v }),
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
        itemName="tipo servizio"
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

export default ServiceTypeComponent;