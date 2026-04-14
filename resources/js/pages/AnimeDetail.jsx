import Layout from '../components/Layout';

export default function AnimeDetail({ anime }) {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="w-full md:w-1/3">
                        <img 
                            src={anime.poster} 
                            alt={anime.title}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                    
                    <div className="w-full md:w-2/3">
                        <h1 className="text-3xl font-bold mb-4 text-purple-400">{anime.title}</h1>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {anime.genres.map((genre) => (
                                <span key={genre} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                                    {genre}
                                </span>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <p className="text-gray-400 text-sm">Status</p>
                                <p className="font-medium">{anime.status}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Tanggal Rilis</p>
                                <p className="font-medium">{anime.releaseDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Episode</p>
                                <p className="font-medium">{anime.episodes.length}</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-300 mb-6">{anime.synopsis}</p>
                        
                        <h2 className="text-xl font-bold mb-4 text-purple-400">Episode List</h2>
                        <div className="space-y-2">
                            {anime.episodes.map((ep) => (
                                <a 
                                    key={ep.id} 
                                    href={`/watch/${ep.id}`}
                                    className="flex items-center justify-between bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <div>
                                        <span className="font-medium">Episode {ep.number}</span>
                                        <span className="text-gray-400 ml-2">{ep.title}</span>
                                    </div>
                                    <span className="text-purple-400">Tonton</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}