import {
  IconButton,
  Popover,
  Divider,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState, useEffect } from "react";

export default function TextSearchFilter({
  value,
  onChange,
  label = "Search text…",
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const applyFilter = () => {
    onChange(localValue.trim());
    setAnchorEl(null);
  };

  const clearFilter = () => {
    setLocalValue("");
    onChange("");
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ ml: 1 }}
        color={value ? "primary" : "default"} // zvýraznenie pri aktívnom filtri
      >
        <FilterListIcon fontSize="small" />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: { width: 220, p: 1 },
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder={label}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />

        <Divider sx={{ my: 1 }} />

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color="error"
            onClick={clearFilter}
            sx={{ textTransform: "none" }}
          >
            Clear
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={applyFilter}
            sx={{ textTransform: "none", ml: "auto" }}
          >
            Apply
          </Button>
        </Stack>
      </Popover>
    </>
  );
}