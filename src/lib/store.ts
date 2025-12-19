"use server";

import fs from 'fs/promises';
import path from 'path';
import { kv } from '@vercel/kv';

const DB_PATH = path.join(process.cwd(), 'settings.json');
// Only use KV if we are in production AND have a URL, otherwise fallback to local for safety.
const USE_KV = !!process.env.KV_URL;

export interface Settings {
    showWeather: boolean;
    showTransport: boolean;
    showNews: boolean;
    showSong: boolean;
    customMessage: string;
}

const defaultSettings: Settings = {
    showWeather: true,
    showTransport: true,
    showNews: true,
    showSong: true,
    customMessage: ""
};

// Helper: Ensure DB exists (Local only)
async function ensureLocalDB() {
    try {
        await fs.access(DB_PATH);
    } catch {
        try {
            await fs.writeFile(DB_PATH, JSON.stringify(defaultSettings, null, 2));
        } catch (e) {
            console.error("Local DB Create Error (Expected on Vercel):", e);
        }
    }
}

export async function getSettings(): Promise<Settings> {
    if (USE_KV) {
        try {
            const settings = await kv.get<Settings>('mirror-settings');
            return settings || defaultSettings;
        } catch (e) {
            console.error("Vercel KV Read Error (Check connection):", e);
            return defaultSettings;
        }
    }

    // Local Fallback
    try {
        await ensureLocalDB();
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Local Read Error:", e);
        return defaultSettings;
    }
}

export async function updateSettings(newSettings: Partial<Settings>) {
    try {
        const current = await getSettings();
        const updated = { ...current, ...newSettings };

        if (USE_KV) {
            await kv.set('mirror-settings', updated);
        } else {
            await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
        }

        return updated;
    } catch (e) {
        console.error("Update Error:", e);
        return defaultSettings;
    }
}
