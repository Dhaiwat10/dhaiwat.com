import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Missing SPOTIFY_CLIENT_ID", { status: 500 });
  }
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/spotify/callback`;
  const authorize = new URL("https://accounts.spotify.com/authorize");
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("scope", "user-read-recently-played");
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("state", Math.random().toString(36).slice(2));
  return NextResponse.redirect(authorize.toString(), 302);
}


