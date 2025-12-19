"use server";

import fs from 'fs/promises';
import path from 'path';
import { kv } from '@vercel/kv';

const DB_PATH = path.join(process.cwd(), 'settings.json');
const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.KV_URL;

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
        await fs.writeFile(DB_PATH, JSON.stringify(defaultSettings, null, 2));
    }
}

export async function getSettings(): Promise<Settings> {
    if (IS_PROD) {
        try {
            const settings = await kv.get<Settings>('mirror-settings');
            return settings || defaultSettings;
        } catch (e) {
            console.error("KV Error:", e);
            return defaultSettings;
        }
    }

    // Local Fallback
    await ensureLocalDB();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    try {
        return JSON.parse(data);
    } catch {
        return defaultSettings;
    }
}

export async function updateSettings(newSettings: Partial<Settings>) {
    const current = await getSettings();
    const updated = { ...current, ...newSettings };

    if (IS_PROD) {
        await kv.set('mirror-settings', updated);
    } else {
        await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
    }

    return updated;
}
