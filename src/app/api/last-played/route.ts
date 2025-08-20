import { NextResponse } from "next/server";

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID!;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const spotifyRefreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

function encodeBase64(input: string): string {
  const B = (globalThis as any).Buffer;
  if (B && typeof B.from === "function") return B.from(input).toString("base64");
  // @ts-ignore
  if (typeof btoa !== "undefined") return btoa(input);
  throw new Error("Base64 not available");
}

async function fetchAccessToken(): Promise<string> {
  if (!spotifyClientId || !spotifyClientSecret || !spotifyRefreshToken) {
    throw new Error("Missing Spotify environment variables");
  }
  const authorizationHeader = encodeBase64(`${spotifyClientId}:${spotifyClientSecret}`);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorizationHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: spotifyRefreshToken,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.status}`);
  }
  const json = await response.json();
  return json.access_token as string;
}

export async function GET() {
  try {
    const accessToken = await fetchAccessToken();
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok) {
      return NextResponse.json({ error: "Spotify API error" }, { status: 500 });
    }
    const json = await response.json();
    const item = json?.items?.[0];
    const track = item?.track;
    const payload = item
      ? {
          playedAt: item.played_at,
          track: {
            name: track?.name,
            url: track?.external_urls?.spotify,
            artists: (track?.artists || []).map((a: any) => a.name).join(", "),
            album: track?.album?.name,
            albumArtUrl: track?.album?.images?.[0]?.url ?? null,
            durationMs: track?.duration_ms,
          },
        }
      : {};
    const res = NextResponse.json(payload);
    res.headers.set("cache-control", "public, max-age=0, s-maxage=60, stale-while-revalidate=600");
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}


