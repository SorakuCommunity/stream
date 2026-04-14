export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <a href="/" className="text-2xl font-bold text-purple-400">Soraku</a>
                        
                        <div className="flex-1 max-w-md mx-8">
                            <form action="/search" method="get" className="relative">
                                <input
                                    type="text"
                                    name="q"
                                    placeholder="Cari anime..."
                                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </form>
                        </div>

                        <div className="flex items-center gap-4">
                            <a href="/schedule" className="hover:text-purple-400 transition-colors">Jadwal</a>
                            <a href="/profile" className="hover:text-purple-400 transition-colors">Profil</a>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                {children}
            </main>

            <footer className="bg-gray-800 border-t border-gray-700 mt-16 py-8">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p>© 2026 Soraku Stream. All rights reserved.</p>
                    <p className="text-sm mt-2">Powered by apistreams.vercel.app</p>
                </div>
            </footer>
        </div>
    );
}