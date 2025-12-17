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

export async function botMessage(ctx: Context, next: () => Promise<any>) {
  const body = (await json(ctx.req)) as BotMessageBody
  const { message, ticketId: incomingTicketId } = body || {}
  const resolvedTicketId = incomingTicketId || `BOT-${Date.now()}`

  if (!message || !String(message).trim()) {
    ctx.status = 400
    ctx.body = { error: 'Missing message' }
    return
  }

  const reply = '¡Gracias por escribirnos! Tu consulta fue recibida. Un asesor te responderá a la brevedad.'

  ctx.status = 200
  ctx.set('Cache-Control', 'no-store')
  ctx.body = {
    reply,
    ticketId: resolvedTicketId,
    success: true,
  }

  await next()
}
