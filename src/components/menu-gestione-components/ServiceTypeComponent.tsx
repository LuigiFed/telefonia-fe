import { Box, CircularProgress, Typography } from "@mui/material";

import { DeleteConfirmModal } from "../generics-components/DeleteModal";
import { GenericFormDialog } from "../generics-components/GenericFormDialog";
import { GenericSearchHeader } from "../generics-components/GenericSearchHeaders";
import { GenericSearchFilters } from "../generics-components/GenericSearchFilters";
import { GenericTable } from "../generics-components/GenericTable";
import { SuccessModal } from "../generics-components/SuccessModal";

import { API } from "../../mock/mock/api/endpoints";
import type { ServiceType } from "../../types/types";
import { useGenericCrud } from "../../hooks/useGenericCrud";

function ServiceTypeComponent() {
  const crud = useGenericCrud<ServiceType>({
    endpoints: {
      list: API.serviceTypes.list,
      create: API.serviceTypes.create,
      update: API.serviceTypes.update,
      delete: API.serviceTypes.delete,
    },
    itemName: "tipo servizio",
    createEmptyItem: () => ({ id: 0, codTipoServizio: "", descrizione: "" }),
    getItemId: (item) => item.id,
    validateItem: (item) => {
      if (!item.descrizione?.trim()) return "La descrizione è obbligatoria.";
      if (!item.codTipoServizio?.trim()) return "Il codice è obbligatorio.";
      return null;
    },
  });

  const filterFunction = (
    items: ServiceType[],
    criteria: Record<string, string>
  ) => {
    const { id = "", descrizione = "", codice = "" } = criteria;
    return items.filter((i) => {
      return (
        (!id || i.id.toString().includes(id)) &&
        (!codice ||
          (i.codTipoServizio ?? "").toLowerCase().includes(codice.toLowerCase())) &&
        (!descrizione ||
          (i.descrizione ?? "")
            .toLowerCase()
            .includes(descrizione.toLowerCase()))
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
    saveItem,
    currentItem,
    setCurrentItem,
    deleteModalOpen,
    setDeleteModalOpen,
    confirmDelete,
    successModalOpen,
    setSuccessModalOpen,
    successMessage,
    isFiltered,
  } = crud;


  return (
    <section
      className="menu-gestione"
      style={{ marginLeft: 16, marginRight: 16 }}
    >
      <GenericSearchHeader
        title="Gestione Tipi di Servizio"
        onAddNew={openAddDialog}
        addButtonLabel="Aggiungi Tipo Servizio"
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
            label: "Codice",
            value: searchCriteria.codice || "",
            onChange: (v) =>
              setSearchCriteria({ ...searchCriteria, codice: v }),
            minWidth: 120,
          },
          {
            label: "Descrizione",
            value: searchCriteria.descrizione || "",
            onChange: (v) =>
              setSearchCriteria({ ...searchCriteria, descrizione: v }),
            minWidth: 200,
            flex: 1,
          },
        ]}
        onSearch={() => crud.applySearch(filterFunction)}
        onClear={() =>
          crud.clearSearch({ id: "", codice: "", descrizione: "" })
        }
      />

      {loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" color="var(--neutro-600)" sx={{ mt: 1 }}>
            Caricamento tipi servizio...
          </Typography>
        </Box>
      )}

      <GenericTable<ServiceType>
        data={filteredItems}
        columns={[
          { key: "id", label: "ID", width: "15%" },
          {
            key: "codTipoServizio",
            label: "Codice",
            width: "20%",
            render: (row) =>  row.codTipoServizio || "",
          },
          {
            key: "descrizione",
            label: "Descrizione",
            width: "55%",
            render: (row) => row.descrizione ?? "",
          },
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
        emptyMessage="Nessun tipo servizio trovato."
        isFiltered={isFiltered}
        totalCount={filteredItems.length}
        itemName="tipo servizio"
      />

      <GenericFormDialog
        open={openDialog}
        onClose={closeDialog}
        title={
          editMode ? "Modifica Tipo Servizio" : "Aggiungi Nuovo Tipo Servizio"
        }
        fields={[
          {
            label: "Codice",
            value: currentItem.codTipoServizio || "",
            onChange: (v) =>
              setCurrentItem({ ...currentItem, codTipoServizio: v.toUpperCase() }),
            disabled: editMode,
            helperText: editMode
              ? "Il codice non può essere modificato"
              : "Inserisci il codice (es. F, D, FD, o altro valore valido)",
          },
          {
            label: "Descrizione",
            value: currentItem.descrizione || "",
            onChange: (v) => setCurrentItem({ ...currentItem, descrizione: v }),
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
        itemName="tipo servizio"
      />

      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={successMessage}
      />
    </section>
  );
}

export default ServiceTypeComponent;
