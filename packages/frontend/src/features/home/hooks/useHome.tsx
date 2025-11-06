import { useQuery } from "@tanstack/react-query";
import { homeService } from "../services/homeService";

export const useHome = () => {
  const latestAlbums = useQuery({
    queryKey: ["home", "latestAlbums"],
    queryFn: () => homeService.getLatestAlbums(),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  const featuredArtists = useQuery({
    queryKey: ["home", "featuredArtists"],
    queryFn: () => homeService.getFeaturedArtists(),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  const topHotSongs = useQuery({
    queryKey: ["home", "topHotSongs"],
    queryFn: () => homeService.getTopHotSongs(),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  return {
    latestAlbums,
    featuredArtists,
    topHotSongs,
    isLoading:
      latestAlbums.isLoading ||
      featuredArtists.isLoading ||
      topHotSongs.isLoading,
    error: latestAlbums.error ?? featuredArtists.error ?? topHotSongs.error,
  };
};
