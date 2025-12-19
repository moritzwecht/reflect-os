"use client";

import { useState, useEffect } from "react";

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const dateString = time.toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: "6rem", fontWeight: "300", lineHeight: "1" }}>
                {timeString}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "400", marginTop: "0.5rem", opacity: 0.8 }}>
                {dateString}
            </div>
        </div>
    );
}
