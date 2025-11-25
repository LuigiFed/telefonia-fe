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
    { id: string; desGestore: string }
  >({
    endpoints: {
      list: API.mobileProviders.list,
      create: API.mobileProviders.create,
      update: API.mobileProviders.update,
      delete: API.mobileProviders.delete,
    },
    itemName: "provider",
    createEmptyItem: () => ({ id: 0, desGestore: "" }),
    getItemId: (item) => item.id,
    validateItem: (item) => {
      if (!item.desGestore.trim()) return "La desGestore è obbligatoria.";
      return null;
    },
  });
  const filterFunction = (
    items: MobileProvider[],
    criteria: { id: string; desGestore: string }
  ) => {
    return items.filter((i) => {
      return (
        (!criteria.id || i.id.toString().includes(criteria.id)) &&
        (!criteria.desGestore ||
          (i.desGestore ?? "")
            .toLowerCase()
            .includes(criteria.desGestore.toLowerCase()))
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
    deleteModalOpen,
    setDeleteModalOpen,
    confirmDelete: handleConfirmDelete,
    successModalOpen,
    setSuccessModalOpen,
    successMessage,
  } = crud;

const saveItem = async (): Promise<void> => {
  if (!currentItem) return;

  const payload = {
    gestoreId: currentItem.id,
    desGestore: currentItem.desGestore,
  };

  const url = editMode
    ? API.mobileProviders.update.replace(":id", currentItem.id.toString())
    : API.mobileProviders.create;

  const method = editMode ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  closeDialog();
  crud.refreshItems();
};



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
            label: "Descrizione Gestore",
            value: searchCriteria.desGestore,
            onChange: (v) =>
              setSearchCriteria({ ...searchCriteria, desGestore: v }),
            minWidth: 200,
            flex: 1,
          },
        ]}
        onSearch={() => crud.applySearch(filterFunction)}
        onClear={() => crud.clearSearch({ id: "", desGestore: "" })}
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
      {/* {!isFiltered && !loading && (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <Typography variant="body1">
            Inserisci i criteri di ricerca e clicca <strong>Ricerca</strong>
          </Typography>
        </Box>
      )} */}

      {/* Tabella */}
      <GenericTable<MobileProvider>
        data={filteredItems}
        columns={[
          { key: "id", label: "ID", width: "15%" },
          { key: "desGestore", label: "Descrizione Gestore", width: "50%" ,  render: (row) => row.desGestore ?? ""},
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
            label: "Descrizione Gestore",
            value: currentItem.desGestore,
            onChange: (v) => setCurrentItem({ ...currentItem, desGestore: v }),
          },
        ]}
        onSave={saveItem} 
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
