import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import type { components } from "../api/schema";
import type { ChatbotModel } from "../api/types";

type CreateChatbotDto = components["schemas"]["CreateChatbotDto"];
type UpdateChatbotDto = components["schemas"]["UpdateChatbotDto"];

export default function ChatbotForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<CreateChatbotDto & UpdateChatbotDto>;
  onSubmit: (data: CreateChatbotDto | UpdateChatbotDto) => void;
}) {
  const [form, setForm] = useState<any>({
    name: "",
    description: "",
    instructions: "",
    temperature: 0.2,
    model: "gpt-4o" as ChatbotModel,
    themeCss: "",
    buttonLabel: "",
    buttonStyleCss: "",
    allowedDomains: [],
    allowCustomerRating: false,
    ...initial,
  });

  const [newDomain, setNewDomain] = useState("");

  const addDomain = () => {
    if (newDomain && !form.allowedDomains.includes(newDomain)) {
      setForm({
        ...form,
        allowedDomains: [...form.allowedDomains, newDomain],
      });
      setNewDomain("");
    }
  };

  const removeDomain = (domain: string) => {
    setForm({
      ...form,
      allowedDomains: form.allowedDomains.filter((d: string) => d !== domain),
    });
  };

  return (
    <Stack gap={2}>
      <TextField
        label="Name"
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <TextField
        label="Description"
        value={form.description || ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        multiline
        minRows={2}
        maxRows={6}
        sx={{ "& .MuiInputBase-input": { overflow: "auto" } }}
      />

      <TextField
        label="Instructions"
        value={form.instructions || ""}
        onChange={(e) => setForm({ ...form, instructions: e.target.value })}
        multiline
        minRows={4}
        maxRows={8}
        sx={{ "& .MuiInputBase-input": { overflow: "auto" } }}
      />

      <Stack direction="row" gap={2}>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel id="model-label">Model</InputLabel>
          <Select<ChatbotModel>
            labelId="model-label"
            value={form.model}
            onChange={(e) =>
              setForm({ ...form, model: e.target.value as ChatbotModel })
            }
          >
            {(
              [
                "gpt-5",
                "gpt-5-mini",
                "gpt-5-nano",
                "gpt-4.1",
                "gpt-4.1-mini",
                "gpt-4.1-nano",
                "o3",
                "o4-mini",
                "gpt-4o",
                "gpt-4o-realtime-preview",
              ] as ChatbotModel[]
            ).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="number"
          label="Temperature"
          value={form.temperature ?? 0.2}
          onChange={(e) =>
            setForm({ ...form, temperature: Number(e.target.value) })
          }
          sx={{ width: 180 }}
          disabled={form.model === "gpt-5"} // lock if GPT-5
        />
      </Stack>

      {"themeCss" in (initial || {}) && (
        <>
          <TextField
            label="Theme CSS"
            value={form.themeCss || ""}
            onChange={(e) => setForm({ ...form, themeCss: e.target.value })}
            multiline
            minRows={3}
            maxRows={6}
            sx={{ "& .MuiInputBase-input": { overflow: "auto" } }}
          />

          <TextField
            label="Button label"
            value={form.buttonLabel || ""}
            onChange={(e) => setForm({ ...form, buttonLabel: e.target.value })}
          />

          <TextField
            label="Button CSS"
            value={form.buttonStyleCss || ""}
            onChange={(e) =>
              setForm({ ...form, buttonStyleCss: e.target.value })
            }
            multiline
            minRows={3}
            maxRows={6}
            sx={{ "& .MuiInputBase-input": { overflow: "auto" } }}
          />
        </>
      )}

      {/* Allowed domains section */}
      <Stack gap={1}>
        <Typography variant="subtitle1">Allowed Domains</Typography>
        <Stack direction="row" gap={1}>
          <TextField
            label="Add domain (https://example.com)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={addDomain}>
            Add
          </Button>
        </Stack>

        <Stack gap={1}>
          {form.allowedDomains.map((d: string, i: number) => (
            <Stack
              key={i}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>{d}</Typography>
              <IconButton onClick={() => removeDomain(d)} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* Allow customer rating */}
      {"allowCustomerRating" in (initial || {}) && (
        <FormControlLabel
          control={
            <Switch
              checked={form.allowCustomerRating || false}
              onChange={(e) =>
                setForm({ ...form, allowCustomerRating: e.target.checked })
              }
            />
          }
          label="Allow customer rating"
        />
      )}

      <Stack direction="row" gap={2}>
        <Button variant="contained" onClick={() => onSubmit(form)}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
}