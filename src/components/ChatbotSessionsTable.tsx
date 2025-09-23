import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
} from "@mui/material";
import RatingFilter from "./filters/RatingFilter";
import TagFilter from "./filters/TagFilter";
import TextSearchFilter from "./filters/TextSearchFilter"; // ✅ add import
import type { components } from "../api/schema";

type GetChatSessionDto = components["schemas"]["GetChatSessionDto"];
type GetChatSessionsDto = components["schemas"]["GetChatSessionsDto"];

export default function ChatbotSessionsTable({
  sessions,
  pagination,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onOpenSession,
  selectedUuid,
  selectedCustomerRatings,
  onCustomerRatingChange,
  selectedAdminRatings,
  onAdminRatingChange,
  selectedAdminTags,
  onAdminTagChange,
  availableTags,
  feedbackSearch,
  onFeedbackSearch,
  firstChatSearch,
  onFirstChatSearch,
}: {
  sessions: GetChatSessionDto[];
  pagination?: GetChatSessionsDto["pagination"];
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onOpenSession: (uuid: string) => void;
  selectedUuid?: string | null;
  selectedCustomerRatings: number[];
  onCustomerRatingChange: (ratings: number[]) => void;
  selectedAdminRatings: number[];
  onAdminRatingChange: (ratings: number[]) => void;
  selectedAdminTags: string[];
  onAdminTagChange: (tags: string[]) => void;
  availableTags: string[];
  feedbackSearch: string;
  onFeedbackSearch: (q: string) => void;
  firstChatSearch: string;
  onFirstChatSearch: (q: string) => void;
}) {
  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Created At</TableCell>
            <TableCell>
              Customer Rating
              <RatingFilter
                selected={selectedCustomerRatings}
                onChange={onCustomerRatingChange}
              />
            </TableCell>
            <TableCell>
              Admin Rating
              <RatingFilter
                selected={selectedAdminRatings}
                onChange={onAdminRatingChange}
              />
            </TableCell>
            <TableCell>
              Admin Tags
              <TagFilter
                tags={availableTags}
                selected={selectedAdminTags}
                onChange={onAdminTagChange}
              />
            </TableCell>
            <TableCell>
              Customer Feedback
              <TextSearchFilter
                value={feedbackSearch}
                onChange={onFeedbackSearch}
                label="Search feedback…"
              />
            </TableCell>
            <TableCell>
              First Chat
              <TextSearchFilter
                value={firstChatSearch}
                onChange={onFirstChatSearch}
                label="Search first chat…"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((s) => (
            <TableRow
              key={s.uuid}
              hover
              sx={{
                cursor: "pointer",
                backgroundColor:
                  selectedUuid === s.uuid ? "rgba(25, 118, 210, 0.1)" : undefined,
              }}
              onClick={() => onOpenSession(s.uuid)}
            >
              <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
              <TableCell>{s.customerRating ?? "—"}</TableCell>
              <TableCell>{s.adminRating ?? "—"}</TableCell>
              <TableCell>
                {s.adminTag?.length
                  ? s.adminTag.map((tag, i) => (
                      <Chip key={i} size="small" label={tag} sx={{ mr: 0.5 }} />
                    ))
                  : "—"}
              </TableCell>
              <TableCell>
                {s.customerFeedback
                  ? s.customerFeedback.length > 40
                    ? s.customerFeedback.slice(0, 40) + "…"
                    : s.customerFeedback
                  : "—"}
              </TableCell>
              <TableCell>
                {s.firstChat?.content
                  ? s.firstChat.content.length > 40
                    ? s.firstChat.content.slice(0, 40) + "…"
                    : s.firstChat.content
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && (
        <TablePagination
          component="div"
          count={pagination.totalItems}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange(parseInt(e.target.value, 10))
          }
        />
      )}
    </>
  );
}