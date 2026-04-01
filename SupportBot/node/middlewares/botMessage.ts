import { json } from 'co-body'

interface BotMessageBody {
  ticketId?: string
  message?: string
  customerName?: string
  customerEmail?: string
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

export async function botMessage(ctx: Context, next: () => Promise<any>) {
  const body = (await json(ctx.req)) as BotMessageBody
  const { message, ticketId: incomingTicketId } = body || {}
  const resolvedTicketId = incomingTicketId || `BOT-${Date.now()}`

  if (!message || !String(message).trim()) {
    ctx.status = 400
    ctx.body = { error: 'Missing message' }
    return
  }

  const settings = (await ctx.clients.apps.getAppSettings(
    `${ctx.vtex.account}.support-bot`
  )) as SupportBotSettings

  const fallbackReply = '¡Gracias por escribirnos! Tu consulta fue recibida. Un asesor te responderá a la brevedad.'

  if (settings.enabled && settings.pythonEndpoint) {
    try {
      const payload = {
        ticketId: resolvedTicketId,
        message,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        source: body.source || 'web-support',
        context: body.context || {},
      }

      const response: any = await ctx.clients.pythonSupport.notifySupport(
        settings.pythonEndpoint,
        payload
      )

      ctx.status = 200
      ctx.set('Cache-Control', 'no-store')
      ctx.body = {
        reply: response?.reply || fallbackReply,
        ticketId: resolvedTicketId,
        forwarded: true,
        success: true,
      }
    } catch (err) {
      console.error('[SupportBot] Error forwarding to Python:', err)
      ctx.status = 200
      ctx.set('Cache-Control', 'no-store')
      ctx.body = {
        reply: fallbackReply,
        ticketId: resolvedTicketId,
        forwarded: false,
        success: true,
      }
    }
  } else {
    ctx.status = 200
    ctx.set('Cache-Control', 'no-store')
    ctx.body = {
      reply: fallbackReply,
      ticketId: resolvedTicketId,
      forwarded: false,
      success: true,
    }
  }

  await next()
}
