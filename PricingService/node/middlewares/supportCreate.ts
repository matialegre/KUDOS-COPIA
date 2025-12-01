import { json } from 'co-body'

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

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
}

export async function supportCreate(ctx: Context, next: () => Promise<any>) {
  const body = (await json(ctx.req)) as {
    message?: string
    name?: string
    email?: string
    from?: string
  }

  const rawMessage = body?.message?.trim()

  if (!rawMessage) {
    ctx.status = 400
    ctx.body = { error: 'Missing message' }
    return
  }

  const message: SupportMessage = {
    id: generateId(),
    message: rawMessage,
    name: body.name?.trim() || undefined,
    email: body.email?.trim() || undefined,
    from: body.from?.trim() || undefined,
    createdAt: new Date().toISOString(),
  }

  const vbase = ctx.clients.vbase

  const current = (await vbase
    .getJSON<SupportMessage[]>(VBASE_BUCKET, VBASE_KEY_PENDING)
    .catch(() => [])) as SupportMessage[]

  current.push(message)

  await vbase.saveJSON(VBASE_BUCKET, VBASE_KEY_PENDING, current)

  ctx.status = 200
  ctx.set('Cache-Control', 'no-store')
  ctx.body = { id: message.id }

  await next()
}
