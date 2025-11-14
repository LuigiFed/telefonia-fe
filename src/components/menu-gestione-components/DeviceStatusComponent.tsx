import React, { useState, useEffect, useMemo } from "react";
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
import type { DeviceStatus } from "../../types/types";

const ROWS_PER_PAGE = 10;

function DeviceStatusComponent() {
  const [allStatuses, setAllStatuses] = useState<DeviceStatus[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<DeviceStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState({
    id: "",
    descrizione: "",
    alias: "",
  });

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState({
    id: "",
    descrizione: "",
    alias: "",
  });

  const [page, setPage] = useState(1);
  const [showList, setShowList] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuStatusId, setMenuStatusId] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const displayStatuses = useMemo(() => {
    return isFiltered ? filteredStatuses : allStatuses;
  }, [isFiltered, filteredStatuses, allStatuses]);

  const getStatusData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.deviceStatuses.list);
      const data = res.data || [];
      setAllStatuses(data);
      setFilteredStatuses(data);
      setIsFiltered(false);
    } catch (err) {
      console.error("Errore fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStatusData();
  }, []);

  const applySearch = () => {
    let results = [...allStatuses];
    if (searchCriteria.id) {
      results = results.filter((s) =>
        s.codice.toLowerCase().includes(searchCriteria.id.trim().toLowerCase())
      );
    }
    if (searchCriteria.descrizione) {
      results = results.filter((s) =>
        s.descrizione
          .toLowerCase()
          .includes(searchCriteria.descrizione.trim().toLowerCase())
      );
    }
    if (searchCriteria.alias) {
      results = results.filter((s) =>
        s.alias
          .toLowerCase()
          .includes(searchCriteria.alias.trim().toLowerCase())
      );
    }
    setFilteredStatuses(results);
    setIsFiltered(true);
    setShowList(true);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchCriteria({ id: "", descrizione: "", alias: "" });
    setFilteredStatuses(allStatuses);
    setIsFiltered(false);
    setShowList(false);
    setPage(1);
  };

  const openAddDialogFn = () => {
    setEditMode(false);
    setNewStatus({ id: "", descrizione: "", alias: "" });
    setOpenAddDialog(true);
  };

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setEditMode(false);
    setSelectedId(null);
    setNewStatus({ id: "", descrizione: "", alias: "" });
  };

  const handleSave = async () => {
    if (
      !newStatus.id?.trim() ||
      !newStatus.descrizione?.trim() ||
      !newStatus.alias?.trim()
    ) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }

    try {
      if (editMode && selectedId) {
        await axios.put(
          API.deviceStatuses.update.replace(":id", String(selectedId)),
          {
            codice: newStatus.id,
            descrizione: newStatus.descrizione,
            alias: newStatus.alias,
          }
        );
        setSuccessMessage("Stato modificato con successo!");
      } else {
        await axios.post(API.deviceStatuses.create, {
          codice: newStatus.id,
          descrizione: newStatus.descrizione,
          alias: newStatus.alias,
        });
        setSuccessMessage("Stato aggiunto con successo!");
      }
      await getStatusData();
      closeAddDialog();
      setSuccessModalOpen(true);
    } catch (err) {
      console.error("Errore salvataggio:", err);
      alert("Errore durante il salvataggio.");
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | number
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuStatusId(typeof id === "string" ? parseInt(id) : id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuStatusId(null);
  };

  const handleEdit = (status: DeviceStatus) => {
    setEditMode(true);
    setSelectedId(status.id);
    setNewStatus({
      id: status.codice,
      descrizione: status.descrizione,
      alias: status.alias,
    });
    setOpenAddDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = (id: number) => {
    setStatusToDelete(id);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    const status = allStatuses.find((s) => s.id === menuStatusId);
    if (!status) return;
    if (action === "edit") handleEdit(status);
    else if (action === "delete") handleDeleteClick(status.id);
  };

  const handleConfirmDelete = async () => {
    if (!statusToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(
        API.deviceStatuses.delete.replace(":id", String(statusToDelete))
      );
      await getStatusData();
      setDeleteModalOpen(false);
      setStatusToDelete(null);
      setSuccessMessage("Stato eliminato con successo!");
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Errore nella cancellazione:", error);
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
      <GenericSearchHeader
        title="Cerca Stati"
        onAddNew={openAddDialogFn}
        addButtonLabel="Aggiungi Stato"
      />

      <GenericSearchFilters
        fields={[
          {
            label: "ID",
            value: searchCriteria.id,
            onChange: (v) => setSearchCriteria({ ...searchCriteria, id: v }),
            minWidth: 120,
          },
          {
            label: "Descrizione",
            value: searchCriteria.descrizione,
            onChange: (v) =>
              setSearchCriteria({ ...searchCriteria, descrizione: v }),
            minWidth: 180,
            flex: 1,
          },
          {
            label: "Alias",
            value: searchCriteria.alias,
            onChange: (v) => setSearchCriteria({ ...searchCriteria, alias: v }),
            minWidth: 120,
          },
        ]}
        onSearch={applySearch}
        onClear={clearSearch}
      />

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
            Inserisci i criteri di ricerca e clicca <strong>Ricerca</strong>
          </Typography>
        </Box>
      )}
      <GenericTable<DeviceStatus>
        data={displayStatuses}
        columns={[
          { key: "codice", label: "ID", width: "25%" },
          { key: "descrizione", label: "Descrizione", width: "45%" },
          { key: "alias", label: "Alias", width: "25%" },
          { key: "actions", label: "Azioni", width: "15%", align: "center" },
        ]}
        page={page}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={setPage}
        onMenuClick={handleMenuClick}
        showList={showList && !loading}
        loading={loading}
        emptyMessage="Nessun stato trovato."
        isFiltered={isFiltered}
        totalCount={displayStatuses.length}
        itemName="stato"
      />

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

      <GenericFormDialog
        open={openAddDialog}
        onClose={closeAddDialog}
        title={editMode ? "Modifica Stato" : "Aggiungi Nuovo Stato"}
        fields={[
          {
            label: "ID",
            value: newStatus.id,
            onChange: (v) => setNewStatus({ ...newStatus, id: v }),
          },
          {
            label: "Descrizione",
            value: newStatus.descrizione,
            onChange: (v) => setNewStatus({ ...newStatus, descrizione: v }),
          },
          {
            label: "Alias",
            value: newStatus.alias,
            onChange: (v) => setNewStatus({ ...newStatus, alias: v }),
          },
        ]}
        onSave={handleSave}
        editMode={editMode}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        itemName="stato"
      />

      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={successMessage}
      />
    </section>
  );
}

export default DeviceStatusComponent;
