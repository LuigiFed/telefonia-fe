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
import type { MobileProvider } from "../../types/types";

function MobileProvidersComponent() {
  const [allProviders, setAllProviders] = useState<MobileProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<MobileProvider[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState({
    id: "",
    codice: "",
    descrizione: "",
  });

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newProvider, setNewProvider] = useState({
    id: "",
    codice: "",
    descrizione: "",
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuProviderId, setMenuProviderId] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isFiltered, setIsFiltered] = useState(false);

  const getProviderData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.mobileProviders.list);
      const data = res.data || [];
      setAllProviders(data);
      setFilteredProviders(data);
      setIsFiltered(false);
    } catch {
      console.error("Errore fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProviderData();
  }, []);

  const applySearch = () => {
    let results = [...allProviders];

    if (searchCriteria.id) {
      results = results.filter(p => p.id.toString().includes(searchCriteria.id.trim()));
    }
    if (searchCriteria.codice) {
      results = results.filter(p =>
        p.codice.toLowerCase().includes(searchCriteria.codice.trim().toLowerCase())
      );
    }
    if (searchCriteria.descrizione) {
      results = results.filter(p =>
        p.descrizione.toLowerCase().includes(searchCriteria.descrizione.trim().toLowerCase())
      );
    }

    setFilteredProviders(results);
    setIsFiltered(true);
  };

  const clearSearch = () => {
    setSearchCriteria({ id: "", codice: "", descrizione: "" });
    setFilteredProviders(allProviders);
    setIsFiltered(false);
  };

  const openAddDialogFn = () => {
    setEditMode(false);
    setNewProvider({ id: "", codice: "", descrizione: "" });
    setOpenAddDialog(true);
  };

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setEditMode(false);
    setSelectedId(null);
    setNewProvider({ id: "", codice: "", descrizione: "" });
  };

  const handleSave = async () => {
    if (!newProvider.descrizione?.trim()) {
      alert("La descrizione è obbligatoria.");
      return;
    }

    try {
      const payload = {
        codice: newProvider.codice || null,
        descrizione: newProvider.descrizione,
      };

      if (editMode && selectedId) {
        await axios.put(API.mobileProviders.update.replace(":id", String(selectedId)), payload);
        setSuccessMessage("Provider modificato con successo!");
      } else {
        await axios.post(API.mobileProviders.create, payload);
        setSuccessMessage("Provider aggiunto con successo!");
      }

      await getProviderData();
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
    setMenuProviderId(typeof id === "string" ? parseInt(id) : id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProviderId(null);
  };

  const handleEdit = (provider: MobileProvider) => {
    setEditMode(true);
    setSelectedId(provider.id);
    setNewProvider({
      id: provider.id.toString(),
      codice: provider.codice || "",
      descrizione: provider.descrizione,
    });
    setOpenAddDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = (id: number) => {
    setProviderToDelete(id);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    const provider = allProviders.find(p => p.id === menuProviderId);
    if (!provider) return;
    if (action === "edit") {
      handleEdit(provider);
    } else {
      handleDeleteClick(provider.id);
    }
  };

  const handleConfirmDelete = async () => {
    if (!providerToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(API.mobileProviders.delete.replace(":id", String(providerToDelete)));
      await getProviderData();
      setDeleteModalOpen(false);
      setSuccessMessage("Provider eliminato con successo!");
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
        title="Cerca Provider Mobile"
        onAddNew={openAddDialogFn}
        addButtonLabel="Aggiungi Nuovo Provider"
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
            label: "Codice",
            value: searchCriteria.codice,
            onChange: v => setSearchCriteria({ ...searchCriteria, codice: v }),
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
      <GenericTable<MobileProvider>
        data={filteredProviders}
        columns={[
          { key: "id", label: "ID", width: "15%" },
          { key: "descrizione", label: "Descrizione", width: "50%" },
          { key: "actions", label: "Azioni", width: "15%", align: "center" },
        ]}
        page={1}
        rowsPerPage={10}
        onPageChange={() => {}}
        onMenuClick={handleMenuClick}
        showList={isFiltered && !loading}
        loading={loading}
        emptyMessage="Nessun provider trovato."
        isFiltered={isFiltered}
        totalCount={filteredProviders.length}
        itemName="provider"
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
        title={editMode ? "Modifica Provider" : "Aggiungi Nuovo Provider"}
        fields={[
          {
            label: "ID",
            value: newProvider.id,
            onChange: () => {},
            disabled: true,
            helperText: editMode ? "Il ID non può essere modificato" : "",
          },
          {
            label: "Codice",
            value: newProvider.codice,
            onChange: v => setNewProvider({ ...newProvider, codice: v }),
          },
          {
            label: "Descrizione",
            value: newProvider.descrizione,
            onChange: v => setNewProvider({ ...newProvider, descrizione: v }),
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
        itemName="provider"
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

export default MobileProvidersComponent;