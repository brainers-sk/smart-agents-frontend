import { api } from "./client";
import type { paths } from "./schema";

// Type helpers from openapi-typescript:
type Resp<T> = T extends {
  responses: { 200: { content: { "application/json": infer R } } };
}
  ? R
  : never;
type Body<T> = T extends {
  requestBody: { content: { "application/json": infer B } };
}
  ? B
  : never;
type Qs<T> = T extends { parameters: { query: infer Q } } ? Q : never;
type PathParams<T> = T extends { parameters: { path: infer P } } ? P : never;

// ---- Health ----
export async function getHealth() {
  type Get = paths["/health"]["get"];
  const { data } = await api.get<Resp<Get>>("/health");
  return data;
}

// ---- Admin Chatbots ----
export async function listChatbots(
  query?: Partial<Qs<paths["/admin/chatbot/list"]["get"]>>
) {
  type Get = paths["/admin/chatbot/list"]["get"];
  const { data } = await api.get<Resp<Get>>("/admin/chatbot/list", {
    params: query,
  });
  return data;
}

export async function getChatbot(chatbotUuid: string) {
  type Get = paths["/admin/chatbot/{chatbotUuid}"]["get"];
  const { data } = await api.get<Resp<Get>>(`/admin/chatbot/${chatbotUuid}`);
  return data;
}

export async function createChatbot(
  payload: Body<paths["/admin/chatbot"]["post"]>
) {
  type Post = paths["/admin/chatbot"]["post"];
  const { data } = await api.post<Resp<Post>>("/admin/chatbot", payload);
  return data;
}

export async function updateChatbot(
  chatbotUuid: string,
  payload: Body<paths["/admin/chatbot/{chatbotUuid}"]["patch"]>
) {
  type Patch = paths["/admin/chatbot/{chatbotUuid}"]["patch"];
  const { data } = await api.patch<Resp<Patch>>(
    `/admin/chatbot/${chatbotUuid}`,
    payload
  );
  return data;
}

export async function deleteChatbot(chatbotUuid: string) {
  type Del = paths["/admin/chatbot/{chatbotUuid}"]["delete"];
  const { data } = await api.delete<Resp<Del>>(`/admin/chatbot/${chatbotUuid}`);
  return data;
}

// ---- Chat ----
export async function sendMessage(
  chatbotId: string,
  payload: Body<paths["/chat/{chatbotId}/message"]["post"]>
) {
  type Post = paths["/chat/{chatbotId}/message"]["post"];
  const { data } = await api.post<Resp<Post>>(
    `/chat/${chatbotId}/message`,
    payload
  );
  return data;
}

// ---- Chat Sessions ----
export async function getChatbotSessions(
  chatbotUuid: string,
  query?: Partial<Qs<paths["/chat/chatbot/{chatbotUuid}/sessions"]["get"]>>
) {
  type Get = paths["/chat/chatbot/{chatbotUuid}/sessions"]["get"];
  const { data } = await api.get<Resp<Get>>(
    `/chat/chatbot/${chatbotUuid}/sessions`,
    { params: query }
  );
  return data;
}

export async function getSessionMessages(sessionUuid: string) {
  type Get = paths["/chat/session/{sessionUuid}/messages"]["get"];
  const { data } = await api.get<Resp<Get>>(
    `/chat/session/${sessionUuid}/messages`
  );
  return data;
}

// ---- Tags on sessions ----
export async function addTagToSession(
  sessionUuid: string,
  payload: Body<paths["/chat/session/{sessionUuid}/add-tag"]["post"]>
) {
  type Post = paths["/chat/session/{sessionUuid}/add-tag"]["post"];
  const { data } = await api.post<Resp<Post>>(
    `/chat/session/${sessionUuid}/add-tag`,
    payload
  );
  return data;
}

export async function removeTagFromSession(
  sessionUuid: string,
  payload: Body<paths["/chat/session/{sessionUuid}/remove-tag"]["post"]>
) {
  type Post = paths["/chat/session/{sessionUuid}/remove-tag"]["post"];
  const { data } = await api.post<Resp<Post>>(
    `/chat/session/${sessionUuid}/remove-tag`,
    payload
  );
  return data;
}
