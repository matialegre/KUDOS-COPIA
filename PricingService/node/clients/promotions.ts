import { IOContext, InstanceOptions, JanusClient } from '@vtex/api'

export interface CouponPayload {
  utmSource: string
  utmCampaign?: string | null
  couponCode: string
  isArchived?: boolean
  maxItemsPerClient?: number
  expirationIntervalPerUse?: string
}

export class PromotionsClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public createCoupon(coupon: CouponPayload) {
    return this.http.post('/api/rnb/pvt/coupon', coupon, {
      metric: 'promotions-create-coupon',
    })
  }
}
