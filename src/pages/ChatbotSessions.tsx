import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import {
  getChatbotSessions,
  getSessionMessages,
  getChatbot,
} from "../api/endpoints";
import type { components } from "../api/schema";
import ChatbotSessionsTable from "../components/ChatbotSessionsTable";
import SessionDetail from "../components/SessionDetail";
import TextSearchFilter from "../components/filters/TextSearchFilter";

type GetChatSessionDto = components["schemas"]["GetChatSessionDto"];
type GetChatSessionsDto = components["schemas"]["GetChatSessionsDto"];
type GetChatSessionMessagesDto =
  components["schemas"]["GetChatSessionMessagesDto"];
type GetChatbotWithTagsDto = components["schemas"]["GetChatbotWithTagsDto"];

export default function ChatbotSessions() {
  const { uuid } = useParams<{ uuid: string }>();

  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<GetChatSessionDto[]>([]);
  const [pagination, setPagination] =
    useState<GetChatSessionsDto["pagination"]>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [selectedCustomerRatings, setSelectedCustomerRatings] = useState<number[]>([]);
  const [selectedAdminRatings, setSelectedAdminRatings] = useState<number[]>([]);
  const [selectedAdminTags, setSelectedAdminTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [selectedSession, setSelectedSession] =
    useState<GetChatSessionMessagesDto | null>(null);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [firstChatSearch, setFirstChatSearch] = useState("");

  // Load available tags from chatbot detail
  useEffect(() => {
    if (!uuid) return;
    getChatbot(uuid).then((bot: GetChatbotWithTagsDto) => {
      setAvailableTags(bot.tags || []);
    });
  }, [uuid]);

  // Load sessions
  useEffect(() => {
    if (!uuid) return;
    setLoading(true);

    getChatbotSessions(uuid, {
  currentPage: page + 1,
  pagination: rowsPerPage,
  search: search || undefined,
  customerRating: selectedCustomerRatings.length ? selectedCustomerRatings : undefined,
  adminRating: selectedAdminRatings.length ? selectedAdminRatings : undefined,
  adminTag: selectedAdminTags.length ? selectedAdminTags : undefined,
  customerFeedback: feedbackSearch || undefined,
  firstChat: firstChatSearch || undefined,
})
      .then((res) => {
        setSessions(res.items);
        setPagination(res.pagination);
      })
      .finally(() => setLoading(false));
  }, [
    uuid,
    page,
    rowsPerPage,
    search,
    selectedCustomerRatings,
    selectedAdminRatings,
    selectedAdminTags,
  ]);

  async function openSession(sessionUuid: string) {
    if (selectedSession?.uuid === sessionUuid) {
      setSelectedSession(null); // toggle off
      return;
    }
    const data = await getSessionMessages(sessionUuid);
    setSelectedSession(data);
  }

  // 🔹 Update session tags in memory so table updates immediately
  const updateSessionTags = (sessionUuid: string, newTags: string[]) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.uuid === sessionUuid ? { ...s, adminTag: newTags } : s
      )
    );
    if (selectedSession?.uuid === sessionUuid) {
      setSelectedSession({ ...selectedSession, adminTag: newTags });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chatbot Sessions
      </Typography>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextSearchFilter
          label="Search text in all messages…"
          value={search}
          onChange={(q) => {
            setSearch(q);
            setPage(0);
          }}
        />
      </Stack>

      {/* Sessions Table */}
      <ChatbotSessionsTable
  sessions={sessions}
  pagination={pagination}
  page={page}
  rowsPerPage={rowsPerPage}
  onPageChange={(newPage) => setPage(newPage)}
  onRowsPerPageChange={(rows) => {
    setRowsPerPage(rows);
    setPage(0);
  }}
  onOpenSession={openSession}
  selectedUuid={selectedSession?.uuid}
  selectedCustomerRatings={selectedCustomerRatings}
  onCustomerRatingChange={setSelectedCustomerRatings}
  selectedAdminRatings={selectedAdminRatings}
  onAdminRatingChange={setSelectedAdminRatings}
  selectedAdminTags={selectedAdminTags}
  onAdminTagChange={setSelectedAdminTags}
  availableTags={availableTags}
  feedbackSearch={feedbackSearch}
  onFeedbackSearch={(q) => setFeedbackSearch(q)}
  firstChatSearch={firstChatSearch}
  onFirstChatSearch={(q) => setFirstChatSearch(q)}
/>

      {/* Session Detail */}
      {selectedSession && (
        <SessionDetail
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onTagsUpdated={(newTags) =>
            updateSessionTags(selectedSession.uuid, newTags)
          }
        />
      )}
    </Box>
  );
}