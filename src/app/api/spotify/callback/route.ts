import { NextResponse } from "next/server";

function encodeBase64(input: string): string {
  const B = (globalThis as any).Buffer;
  if (B && typeof B.from === "function")
    return B.from(input).toString("base64");
  // @ts-ignore
  if (typeof btoa !== "undefined") return btoa(input);
  throw new Error("Base64 not available");
}

export async function GET(request: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new NextResponse("Missing Spotify env vars", { status: 500 });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new NextResponse("No code", { status: 400 });

  const redirectUri = `http://127.0.0.1:4321/api/spotify/callback`;
  const authorizationHeader = encodeBase64(`${clientId}:${clientSecret}`);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorizationHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    return new NextResponse(text, { status: 500 });
  }
  const json = await response.json();
  return new NextResponse(
    `<!doctype html><html><body style="font-family:system-ui;padding:24px"><h1>Spotify tokens received</h1><p><strong>Refresh token</strong> (save as <code>SPOTIFY_REFRESH_TOKEN</code>):</p><pre style="white-space:pre-wrap;word-break:break-all;background:#f4f4f4;padding:12px">${
      json.refresh_token || "(none)"
    }</pre><p>Access token (temporary):</p><pre style="white-space:pre-wrap;word-break:break-all;background:#f4f4f4;padding:12px">${
      json.access_token || "(none)"
    }</pre><p>You can close this tab now.</p></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
