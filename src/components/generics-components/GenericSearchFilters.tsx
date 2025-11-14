import { Box, Typography, TextField, Button, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface FilterField {
  label: string;
  value: string ;
  onChange: (value: string) => void;
  placeholder?: string;
  minWidth?: number;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  flex?: number;
}

interface GenericSearchFiltersProps {
  fields: FilterField[];
  onSearch: () => void;
  onClear: () => void;
}

export const GenericSearchFilters = ({
  fields,
  onSearch,
  onClear,
}: GenericSearchFiltersProps) => (
  <Box sx={{ mb: 3 }}>
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}
    >
      {fields.map((field, index) => (
        <Box
          key={index}
          sx={{
            minWidth: field.minWidth || 120,
            flex: field.flex || "initial",
          }}
        >
          <Typography
            variant="body2"
            color="var(--neutro-800)"
            sx={{ mb: 0.5, display: "block" }}
          >
            {field.label}
          </Typography>
          <TextField
            className="textFieldInput"
            size="small"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                backgroundColor: "var(--neutro-100)",
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  borderWidth: 1,
                },
              },
              "& .MuiInputBase-input": { py: 1 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      ))}

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onSearch}
          sx={{
            height: 40,
            backgroundColor: "var(--neutro-100)",
            color: "var(--blue-consob-600)",
            borderRadius: 1,
            borderColor: "var(--blue-consob-600)",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "var(--blue-consob-800)",
              color: "white",
              borderColor: "var(--blue-consob-800)",
            },
          }}
        >
          Ricerca
        </Button>
        <Button
          onClick={onClear}
          sx={{
            height: 40,
            color: "var(--blue-consob-600)",
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          Pulisci Filtri
        </Button>
      </Box>
    </Box>
  </Box>
);