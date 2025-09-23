import {
  IconButton,
  Popover,
  MenuItem,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";

export default function TagFilter({
  tags,
  selected,
  onChange,
}: {
  tags: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ ml: 1, color: selected.length > 0 ? "primary.main" : "inherit" }}
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
        {tags.map((tag) => (
          <MenuItem
            key={tag}
            disableRipple
            sx={{ py: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={selected.includes(tag)}
              size="small"
              onChange={() => toggleValue(tag)}
              sx={{ p: 0.25 }}
            />
            <ListItemText primary={tag} />
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          disableRipple
          onClick={clearAll}
          sx={{
            py: 0.5,
            color: "error.main",
            fontWeight: 500,
            justifyContent: "flex-start",
          }}
        >
          Clear
        </MenuItem>
      </Popover>
    </>
  );
}