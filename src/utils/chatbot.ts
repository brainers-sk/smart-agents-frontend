import type { components } from '../api/schema'

type UpdateChatbotDto = components['schemas']['UpdateChatbotDto']
type GetChatbotDto = components['schemas']['GetChatbotDto']

export function toUpdatePayload(bot: GetChatbotDto): UpdateChatbotDto {
  return {
    name: bot.name,
    description: bot.description,
    instructions: bot.instructions,
    temperature: bot.temperature,
    service: bot.service,
    model: bot.model,
    themeCss: bot.themeCss,
    buttonLabel: bot.buttonLabel,
    buttonStyleCss: bot.buttonStyleCss,
    allowCustomerRating: bot.allowCustomerRating,
    allowedDomains: bot.allowedDomains,
  }
}
