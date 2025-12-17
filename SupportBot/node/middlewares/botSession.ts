import { json } from 'co-body'

interface BotSessionBody {
  ticketId?: string
  source?: string
  context?: {
    page?: string
    orderId?: string
    cartId?: string
  }
}

interface SupportBotSettings {
  enabled?: boolean
  pythonEndpoint?: string
}

export async function botSession(ctx: Context, next: () => Promise<any>) {
  const settings = (await ctx.clients.apps.getAppSettings(
    `${ctx.vtex.account}.support-bot`
  )) as SupportBotSettings

  const body = (await json(ctx.req)) as BotSessionBody
  const incomingTicketId = body?.ticketId
  const ticketId = incomingTicketId || `BOT-${Date.now()}`

  ctx.status = 200
  ctx.set('Cache-Control', 'no-store')
  ctx.body = {
    ticketId,
    enabled: !!settings.enabled,
  }

  await next()
}
