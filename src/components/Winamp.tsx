"use client";
import { useEffect, useState } from "react";

type Track = {
  name?: string;
  url?: string;
  artists?: string;
  album?: string;
  albumArtUrl?: string | null;
  durationMs?: number;
};

export default function Winamp() {
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/last-played")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Request failed"))))
      .then((data) => setTrack(data?.track ?? null))
      .catch(() => setError("Failed to load"));
  }, []);

  const progressWidth = (() => {
    const d = track?.durationMs || 0;
    return Math.max(5, Math.min(100, Math.round((15_000 / Math.max(1, d)) * 100)));
  })();

  const formatDuration = (ms?: number) => {
    const total = Math.max(0, Math.floor((ms ?? 0) / 1000));
    const m = Math.floor(total / 60)
      .toString()
      .padStart(1, "0");
    const s = (total % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const eqSeed = (track?.name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) || 7;
  const eq = Array.from({ length: 10 }).map((_, i) => ((Math.sin((i + 1) * eqSeed) + 1) / 2) * 100);

  return (
    <div className="w-full max-w-[520px] mt-8 bg-[#2b2b2b] text-[#e6e6e6] border-2 border-[#111] shadow-[0_2px_0_#000,inset_0_0_0_1px_#555] mx-auto">
      <div className="flex items-center justify-between px-2 py-1.5 bg-gradient-to-b from-[#0a6] to-[#084] text-white font-bold tracking-wider">
        <div className="text-[12px] uppercase">Last Played</div>
        <div className="space-x-1 text-[12px] select-none">
          <span>_</span>
          <span>□</span>
          <span>×</span>
        </div>
      </div>
      <div className="grid grid-cols-[80px_1fr] gap-3 p-3 items-center">
        {track?.albumArtUrl ? (
          <img className="w-20 h-20 object-cover border border-black shadow-[inset_0_0_0_1px_#777] bg-[#111]" src={track.albumArtUrl} alt="Album art" />
        ) : (
          <div className="w-20 h-20 border border-black shadow-[inset_0_0_0_1px_#777] bg-[#111]" />
        )}
        <div className="flex flex-col gap-2">
          <div className="bg-[#0a0] text-black font-mono text-[12px] px-2 py-1 tracking-[0.15em] shadow-[inset_0_-2px_0_#060,inset_0_2px_0_#5f5]">
            {(track?.name ?? error ?? "Loading…").toUpperCase()}
          </div>
          <div className="text-[12px] text-[#cfd2cf] whitespace-nowrap overflow-hidden text-ellipsis">
            {track ? `${track.artists ?? "Unknown artist"} — ${track.album ?? ""}` : ""}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button aria-label="prev" className="h-6 w-6 grid place-items-center bg-[#3a3a3a] border border-black shadow-[inset_0_0_0_1px_#6b6b6b] cursor-default">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="text-[#dcdcdc]"><path d="M6.5 1v6H5V1h1.5zM5 4L1 7V1l4 3z"/></svg>
              </button>
              <button aria-label="play" className="h-6 w-6 grid place-items-center bg-[#3a3a3a] border border-black shadow-[inset_0_0_0_1px_#6b6b6b] cursor-default">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="text-[#00ff00]"><path d="M2 1l5 3-5 3V1z"/></svg>
              </button>
              <button aria-label="pause" className="h-6 w-6 grid place-items-center bg-[#3a3a3a] border border-black shadow-[inset_0_0_0_1px_#6b6b6b] cursor-default">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="text-[#dcdcdc]"><path d="M2 1h2v6H2zM5 1h2v6H5z"/></svg>
              </button>
              <button aria-label="stop" className="h-6 w-6 grid place-items-center bg-[#3a3a3a] border border-black shadow-[inset_0_0_0_1px_#6b6b6b] cursor-default">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="text-[#ff4141]"><path d="M2 2h4v4H2z"/></svg>
              </button>
              <button aria-label="next" className="h-6 w-6 grid place-items-center bg-[#3a3a3a] border border-black shadow-[inset_0_0_0_1px_#6b6b6b] cursor-default">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="text-[#dcdcdc]"><path d="M1.5 1h1.5v6H1.5zM3 4l4 3V1L3 4z"/></svg>
              </button>
            </div>
            <div className="flex-1 h-2 relative bg-[#101010] border border-black shadow-[inset_0_0_0_1px_#444]">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0f0] to-[#0a0]" style={{ width: `${progressWidth}%` }} />
              <div className="pointer-events-none absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,#fff0_0,#fff0_6px,#fff2_6px,#fff2_12px)]" />
            </div>
            <div className="text-[10px] font-mono text-[#7fffd4] min-w-[32px] text-right">{formatDuration(track?.durationMs)}</div>
          </div>
          <div className="flex items-end gap-2">
            <div className="w-24 h-2 relative bg-[#101010] border border-black shadow-[inset_0_0_0_1px_#444]">
              <div className="absolute inset-y-0 left-0 bg-[#7fffd4]" style={{ width: `60%` }} />
            </div>
            <div className="flex items-end gap-1 h-8">
              {eq.map((v, idx) => (
                <div key={idx} className="w-1.5 bg-[#0a0]" style={{ height: `${Math.max(10, Math.min(100, v))}%` }} />
              ))}
            </div>
            {track?.url ? (
              <a className="ml-auto inline-block bg-[#1db954] text-white border border-[#0a8f3a] px-2 py-0.5 text-[12px] shadow-[0_1px_0_#000,inset_0_0_0_1px_#6fd08f]" href={track.url} target="_blank" rel="noreferrer">
                Open in Spotify
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}


