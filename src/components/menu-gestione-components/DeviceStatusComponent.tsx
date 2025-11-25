import { Box, CircularProgress, Typography } from "@mui/material";

import { DeleteConfirmModal } from "../generics-components/DeleteModal";
import { GenericFormDialog } from "../generics-components/GenericFormDialog";
import { GenericSearchHeader } from "../generics-components/GenericSearchHeaders";
import { GenericSearchFilters } from "../generics-components/GenericSearchFilters";
import { GenericTable } from "../generics-components/GenericTable";
import { SuccessModal } from "../generics-components/SuccessModal";

import { API } from "../../mock/mock/api/endpoints";
import type { DeviceStatus } from "../../types/types";
import { useGenericCrud } from "../../hooks/useGenericCrud";

function DeviceStatusComponent() {
  const crud = useGenericCrud<DeviceStatus>({
    endpoints: {
      list: API.deviceStatuses.list,
      create: API.deviceStatuses.create,
      update: API.deviceStatuses.update,
      delete: API.deviceStatuses.delete,
    },
    itemName: "stato dispositivo",
    createEmptyItem: () => ({ id: 0, desStato: "", alias: "" }),
    getItemId: (item) => item.id,
    validateItem: (item) => {
      if (!item.desStato?.trim()) return "La descrizione dello stato è obbligatoria.";
      return null;
    },
  });
  const filterFunction = (
    items: DeviceStatus[],
    criteria: Record<string, string>
  ) => {
    const { id = "", desStato = "", alias = "" } = criteria;
    return items.filter((i) => {
      return (
        (!id || i.id.toString().includes(id)) &&
        (!desStato || (i.desStato ?? "").toLowerCase().includes(desStato.toLowerCase())) &&
        (!alias || (i.alias ?? "").toLowerCase().includes(alias.toLowerCase()))
      );
    });
  };

  const {
    searchCriteria,
    setSearchCriteria,
    filteredItems,
    loading,
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
    confirmDelete,
    successModalOpen,
    setSuccessModalOpen,
    successMessage,
    isFiltered
  } = crud;

  const saveItem = async (): Promise<void> => {
  if (!currentItem) return;

  const payload = {
    statoId: currentItem.id,
    desStato: currentItem.desStato,
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
    <section className="menu-gestione" style={{ marginLeft: 16, marginRight: 16 }}>
      <GenericSearchHeader
        title="Gestione Stati Dispositivo"
        onAddNew={openAddDialog}
        addButtonLabel="Aggiungi Stato"
      />

      <GenericSearchFilters
        fields={[
          {
            label: "ID",
            value: searchCriteria.id || "",
            onChange: (v) => setSearchCriteria({ ...searchCriteria, id: v }),
            minWidth: 100,
          },
          {
            label: "Descrizione",
            value: searchCriteria.desStato || "",
            onChange: (v) => setSearchCriteria({ ...searchCriteria, desStato: v }),
            minWidth: 200,
            flex: 1,
          },
          {
            label: "Alias",
            value: searchCriteria.alias || "",
            onChange: (v) => setSearchCriteria({ ...searchCriteria, alias: v }),
            minWidth: 120,
          },
        ]}
        onSearch={() => crud.applySearch(filterFunction)}
        onClear={() => crud.clearSearch({ id: "", desStato: "", alias: "" })}
      />

      {loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" color="var(--neutro-600)" sx={{ mt: 1 }}>
            Caricamento stati dispositivo...
          </Typography>
        </Box>
      )}

      <GenericTable<DeviceStatus>
        data={filteredItems}
        columns={[
          { key: "id", label: "ID", width: "15%" },
          { key: "desStato", label: "Descrizione", width: "50%" },
          { key: "alias", label: "Alias", width: "25%" },
          { key: "actions", label: "Azioni", width: "10%", align: "center" },
        ]}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showList={true}
        loading={loading}
        emptyMessage="Nessuno stato dispositivo trovato."
        isFiltered={isFiltered} 
        totalCount={filteredItems.length}
        itemName="stato dispositivo"
      />

      <GenericFormDialog
        open={openDialog}
        onClose={closeDialog}
        title={editMode ? "Modifica Stato Dispositivo" : "Aggiungi Nuovo Stato"}
        fields={[
          {
            label: "Descrizione",
            value: currentItem.desStato || "",
            onChange: (v) => setCurrentItem({ ...currentItem, desStato: v }),
        
          },
          {
            label: "Alias",
            value: currentItem.alias || "",
            onChange: (v) => setCurrentItem({ ...currentItem, alias: v }),
          },
        ]}
        onSave={saveItem}
        editMode={editMode}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        deleting={loading}
        itemName="stato dispositivo"
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