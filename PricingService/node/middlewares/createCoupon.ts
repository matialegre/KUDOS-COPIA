import { json } from 'co-body'
import type { CouponPayload } from '../clients/promotions'

const WELCOME_UTM_SOURCE = 'WELCOME10'

function generateCouponCode(email: string) {
  const normalized = email.trim().toLowerCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `MUNDO10-${random}`
}

export async function createCoupon(ctx: Context, next: () => Promise<any>) {
  const body = (await json(ctx.req)) as { email?: string }
  const email = body?.email?.trim()

  if (!email) {
    ctx.status = 400
    ctx.body = { error: 'Missing email' }
    return
  }

  const couponCode = generateCouponCode(email)

  const payload: CouponPayload = {
    utmSource: WELCOME_UTM_SOURCE,
    utmCampaign: null,
    couponCode,
    isArchived: false,
    maxItemsPerClient: 0,
    expirationIntervalPerUse: '00:00:00',
  }

  try {
    await ctx.clients.promotions.createCoupon(payload)

    ctx.status = 200
    ctx.set('Cache-Control', 'no-store')
    ctx.body = { couponCode }
  } catch (err) {
    ctx.status = 500
    ctx.body = { error: 'Failed to create coupon' }
  }

  await next()
}
