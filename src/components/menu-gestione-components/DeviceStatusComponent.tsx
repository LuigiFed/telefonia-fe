import {Box,CircularProgress,Typography} from "@mui/material";

import { DeleteConfirmModal } from "../generics-components/DeleteModal";
import { GenericFormDialog } from "../generics-components/GenericFormDialog";
import { GenericSearchHeader } from "../generics-components/GenericSearchHeaders";
import { GenericSearchFilters } from "../generics-components/GenericSearchFilters";
import { GenericTable } from "../generics-components/GenericTable";
import { SuccessModal } from "../generics-components/SuccessModal";


import "../../theme/default/InputFields.css";

import { API } from "../../mock/mock/api/endpoints";
import type { DeviceStatus } from "../../types/types";
import { useGenericCrud } from "../../hooks/useGenericCrud";

function DeviceStatusComponent() {
  const crud = useGenericCrud<DeviceStatus,{ id: string; alias: string; descrizione: string }>({
    endpoints: {
      list: API.deviceStatuses.list,
      create: API.deviceStatuses.create,
      update: API.deviceStatuses.update,
      delete: API.deviceStatuses.delete,
    },
    itemName: "stato",
    createEmptyItem: () => ({ id: 0, codice: "", alias:"", descrizione: "" }),
    getItemId: (item) => item.id,
    validateItem: (item) => {
      if (!item.descrizione.trim()) return "La descrizione è obbligatoria.";
      return null;
    },
  });
  const filterFunction = (
    items: DeviceStatus[],
    criteria: { id: string; descrizione: string }
  ) => {
    return items.filter((i) => {
      return (
        (!criteria.id || i.id.toString().includes(criteria.id)) &&
        (!criteria.descrizione ||
          i.descrizione
            .toLowerCase()
            .includes(criteria.descrizione.toLowerCase()))
      );
    });
  };

  const {
    searchCriteria,
    setSearchCriteria,
    filteredItems,
    loading,
    isFiltered,
    openAddDialog,
    openDialog,
    closeDialog,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    handleEdit,        
    handleDelete,      
    editMode,
    currentItem,
    setCurrentItem,
    saveItem: handleSaveItem,
    deleteModalOpen,
    setDeleteModalOpen,
    confirmDelete: handleConfirmDelete,
    successModalOpen,
    setSuccessModalOpen,
    successMessage,
  } = crud;

  return (
    <section
      className="menu-gestione"
      style={{ marginLeft: 16, marginRight: 16 }}
    >
      <GenericSearchHeader
        title="Cerca Stati"
        onAddNew={openAddDialog}
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
        onSearch={() => crud.applySearch(filterFunction)}
        onClear={() => crud.clearSearch({ id: "",alias:"", descrizione: "" })}
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
        data={filteredItems}
        columns={[
          { key: "codice", label: "ID", width: "25%" },
          { key: "descrizione", label: "Descrizione", width: "45%" },
          { key: "alias", label: "Alias", width: "25%" },
          { key: "actions", label: "Azioni", width: "15%", align: "center" },
        ]}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onEdit={handleEdit}           
        onDelete={handleDelete}     
        showList={isFiltered && !loading}
        loading={loading}
        emptyMessage="Nessuno stato trovato."
        isFiltered={isFiltered}
        totalCount={filteredItems.length}
        itemName="stato"
      />

      <GenericFormDialog
        open={openDialog}
        onClose={closeDialog}
        title={editMode ? "Modifica Stato" : "Aggiungi Nuovo Stato"}
        fields={[
          {
            label: "ID",
            value: currentItem.id,
            onChange: (v) =>   setCurrentItem({ ...currentItem, id: Number(v) || 0 }),
          },
          {
            label: "Descrizione",
            value: currentItem.descrizione,
            onChange: (v) => setCurrentItem({ ...currentItem, descrizione: v }),
          },
          {
            label: "Alias",
            value: currentItem.alias,
            onChange: (v) => setCurrentItem({ ...currentItem, alias: v }),
          },
        ]}
        onSave={handleSaveItem}
        editMode={editMode}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        deleting={loading}
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
