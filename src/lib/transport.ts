import { createClient } from 'hafas-client';
import { profile as nahshProfile } from 'hafas-client/p/nahsh/index.js';

const client = createClient(nahshProfile, 'reflect-os');

export interface Departure {
    id: string;
    line: string;
    direction: string;
    time: string; // ISO string
    delay?: number;
    station: string;
    icon?: 'bus' | 'train' | 'subway';
}

export async function getDepartures(): Promise<Departure[]> {
    const stationIds = ['9300684', '9301479']; // Armbruststraße, Apostelkirche
    const departures: Departure[] = [];

    try {
        for (const id of stationIds) {
            // Fetch next 5 departures for each station
            const result = await client.departures(id, { results: 5, duration: 60 });

            // Handle different hafas-client return structures
            const list = Array.isArray(result) ? result : (result as any).departures || [];

            const mapped = list.map((dep: any) => ({
                id: dep.tripId || Math.random().toString(),
                line: dep.line?.name || '?',
                direction: dep.direction || '?',
                time: dep.when || dep.plannedWhen,
                delay: dep.delay,
                station: dep.stop?.name?.replace('Hamburg ', '') || '?',
                icon: dep.line?.product === 'bus' ? 'bus' : 'train'
            }));

            departures.push(...mapped);
        }

        // Sort by time
        return departures
            .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
            .slice(0, 6); // Top 6 departures total

    } catch (error) {
        console.error("Failed to fetch departures:", error);
        return [];
    }
}
