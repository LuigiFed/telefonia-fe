import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Pagination,
  Box,
  Collapse,
  Typography,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

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
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>, id: string | number) => void;
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
  onMenuClick,
  showList,
  loading,
  emptyMessage,
  isFiltered,
  totalCount,
  itemName,
}: Props<T>) => {
  const start = (page - 1) * rowsPerPage;
  const paginatedData = data.slice(start, start + rowsPerPage);

  return (
    <Collapse in={showList && !loading} timeout="auto" unmountOnExit>
      <Box sx={{ maxWidth: 900, mx: "auto", px: 2, mb: 4 }}>
        {isFiltered && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {totalCount === 1 ? `1 ${itemName}` : `${totalCount} ${itemName}`}
          </Typography>
        )}

        <Paper elevation={3} sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
          {paginatedData.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              <Typography>{emptyMessage}</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "var(--table-head)" }}>
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        sx={{
                          width: col.width,
                          fontWeight: 600,
                          textAlign: col.align || "left",
                          ...(col.key === "actions" && { borderLeft: "1px solid var(--neutro-200)" }),
                        }}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id as string | number} hover sx={{ "&:hover": { backgroundColor: "action.hover" } }}>
                      {columns.map((col) => {
                        if (col.key === "actions") {
                          return (
                            <TableCell key="actions" align="center" sx={{ borderLeft: "1px solid var(--neutro-200)" }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => onMenuClick(e, item.id)}
                                endIcon={<MoreVertIcon fontSize="small" />}
                              >
                                Azioni
                              </Button>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={String(col.key)} sx={{ color: "var(--neutro-600)" }}>
                            {col.render ? col.render(item) : String(item[col.key as keyof T])}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Pagination
            count={Math.ceil(data.length / rowsPerPage)}
            page={page}
            onChange={(_, v) => onPageChange(v)}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
            sx={{ "& .MuiPaginationItem-root": { borderRadius: "8px" } }}
          />
        </Box>
      </Box>
    </Collapse>
  );
};