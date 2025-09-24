import { useEffect, useState } from "react";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import type { components } from "../api/schema";
import { listChatbotStats } from "../api/endpoints";
import ChatbotStatsCard from "../components/ChatbotStatsCard";

type GetChatbotStatsItemDto =
  components["schemas"]["GetChatbotStatsItemDto"];

export default function Dashboard() {
  const [stats, setStats] = useState<GetChatbotStatsItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listChatbotStats({ currentPage: 1, pagination: 20 })
      .then((res) => setStats(res.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 3, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>
        Chatbot Dashboard
      </Typography>

      <Grid container spacing={2}>
        {stats.map((bot) => (
          <Grid>
            <ChatbotStatsCard bot={bot} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}