"use client";

import { useEffect, useState } from "react";
import { fetchWeather, WeatherData } from "../lib/weather";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function SunTimes() {
    const [data, setData] = useState<WeatherData | null>(null);
    // Default: Hamburg, Germany
    // TODO: Let user configure this centrally
    const lat = 53.5511;
    const lon = 9.9937;

    useEffect(() => {
        async function load() {
            try {
                const weather = await fetchWeather(lat, lon);
                setData(weather);
            } catch (e) {
                console.error(e);
            }
        }

        load();
        // Refresh every 60 minutes
        const interval = setInterval(load, 1000 * 60 * 60);
        return () => clearInterval(interval);
    }, []);

    if (!data || !data.sunrise || !data.sunset) return null;

    // Format times (YYYY-MM-DDTHH:MM) -> HH:MM
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', opacity: 0.9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'flex-start' }}>
                <ArrowUp size={20} strokeWidth={2} />
                <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>{formatTime(data.sunrise)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'flex-start' }}>
                <ArrowDown size={20} strokeWidth={2} />
                <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>{formatTime(data.sunset)}</span>
            </div>
        </div>
    );
}
