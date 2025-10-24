import { useQuery } from "@tanstack/react-query";
import { homeService } from "../services/homeService";

export const useHome = () => {
  const latestAlbums = useQuery({
    queryKey: ["home", "latestAlbums"],
    queryFn: () => homeService.getLatestAlbums(),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  const featuredCreators = useQuery({
    queryKey: ["home", "featuredCreators"],
    queryFn: () => homeService.getFeaturedCreators(),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  const topHotSongs = useQuery({
    queryKey: ["home", "topHotSongs"],
    queryFn: () => homeService.getTopHotSongs(),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  return {
    latestAlbums,
    featuredCreators,
    topHotSongs,
    isLoading:
      latestAlbums.isLoading ||
      featuredCreators.isLoading ||
      topHotSongs.isLoading,
    error: latestAlbums.error ?? featuredCreators.error ?? topHotSongs.error,
  };
};
