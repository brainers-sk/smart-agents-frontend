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
import ChatbotIntegrations from "../components/ChatbotIntegrations";
import { getChatbot, updateChatbot, deleteChatbot } from "../api/endpoints";
import type { components } from "../api/schema";
import ChatbotSessions from "./ChatbotSessions";
import { toUpdatePayload } from "../utils/chatbot";

type GetChatbotDto = components["schemas"]["GetChatbotDto"];

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

  const subtitle =
    bot.model === ("copilot" as any)
      ? "Service: Microsoft Copilot"
      : `Model: ${bot.model}`;

  return (
    <Container sx={{ py: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Box>
          <Typography variant="h5">{bot.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        <Stack direction="row" gap={1}>
          {/* Keep just Delete here so we don’t send stale 'bot' */}
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
              // Merge form changes with current bot, normalize with toUpdatePayload
              await updateChatbot(bot.uuid, toUpdatePayload({ ...bot, ...data }));
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
          <ChatbotSessions />
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