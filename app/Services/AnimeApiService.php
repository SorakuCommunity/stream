<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AnimeApiService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.anime_api.url', 'http://localhost:3000/v1');
    }

    public function getTrending()
    {
        try {
            $response = Http::timeout(10)->get("{$this->baseUrl}/anime/trending");

            return $response->successful() ? $response->json() : [];
        } catch (\Exception $e) {
            return [];
        }
    }

    public function getRecent()
    {
        try {
            $response = Http::timeout(10)->get("{$this->baseUrl}/anime/recent");

            return $response->successful() ? $response->json() : [];
        } catch (\Exception $e) {
            return [];
        }
    }

    public function search(string $query)
    {
        try {
            $response = Http::timeout(10)->get("{$this->baseUrl}/anime/search", ['q' => $query]);

            return $response->successful() ? $response->json() : [];
        } catch (\Exception $e) {
            return [];
        }
    }

public function getAnime(string $id)
    {
        try {
            $response = Http::timeout(10)->get("{$this->baseUrl}/anime/{$id}");
            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            return null;
        }
    }
    }

    public function getEpisode(string $episodeId)
    {
        try {
            $response = Http::timeout(10)->get("{$this->baseUrl}/episode/{$episodeId}");

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getSchedule()
    {
        try {
            $response = Http::timeout(10)->get("{$this->baseUrl}/schedule/today");

            return $response->successful() ? $response->json() : [];
        } catch (\Exception $e) {
            return [];
        }
    }
}
