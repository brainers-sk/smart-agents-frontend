import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatbotForm from "../components/ChatbotForm";
import { createChatbot } from "../api/endpoints";
import type { components } from "../api/schema";

type CreateChatbotDto = components["schemas"]["CreateChatbotDto"];

export default function ChatbotCreate() {
  const nav = useNavigate();

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" mb={2}>Create Chatbot</Typography>
      <ChatbotForm
        onSubmit={async (data) => {
          await createChatbot(data as CreateChatbotDto);
          nav("/chatbots");
        }}
      />
    </Container>
  );
}