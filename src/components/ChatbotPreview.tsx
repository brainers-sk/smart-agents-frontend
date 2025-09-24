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

type GetChatbotDto = components["schemas"]["GetChatbotDto"];

export default function ChatbotPreview({ uuid }: { uuid: string }) {
  const [bot, setBot] = useState<GetChatbotDto | null>(null);
  const [url, setUrl] = useState<string>("https://example.sk");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (uuid) getChatbot(uuid).then(setBot);
  }, [uuid]);

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
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* URL input + load button */}
      {!isFullscreen && (
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
      )}

      {/* Iframe + overlay widget */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          bgcolor: "#f9f9f9",
          ...(isFullscreen && {
            position: "fixed",
            inset: 0,
            zIndex: 1300,
          }),
        }}
      >
        {previewUrl ? (
          <iframe
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

        {/* Widget button */}
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            bottom: 24,
            right: 24,
            borderRadius: "50%",
            width: 56,
            height: 56,
            minWidth: 0,
            bgcolor: "#DF4425",
            "&:hover": { bgcolor: "#c73a20" },
            zIndex: 2,
            fontSize: "1.4rem",
          }}
          onClick={() => setOpen((v) => !v)}
        >
          💬
        </Button>

        {/* Widget panel */}
        {open && (
          <Box
            sx={{
              position: "absolute",
              bottom: 90,
              right: 24,
              width: 360,
              height: 500,
              borderRadius: 2,
              boxShadow: "0 10px 30px rgba(0,0,0,.15)",
              overflow: "hidden",
              bgcolor: "white",
              zIndex: 1,
            }}
          >
            <iframe
              title="Chatbot Widget"
              src={`${import.meta.env.VITE_API_URL}/embed/${bot.uuid}`}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box>
        )}

        {/* Fullscreen toggle */}
        <Button
          variant="outlined"
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 24,
            zIndex: 3,
            bgcolor: "white",
          }}
          onClick={() => setIsFullscreen((v) => !v)}
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </Box>
    </Box>
  );
}