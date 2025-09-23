import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import { Person, SmartToy } from "@mui/icons-material";
import { sendMessage } from "../api/endpoints";
import { marked } from "marked";
import type { components } from "../api/schema";

type SendMessageReplyDto = components["schemas"]["SendMessageReplyDto"];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatbotTeamsPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || !uuid) return;
    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply: SendMessageReplyDto = await sendMessage(uuid, {
        message: userMessage.content,
        sessionUuid: sessionUuid || undefined,
      });

      if (reply.sessionUuid) setSessionUuid(reply.sessionUuid);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply.reply },
      ]);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Nepodarilo sa načítať odpoveď." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 60px)", // 🔹 zmenšené o 60px
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f9f9f9",
        p: "10px 0", // padding hore/dole
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "#DF4425",
          color: "white",
          p: 1.5,
          textAlign: "center",
          fontWeight: 600,
          fontSize: "1.1rem",
          flexShrink: 0,
        }}
      >
        Chatbot
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 2,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {messages.map((m, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={1}
            justifyContent={m.role === "user" ? "flex-end" : "flex-start"}
          >
            {m.role === "assistant" && (
              <Avatar sx={{ bgcolor: "#DF4425" }}>
                <SmartToy />
              </Avatar>
            )}

            <Box
              sx={{
                bgcolor: m.role === "user" ? "#DF4425" : "#e5e5ea",
                color: m.role === "user" ? "white" : "black",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "70%",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  mb: 0.5,
                  color: m.role === "user" ? "white" : "#333",
                }}
              >
                {m.role === "user" ? "Ja" : "AI asistent"}
              </Typography>
              {m.role === "assistant" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: marked(m.content) }}
                  style={{ fontSize: "0.9rem" }}
                />
              ) : (
                <Typography variant="body2">{m.content}</Typography>
              )}
            </Box>

            {m.role === "user" && (
              <Avatar sx={{ bgcolor: "#DF4425" }}>
                <Person />
              </Avatar>
            )}
          </Stack>
        ))}

        {loading && (
          <Box
            sx={{
              alignSelf: "flex-start",
              bgcolor: "#e5e5ea",
              px: 2,
              py: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "0.9rem",
              color: "#333",
            }}
          >
            Hľadám informácie
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                ml: 1,
                gap: "3px",
              }}
            >
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </Box>
          </Box>
        )}
        <div ref={endRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          borderTop: "1px solid #ddd",
          p: 1,
          display: "flex",
          gap: 1,
          bgcolor: "white",
          flexShrink: 0,
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Napíš správu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          variant="contained"
          sx={{ bgcolor: "#DF4425", "&:hover": { bgcolor: "#c73a20" } }}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Send
        </Button>
      </Box>

      {/* Loader animation */}
      <style>
        {`
          .dot {
            width: 6px;
            height: 6px;
            background: #555;
            border-radius: 50%;
            display: inline-block;
            opacity: 0.3;
            animation: blink 1.4s infinite;
          }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes blink {
            0%   { opacity: 0.3; transform: translateY(0); }
            50%  { opacity: 1;   transform: translateY(-2px); }
            100% { opacity: 0.3; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}