import {
  Stack, TextField, FormControl, InputLabel, Select, MenuItem,
  Button, Typography, IconButton, Switch, FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMemo, useState } from "react";
import type { components } from "../api/schema";
import type { ChatbotModel } from "../api/types";

type CreateChatbotDto = components["schemas"]["CreateChatbotDto"];
type UpdateChatbotDto = components["schemas"]["UpdateChatbotDto"];
type ModelOrCopilot = ChatbotModel | "copilot";

enum ServiceEnum {
  OPENAI = "openai",
  COPILOT = "copilot",
}

export type ChatbotFormValues = Partial<UpdateChatbotDto> & {
  service?: ServiceEnum;
  model?: ModelOrCopilot;
};

const OPENAI_MODELS: ChatbotModel[] = [
  "gpt-5","gpt-5-mini","gpt-5-nano",
  "gpt-4.1","gpt-4.1-mini","gpt-4.1-nano",
  "o3","o4-mini","gpt-4o","gpt-4o-realtime-preview",
];

export default function ChatbotForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<CreateChatbotDto & UpdateChatbotDto>;
  onSubmit: (data: CreateChatbotDto | UpdateChatbotDto) => void;
}) {
  // odvodiť počiatočnú službu z initial.model
  const initialService = useMemo<ServiceEnum>(
    () => (initial?.model === "copilot" ? ServiceEnum.COPILOT : ServiceEnum.OPENAI),
    [initial?.model]
  );

  const [form, setForm] = useState<ChatbotFormValues>({
    name: "",
    description: "",
    instructions: "",
    temperature: 0.2,
    service: initialService,
    model: (initialService === ServiceEnum.COPILOT
      ? "copilot"
      : ((initial?.model as ChatbotModel) ?? "gpt-4o")) as ModelOrCopilot,
    themeCss: "",
    buttonLabel: "",
    buttonStyleCss: "",
    allowedDomains: [],
    allowCustomerRating: false,
    ...initial,
  });

  const [newDomain, setNewDomain] = useState("");
  const allowedDomains = form.allowedDomains ?? [];

  const handleServiceChange = (value: ServiceEnum) => {
    if (value === ServiceEnum.COPILOT) {
      setForm((f) => ({ ...f, service: value, model: "copilot" }));
    } else {
      // pri návrate na OpenAI necháme pôvodný (ak bol copilot, dáme default)
      setForm((f) => ({
        ...f,
        service: value,
        model:
          f.model && f.model !== "copilot"
            ? (f.model as ChatbotModel)
            : ("gpt-4o" as ChatbotModel),
      }));
    }
  };

  const isCopilot = form.service === ServiceEnum.COPILOT;

  const addDomain = () => {
    if (newDomain && !allowedDomains.includes(newDomain)) {
      setForm({ ...form, allowedDomains: [...allowedDomains, newDomain] });
      setNewDomain("");
    }
  };
  const removeDomain = (domain: string) =>
    setForm({
      ...form,
      allowedDomains: allowedDomains.filter((d) => d !== domain),
    });

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
        multiline minRows={2} maxRows={6}
        sx={{ "& .MuiInputBase-input": { overflow: "auto" } }}
      />

      <TextField
        label="Instructions"
        value={form.instructions || ""}
        onChange={(e) => setForm({ ...form, instructions: e.target.value })}
        multiline minRows={4} maxRows={8}
        sx={{ "& .MuiInputBase-input": { overflow: "auto" } }}
      />

      {/* Service */}
      <FormControl fullWidth>
        <InputLabel id="service-label">Service</InputLabel>
        <Select<ServiceEnum>
          labelId="service-label"
          value={form.service ?? ServiceEnum.OPENAI}
          label="Service"
          onChange={(e) => handleServiceChange(e.target.value as ServiceEnum)}
        >
          <MenuItem value={ServiceEnum.OPENAI}>OpenAI</MenuItem>
          <MenuItem value={ServiceEnum.COPILOT}>Microsoft Copilot</MenuItem>
        </Select>
      </FormControl>

      {/* Model & Temperature len pre OpenAI */}
      {!isCopilot && (
        <Stack direction="row" gap={2}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="model-label">Model</InputLabel>
            <Select<ChatbotModel>
              labelId="model-label"
              value={(form.model as ChatbotModel) ?? "gpt-4o"}
              label="Model"
              onChange={(e) =>
                setForm({ ...form, model: e.target.value as ChatbotModel })
              }
            >
              {OPENAI_MODELS.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
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
            disabled={(form.model as string) === "gpt-5"} // ak to chceš zamknúť pre GPT-5
          />
        </Stack>
      )}

      {"themeCss" in (initial || {}) && (
        <>
          <TextField
            label="Theme CSS"
            value={form.themeCss || ""}
            onChange={(e) => setForm({ ...form, themeCss: e.target.value })}
            multiline minRows={3} maxRows={6}
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
            onChange={(e) => setForm({ ...form, buttonStyleCss: e.target.value })}
            multiline minRows={3} maxRows={6}
            sx={{ "& .MuiInputBase-input": { overflow: "auto" } }}
          />
        </>
      )}

      {/* Allowed domains */}
      <Stack gap={1}>
        <Typography variant="subtitle1">Allowed Domains</Typography>
        <Stack direction="row" gap={1}>
          <TextField
            label="Add domain (https://example.com)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={addDomain}>Add</Button>
        </Stack>
        <Stack gap={1}>
          {allowedDomains.map((d, i) => (
            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
              <Typography>{d}</Typography>
              <IconButton onClick={() => removeDomain(d)} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Stack>

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

      {/* Save – nikdy neposielame `service` */}
      <Stack direction="row" gap={2}>
        <Button
          variant="contained"
          onClick={() => {
            const {  ...rest } = form; // odstránime `service`
            const isCopilotNow = form.service === ServiceEnum.COPILOT
            onSubmit({
             ...rest,
             service: form.service,
             name: form.name ?? "",
             temperature: form.temperature ?? 0.2,
             model: isCopilotNow ? "copilot" : ((form.model as ChatbotModel) ?? "gpt-4o"),
             allowedDomains: form.allowedDomains ?? [],
           } as CreateChatbotDto | UpdateChatbotDto)
          }}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
}