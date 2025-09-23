import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

export default function SearchFilter({
  label = "Search text...",
  initial = "",
  onSearch,
}: {
  label?: string;
  initial?: string;
  onSearch: (val: string) => void;
}) {
  const [value, setValue] = useState(initial);

  return (
    <Stack direction="row" spacing={1}>
      <TextField
        label={label}
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={() => onSearch(value)}
        sx={{ whiteSpace: "nowrap" }}
      >
        Apply
      </Button>
    </Stack>
  );
}