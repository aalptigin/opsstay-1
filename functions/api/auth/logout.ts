export async function onRequestPost({ request }: any) {
  const secure = new URL(request.url).protocol === "https:";
  const cookie =
    `opsstay_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` + (secure ? `; Secure` : "");

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": cookie,
    },
  });
}
