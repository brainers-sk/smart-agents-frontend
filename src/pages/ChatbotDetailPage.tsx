import { useEffect, useState } from "react";
import { Container, Tabs, Tab, Box, Typography, Stack, Button, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ChatbotForm from "../components/ChatbotForm";
import ChatPlayground from "../components/ChatPlayground";
import ChatbotPreviewPage from "../components/ChatbotPreview";
import { getChatbot, updateChatbot, deleteChatbot } from "../api/endpoints";
import type { components } from "../api/schema";
import ChatbotSessions from "./ChatbotSessions";

type GetChatbotDto = components["schemas"]["GetChatbotDto"];
type UpdateChatbotDto = components["schemas"]["UpdateChatbotDto"];

export default function ChatbotDetailPage() {
  const { uuid } = useParams();
  const [bot, setBot] = useState<GetChatbotDto | null>(null);
  const [tab, setTab] = useState(0);
  const nav = useNavigate();

  useEffect(() => { if (uuid) getChatbot(uuid).then(setBot); }, [uuid]);

  if (!bot) return <Container sx={{ py: 3 }}>Loading…</Container>;

  return (
    <Container sx={{ py: 3 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Details & Test" />
        <Tab label="Preview" />
        <Tab label="Sessions" />
      </Tabs>

      {tab === 0 && (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Edit Chatbot</Typography>
            <Button
              color="error"
              onClick={async () => { await deleteChatbot(bot.uuid); nav("/chatbots"); }}
            >
              Delete
            </Button>
          </Stack>

          <ChatbotForm
            initial={bot}
            onSubmit={async (data) => {
              await updateChatbot(bot.uuid, data as UpdateChatbotDto);
              const refreshed = await getChatbot(bot.uuid);
              setBot(refreshed);
            }}
          />

          <Box mt={4}>
            <Typography variant="h6">Embed</Typography>
            <TextField fullWidth value={`<script src="${import.meta.env.VITE_API_URL}/widget/${bot.uuid}.js"></script>`}/>
          </Box>

          <Box mt={4}>
            <Typography variant="h6">Quick Chat (test)</Typography>
            <ChatPlayground chatbotId={bot.uuid} />
          </Box>
        </>
      )}

      {tab === 1 && (
        <ChatbotPreviewPage />
      )}

      {tab === 2 && (
        <ChatbotSessions chatbotId={bot.uuid} />
      )}
    </Container>
  );
}