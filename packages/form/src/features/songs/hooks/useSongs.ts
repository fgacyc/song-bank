import { useEffect, useMemo, useState, type FormEvent } from "react";

import { extractYoutubeVideoId } from "@/helpers/spotifyHelpers";

import {
  createInitialSongFormState,
  type AlbumRecord,
  type ArtistRecord,
  type SongFormState,
  type SongRecord,
  type SpotifyImageResult,
} from "../types";
import { ITEMS_PER_PAGE } from "../utils/pagination";
import { songsService } from "../services/songsService";

export const useSongs = () => {
  const [songs, setSongs] = useState<SongRecord[]>([]);
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [albums, setAlbums] = useState<AlbumRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<SongRecord | null>(null);

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [formData, setFormData] = useState<SongFormState>(
    createInitialSongFormState,
  );

  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageResults, setImageResults] = useState<SpotifyImageResult[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtistFilter, setSelectedArtistFilter] = useState("");
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState("");
  const [selectedKeyFilter, setSelectedKeyFilter] = useState("");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "polaroid">("list");
  const [currentPage, setCurrentPage] = useState(1);

  const loadSongs = async () => {
    const data = await songsService.getSongs();
    setSongs(data);
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);

        const [songsResult, artistsResult, albumsResult] =
          await Promise.allSettled([
            songsService.getSongs(),
            songsService.getArtists(),
            songsService.getAlbums(),
          ]);

        if (!isMounted) {
          return;
        }

        if (songsResult.status === "fulfilled") {
          setSongs(songsResult.value);
        } else {
          console.error("Error fetching songs:", songsResult.reason);
        }

        if (artistsResult.status === "fulfilled") {
          setArtists(artistsResult.value);
        } else {
          console.error("Error fetching artists:", artistsResult.reason);
        }

        if (albumsResult.status === "fulfilled") {
          setAlbums(albumsResult.value);
        } else {
          console.error("Error fetching albums:", albumsResult.reason);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedArtistFilter,
    selectedAlbumFilter,
    selectedKeyFilter,
    selectedLanguageFilter,
  ]);

  const artistLookup = useMemo(() => {
    return new Map(artists.map((artist) => [artist.id, artist.name]));
  }, [artists]);

  const albumLookup = useMemo(() => {
    return new Map(albums.map((album) => [album.id, album.name]));
  }, [albums]);

  const artistOptions = useMemo(
    () =>
      artists
        .slice()
        .sort((firstArtist, secondArtist) =>
          firstArtist.name.localeCompare(secondArtist.name),
        ),
    [artists],
  );

  const albumOptions = useMemo(() => {
    const filteredAlbums = selectedArtistFilter
      ? albums.filter((album) => album.artist_id === selectedArtistFilter)
      : albums;

    return filteredAlbums
      .slice()
      .sort((firstAlbum, secondAlbum) =>
        firstAlbum.name.localeCompare(secondAlbum.name),
      );
  }, [albums, selectedArtistFilter]);

  const keyOptions = useMemo(() => {
    return Array.from(
      new Set(
        songs
          .map((song) => song.original_key?.trim())
          .filter((key): key is string => Boolean(key)),
      ),
    ).sort((firstKey, secondKey) => firstKey.localeCompare(secondKey));
  }, [songs]);

  const languageOptions = useMemo(() => {
    return Array.from(
      new Set(
        songs
          .map((song) => song.song_language?.trim())
          .filter((language): language is string => Boolean(language)),
      ),
    ).sort((firstLanguage, secondLanguage) =>
      firstLanguage.localeCompare(secondLanguage),
    );
  }, [songs]);

  const filteredSongs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return songs.filter((song) => {
      const songName = song.name ?? "";
      const artistName = song.artist_id
        ? (artistLookup.get(song.artist_id) ?? "")
        : "";
      const albumName = song.album_id
        ? (albumLookup.get(song.album_id) ?? "")
        : "";

      const matchesSearch = normalizedQuery
        ? [songName, artistName, albumName]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery))
        : true;

      const matchesArtist = selectedArtistFilter
        ? song.artist_id === selectedArtistFilter
        : true;
      const matchesAlbum = selectedAlbumFilter
        ? song.album_id === selectedAlbumFilter
        : true;
      const matchesKey = selectedKeyFilter
        ? (song.original_key ?? "") === selectedKeyFilter
        : true;
      const matchesLanguage = selectedLanguageFilter
        ? (song.song_language ?? "") === selectedLanguageFilter
        : true;

      return (
        matchesSearch &&
        matchesArtist &&
        matchesAlbum &&
        matchesKey &&
        matchesLanguage
      );
    });
  }, [
    albumLookup,
    artistLookup,
    searchQuery,
    selectedAlbumFilter,
    selectedArtistFilter,
    selectedKeyFilter,
    selectedLanguageFilter,
    songs,
  ]);

  const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
  const showingStart =
    filteredSongs.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd =
    filteredSongs.length === 0
      ? 0
      : Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredSongs.length);

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedSongs = filteredSongs.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const resetForm = () => {
    setYoutubeUrl("");
    setFormData(createInitialSongFormState());
    setEditingSong(null);
    setImageSearchQuery("");
    setImageResults([]);
    setSelectedImage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const searchSpotifyImages = async (query?: string) => {
    const searchQueryValue = query ?? imageSearchQuery;
    if (!searchQueryValue) {
      return;
    }

    setSearchingImages(true);
    try {
      const data = await songsService.searchSpotifyImages(searchQueryValue);
      setImageResults(data);

      if (data.length > 0 && !selectedImage && data[0]) {
        setSelectedImage(data[0].imageUrl);
        setFormData((prev) => ({
          ...prev,
          coverImageUrl: data[0]!.imageUrl,
        }));
      }
    } catch (error) {
      console.error("Error searching Spotify:", error);
    } finally {
      setSearchingImages(false);
    }
  };

  const extractYoutubeInfo = async () => {
    if (!youtubeUrl) {
      return;
    }

    const videoId = extractYoutubeVideoId(youtubeUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    setExtracting(true);
    try {
      const ytData = await songsService.getYoutubeMetadata(videoId);

      setFormData((prev) => ({
        ...prev,
        name: ytData.title ?? prev.name,
        coverImageUrl: ytData.thumbnail ?? prev.coverImageUrl,
      }));

      setSelectedImage(ytData.thumbnail ?? "");

      if (ytData.title) {
        setImageSearchQuery(ytData.title);
        await searchSpotifyImages(ytData.title);
      }
    } catch (error) {
      console.error("Error extracting YouTube info:", error);
    } finally {
      setExtracting(false);
    }
  };

  const selectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setFormData((prev) => ({ ...prev, coverImageUrl: imageUrl }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.artistId) {
      alert("Please select an artist. Create one first if it doesn't exist.");
      return;
    }

    try {
      await songsService.saveSong(
        formData,
        youtubeUrl,
        editingSong?.id ?? null,
      );
      await loadSongs();
      closeModal();
    } catch (error) {
      console.error("Error saving song:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this song?")) {
      return;
    }

    try {
      await songsService.deleteSong(id);
      await loadSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const handleEdit = (song: SongRecord) => {
    setEditingSong(song);
    setYoutubeUrl(song.original_youtube_url ?? "");
    setFormData({
      name: song.name ?? "",
      altName: song.original_band ?? "",
      artistId: song.artist_id ?? "",
      albumId: song.album_id ?? "",
      key: song.original_key ?? "",
      language: song.song_language ?? "",
      lyrics: song.chord_lyrics ?? "",
      coverImageUrl: song.cover_image_url ?? "",
    });
    setSelectedImage(song.cover_image_url ?? "");

    if (song.name) {
      setImageSearchQuery(song.name);
    }

    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedArtistFilter("");
    setSelectedAlbumFilter("");
    setSelectedKeyFilter("");
    setSelectedLanguageFilter("");
  };

  return {
    songs,
    artists,
    albums,
    loading,
    isModalOpen,
    editingSong,
    youtubeUrl,
    setYoutubeUrl,
    extracting,
    formData,
    setFormData,
    imageSearchQuery,
    setImageSearchQuery,
    imageResults,
    searchingImages,
    selectedImage,
    searchQuery,
    setSearchQuery,
    selectedArtistFilter,
    setSelectedArtistFilter,
    selectedAlbumFilter,
    setSelectedAlbumFilter,
    selectedKeyFilter,
    setSelectedKeyFilter,
    selectedLanguageFilter,
    setSelectedLanguageFilter,
    isFiltersOpen,
    setIsFiltersOpen,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    artistOptions,
    albumOptions,
    keyOptions,
    languageOptions,
    filteredSongs,
    pagedSongs,
    totalPages,
    safeCurrentPage,
    showingStart,
    showingEnd,
    openCreateModal,
    closeModal,
    handleEdit,
    handleSubmit,
    handleDelete,
    clearFilters,
    selectImage,
    searchSpotifyImages,
    extractYoutubeInfo,
  };
};
