"use client";

import { useEffect, useState } from "react";
import { Departure, getDepartures } from "../lib/transport";
import { Bus, Train } from "lucide-react";

export default function Transport() {
    const [departures, setDepartures] = useState<Departure[]>([]);

    useEffect(() => {
        async function load() {
            const data = await getDepartures();
            setDepartures(data);
        }

        load();
        // Refresh every 30 seconds
        const interval = setInterval(load, 1000 * 30);
        return () => clearInterval(interval);
    }, []);

    if (departures.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '400px' }}>
            {departures.map((dep, i) => {
                const date = new Date(dep.time);
                const now = new Date();
                const diff = Math.round((date.getTime() - now.getTime()) / 60000);
                const timeDisplay = diff <= 0 ? 'Jetzt' : `${diff} min`;

                return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem' }}>

                        {/* Line Badge (HVV Style) */}
                        <div style={{
                            minWidth: '42px',
                            height: '24px',
                            backgroundColor: 'white',
                            color: 'black',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            padding: '0 4px'
                        }}>
                            {dep.line}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div style={{ display: 'flex', gap: '0.5rem', fontWeight: 600 }}>
                                <span style={{ fontWeight: 400, opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {dep.direction}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{dep.station}</div>
                        </div>
                        <div style={{ fontWeight: 600, textAlign: 'right', minWidth: '50px' }}>
                            {timeDisplay}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
