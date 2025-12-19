import fs from 'fs/promises';
import path from 'path';
import { kv } from '@vercel/kv';

const DB_PATH = path.join(process.cwd(), 'settings.json');
const IS_PROD = process.env.NODE_ENV === 'production';

// Vercel KV / Upstash usually provides KV_URL or REDIS_URL
const USE_STORAGE = !!(process.env.KV_URL || process.env.REDIS_URL || process.env.KV_REST_API_URL);

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

// Helper: Ensure DB exists (Local only, called only in dev)
async function ensureLocalDB() {
    if (IS_PROD) return;
    try {
        await fs.access(DB_PATH);
    } catch {
        try {
            await fs.writeFile(DB_PATH, JSON.stringify(defaultSettings, null, 2));
        } catch (e) {
            // Local dev write error
        }
    }
}

export async function getSettings(): Promise<Settings> {
    // 1. Production Path (Vercel)
    if (IS_PROD || USE_STORAGE) {
        if (!USE_STORAGE) {
            console.warn("Storage requested but no KV_URL/REDIS_URL found. Returning defaults.");
            return defaultSettings;
        }
        try {
            const settings = await kv.get<Settings>('mirror-settings');
            return settings || defaultSettings;
        } catch (e) {
            console.error("Vercel Storage Error:", e);
            return defaultSettings;
        }
    }

    // 2. Development Path (Local)
    try {
        await ensureLocalDB();
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data || '{}') || defaultSettings;
    } catch (e) {
        return defaultSettings;
    }
}

export async function updateSettings(newSettings: Partial<Settings>) {
    try {
        const current = await getSettings();
        const updated = { ...current, ...newSettings };

        if (IS_PROD || USE_STORAGE) {
            if (USE_STORAGE) {
                await kv.set('mirror-settings', updated);
            }
            return updated;
        }

        // Local
        await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
        return updated;
    } catch (e) {
        console.error("Storage Update Error:", e);
        return defaultSettings;
    }
}
