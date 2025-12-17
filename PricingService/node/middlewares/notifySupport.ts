// Support notifications moved to mundooutdoorar.support-bot app
// This endpoint is deprecated and will be removed in future versions

export async function notifySupport(ctx: Context, next: () => Promise<any>) {
  ctx.status = 503
  ctx.set('Cache-Control', 'no-store')
  ctx.body = {
    error: 'Support notifications disabled',
    message: 'This endpoint has been deprecated. Please use mundooutdoorar.support-bot app instead.',
  }

  await next()
}
