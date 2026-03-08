export interface AnimeTitle {
  romaji: string;
  english?: string;
  native?: string;
}

export interface CoverImage {
  large?: string;
  extraLarge?: string;
  medium?: string;
  color?: string;
}

export interface Anime {
  id: number;
  idMal?: number;
  title: AnimeTitle;
  coverImage: CoverImage;
  bannerImage?: string;
  description?: string;
  averageScore?: number;
  popularity?: number;
  episodes?: number;
  status?: string;
  format?: string;
  season?: string;
  seasonYear?: number;
  genres?: string[];
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
}

export interface UserData {
  id: number;
  name: string;
  avatar: { large: string };
  statistics?: {
    anime: {
      count: number;
      episodesWatched: number;
      meanScore: number;
      minutesWatched: number;
    };
  };
}

export interface Episode {
  id: string;
  number: number;
  title?: string;
  image?: string;
  description?: string;
}

export interface StreamingSource {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export type AuthProvider = "anilist" | "discord" | "email";

export type UserRole =
  | "owner"
  | "manager"
  | "admin"
  | "agensi"
  | "member"
  | "donatur"
  | "premium";
