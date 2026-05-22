import { useEffect, useMemo, useState, type FormEvent } from "react";

import { artistsService } from "../services/artistsService";
import type {
  ArtistFormState,
  ArtistRecord,
  SpotifyImageResult,
} from "../types";
import { createInitialArtistFormState } from "../types";
import { ITEMS_PER_PAGE } from "../utils/pagination";

export const useArtists = () => {
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<ArtistRecord | null>(null);
  const [formData, setFormData] = useState<ArtistFormState>(
    createInitialArtistFormState,
  );

  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageResults, setImageResults] = useState<SpotifyImageResult[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "polaroid">("list");
  const [currentPage, setCurrentPage] = useState(1);

  const loadArtists = async () => {
    try {
      const data = await artistsService.getArtists();
      setArtists(data);
    } catch (error) {
      console.error("Error loading artists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadArtists();
  }, []);

  const filteredArtists = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return artists;
    }

    return artists.filter((artist) => {
      const nameMatches = artist.name.toLowerCase().includes(query);
      return nameMatches;
    });
  }, [artists, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredArtists.length / ITEMS_PER_PAGE);
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
  const showingStart =
    filteredArtists.length === 0
      ? 0
      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd =
    filteredArtists.length === 0
      ? 0
      : Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredArtists.length);

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

  const pagedArtists = filteredArtists.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const resetForm = () => {
    setFormData(createInitialArtistFormState());
    setEditingArtist(null);
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
    const searchTerm = query ?? imageSearchQuery;

    if (!searchTerm) {
      return;
    }

    setSearchingImages(true);

    try {
      const data = await artistsService.searchSpotifyImages(searchTerm);
      setImageResults(data);

      if (data.length > 0 && !selectedImage && data[0]) {
        setSelectedImage(data[0].imageUrl);
        setFormData((current) => ({
          ...current,
          imageUrl: data[0].imageUrl,
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
    setFormData((current) => ({ ...current, imageUrl }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await artistsService.saveArtist(formData, editingArtist?.id);
      await loadArtists();
      closeModal();
    } catch (error) {
      console.error("Error saving artist:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this artist?")) {
      return;
    }

    try {
      await artistsService.deleteArtist(id);
      await loadArtists();
    } catch (error) {
      console.error("Error deleting artist:", error);
    }
  };

  const handleEdit = (artist: ArtistRecord) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio ?? "",
      imageUrl: artist.image_cover_url ?? "",
    });
    setSelectedImage(artist.image_cover_url ?? "");
    setImageSearchQuery(artist.name);
    setIsModalOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    artists,
    filteredArtists,
    pagedArtists,
    totalPages,
    safeCurrentPage,
    showingStart,
    showingEnd,
    loading,
    isModalOpen,
    editingArtist,
    formData,
    setFormData,
    imageSearchQuery,
    setImageSearchQuery,
    imageResults,
    searchingImages,
    selectedImage,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    openCreateModal,
    closeModal,
    handleEdit,
    handleSubmit,
    handleDelete,
    selectImage,
    searchSpotifyImages,
  };
};
