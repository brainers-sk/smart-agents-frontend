import {
  Box,
  Typography,
  TextField,
  Stack,
  Tabs,
  Tab,
  Link,
} from "@mui/material";
import { useState } from "react";
import type { components } from "../api/schema";

type GetChatbotDto = components["schemas"]["GetChatbotDto"];

export default function ChatbotIntegrations({ bot }: { bot: GetChatbotDto }) {
  const [tab, setTab] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;
  const teamsUrl = `${window.location.origin}/teams/${bot.uuid}`;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Integration Snippet
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Copy & paste the following snippet into your website before{" "}
        <code>{"</body>"}</code>:
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={3}
        value={`<script src="${apiUrl}/widget/${bot.uuid}.js"></script>`}
      />

      <Stack sx={{ mt: 3 }} spacing={2}>
        <Typography variant="subtitle1">⚡ Example usage</Typography>
        <Typography variant="body2">
          Place this snippet on your site and a floating chatbot button will
          appear in the bottom-right corner. Clicking it opens the chatbot panel
          with your assistant.
        </Typography>
      </Stack>

      {/* Direct API request */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Direct API Request
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You can also call the API directly to send a message:
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="cURL" />
          <Tab label="fetch" />
          <Tab label="Axios" />
        </Tabs>

        {tab === 0 && (
          <TextField
            fullWidth
            multiline
            minRows={6}
            value={`curl -X POST "${apiUrl}/chat/${bot.uuid}/message" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Hello!",
    "sessionUuid": "optional-session-uuid"
  }'`}
          />
        )}

        {tab === 1 && (
          <TextField
            fullWidth
            multiline
            minRows={8}
            value={`await fetch("${apiUrl}/chat/${bot.uuid}/message", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Hello!",
    // sessionUuid: "optional-session-uuid"
  })
});`}
          />
        )}

        {tab === 2 && (
          <TextField
            fullWidth
            multiline
            minRows={8}
            value={`import axios from "axios";

await axios.post("${apiUrl}/chat/${bot.uuid}/message", {
  message: "Hello!",
  // sessionUuid: "optional-session-uuid"
});`}
          />
        )}
      </Box>

      {/* Microsoft Teams */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Microsoft Teams App
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You can also use this chatbot inside Microsoft Teams by creating a
          simple custom Teams app that embeds{" "}
          <Link href={teamsUrl} target="_blank" underline="hover">
            {teamsUrl}
          </Link>.
        </Typography>

        <ol>
          <li>
            <strong>Use the built-in Teams page</strong>:{" "}
            <TextField fullWidth value={teamsUrl} sx={{ my: 1 }} />
          </li>
          <li>
            <strong>Create a Teams app manifest</strong> (JSON file) with a tab
            pointing to this page:
            <TextField
              fullWidth
              multiline
              minRows={8}
              sx={{ my: 1 }}
              value={`{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.11/MicrosoftTeams.schema.json",
  "manifestVersion": "1.11",
  "version": "1.0.0",
  "id": "your-app-id",
  "packageName": "com.yourcompany.chatbot",
  "developer": {
    "name": "Your Company",
    "websiteUrl": "https://yourdomain.com",
    "privacyUrl": "https://yourdomain.com/privacy",
    "termsOfUseUrl": "https://yourdomain.com/terms"
  },
  "name": {
    "short": "My Chatbot",
    "full": "My Custom Chatbot"
  },
  "description": {
    "short": "Chatbot integration",
    "full": "A chatbot embedded into Teams using the widget."
  },
  "staticTabs": [
    {
      "entityId": "chatbotTab",
      "name": "Chatbot",
      "contentUrl": "${teamsUrl}",
      "scopes": ["personal"]
    }
  ],
  "permissions": ["identity", "messageTeamMembers"],
  "validDomains": ["${window.location.hostname}"]
}`}
            />
          </li>
          <li>
            <strong>Upload the app package</strong> (manifest + icons) in Teams
            via <em>Apps → Manage your apps → Upload a custom app</em>.
          </li>
          <li>Done ✅ — your chatbot is now available as a Teams tab!</li>
        </ol>
      </Box>
    </Box>
  );
}