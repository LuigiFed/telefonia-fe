import {Box,CircularProgress,Typography} from "@mui/material";

import { DeleteConfirmModal } from "../generics-components/DeleteModal";
import { GenericFormDialog } from "../generics-components/GenericFormDialog";
import { GenericSearchHeader } from "../generics-components/GenericSearchHeaders";
import { GenericSearchFilters } from "../generics-components/GenericSearchFilters";
import { GenericTable } from "../generics-components/GenericTable";
import { SuccessModal } from "../generics-components/SuccessModal";


import "../../theme/default/InputFields.css";

import { API } from "../../mock/mock/api/endpoints";
import type { MobileProvider } from "../../types/types";
import { useGenericCrud } from "../../hooks/useGenericCrud";

function MobileProvidersComponent() {
  const crud = useGenericCrud<
    MobileProvider,
    { id: string; descrizione: string }
  >({
    endpoints: {
      list: API.mobileProviders.list,
      create: API.mobileProviders.create,
      update: API.mobileProviders.update,
      delete: API.mobileProviders.delete,
    },
    itemName: "provider",
    createEmptyItem: () => ({ id: 0, codice: "", descrizione: "" }),
    getItemId: (item) => item.id,
    validateItem: (item) => {
      if (!item.descrizione.trim()) return "La descrizione è obbligatoria.";
      return null;
    },
  });
  const filterFunction = (
    items: MobileProvider[],
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
    handleDelete,
    handleEdit,
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
      {/* Header */}
      <GenericSearchHeader
        title="Cerca Provider Mobile"
        onAddNew={openAddDialog}
        addButtonLabel="Aggiungi Nuovo Provider"
      />

      {/* Filtri */}
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
            minWidth: 200,
            flex: 1,
          },
        ]}
        onSearch={() => crud.applySearch(filterFunction)}
        onClear={() => crud.clearSearch({ id: "", descrizione: "" })}
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
            Inserisci i criteri di ricerca e clicca <strong>Ricerca</strong>
          </Typography>
        </Box>
      )}

      {/* Tabella */}
      <GenericTable<MobileProvider>
        data={filteredItems}
        columns={[
          { key: "id", label: "ID", width: "15%" },
          { key: "descrizione", label: "Descrizione", width: "50%" },
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
        emptyMessage="Nessun provider trovato."
        isFiltered={isFiltered}
        totalCount={filteredItems.length}
        itemName="provider"
      />

      {/* Dialog Aggiungi/Modifica */}
      <GenericFormDialog
        open={openDialog}
        onClose={closeDialog}
        title={editMode ? "Modifica Provider" : "Aggiungi Nuovo Provider"}
        fields={[
          {
            label: "ID",
            value: currentItem.id,
            onChange: () => {},
            disabled: true,
            helperText: editMode ? "Il ID non può essere modificato" : "",
          },
          {
            label: "Codice",
            value: currentItem.codice,
            onChange: (v) => setCurrentItem({ ...currentItem, codice: v }),
          },
          {
            label: "Descrizione",
            value: currentItem.descrizione,
            onChange: (v) => setCurrentItem({ ...currentItem, descrizione: v }),
          },
        ]}
        onSave={handleSaveItem}
        editMode={editMode}
      />

      {/* Conferma Eliminazione */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        deleting={loading}
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
