import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
import { sendMessage } from "../api/endpoints";
import type { components } from "../api/schema";

type SendMessageDto = components["schemas"]["SendMessageDto"];

export default function ChatPlayground({ chatbotId }: { chatbotId: string }) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);

  async function onSend() {
    if (!input) return;
    setMessages((m) => [...m, { role: "user", text: input }]);
    const payload: SendMessageDto = { message: input, sessionUuid: sessionUuid ?? undefined };
    setInput("");
    const res = await sendMessage(chatbotId, payload);
    setSessionUuid(res.sessionUuid);
    setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
  }

  return (
    <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2 }}>
      <Stack gap={1} sx={{ maxHeight: 280, overflowY: "auto", mb: 2 }}>
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={{
              alignSelf: m.role === "user" ? "end" : "start",
              px: 1.5,
              py: 1,
              bgcolor: m.role === "user" ? "#e3f2fd" : "#f1f8e9",
              borderRadius: 1.5,
            }}
          >
            <strong>{m.role}:</strong> {m.text}
          </Box>
        ))}
      </Stack>
      <Stack direction="row" gap={1}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          size="small"
          fullWidth
          placeholder="Type a message..."
        />
        <Button variant="contained" onClick={onSend}>Send</Button>
      </Stack>
    </Box>
  );
}