import Layout from '../components/Layout';

export default function Profile() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-purple-400">Profil</h1>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                            ?
                        </div>
                        <div>
                            <p className="text-xl font-bold">Guest User</p>
                            <p className="text-gray-400">Belum login</p>
                        </div>
                    </div>
                    
                    <p className="text-gray-400 mb-4">
                        Login untuk menyimpan progres menonton dan melihat list anime.
                    </p>
                    
                    <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors">
                        Login dengan AniList
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4 text-purple-400">Sedang Menonton</h3>
                        <p className="text-gray-500">0 anime</p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4 text-purple-400">Selesai</h3>
                        <p className="text-gray-500">0 anime</p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4 text-purple-400">Ingin Tonton</h3>
                        <p className="text-gray-500">0 anime</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}