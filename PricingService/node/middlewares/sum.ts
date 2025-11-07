export async function sum(ctx: Context, next: () => Promise<any>) {
  const {
    query: { x: rawX, y: rawY },
  } = ctx

  const x = Number(Array.isArray(rawX) ? rawX[0] : rawX ?? '1')
  const y = Number(Array.isArray(rawY) ? rawY[0] : rawY ?? '1')

  if (Number.isNaN(x) || Number.isNaN(y)) {
    ctx.status = 400
    ctx.body = {
      message: 'Provide numeric query params ?x=&y=',
    }

    return
  }

  ctx.status = 200
  ctx.set('Cache-Control', 'no-store')
  ctx.body = {
    x,
    y,
    result: x + y,
  }

  await next()
}
