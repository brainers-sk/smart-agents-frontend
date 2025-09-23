import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Stack,
} from "@mui/material";
import { getChatbot } from "../api/endpoints";
import type { components } from "../api/schema";
import { cleanupWidget } from "../utils/helpers";

type GetChatbotDto = components["schemas"]["GetChatbotDto"];

export default function ChatbotPreview({ uuid }: { uuid: string }) {
  const [bot, setBot] = useState<GetChatbotDto | null>(null);
  const [url, setUrl] = useState<string>("https://example.sk");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState<number>(0);

  // Load chatbot info
  useEffect(() => {
    if (uuid) getChatbot(uuid).then(setBot);
  }, [uuid]);

  // Inject widget script only in Preview tab
  useEffect(() => {
    if (!bot) return;

    // cleanup 
    cleanupWidget();

    const script = document.createElement("script");
    script.id = "chatbot-widget-script";
    script.src = `${import.meta.env.VITE_API_URL}/widget/${bot.uuid}.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      window.postMessage({ type: "REMOVE_CHATBOT" }, "*");
      script.remove();
    };
  }, [bot, previewKey]);

  if (!bot) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const loadPreview = () => {
    setPreviewUrl(url);
    setPreviewKey((k) => k + 1);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ p: 1.5, borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}
      >
        <TextField
          label="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          size="small"
        />
        <Button variant="contained" onClick={loadPreview}>
          Load
        </Button>
      </Stack>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {previewUrl ? (
          <iframe
            key={previewKey}
            title="Chatbot Preview"
            src={previewUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "0.95rem",
            }}
          >
            👆 Enter a URL and click Load to preview with the chatbot
          </Box>
        )}
      </Box>
    </Box>
  );
}


