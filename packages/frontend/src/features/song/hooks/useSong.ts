import { useQuery } from "@tanstack/react-query";
import { songService } from "@/features/song/services/songService";
import type { SongType } from "@/types/types";

export const useSong = (songId: string | undefined) => {
  return useQuery<SongType | null>({
    queryKey: ["song", songId],
    queryFn: async () => {
      if (!songId) throw new Error("Song parameter is required");

      return await songService.getSongByIdViaAPI(songId);
    },
    enabled: !!songId,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: (failureCount, error) => {
      if (error.message.includes("Song not found")) return false;
      return failureCount < 2;
    },
  });
};

// Hook for top hot songs
export const useTopHotSongs = (limit = 20) => {
  return useQuery<SongType[]>({
    queryKey: ["topHotSongs", limit],
    queryFn: () => songService.getTopHotSongsViaAPI(limit),
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: 2,
  });
};
