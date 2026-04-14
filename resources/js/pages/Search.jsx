import Layout from '../components/Layout';

export default function Search({ query, results = [] }) {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-purple-400">
                    {query ? `Hasil pencarian: "${query}"` : 'Cari Anime'}
                </h1>
                
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {results.map((anime) => (
                            <a key={anime.id} href={`/anime/${anime.id}`} className="group">
                                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                                    <img 
                                        src={anime.poster || anime.image} 
                                        alt={anime.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                        {anime.status || anime.type || 'Unknown'}
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium truncate group-hover:text-purple-400">
                                    {anime.title}
                                </h3>
                            </a>
                        ))}
                    </div>
                ) : query ? (
                    <div className="text-center text-gray-400 py-12">
                        <p>Tidak ada hasil untuk "{query}"</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-12">
                        <p>Masukkan kata kunci untuk mencari anime</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}