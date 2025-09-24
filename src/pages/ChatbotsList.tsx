import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
  Box,
  // Grid, // ✅ klasický Grid z MUI v5
} from "@mui/material";
import Grid from "@mui/material/Grid"
import { useNavigate } from "react-router-dom";
import { listChatbots } from "../api/endpoints";
import type { components } from "../api/schema";

type GetChatbotDto = components["schemas"]["GetChatbotDto"];

export default function ChatbotsList() {
  const [items, setItems] = useState<GetChatbotDto[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    listChatbots({ currentPage: 1, pagination: 20 }).then((res) => {
      setItems(res.items ?? []);
    });
  }, []);

  return (
    <Container sx={{ py: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Chatbots
        </Typography>
        <Button
          variant="contained"
          onClick={() => nav("/chatbots/new")}
          sx={{ borderRadius: 2 }}
        >
          New
        </Button>
      </Stack>

      {/* Grid of cards */}
      <Grid container spacing={2}>
        {items.map((b) => (
          <Grid  >
            <Card
              onClick={() => nav(`/chatbots/${b.uuid}`)}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                  bgcolor: "rgba(223, 68, 37, 0.05)", // 🔴 red hover
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {b.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minHeight: "2.4em" }}
                >
                  {b.description || "—"}
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    fontSize: "0.8rem",
                    color: "text.disabled",
                  }}
                >
                  Created:{" "}
                  {new Date(b.createdAt).toLocaleDateString("sk-SK", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}