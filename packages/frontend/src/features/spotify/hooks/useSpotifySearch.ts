import { useQuery } from "@tanstack/react-query";
import { spotifyService } from "../services/spotifyService";

export type SpotifySearchType = "track" | "album" | "artist";

interface SpotifyImageSearchOptions {
  query: string;
  type: SpotifySearchType;
  enabled?: boolean;
  artistName?: string;
}

export const useSpotifyImageSearch = ({
  query,
  type,
  enabled = true,
  artistName,
}: SpotifyImageSearchOptions) => {
  return useQuery({
    queryKey: ["spotify-image", type, query, artistName],
    queryFn: async () => {
      console.log(`Searching Spotify for ${type}: "${query}"`);

      if (type === "track") {
        return await spotifyService.getTrackCover(query, artistName);
      } else if (type === "album") {
        return await spotifyService.searchAlbumCover(query, artistName);
      } else if (type === "artist") {
        return await spotifyService.searchArtistImage(query);
      }

      return null;
    },
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
};

export const useSpotifyTrackCover = (
  songName: string,
  artistName?: string,
  enabled = true,
) => {
  return useSpotifyImageSearch({
    query: songName,
    type: "track",
    artistName,
    enabled,
  });
};

export const useSpotifyAlbumCover = (
  albumName: string,
  artistName?: string,
  enabled = true,
) => {
  return useSpotifyImageSearch({
    query: albumName,
    type: "album",
    artistName,
    enabled,
  });
};

export const useSpotifyArtistImage = (artistName: string, enabled = true) => {
  return useSpotifyImageSearch({
    query: artistName,
    type: "artist",
    enabled,
  });
};
