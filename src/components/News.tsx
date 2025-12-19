"use client";

import { useEffect, useState } from "react";
import { getNews, NewsItem } from "../lib/news";
import { Newspaper } from "lucide-react";

export default function News() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function load() {
            const data = await getNews();
            setNews(data);
        }

        load();
        const loadInterval = setInterval(load, 1000 * 60 * 15); // 15 minutes refresh data
        return () => clearInterval(loadInterval);
    }, []);

    useEffect(() => {
        if (news.length === 0) return;
        const rotateInterval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 15000); // 15 seconds rotate
        return () => clearInterval(rotateInterval);
    }, [news]);

    if (news.length === 0) return null;

    const currentItem = news[currentIndex];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px', minHeight: '150px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7, marginBottom: '0.2rem' }}>
                <Newspaper size={20} />
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Tagesschau</span>
            </div>

            <div key={currentItem.title} className="news-item" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.3, marginBottom: '0.5rem' }}>
                    {currentItem.title}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {currentItem.contentSnippet}
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginTop: 'auto' }}>
                <div
                    key={currentIndex} // Reset animation on index change
                    style={{
                        height: '100%',
                        backgroundColor: 'white',
                        borderRadius: '2px',
                        width: '0%',
                        animation: 'progress 15s linear forwards'
                    }}
                />
            </div>

            <style jsx global>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
        }
      `}</style>
        </div>
    );
}
