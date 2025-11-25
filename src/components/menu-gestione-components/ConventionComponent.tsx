import { Box, CircularProgress, Typography } from "@mui/material";

import { DeleteConfirmModal } from "../generics-components/DeleteModal";
import { GenericFormDialog } from "../generics-components/GenericFormDialog";
import { GenericSearchHeader } from "../generics-components/GenericSearchHeaders";
import { GenericSearchFilters } from "../generics-components/GenericSearchFilters";
import { GenericTable } from "../generics-components/GenericTable";
import { SuccessModal } from "../generics-components/SuccessModal";

import "../../theme/default/InputFields.css";

import { API } from "../../mock/mock/api/endpoints";
import type { Convention } from "../../types/types";
import { useGenericCrud } from "../../hooks/useGenericCrud";

function ConventionComponent() {
  const crud = useGenericCrud<Convention, {
    convenzione: string; id: string; descrizioneConvenzione: string }
    >({
    endpoints: {
      list: API.convention.list,
      create: API.convention.create,
      update: API.convention.update,
      delete: API.convention.delete,
    },
    itemName: "convention",
    createEmptyItem: () => ({ id: 0, convenzione: "", descrizioneConvenzione: "" }),
    getItemId: (item) => item.id,
    validateItem: (item) => {
      if (!item.descrizioneConvenzione.trim()) return "La descrizioneConvenzione è obbligatoria.";
      return null;
    },
  });
const filterFunction = (
  items: Convention[],
  criteria: { id: string; convenzione: string; descrizioneConvenzione: string }
) => {
  return items.filter((i) => {
    return (
      (!criteria.convenzione ||
        i.convenzione.toLowerCase().includes(criteria.convenzione.toLowerCase())) &&
      (!criteria.descrizioneConvenzione ||
        i.descrizioneConvenzione
          .toLowerCase()
          .includes(criteria.descrizioneConvenzione.toLowerCase()))
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
      {/* Header */}
      <GenericSearchHeader
        title="Cerca Convenzioni"
        onAddNew={openAddDialog}
        addButtonLabel="Aggiungi convenzione"
      />

      {/* Filtri */}
      <GenericSearchFilters
        fields={[
          {
            label: "Convenzione",
            value: searchCriteria.convenzione,
            onChange: (v) => setSearchCriteria({ ...searchCriteria, convenzione: v }),
            minWidth: 120,
          },
          {
            label: "Descrizione Convenzione",
            value: searchCriteria.descrizioneConvenzione,
            onChange: (v) =>
              setSearchCriteria({ ...searchCriteria, descrizioneConvenzione: v }),
            minWidth: 200,
            flex: 1,
          },
        ]}
        onSearch={() => crud.applySearch(filterFunction)}
        onClear={() => crud.clearSearch({ convenzione: "",id: "",descrizioneConvenzione: "" })}
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
      <GenericTable<Convention>
        data={filteredItems}
        columns={[
          { key: "convenzione", label: "Convenzione", width: "20%" },
          { key: "descrizioneConvenzione", label: "Descrizione Convenzione", width: "65%" },
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
        emptyMessage="Nessuna convenzione trovata."
        isFiltered={isFiltered}
        totalCount={filteredItems.length}
        itemName="convenzione"
      />

      {/* Dialog Aggiungi/Modifica */}
      <GenericFormDialog
        open={openDialog}
        onClose={closeDialog}
        title={editMode ? "Modifica Convenzione" : "Aggiungi nuova Convenzione"}
        fields={[
          {
            label: "Convenzione",
            value: currentItem.convenzione,
            onChange: (v) => setCurrentItem({ ...currentItem, convenzione: v }),
          },
          {
            label: "Descrizione Convenzione",
            value: currentItem.descrizioneConvenzione,
            onChange: (v) =>
              setCurrentItem({ ...currentItem, descrizioneConvenzione: v }),
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
        itemName="convenzione"
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

export default ConventionComponent;
