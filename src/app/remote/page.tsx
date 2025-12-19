"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../lib/actions";
import { Settings } from "../../lib/store";
import { Send, Trash2 } from "lucide-react";

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
        if (!msgInput.trim()) return;
        setSettings(s => s ? ({ ...s, customMessage: msgInput }) : null);
        await updateSettings({ customMessage: msgInput });
        setMsgInput(""); // Clear field
    }

    async function clearMessage() {
        setMsgInput("");
        setSettings(s => s ? ({ ...s, customMessage: "" }) : null);
        await updateSettings({ customMessage: "" });
    }

    if (loading || !settings) return <div style={{ padding: '2rem', color: 'white' }}>Laden...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            color: 'white',
            padding: '1.5rem',
            fontFamily: 'sans-serif',
            maxWidth: '500px',
            margin: '0 auto'
        }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>Mirror Remote</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                {/* Toggles */}
                <Toggle label="Wetter anzeigen" checked={settings.showWeather} onClick={() => toggle('showWeather')} />
                <Toggle label="HVV anzeigen" checked={settings.showTransport} onClick={() => toggle('showTransport')} />
                <Toggle label="News anzeigen" checked={settings.showNews} onClick={() => toggle('showNews')} />
                <Toggle label="Song of the Day" checked={settings.showSong} onClick={() => toggle('showSong')} />

                <hr style={{ borderColor: '#222', margin: '0.5rem 0' }} />

                {/* Custom Message */}
                <div style={{ backgroundColor: '#111', padding: '1.2rem', borderRadius: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.9rem', opacity: 0.7 }}>
                        NACHRICHT SENDEN
                    </label>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <input
                            type="text"
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            placeholder="Nachricht ..."
                            onKeyDown={(e) => e.key === 'Enter' && saveMessage()}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid #333',
                                background: '#000',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={saveMessage}
                            style={{
                                width: '50px',
                                height: '50px',
                                backgroundColor: 'white',
                                color: 'black',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Send size={24} />
                        </button>
                    </div>

                    {settings.customMessage && (
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            backgroundColor: '#1a1a1a',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: '4px solid white'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.2rem' }}>AKTIVE NACHRICHT:</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>{settings.customMessage}</div>
                            </div>
                            <button
                                onClick={clearMessage}
                                style={{
                                    backgroundColor: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={20} />
                            </button>
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
