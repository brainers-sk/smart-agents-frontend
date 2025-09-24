import { Card, CardContent, Typography, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import type { components } from "../api/schema";

type GetChatbotStatsItemDto =
  components["schemas"]["GetChatbotStatsItemDto"];

export default function ChatbotStatsCard({ bot }: { bot: GetChatbotStatsItemDto }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        {/* Name */}
        <Typography
          variant="subtitle1"
          gutterBottom
          align="center"
          fontWeight={600}
        >
          {bot.name}
        </Typography>

        {/* Stats grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
          }}
        >
          <StatBox label="Konverzácie" value={bot.conversationCount} />
          <StatBox
            label="Posledná konverzácia"
            value={
              bot.lastConversationAt
                ? new Date(bot.lastConversationAt).toLocaleString("sk-SK")
                : "—"
            }
          />
          <StatBox
            label="Priemerné hodnotenie"
            value={
              bot.averageCustomerRating != null ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ mr: 0.5 }}
                  >
                    {Number(bot.averageCustomerRating).toFixed(1)}
                  </Typography>
                  <StarIcon sx={{ color: "#FFD700", fontSize: 18 }} />
                </Box>
              ) : (
                "—"
              )
            }
          />
          <StatBox label="Správy" value={bot.totalMessages} />
          <StatBox
            label="Správy / konv."
            value={
              bot.messagesPerConversation != null
                ? Number(bot.messagesPerConversation).toFixed(1)
                : "—"
            }
          />
        </Box>
      </CardContent>
    </Card>
  );
}

function StatBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 1,
        border: "1px solid #eee",
        borderRadius: 1,
        minHeight: 65,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  );
}