import { Box, CircularProgress, Typography } from "@mui/material";

import { DeleteConfirmModal } from "../generics-components/DeleteModal";
import { GenericFormDialog } from "../generics-components/GenericFormDialog";
import { GenericSearchHeader } from "../generics-components/GenericSearchHeaders";
import { GenericSearchFilters } from "../generics-components/GenericSearchFilters";
import { GenericTable } from "../generics-components/GenericTable";
import { SuccessModal } from "../generics-components/SuccessModal";

import "../../theme/default/InputFields.css";
import { API } from "../../mock/mock/api/endpoints";
import { useGenericCrud } from "../../hooks/useGenericCrud";
import type { DeviceModel } from "../../types/types";

function DeviceModelsComponent() {

  const crud = useGenericCrud<DeviceModel, { id: string; desModello: string }>({
    endpoints: {
      list: API.deviceModels.list,
      create: API.deviceModels.create,
      update: API.deviceModels.update,
      delete: API.deviceModels.delete,
    },
    itemName: "modello",
    createEmptyItem: () => ({ id: 0, desModello: "" }),
    getItemId: (item) => item.id,
    validateItem: (item) => {
      if (!item.desModello.trim()) return "La descrizione è obbligatoria.";
      return null;
    },
  });

  const {
    filteredItems,
    loading,
    isFiltered,
    openAddDialog,
    openDialog,
    closeDialog,
    editMode,
    currentItem,
    setCurrentItem,
    saveItem,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    handleEdit,        
    handleDelete,      
    deleteModalOpen,
    confirmDelete,
    deleting,
    successModalOpen,
    setSuccessModalOpen,
    successMessage,
    searchCriteria,
    setSearchCriteria,
    applySearch,
    clearSearch,
  } = crud;

  const filterFunction = (
    items: DeviceModel[],
    criteria: { id: string; desModello: string }
  ) => {
    return items.filter((i) => {
      return (
        (!criteria.id || i.id.toString().includes(criteria.id)) &&
        (!criteria.desModello ||
          i.desModello.toLowerCase().includes(criteria.desModello.toLowerCase()))
      );
    });
  };

  return (
    <section className="menu-gestione" style={{ margin: 16 }}>
      {/* Header */}
      <GenericSearchHeader
        title="Gestione Modelli"
        onAddNew={openAddDialog}
        addButtonLabel="Aggiungi Modello"
      />

      {/* Filtri */}
      <GenericSearchFilters
        fields={[
          {
            label: "ID",
            value: searchCriteria.id || "",
            onChange: (v) => setSearchCriteria({ ...searchCriteria, id: v }),
            minWidth: 120,
          },
          {
            label: "Descrizione",
            value: searchCriteria.desModello || "",
            onChange: (v) => setSearchCriteria({ ...searchCriteria, desModello: v }),
            minWidth: 200,
            flex: 1,
          },
        ]}
        onSearch={() => applySearch(filterFunction)}
        onClear={() => clearSearch({ id: "", desModello: "" })}
      />

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress color="primary" />
          <Typography sx={{ mt: 2 }}>Caricamento modelli...</Typography>
        </Box>
      )}

       {/* Messaggio iniziale */}
      {/* {isFiltered && !loading && (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <Typography variant="body1">
            Inserisci i criteri di ricerca e clicca <strong>Ricerca</strong>
          </Typography>
        </Box>
      )} */}

    
      <GenericTable<DeviceModel>
        data={filteredItems}
        columns={[
          { key: "id", label: "ID", width: "20%" },
          { key: "desModello", label: "Descrizione Modello", width: "65%" },
          { key: "actions", label: "Azioni", width: "15%", align: "center" },
        ]}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onEdit={handleEdit}
        onDelete={handleDelete} 
        showList={true}
        loading={loading}
        emptyMessage="Nessun modello trovato con i criteri inseriti."
        isFiltered={isFiltered}
        totalCount={filteredItems.length}
        itemName="modelli"
      />

      {/* Dialog Modifica / Aggiungi */}
      <GenericFormDialog
        open={openDialog}
        onClose={closeDialog}
        title={editMode ? "Modifica Modello" : "Aggiungi Nuovo Modello"}
        fields={[
          {
            label: "ID",
            value: currentItem.id,
            disabled: true,
            onChange: () => {},
          },
          {
            label: "Descrizione",
            value: currentItem.desModello,
            onChange: (v) => setCurrentItem({ ...currentItem, desModello: v }),
          },
        ]}
        onSave={saveItem}
        editMode={editMode}
      />

      {/* Conferma eliminazione */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => crud.setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
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