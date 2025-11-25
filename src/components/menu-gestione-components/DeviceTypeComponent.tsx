import {Box,CircularProgress,Typography} from "@mui/material";

import { DeleteConfirmModal } from "../generics-components/DeleteModal";
import { GenericFormDialog } from "../generics-components/GenericFormDialog";
import { GenericSearchHeader } from "../generics-components/GenericSearchHeaders";
import { GenericSearchFilters } from "../generics-components/GenericSearchFilters";
import { GenericTable } from "../generics-components/GenericTable";
import { SuccessModal } from "../generics-components/SuccessModal";


import "../../theme/default/InputFields.css";
import { API } from "../../mock/mock/api/endpoints";
import type { DeviceType } from "../../types/types";
import { useGenericCrud } from "../../hooks/useGenericCrud";

function DeviceTypeComponent() {
  const crud = useGenericCrud<DeviceType, { id: string; desTipoDispositivo: string }>({
    endpoints: {
      list: API.deviceTypes.list,
      create: API.deviceTypes.create,
      update: API.deviceTypes.update,
      delete: API.deviceTypes.delete,
    },
    itemName: "stato",
    createEmptyItem: () => ({ id: 0, codice: "", desTipoDispositivo: "" }),
    getItemId: (item) => item.id,
    validateItem: (item) => {
      if (!item.desTipoDispositivo.trim()) return "La desTipoDispositivo è obbligatoria.";
      return null;
    },
  });
  const filterFunction = (
    items: DeviceType[],
    criteria: { id: string; desTipoDispositivo: string }
  ) => {
    return items.filter((i) => {
      return (
        (!criteria.id || i.id.toString().includes(criteria.id)) &&
        (!criteria.desTipoDispositivo ||
          (i.desTipoDispositivo ?? "")
            .toLowerCase()
            .includes(criteria.desTipoDispositivo.toLowerCase()))
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
    tipoDispositivoId: currentItem.id, 
    desTipoDispositivo: currentItem.desTipoDispositivo ?? "",
  };

  const url = editMode
    ? API.deviceTypes.update.replace(":id", currentItem.id.toString())
    : API.deviceTypes.create;

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
        title="Cerca Tipi"
        onAddNew={openAddDialog}
        addButtonLabel="Aggiungi Tipo"
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
            label: "Descrizione Tipo Dispositivo",
            value: searchCriteria.desTipoDispositivo,
            onChange: (v) =>
              setSearchCriteria({ ...searchCriteria, desTipoDispositivo: v }),
            minWidth: 200,
            flex: 1,
          },
        ]}
        onSearch={() => crud.applySearch(filterFunction)}
        onClear={() => crud.clearSearch({ id: "", desTipoDispositivo: "" })}
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
      <GenericTable<DeviceType>
        data={filteredItems}
        columns={[
          { key: "id", label: "ID", width: "20%" },
          { key: "desTipoDispositivo", label: "Descrizione Tipo Dispositivo", width: "65%", render: (row) => row.desTipoDispositivo ?? "" },
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
        emptyMessage="Nessun tipo trovato."
        isFiltered={isFiltered}
        totalCount={filteredItems.length}
        itemName="tipo"
      />

      {/* Dialog Aggiungi/Modifica */}
      <GenericFormDialog
        open={openDialog}
        onClose={closeDialog}
        title={editMode ? "Modifica Tipo" : "Aggiungi Nuovo Tipo"}
        fields={[
          {
            label: "ID",
            value: currentItem.id,
            onChange: (v) =>
              setCurrentItem({ ...currentItem, id: Number(v) || 0 }),
            disabled: true,
          },
          {
            label: "Descrizione Dispositivo",
            value: currentItem.desTipoDispositivo,
            onChange: (v) => setCurrentItem({ ...currentItem, desTipoDispositivo: v }),
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

export default DeviceTypeComponent;
