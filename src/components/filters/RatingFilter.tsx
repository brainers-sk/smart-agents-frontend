import {
  IconButton,
  Popover,
  MenuItem,
  Checkbox,
  ListItemText,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState, useEffect } from "react";

export default function RatingFilter({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (val: number[]) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // local state for checkboxes
  const [localSelected, setLocalSelected] = useState<number[]>(selected);

  // outside filter sync
  useEffect(() => {
    setLocalSelected(selected);
  }, [selected]);

  const toggleValue = (value: number) => {
    if (localSelected.includes(value)) {
      setLocalSelected(localSelected.filter((v) => v !== value));
    } else {
      setLocalSelected([...localSelected, value]);
    }
  };

  const applyFilter = () => {
    onChange(localSelected);
    setAnchorEl(null);
  };

  const clearAll = () => {
    setLocalSelected([]);
    onChange([]);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ ml: 1 }}
        color={selected.length > 0 ? "primary" : "default"} 
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
          sx: {
            width: 180,
            p: 0.5,
            overflow: "visible",
          },
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((val) => (
          <MenuItem key={val} disableRipple sx={{ py: 0.25 }}>
            <Checkbox
              checked={localSelected.includes(val)}
              size="small"
              onChange={() => toggleValue(val)}
              sx={{ p: 0.25 }}
            />
            <ListItemText primary={`⭐ ${val}`} />
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.5 }} />

        <Stack direction="row" spacing={1} sx={{ px: 1, pb: 1 }}>
          <Button
            size="small"
            color="error"
            onClick={clearAll}
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