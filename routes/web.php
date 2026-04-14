<?php

use App\Services\AnimeApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (AnimeApiService $api) {
    $trendingData = $api->getTrending();
    $recentData = $api->getRecent();

    // Use API data if available, otherwise fall back to demo data
    $trending = ! empty($trendingData) ? $trendingData : [
        ['id' => 1, 'title' => 'One Piece', 'poster' => 'https://via.placeholder.com/300x450/6366f1/ffffff?text=One+Piece', 'status' => 'Ongoing', 'episodes' => 1125],
        ['id' => 2, 'title' => 'Naruto', 'poster' => 'https://via.placeholder.com/300x450/a855f7/ffffff?text=Naruto', 'status' => 'Completed', 'episodes' => 720],
        ['id' => 3, 'title' => 'Demon Slayer', 'poster' => 'https://via.placeholder.com/300x450/6366f1/ffffff?text=Demon+Slayer', 'status' => 'Completed', 'episodes' => 55],
        ['id' => 4, 'title' => 'Jujutsu Kaisen', 'poster' => 'https://via.placeholder.com/300x450/a855f7/ffffff?text=JJK', 'status' => 'Ongoing', 'episodes' => 45],
        ['id' => 5, 'title' => 'Attack on Titan', 'poster' => 'https://via.placeholder.com/300x450/6366f1/ffffff?text=AOT', 'status' => 'Completed', 'episodes' => 94],
        ['id' => 6, 'title' => 'My Hero Academia', 'poster' => 'https://via.placeholder.com/300x450/a855f7/ffffff?text=MHA', 'status' => 'Ongoing', 'episodes' => 138],
    ];

    $recent = ! empty($recentData) ? $recentData : [
        ['id' => 7, 'title' => 'Blue Lock', 'poster' => 'https://via.placeholder.com/300x450/6366f1/ffffff?text=Blue+Lock', 'latestEpisode' => 24],
        ['id' => 8, 'title' => 'Chainsaw Man', 'poster' => 'https://via.placeholder.com/300x450/a855f7/ffffff?text=CSM', 'latestEpisode' => 12],
        ['id' => 9, 'title' => 'Spy x Family', 'poster' => 'https://via.placeholder.com/300x450/6366f1/ffffff?text=SxF', 'latestEpisode' => 25],
        ['id' => 10, 'title' => 'Solo Leveling', 'poster' => 'https://via.placeholder.com/300x450/a855f7/ffffff?text=Solo+Leveling', 'latestEpisode' => 13],
        ['id' => 11, 'title' => 'Frieren', 'poster' => 'https://via.placeholder.com/300x450/6366f1/ffffff?text=Frieren', 'latestEpisode' => 28],
        ['id' => 12, 'title' => 'Kamen Rider', 'poster' => 'https://via.placeholder.com/300x450/a855f7/ffffff?text=Kamen+Rider', 'latestEpisode' => 52],
    ];

    return Inertia::render('Home', [
        'trending' => $trending,
        'recent' => $recent,
    ]);
});

Route::get('/search', function (Request $request, AnimeApiService $api) {
    $query = $request->q;
    $results = [];

    if ($query) {
        $results = $api->search($query);
    }

    return Inertia::render('Search', [
        'query' => $query,
        'results' => $results,
    ]);
});

Route::get('/anime/{id}', function ($id, AnimeApiService $api) {
    $animeData = $api->getAnime($id);

    $anime = $animeData ?? [
        'id' => $id,
        'title' => 'One Piece',
        'poster' => 'https://via.placeholder.com/300x450/6366f1/ffffff?text=One+Piece',
        'synopsis' => 'Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever, known as the One Piece. The crew consists of Zoro, a swordsman and combat specialist; Nami, a navigator; Usopp, a sniper; and Sanji, a chef.',
        'status' => 'Ongoing',
        'releaseDate' => '1999',
        'genres' => ['Action', 'Adventure', 'Comedy', 'Fantasy'],
        'episodes' => [
            ['id' => 1, 'number' => 1, 'title' => 'Romance Dawn: For the New World'],
            ['id' => 2, 'number' => 2, 'title' => 'They Call Him Luffy'],
            ['id' => 3, 'number' => 3, 'title' => 'Don\'t Forget to Breathe'],
        ],
    ];

    return Inertia::render('AnimeDetail', ['anime' => $anime]);
});

Route::get('/watch/{episodeId}', function ($episodeId, AnimeApiService $api) {
    $episodeData = $api->getEpisode($episodeId);

    $episode = $episodeData ?? [
        'id' => $episodeId,
        'animeId' => 1,
        'animeTitle' => 'One Piece',
        'episodeNumber' => 1,
        'title' => 'Romance Dawn: For the New World',
        'sources' => [
            ['quality' => '1080p', 'url' => 'https://example.com/video1080.m3u8'],
            ['quality' => '720p', 'url' => 'https://example.com/video720.m3u8'],
            ['quality' => '480p', 'url' => 'https://example.com/video480.m3u8'],
            ['quality' => '360p', 'url' => 'https://example.com/video360.m3u8'],
        ],
        'subtitles' => [
            ['lang' => 'Indonesian', 'url' => 'https://example.com/sub_id.vtt'],
            ['lang' => 'English', 'url' => 'https://example.com/sub_en.vtt'],
            ['lang' => 'Japanese', 'url' => 'https://example.com/sub_jp.vtt'],
        ],
    ];

    return Inertia::render('Watch', ['episode' => $episode]);
});

Route::get('/schedule', function (AnimeApiService $api) {
    $scheduleData = $api->getSchedule();

    $schedule = ! empty($scheduleData) ? $scheduleData : [
        'Monday' => [['title' => 'One Piece', 'time' => '09:00']],
        'Tuesday' => [['title' => 'Naruto', 'time' => '18:00']],
        'Wednesday' => [['title' => 'Demon Slayer', 'time' => '20:00']],
    ];

    return Inertia::render('Schedule', ['schedule' => $schedule]);
});

Route::get('/profile', function () {
    return Inertia::render('Profile');
});
