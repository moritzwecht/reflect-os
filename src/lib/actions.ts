"use server";

import { getSettings as getSettingsStore, updateSettings as updateSettingsStore } from "./store";
import { getNews as getNewsLib } from "./news";
import { getDailySong as getDailySongLib } from "./daily";
import { getDepartures as getDeparturesLib } from "./transport";

/**
 * Consolidated exports for more reliable Server Action discovery on Vercel.
 */

export async function getSettings() {
    return await getSettingsStore();
}

export async function updateSettings(settings: any) {
    return await updateSettingsStore(settings);
}

export async function getNewsAction() {
    return await getNewsLib();
}

export async function getDailySongAction() {
    return await getDailySongLib();
}

export async function getDeparturesAction() {
    return await getDeparturesLib();
}
