"use client";

import { useEffect, useState } from "react";
import { fetchWeather, WeatherData } from "../lib/weather";
import {
    Sun, Moon, CloudSun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Loader2
} from "lucide-react";

export default function Weather() {
    const [data, setData] = useState<WeatherData | null>(null);
    // Default: Hamburg, Germany
    // TODO: Let user configure this
    const lat = 53.5511;
    const lon = 9.9937;
    const locationName = "Hamburg";

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
        // Refresh every 30 minutes
        const interval = setInterval(load, 1000 * 60 * 30);
        return () => clearInterval(interval);
    }, []);

    if (!data) {
        return (
            <Loader2 className="animate-spin" size={32} />
        );
    }

    const getIcon = (code: number) => {
        // WMO Weather interpretation codes (WW)
        // Using Lucide icons
        // https://open-meteo.com/en/docs
        const props = { size: 60, strokeWidth: 1.5 };

        switch (code) {
            case 0: return <Sun {...props} />; // Clear sky
            case 1:
            case 2: return <CloudSun {...props} />; // Mainly clear, partly cloudy
            case 3: return <Cloud {...props} />; // Overcast
            case 45:
            case 48: return <CloudFog {...props} />; // Fog
            case 51:
            case 53:
            case 55: return <CloudRain {...props} />; // Drizzle
            case 61:
            case 63:
            case 65: return <CloudRain {...props} />; // Rain
            case 71:
            case 73:
            case 75: return <CloudSnow {...props} />; // Snow
            case 77: return <CloudSnow {...props} />; // Snow grains
            case 80:
            case 81:
            case 82: return <CloudRain {...props} />; // Rain showers
            case 85:
            case 86: return <CloudSnow {...props} />; // Snow showers
            case 95: return <CloudLightning {...props} />; // Thunderstorm
            case 96:
            case 99: return <CloudLightning {...props} />; // Thunderstorm with hail
            default: return <Sun {...props} />;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {getIcon(data.weatherCode)}
                <span style={{ fontSize: "5rem", fontWeight: "300", lineHeight: "1" }}>
                    {Math.round(data.temperature)}°
                </span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "400", marginTop: "0.5rem", opacity: 0.8 }}>
                {locationName}
            </div>
        </div>
    );
}
