import { json } from 'co-body'

interface NotifySupportBody {
  message?: string
  customerName?: string
  customerEmail?: string
  from?: string
}

interface PricingServiceSettings {
  callMeBotPhone?: string
  callMeBotApiKey?: string
}

export async function notifySupport(ctx: Context, next: () => Promise<any>) {
  const settings = (await ctx.clients.apps.getAppSettings(
    `${ctx.vtex.account}.pricing-service`
  )) as PricingServiceSettings

  const { callMeBotPhone, callMeBotApiKey } = settings || {}

  if (!callMeBotPhone || !callMeBotApiKey) {
    ctx.status = 500
    ctx.body = { error: 'CallMeBot is not configured' }
    return
  }

  const body = (await json(ctx.req)) as NotifySupportBody
  const { message, customerName, customerEmail, from } = body

  if (!message || !message.trim()) {
    ctx.status = 400
    ctx.body = { error: 'Missing message' }
    return
  }

  const safeMessage = message.trim().slice(0, 1500)

  let text = `Nuevo mensaje desde Mundo Outdoor` + '\n' + '\n'

  if (customerName) {
    text += `Nombre: ${customerName}` + '\n'
  }

  if (customerEmail) {
    text += `Email: ${customerEmail}` + '\n'
  }

  if (from) {
    text += `Origen: ${from}` + '\n'
  }

  text += '\n' + 'Mensaje:' + '\n' + safeMessage

  try {
    await ctx.clients.callmebot.sendWhatsAppMessage({
      phone: callMeBotPhone,
      text,
      apiKey: callMeBotApiKey,
    })

    ctx.status = 200
    ctx.set('Cache-Control', 'no-store')
    ctx.body = { ok: true }
  } catch (error) {
    ctx.status = 502
    ctx.body = { error: 'Failed to send notification' }
  }

  await next()
}
