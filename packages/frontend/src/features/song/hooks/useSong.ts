import { useQuery } from "@tanstack/react-query";
import { songService } from "@/features/song/services/songService";
import type { SongWithAlbumAndArtist } from "@/types/types";

export const useSong = (songParam: string | undefined) => {
  return useQuery<SongWithAlbumAndArtist | null>({
    queryKey: ["song", songParam],
    queryFn: async () => {
      if (!songParam) throw new Error("Song parameter is required");

      const songId = songService.extractSongId(songParam);
      if (!songId) throw new Error("Invalid song parameter format");

      return await songService.getSongByIdViaAPI(songId);
    },
    enabled: !!songParam,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: (failureCount, error) => {
      if (error.message.includes("Song not found")) return false;
      return failureCount < 2;
    },
  });
};

// Hook for top hot songs
export const useTopHotSongs = (limit = 20) => {
  return useQuery<SongWithAlbumAndArtist[]>({
    queryKey: ["topHotSongs", limit],
    queryFn: () => songService.getTopHotSongsViaAPI(limit),
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: 2,
  });
};
