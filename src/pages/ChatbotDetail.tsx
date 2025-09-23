import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Button,
  Box,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ChatbotForm from "../components/ChatbotForm";
import ChatPlayground from "../components/ChatPlayground";
import ChatbotPreview from "../components/ChatbotPreview";
import ChatbotIntegrations from "../components/ChatbotIntegrations"; // ⬅️ pridaj import
import { getChatbot, updateChatbot, deleteChatbot } from "../api/endpoints";
import type { components } from "../api/schema";
import ChatbotSessions from "./ChatbotSessions";

type GetChatbotDto = components["schemas"]["GetChatbotDto"];
type UpdateChatbotDto = components["schemas"]["UpdateChatbotDto"];

export default function ChatbotDetail() {
  const { uuid } = useParams();
  const [bot, setBot] = useState<GetChatbotDto | null>(null);
  const [tab, setTab] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    if (uuid) getChatbot(uuid).then(setBot);
  }, [uuid]);

  if (!bot) {
    return (
      <Container sx={{ py: 3 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">{bot.name}</Typography>
        <Stack direction="row" gap={1}>
          <Button
            variant="contained"
            onClick={async () => {
              await updateChatbot(bot.uuid, bot as UpdateChatbotDto);
              const refreshed = await getChatbot(bot.uuid);
              setBot(refreshed);
            }}
          >
            Save
          </Button>
          <Button
            color="error"
            onClick={async () => {
              await deleteChatbot(bot.uuid);
              nav("/chatbots");
            }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Detail" />
        <Tab label="Preview" />
        <Tab label="Sessions" />
        <Tab label="Integrations" />
      </Tabs>

      {/* Tab panels */}
      {tab === 0 && (
        <Box>
          <ChatbotForm
            initial={bot}
            onSubmit={async (data) => {
              await updateChatbot(bot.uuid, data as UpdateChatbotDto);
              const refreshed = await getChatbot(bot.uuid);
              setBot(refreshed);
            }}
          />
          <Box mt={4}>
            <Typography variant="h6">Quick Chat (test)</Typography>
            <ChatPlayground chatbotId={bot.uuid} />
          </Box>
        </Box>
      )}

      {tab === 1 && (
        <Box sx={{ height: "70vh" }}>
          <ChatbotPreview uuid={bot.uuid} />
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <ChatbotSessions chatbotId={bot.uuid} />
        </Box>
      )}

      {tab === 3 && (
        <Box>
          <ChatbotIntegrations bot={bot} />
        </Box>
      )}
    </Container>
  );
}