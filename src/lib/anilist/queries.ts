import { gql } from "@apollo/client";

export const GET_ANIME_LIST = gql`
  query GetAnimeList($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus, $season: MediaSeason, $seasonYear: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      media(type: ANIME, sort: $sort, status: $status, season: $season, seasonYear: $seasonYear) {
        id title { romaji english native }
        coverImage { large medium color }
        bannerImage averageScore popularity
        episodes status format season seasonYear
        genres nextAiringEpisode { airingAt timeUntilAiring episode }
      }
    }
  }
`;

export const GET_ANIME_DETAILS = gql`
  query GetAnimeDetails($id: Int) {
    Media(id: $id, type: ANIME) {
      id title { romaji english native }
      coverImage { large extraLarge }
      bannerImage description averageScore popularity
      episodes status format season seasonYear
      genres studios { nodes { name } }
      characters { nodes { name { full } image { medium } } }
      relations { edges { relationType node { id title { romaji } coverImage { medium } type } } }
      externalLinks { url site }
      nextAiringEpisode { airingAt timeUntilAiring episode }
    }
  }
`;

export const GET_TRENDING = gql`
  query GetTrending($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id title { romaji english }
        coverImage { large color }
        bannerImage averageScore popularity episodes status format
        nextAiringEpisode { airingAt timeUntilAiring episode }
      }
    }
  }
`;

export const GET_VIEWER = gql`
  query GetViewer {
    Viewer {
      id name avatar { large }
      statistics {
        anime { count episodesWatched meanScore minutesWatched }
      }
    }
  }
`;

export const GET_USER_ANIME_LIST = gql`
  query GetUserAnimeList($username: String!, $status: MediaListStatus!) {
    MediaListCollection(userName: $username, type: ANIME, status: $status, sort: UPDATED_TIME_DESC) {
      lists {
        entries {
          progress
          media {
            id episodes format
            title { romaji english }
            coverImage { large color }
            status averageScore genres
          }
        }
      }
    }
  }
`;

export const GET_SCHEDULE = gql`
  query GetSchedule($weekStart: Int, $weekEnd: Int, $page: Int) {
    Page(page: $page, perPage: 50) {
      airingSchedules(airingAt_greater: $weekStart, airingAt_lesser: $weekEnd, sort: TIME) {
        id airingAt timeUntilAiring episode
        media {
          id title { romaji english }
          coverImage { medium color }
          format status
        }
      }
    }
  }
`;
