"use client";

import { useEffect, useState } from "react";
import { DailySong, getDailySong } from "../lib/daily";
import { Music2 } from "lucide-react";

export default function DailySpotlight() {
    const [song, setSong] = useState<DailySong | null>(null);

    useEffect(() => {
        async function load() {
            const data = await getDailySong();
            setSong(data);
        }
        load();
    }, []);

    if (!song) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '500px', animation: 'fadeIn 1s ease-in' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>
                <Music2 size={16} />
                <span>Song of the Day</span>
            </div>

            <div style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.5rem' }}>
                {song.title}
            </div>
            <div style={{ fontSize: '1.2rem', opacity: 0.8, fontWeight: 300 }}>
                {song.artist}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
