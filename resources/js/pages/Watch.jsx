import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function Watch({ episode }) {
    const [quality, setQuality] = useState('720p');
    const [subtitle, setSubtitle] = useState('');
    const playerRef = useRef(null);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-4">
                <div className="mb-4">
                    <a href={`/anime/${episode.animeId}`} className="text-purple-400 hover:underline">
                        ← {episode.animeTitle}
                    </a>
                    <h1 className="text-xl font-bold">
                        Episode {episode.episodeNumber}: {episode.title}
                    </h1>
                </div>

                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <p className="text-4xl mb-2">▶</p>
                            <p>Video Player (Vidstack)</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Quality: {quality} | Subtitle: {subtitle || 'None'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <label className="text-gray-400">Quality:</label>
                        <select 
                            value={quality}
                            onChange={(e) => setQuality(e.target.value)}
                            className="bg-gray-800 text-white px-3 py-2 rounded-lg"
                        >
                            {episode.sources.map((s) => (
                                <option key={s.quality} value={s.quality}>{s.quality}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-gray-400">Subtitle:</label>
                        <select 
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="bg-gray-800 text-white px-3 py-2 rounded-lg"
                        >
                            <option value="">None</option>
                            {episode.subtitles.map((s) => (
                                <option key={s.lang} value={s.lang}>{s.lang}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-bold mb-4 text-purple-400">Vidstack Player Features</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Quality selector (360p, 480p, 720p, 1080p)</li>
                        <li>Subtitle selector (softsub/hardsub)</li>
                        <li>Episode navigation</li>
                        <li>Picture-in-Picture</li>
                        <li>Autoplay next episode</li>
                        <li>Keyboard shortcuts</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
}