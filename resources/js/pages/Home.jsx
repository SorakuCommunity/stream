import Layout from '../components/Layout';

function getAnimeImage(anime) {
    return anime.image || anime.poster || anime.cover || anime.thumbnail || '';
}

function getAnimeTitle(anime) {
    return anime.title || anime.titleEnglish || anime.titleJapanese || 'Unknown';
}

function getAnimeId(anime) {
    return anime.id || anime.animeId || anime.malId || '';
}

export default function Home({ trending, recent }) {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <section className="mb-12">
                    <h1 className="text-3xl font-bold mb-6 text-purple-400">Trending Anime</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {trending.map((anime) => (
                            <a key={getAnimeId(anime)} href={`/anime/${getAnimeId(anime)}`} className="group">
                                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                                    <img 
                                        src={getAnimeImage(anime)} 
                                        alt={getAnimeTitle(anime)}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                        {anime.status || (anime.isCurrentlyAiring ? 'Ongoing' : 'Completed')}
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium truncate group-hover:text-purple-400 transition-colors">
                                    {getAnimeTitle(anime)}
                                </h3>
                                <p className="text-xs text-gray-400">{anime.episodes?.[0]?.number || anime.totalEpisodes || anime.episodes || '?'} episodes</p>
                            </a>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6 text-purple-400">Recently Updated</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {recent.map((anime) => (
                            <a key={getAnimeId(anime)} href={`/anime/${getAnimeId(anime)}`} className="group">
                                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                                    <img 
                                        src={getAnimeImage(anime)} 
                                        alt={getAnimeTitle(anime)}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                        EP {anime.episodeNumber || anime.latestEpisode || anime.episode || '?'}
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium truncate group-hover:text-purple-400 transition-colors">
                                    {getAnimeTitle(anime)}
                                </h3>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
}