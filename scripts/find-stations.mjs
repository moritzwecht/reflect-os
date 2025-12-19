import { createClient } from 'hafas-client';
import { profile as nahshProfile } from 'hafas-client/p/nahsh/index.js';

// Using NahSH profile as it covers Hamburg (HVV)
const client = createClient(nahshProfile, 'reflect-os-setup');

async function findIds() {
    console.log('Searching for "Armbruststraße"...');
    const stations1 = await client.locations('Armbruststraße', { results: 3 });
    console.log(stations1);

    console.log('\nSearching for "Apostelkirche"...');
    const stations2 = await client.locations('Apostelkirche', { results: 3 });
    console.log(stations2);
}

findIds().catch(console.error);
