import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Box,
  Collapse,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Column<T> {
  key: keyof T | "actions";
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: T) => React.ReactNode;
}

interface Props<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  showList: boolean;
  loading: boolean;
  emptyMessage: string;
  isFiltered: boolean;
  totalCount: number;
  itemName: string;
}

export const GenericTable = <T extends { id: string | number }>({
  data,
  columns,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  showList,
  loading,
  emptyMessage,
  isFiltered,
  totalCount,
  itemName,
}: Props<T>) => {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRows = parseInt(event.target.value, 10);
    onRowsPerPageChange?.(newRows);
    onPageChange(1);
  };

  return (
    <Collapse in={showList && !loading} timeout="auto" unmountOnExit>
      <Box sx={{ mt: 3 }}>
        {isFiltered && totalCount > 0 && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {totalCount} {totalCount === 1 ? itemName : itemName } trovati
          </Typography>
        )}

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--table-head, #f5f7fa)" }}>
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    align={col.align || "left"}
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      py: 2,
                      ...(col.key === "actions" && {
                        width: 120,
                        textAlign: "center",
                      }),
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography color="text.secondary">
                      Caricamento...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Typography color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      backgroundColor: "background.paper",
                    }}
                  >
                    {columns.map((col) => {
                      if (col.key === "actions") {
                        return (
                          <TableCell key="actions" align="center">
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 0.5,
                              }}
                            >
                              <Tooltip title="Modifica" arrow>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => onEdit?.(item)}
                                  sx={{
                                    bgcolor: "background.default",
                                    "&:hover": { bgcolor: "primary.100" },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Elimina" arrow>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => onDelete?.(item)}
                                  sx={{
                                    bgcolor: "background.default",
                                    "&:hover": { bgcolor: "error.100" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={String(col.key)}
                          align={col.align}
                          sx={{ color: "text.primary" }}
                        >
                          {col.render
                            ? col.render(item)
                            : String(item[col.key as keyof T])}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalCount > 0 && (
          <Box sx={{ mt: 4 }}>
            <TablePagination
              count={totalCount}
              page={page - 1}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Righe per pagina:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} di ${count !== -1 ? count : "più di " + to}`
              }
              sx={{
                ".MuiTablePagination-toolbar": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 8px",
                  minHeight: "52px",
                  flexWrap: "nowrap",
                },

                ".MuiTablePagination-spacer": {
                  display: "none",
                  
                },

                ".MuiTablePagination-selectLabel, .MuiInputBase-root": {
                  marginRight: 2,
                },

                ".MuiTablePagination-displayedRows": {
                  margin: 0,
                  flex: "1 1 auto",
                  textAlign: "center",
                  fontWeight: 500,
                },

                ".MuiTablePagination-actions": {
                  marginLeft: 2,
                },
                ".MuiTablePagination-select": {
                  paddingTop: 0.5,
                  paddingBottom: 0.5,
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Collapse>
  );
};
