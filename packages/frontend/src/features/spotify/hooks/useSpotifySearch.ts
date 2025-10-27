import { useQuery } from "@tanstack/react-query";
import { spotifyService } from "../services/spotifyService";

export const useSpotifySearch = (
  query: string,
  type: "track" | "album" | "artist",
) => {
  return useQuery({
    queryKey: ["spotify", type, query],
    queryFn: () => spotifyService.searchImage(query, type),
    enabled: !!query,
  });
};
