import type { components } from "./schema";

// Extract model type from CreateChatbotDto
export type ChatbotModel = NonNullable<
  components["schemas"]["CreateChatbotDto"]["model"]
>;
