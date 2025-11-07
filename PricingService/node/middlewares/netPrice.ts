export async function netPrice(ctx: Context, next: () => Promise<any>) {
  const {
    query: { skuId: rawSkuId, seller: rawSeller, price: rawPrice },
  } = ctx

  const skuId = rawSkuId ? Number(Array.isArray(rawSkuId) ? rawSkuId[0] : rawSkuId) : null
  const seller = rawSeller ? String(Array.isArray(rawSeller) ? rawSeller[0] : rawSeller) : '1'
  const price = rawPrice ? Number(Array.isArray(rawPrice) ? rawPrice[0] : rawPrice) : null

  if (!price || Number.isNaN(price)) {
    ctx.status = 400
    ctx.body = {
      error: 'Missing or invalid price parameter',
    }

    return
  }

  // IVA rate for Argentina (21%)
  const ivaRate = 0.21

  // Calculate price without IVA
  const priceWithoutIVA = Math.round(price / (1 + ivaRate))

  ctx.status = 200
  ctx.set('Cache-Control', 'no-store')
  ctx.body = {
    skuId,
    seller,
    priceFinal: price,
    ivaRate,
    priceWithoutIVA,
  }

  await next()
}
