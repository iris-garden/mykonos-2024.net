export async function onRequestGet(ctx) {
  const file = await ctx.env.bucket.get(ctx.params.path);
  if (!file) return new Response(null, { status: 404 });
  return new Response(file.body, {
    headers: {"Content-Type": "image/jpeg"},
  });
}

