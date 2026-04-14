import Layout from '../components/Layout';

export default function Schedule({ schedule }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-purple-400">Jadwal Anime</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {days.map((day) => (
                        <div key={day} className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 text-purple-400">{day}</h2>
                            {schedule[day]?.length > 0 ? (
                                <ul className="space-y-3">
                                    {schedule[day].map((anime, idx) => (
                                        <li key={idx} className="flex justify-between items-center">
                                            <span>{anime.title}</span>
                                            <span className="text-purple-400">{anime.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Tidak ada anime</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}