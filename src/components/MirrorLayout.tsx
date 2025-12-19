"use client";

import { useEffect, useState } from "react";
import { getSettings } from "../lib/actions";
import styles from "../app/page.module.css";
import Clock from "./Clock";
import Weather from "./Weather";
import SunTimes from "./SunTimes";
import Transport from "./Transport";
import News from "./News";
import DailySpotlight from "./DailySpotlight";
import { Settings } from "../lib/store";

export default function MirrorLayout({ initialSettings }: { initialSettings: Settings }) {
    const [settings, setSettings] = useState<Settings>(initialSettings);

    useEffect(() => {
        // Poll settings every 3 seconds to stay in sync with Remote
        async function load() {
            try {
                const s = await getSettings();
                setSettings(s);
            } catch (e) {
                console.error("Polling error:", e);
            }
        }

        const interval = setInterval(load, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className={styles.main}>
            {/* Top Left: Clock (Always visible) */}
            <div className={styles.topLeft}>
                <Clock />
            </div>

            {/* Top Right: Weather & Sun */}
            {settings.showWeather && (
                <div className={styles.topRight}>
                    <Weather />
                    <div style={{ marginTop: '2rem' }}>
                        <SunTimes />
                    </div>
                </div>
            )}

            {/* Center: Song or Custom Message */}
            <div className={styles.center}>
                {settings.customMessage ? (
                    <div style={{
                        fontSize: '4rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        maxWidth: '80vw',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        {settings.customMessage}
                    </div>
                ) : (
                    settings.showSong && <DailySpotlight />
                )}
            </div>

            {/* Bottom Left: News */}
            {settings.showNews && (
                <div className={styles.bottomLeft}>
                    <News />
                </div>
            )}

            {/* Bottom Right: Transport */}
            {settings.showTransport && (
                <div className={styles.bottomRight}>
                    <Transport />
                </div>
            )}
        </main>
    );
}
