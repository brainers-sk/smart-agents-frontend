import { useEffect, useState } from "react";
import { Container, Typography, Stack, Button, Card, CardContent, Box } from "@mui/material";
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Chatbots</Typography>
        <Button variant="contained" onClick={() => nav("/chatbots/new")}>New</Button>
      </Stack>

      <Stack gap={2}>
        {items.map((b) => (
          <Card key={b.uuid}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1">{b.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{b.description || "—"}</Typography>
                </Box>
                <Box>
                  <Button onClick={() => nav(`/chatbots/${b.uuid}`)}>Manage</Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}