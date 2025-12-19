"use server";

import Parser from 'rss-parser';

export interface NewsItem {
    title: string;
    contentSnippet?: string;
    pubDate?: string;
}

export async function getNews(): Promise<NewsItem[]> {
    const parser = new Parser();
    try {
        const feed = await parser.parseURL('https://www.tagesschau.de/xml/rss2/');
        return feed.items.slice(0, 5).map(item => ({
            title: item.title || 'Keine Nachricht',
            contentSnippet: item.contentSnippet,
            pubDate: item.pubDate
        }));
    } catch (error) {
        console.error("Failed to fetch news:", error);
        return [];
    }
}
