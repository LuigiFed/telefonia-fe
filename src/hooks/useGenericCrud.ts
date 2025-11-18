import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface CRUDConfig<T> {
  endpoints: {
    list: string;
    create: string;
    update: string;
    delete: string;
  };
  itemName: string;
  createEmptyItem: () => T;
  getItemId: (item: T) => number;
  validateItem?: (item: T, editMode: boolean) => string | null;
}

export function useGenericCrud<T, S = Record<string, string>>(config: CRUDConfig<T>) {
  const { endpoints, itemName, createEmptyItem, getItemId, validateItem } = config;

  // Stati dati
  const [allItems, setAllItems] = useState<T[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  // Ricerca
  const [searchCriteria, setSearchCriteria] = useState<S>({} as S);
  const [isFiltered, setIsFiltered] = useState(false);

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<T>(createEmptyItem());

  // Paginazione
  const [page, setPage] = useState(1);          
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Eliminazione
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Successo
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Caricamento dati
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(endpoints.list);
      const data = res.data || [];
      setAllItems(data);
      setFilteredItems(data);
      setIsFiltered(false);
      setPage(1);
    } catch (error) {
      console.error(`Errore caricamento ${itemName}:`, error);
    } finally {
      setLoading(false);
    }
  }, [endpoints.list, itemName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems, endpoints.list]);

  // Ricerca
  const applySearch = useCallback(
    (filterFunction: (items: T[], criteria: S) => T[]) => {
      const results = filterFunction(allItems, searchCriteria);
      setFilteredItems(results);
      setIsFiltered(true);
      setPage(1);
    },
    [allItems, searchCriteria]
  );

  const clearSearch = useCallback(
    (initialCriteria: S) => {
      setSearchCriteria(initialCriteria);
      setFilteredItems(allItems);
      setIsFiltered(false);
    },
    [allItems]
  );

  // Dialog
  const openAddDialog = useCallback(() => {
    setEditMode(false);
    setCurrentItem(createEmptyItem());
    setOpenDialog(true);
  }, [createEmptyItem]);

  const closeDialog = useCallback(() => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentItem(createEmptyItem());
  }, [createEmptyItem]);

  // Salvataggio
  const saveItem = useCallback(async () => {
    if (validateItem) {
      const error = validateItem(currentItem, editMode);
      if (error) {
        alert(error);
        return;
      }
    }

    try {
      if (editMode) {
        const id = getItemId(currentItem);
        await axios.put(endpoints.update.replace(":id", String(id)), currentItem);
        setSuccessMessage(`${itemName} modificato con successo!`);
      } else {
        await axios.post(endpoints.create, currentItem);
        setSuccessMessage(`${itemName} aggiunto con successo!`);
      }
      await fetchItems();
      closeDialog();
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Errore durante il salvataggio.");
    }
  }, [currentItem, editMode, endpoints, itemName, validateItem, getItemId, fetchItems, closeDialog]);

 const handleEdit = useCallback(
  (item: T) => {
    setCurrentItem(item);
    setEditMode(true);
    setOpenDialog(true);
  },
  []
);

const handleDelete = useCallback((item: T) => {
  const id = getItemId(item);
  setItemToDelete(id);
  setDeleteModalOpen(true);
}, [getItemId]);

  // Conferma eliminazione
  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(endpoints.delete.replace(":id", String(itemToDelete)));
      await fetchItems();
      setSuccessMessage(`${itemName} eliminato con successo!`);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Errore eliminazione:", error);
      alert("Errore durante l'eliminazione.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, endpoints.delete, itemName, fetchItems]);

  return {
    // Dati
    allItems,
    filteredItems,
    loading,
    isFiltered,

    // Ricerca
    searchCriteria,
    setSearchCriteria,
    applySearch,
    clearSearch,

    // Paginazione 
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,

    // Dialog
    openDialog,
    editMode,
    currentItem,
    setCurrentItem,
    openAddDialog,
    closeDialog,
    saveItem,

    // AZIONI DIRETTE PER LE ICONE
    handleEdit,
    handleDelete,

    // Eliminazione
    deleteModalOpen,
    setDeleteModalOpen,
    deleting,
    confirmDelete,

    // Successo
    successModalOpen,
    setSuccessModalOpen,
    successMessage,
    setSuccessMessage,

    // Refresh
    refreshItems: fetchItems,
  };
}

export default useGenericCrud; 