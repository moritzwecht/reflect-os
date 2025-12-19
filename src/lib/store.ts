"use server";

import fs from 'fs/promises';
import path from 'path';
import { kv } from '@vercel/kv';

const DB_PATH = path.join(process.cwd(), 'settings.json');

// Vercel KV needs KV_REST_API_URL and KV_REST_API_TOKEN.
// If the user only has REDIS_URL, they might have the wrong integration.
const HAS_KV_VARS = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const USE_STORAGE = HAS_KV_VARS || !!process.env.KV_URL;

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
            // Only write if we are NOT on Vercel (or in /tmp)
            if (process.env.NODE_ENV !== 'production') {
                await fs.writeFile(DB_PATH, JSON.stringify(defaultSettings, null, 2));
            }
        } catch (e) {
            // Silence FS errors on Vercel
        }
    }
}

export async function getSettings(): Promise<Settings> {
    if (USE_STORAGE) {
        try {
            const settings = await kv.get<Settings>('mirror-settings');
            return settings || defaultSettings;
        } catch (e) {
            console.error("Vercel KV Error:", e);
            // Fallback to defaults to prevent 500
            return defaultSettings;
        }
    }

    // Local Fallback
    try {
        await ensureLocalDB();
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        // If file doesn't exist or we can't read it, just return defaults
        return defaultSettings;
    }
}

export async function updateSettings(newSettings: Partial<Settings>) {
    try {
        const current = await getSettings();
        const updated = { ...current, ...newSettings };

        if (USE_STORAGE) {
            await kv.set('mirror-settings', updated);
        } else {
            // Local file write
            await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
        }

        return updated;
    } catch (e) {
        console.error("Storage Update Error:", e);
        // Return whatever we have to keep UI functioning
        return defaultSettings;
    }
}
