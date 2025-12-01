const VBASE_BUCKET = 'support-messages'
const VBASE_KEY_PENDING = 'pending'

interface SupportMessage {
  id: string
  message: string
  name?: string
  email?: string
  from?: string
  createdAt: string
}

export async function supportPending(ctx: Context, next: () => Promise<any>) {
  const vbase = ctx.clients.vbase

  const messages = (await vbase
    .getJSON<SupportMessage[]>(VBASE_BUCKET, VBASE_KEY_PENDING)
    .catch(() => [])) as SupportMessage[]

  // Limpiamos la lista de pendientes después de entregarlos
  await vbase.saveJSON(VBASE_BUCKET, VBASE_KEY_PENDING, [])

  ctx.status = 200
  ctx.set('Cache-Control', 'no-store')
  ctx.body = messages

  await next()
}
