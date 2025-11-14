import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
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
import type { DeviceType } from "../../types/types";

function DeviceTypeComponent() {
  const [allTypes, setAllTypes] = useState<DeviceType[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState({
    ID: "",
    descrizione: "",
  });

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newType, setNewType] = useState({ ID: "", descrizione: "" });
  const [isFiltered, setIsFiltered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTypeId, setMenuTypeId] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const getDeviceTypeData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.deviceTypes.list);
      const data = res.data || [];
      setAllTypes(data);
      setFilteredTypes(data);
    } catch (err) {
      console.error("Errore fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeviceTypeData();
  }, []);

 const applySearch = () => {
  let results = [...allTypes];
  if (searchCriteria.ID) {
    results = results.filter(t => t.id.toString().includes(searchCriteria.ID.trim()));
  }
  if (searchCriteria.descrizione) {
    results = results.filter(t =>
      t.descrizione.toLowerCase().includes(searchCriteria.descrizione.trim().toLowerCase())
    );
  }
  setFilteredTypes(results);
  setIsFiltered(true); 
};

const clearSearch = () => {
  setSearchCriteria({ ID: "", descrizione: "" });
  setFilteredTypes(allTypes);
  setIsFiltered(false); 
};


  const openAddDialogFn = () => {
    setEditMode(false);
    setNewType({ ID: "", descrizione: "" });
    setOpenAddDialog(true);
  };

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setEditMode(false);
    setSelectedId(null);
    setNewType({ ID: "", descrizione: "" });
  };

  const handleSave = async () => {
    if (!newType.ID?.trim() || !newType.descrizione?.trim()) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }
    try {
      if (editMode && selectedId) {
        await axios.put(
          API.deviceTypes.update.replace(":id", String(selectedId)),
          {
            id: parseInt(newType.ID),
            descrizione: newType.descrizione,
          }
        );
        setSuccessMessage("Tipo modificato con successo!");
      } else {
        await axios.post(API.deviceTypes.create, {
          id: parseInt(newType.ID),
          descrizione: newType.descrizione,
        });
        setSuccessMessage("Tipo aggiunto con successo!");
      }
      await getDeviceTypeData();
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
    setMenuTypeId(typeof id === "string" ? parseInt(id) : id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTypeId(null);
  };

  const handleEdit = (type: DeviceType) => {
    setEditMode(true);
    setSelectedId(type.id);
    setNewType({ ID: type.id.toString(), descrizione: type.descrizione });
    setOpenAddDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = (id: number) => {
    setTypeToDelete(id);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    const type = allTypes.find((t) => t.id === menuTypeId);
    if (!type) return;

    if (action === "edit") {
      handleEdit(type);
    } else {
      handleDeleteClick(type.id);
    }
  };

  const handleConfirmDelete = async () => {
    if (!typeToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(
        API.deviceTypes.delete.replace(":id", String(typeToDelete))
      );
      await getDeviceTypeData();
      setDeleteModalOpen(false);
      setSuccessMessage("Tipo eliminato con successo!");
      setSuccessModalOpen(true);
    } catch {
      alert("Errore durante l'eliminazione.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section
      className="menu-gestione"
      style={{ marginLeft: 16, marginRight: 16 }}
    >
      {/* Header */}
      <GenericSearchHeader
        title="Cerca Tipi"
        onAddNew={openAddDialogFn}
        addButtonLabel="Aggiungi Tipo"
      />

      {/* Filtri */}
      <GenericSearchFilters
        fields={[
          {
            label: "ID",
            value: searchCriteria.ID,
            onChange: (v) => setSearchCriteria({ ...searchCriteria, ID: v }),
            minWidth: 120,
          },
          {
            label: "Descrizione",
            value: searchCriteria.descrizione,
            onChange: (v) =>
              setSearchCriteria({ ...searchCriteria, descrizione: v }),
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

      {/* Tabella */}
      <GenericTable<DeviceType>
        data={filteredTypes}
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
        emptyMessage="Nessun tipo trovato."
        isFiltered={filteredTypes.length !== allTypes.length}
        totalCount={filteredTypes.length}
        itemName="tipo"
      />

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
      <GenericFormDialog
        open={openAddDialog}
        onClose={closeAddDialog}
        title={editMode ? "Modifica Tipo" : "Aggiungi Nuovo Tipo"}
        fields={[
          {
            label: "ID",
            value: newType.ID,
            onChange: (v) => setNewType({ ...newType, ID: v }),
          },
          {
            label: "Descrizione",
            value: newType.descrizione,
            onChange: (v) => setNewType({ ...newType, descrizione: v }),
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
        itemName="tipo"
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

export default DeviceTypeComponent;
