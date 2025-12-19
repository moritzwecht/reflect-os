"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, Settings } from "../../lib/store";

export default function Remote() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [msgInput, setMsgInput] = useState("");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const s = await getSettings();
        setSettings(s);
        setMsgInput(s.customMessage);
        setLoading(false);
    }

    async function toggle(key: keyof Settings) {
        if (!settings) return;
        const newVal = !settings[key];
        // Optimistic update
        setSettings({ ...settings, [key]: newVal });
        await updateSettings({ [key]: newVal });
    }

    async function saveMessage() {
        await updateSettings({ customMessage: msgInput });
        alert("Nachricht gesendet!");
    }

    if (loading || !settings) return <div style={{ padding: '2rem', color: 'white' }}>Laden...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            color: 'white',
            padding: '2rem',
            fontFamily: 'sans-serif'
        }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Mirror Remote</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Toggles */}
                <Toggle label="Wetter anzeigen" checked={settings.showWeather} onClick={() => toggle('showWeather')} />
                <Toggle label="HVV anzeigen" checked={settings.showTransport} onClick={() => toggle('showTransport')} />
                <Toggle label="News anzeigen" checked={settings.showNews} onClick={() => toggle('showNews')} />
                <Toggle label="Song of the Day" checked={settings.showSong} onClick={() => toggle('showSong')} />

                <hr style={{ borderColor: '#333', margin: '1rem 0' }} />

                {/* Custom Message */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nachricht an Spiegel:</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            placeholder="Ich liebe dich..."
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                background: '#111',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                        />
                        <button
                            onClick={saveMessage}
                            style={{
                                padding: '0 1.2rem',
                                backgroundColor: 'white',
                                color: 'black',
                                fontWeight: 700,
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Senden
                        </button>
                    </div>
                    {settings.customMessage && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.5 }}>
                            Aktuell: "{settings.customMessage}"
                            <button onClick={() => { setMsgInput(""); updateSettings({ customMessage: "" }); setSettings(s => s ? ({ ...s, customMessage: "" }) : null) }} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Löschen</button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function Toggle({ label, checked, onClick }: { label: string, checked: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#111',
                borderRadius: '12px',
                cursor: 'pointer',
                border: checked ? '1px solid white' : '1px solid #333'
            }}
        >
            <span style={{ fontWeight: 500 }}>{label}</span>
            <div style={{
                width: '40px',
                height: '24px',
                backgroundColor: checked ? 'white' : '#333',
                borderRadius: '12px',
                position: 'relative',
                transition: 'background 0.2s'
            }}>
                <div style={{
                    width: '18px',
                    height: '18px',
                    backgroundColor: checked ? 'black' : 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '3px',
                    left: checked ? '19px' : '3px',
                    transition: 'left 0.2s'
                }} />
            </div>
        </div>
    );
}
