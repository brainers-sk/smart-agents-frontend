import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import type { components } from "../api/schema";
import { addTagToSession, removeTagFromSession } from "../api/endpoints";
import { marked } from "marked";

type GetChatSessionMessagesDto =
  components["schemas"]["GetChatSessionMessagesDto"];

export default function SessionDetail({
  session,
  onClose,
  onTagsUpdated,
}: {
  session: GetChatSessionMessagesDto;
  onClose?: () => void;
  onTagsUpdated?: (newTags: string[]) => void;
}) {
  const [tags, setTags] = useState<string[]>(session.adminTag || []);
  const [newTag, setNewTag] = useState("");

  async function handleAddTag() {
    if (!newTag.trim()) return;
    try {
      await addTagToSession(session.uuid, { tag: newTag.trim() });
      const updated = [...tags, newTag.trim()];
      setTags(updated);
      onTagsUpdated?.(updated);
      setNewTag("");
    } catch (err) {
      console.error("Failed to add tag", err);
    }
  }

  async function handleRemoveTag(tag: string) {
    try {
      await removeTagFromSession(session.uuid, { tag });
      const updated = tags.filter((t) => t !== tag);
      setTags(updated);
      onTagsUpdated?.(updated);
    } catch (err) {
      console.error("Failed to remove tag", err);
    }
  }

  return (
    <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Session Detail – {session.uuid}</Typography>
        {onClose && (
          <Button size="small" variant="outlined" onClick={onClose}>
            Close
          </Button>
        )}
      </Stack>

      {/* Feedback */}
      {session.customerFeedback && (
        <Paper
          variant="outlined"
          sx={{
            mt: 2,
            p: 1.5,
            borderStyle: "dashed",
            bgcolor: "#fafafa",
          }}
        >
          <Typography variant="subtitle2">Customer Feedback:</Typography>
          <Typography variant="body2">{session.customerFeedback}</Typography>
        </Paper>
      )}

      {/* Ratings & tags */}
      <Stack direction="row" spacing={1} mt={2} mb={2} flexWrap="wrap">
        {session.customerRating != null && (
          <Chip label={`⭐ ${session.customerRating}`} size="small" />
        )}
        {session.adminRating != null && (
          <Chip label={`Admin ⭐ ${session.adminRating}`} size="small" />
        )}
        {tags.map((tag, i) => (
          <Chip
            key={i}
            label={tag}
            variant="outlined"
            onDelete={() => handleRemoveTag(tag)}
          />
        ))}
      </Stack>

      {/* Add tag */}
      <Stack direction="row" spacing={1} mt={1}>
        <TextField
          size="small"
          label="Add tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddTag}>
          Add
        </Button>
      </Stack>

      {/* Messages */}
        <Stack spacing={2} mt={3}>
        {session.chatMessages.map((m) => {
            const isUser = (typeof m.role === "string" && m.role === "user");
            return (
            <Box
                key={m.uuid}
                sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                }}
            >
                <Paper
                elevation={1}
                sx={{
                    px: 2,
                    py: 1.5,
                    maxWidth: "75%",
                    borderRadius: isUser
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                    bgcolor: isUser ? "#DF4425" : "#f5f5f5", // 🔴 červená pre user
                    color: isUser ? "white" : "black",
                }}
                >
                <Typography
                    variant="subtitle1"
                    sx={{
                    fontWeight: "bold",
                    mb: 0.5,
                    color: isUser ? "white" : "black",
                    }}
                >
                    {isUser ? "👤 Ja" : "🤖 AI asistent"}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap" }}
                    component="div"
                    dangerouslySetInnerHTML={{
                    __html: marked.parse(m.content || ""),
                    }}
                />
                </Paper>
            </Box>
            );
        })}
        </Stack>
    </Box>
  );
}