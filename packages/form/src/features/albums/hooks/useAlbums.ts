import { useEffect, useMemo, useState, type FormEvent } from "react";

import {
  createInitialAlbumFormState,
  type AlbumFormState,
  type AlbumRecord,
  type ArtistRecord,
  type SpotifyImageResult,
} from "../types";
import { ITEMS_PER_PAGE } from "../utils/pagination";
import { albumsService } from "../services/albumsService";

export const useAlbums = () => {
  const [albums, setAlbums] = useState<AlbumRecord[]>([]);
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<AlbumRecord | null>(null);

  const [formData, setFormData] = useState<AlbumFormState>(
    createInitialAlbumFormState,
  );

  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageResults, setImageResults] = useState<SpotifyImageResult[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtistFilter, setSelectedArtistFilter] = useState("");
  const [selectedReleaseYearFilter, setSelectedReleaseYearFilter] =
    useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "polaroid">("list");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);

        const [albumsResult, artistsResult] = await Promise.allSettled([
          albumsService.getAlbums(),
          albumsService.getArtists(),
        ]);

        if (!isMounted) {
          return;
        }

        if (albumsResult.status === "fulfilled") {
          setAlbums(albumsResult.value);
        } else {
          console.error("Error fetching albums:", albumsResult.reason);
        }

        if (artistsResult.status === "fulfilled") {
          setArtists(artistsResult.value);
        } else {
          console.error("Error fetching artists:", artistsResult.reason);
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
  }, [searchQuery, selectedArtistFilter, selectedReleaseYearFilter]);

  const artistLookup = useMemo(() => {
    return new Map(artists.map((artist) => [artist.id, artist.name]));
  }, [artists]);

  const artistOptions = useMemo(
    () =>
      artists
        .slice()
        .sort((firstArtist, secondArtist) =>
          firstArtist.name.localeCompare(secondArtist.name),
        ),
    [artists],
  );

  const releaseYearOptions = useMemo(() => {
    return Array.from(
      new Set(
        albums
          .map((album) => new Date(album.release_date).getFullYear())
          .filter((year) => Number.isFinite(year)),
      ),
    )
      .sort((firstYear, secondYear) => secondYear - firstYear)
      .map((year) => year.toString());
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return albums.filter((album) => {
      const artistName = artistLookup.get(album.artist_id) ?? "";
      const releaseYear = new Date(album.release_date).getFullYear().toString();

      const matchesSearch = normalizedQuery
        ? [album.name, artistName]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery))
        : true;

      const matchesArtist = selectedArtistFilter
        ? album.artist_id === selectedArtistFilter
        : true;

      const matchesReleaseYear = selectedReleaseYearFilter
        ? releaseYear === selectedReleaseYearFilter
        : true;

      return matchesSearch && matchesArtist && matchesReleaseYear;
    });
  }, [
    albums,
    artistLookup,
    searchQuery,
    selectedArtistFilter,
    selectedReleaseYearFilter,
  ]);

  const totalPages = Math.ceil(filteredAlbums.length / ITEMS_PER_PAGE);
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
  const showingStart =
    filteredAlbums.length === 0
      ? 0
      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd =
    filteredAlbums.length === 0
      ? 0
      : Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredAlbums.length);

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

  const pagedAlbums = filteredAlbums.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const resetForm = () => {
    setFormData(createInitialAlbumFormState());
    setEditingAlbum(null);
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
      const data = await albumsService.searchSpotifyImages(searchQueryValue);
      setImageResults(data);

      if (data.length > 0 && !selectedImage && data[0]) {
        setSelectedImage(data[0].imageUrl);
        setFormData((prev) => ({
          ...prev,
          imageUrl: data[0]!.imageUrl,
        }));
      }
    } catch (error) {
      console.error("Error searching Spotify:", error);
    } finally {
      setSearchingImages(false);
    }
  };

  const selectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.artistId) {
      alert("Please select an artist. Create one first if it doesn't exist.");
      return;
    }

    try {
      await albumsService.saveAlbum(formData, editingAlbum?.id ?? null);
      const updatedAlbums = await albumsService.getAlbums();
      setAlbums(updatedAlbums);
      closeModal();
    } catch (error) {
      console.error("Error saving album:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this album?")) {
      return;
    }

    try {
      await albumsService.deleteAlbum(id);
      const updatedAlbums = await albumsService.getAlbums();
      setAlbums(updatedAlbums);
    } catch (error) {
      console.error("Error deleting album:", error);
    }
  };

  const handleEdit = (album: AlbumRecord) => {
    setEditingAlbum(album);
    setFormData({
      name: album.name,
      releaseDate: album.release_date.split("T")[0] ?? "",
      imageUrl: album.image_cover_url ?? "",
      artistId: album.artist_id,
    });
    setSelectedImage(album.image_cover_url ?? "");

    if (album.name) {
      setImageSearchQuery(album.name);
    }

    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedArtistFilter("");
    setSelectedReleaseYearFilter("");
  };

  return {
    albums,
    artists,
    loading,
    isModalOpen,
    editingAlbum,
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
    selectedReleaseYearFilter,
    setSelectedReleaseYearFilter,
    isFiltersOpen,
    setIsFiltersOpen,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    artistOptions,
    releaseYearOptions,
    filteredAlbums,
    pagedAlbums,
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
  };
};
