import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SearchableSelect } from "@/features/shared/components/Inputs/SearchableSelect";
import Button from "@/features/shared/components/ui/Button";
import Modal from "@/features/shared/components/ui/Modal";
import Layout from "@/layouts/Layout";

interface Album {
  id: string;
  name: string;
  release_date: string;
  image_cover_url: string | null;
  artist_id: string;
}

interface Artist {
  id: string;
  name: string;
}

interface SpotifyResult {
  name: string;
  artist: string;
  imageUrl: string;
  albumName: string;
}

const Album = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    releaseDate: "",
    imageUrl: "",
    artistId: "",
  });
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageResults, setImageResults] = useState<SpotifyResult[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [searchingImages, setSearchingImages] = useState(false);

  useEffect(() => {
    void (async () => {
      await fetchAlbums();
      await fetchArtists();
    })();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch("/api/albums");
      const data = (await response.json()) as Album[];
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists");
      const data = (await response.json()) as Artist[];
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const searchSpotifyImages = async (query?: string) => {
    const searchQuery = query ?? imageSearchQuery;
    if (!searchQuery) return;

    setSearchingImages(true);
    try {
      const response = await fetch(
        `/api/spotify-search?query=${encodeURIComponent(searchQuery)}`,
      );
      if (response.ok) {
        const data = (await response.json()) as SpotifyResult[];
        setImageResults(data);

        // Auto-select first image if none selected
        if (data.length > 0 && !selectedImage && data[0]) {
          setSelectedImage(data[0].imageUrl);
          setFormData((prev) => ({ ...prev, imageUrl: data[0]!.imageUrl }));
        }
      }
    } catch (error) {
      console.error("Error searching Spotify:", error);
    } finally {
      setSearchingImages(false);
    }
  };

  const selectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setFormData((prev) => ({ ...prev, imageUrl: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.artistId) {
      alert("Please select an artist. Create one first if it doesn't exist.");
      return;
    }

    try {
      const method = editingAlbum ? "PUT" : "POST";
      const body = editingAlbum
        ? {
            id: editingAlbum.id,
            name: formData.name,
            release_date: formData.releaseDate,
            image_cover_url: formData.imageUrl || null,
            artist_id: formData.artistId,
          }
        : {
            name: formData.name,
            release_date: formData.releaseDate,
            image_cover_url: formData.imageUrl || null,
            artist_id: formData.artistId,
          };

      const response = await fetch("/api/albums", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchAlbums();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving album:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      try {
        const response = await fetch("/api/albums", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          await fetchAlbums();
        }
      } catch (error) {
        console.error("Error deleting album:", error);
      }
    }
  };

  const handleEdit = (album: Album) => {
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

  const resetForm = () => {
    setFormData({
      name: "",
      releaseDate: "",
      imageUrl: "",
      artistId: "",
    });
    setEditingAlbum(null);
    setImageSearchQuery("");
    setImageResults([]);
    setSelectedImage("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const getArtistName = (artistId: string) => {
    const artist = artists.find((a) => a.id === artistId);
    return artist?.name ?? "Unknown Artist";
  };

  if (loading) {
    return (
      <Layout title="Albums | Song Bank Admin">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-lg text-text-secondary">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Albums | Song Bank Admin">
      <div className="container mx-auto px-4 py-8 md:px-12 lg:px-24">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Albums</h1>
          <Button onClick={openCreateModal}>Add New Album</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div
              key={album.id}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-md transition-shadow hover:shadow-lg"
            >
              {album.image_cover_url && (
                <Image
                  src={album.image_cover_url}
                  alt={album.name}
                  width={400}
                  height={192}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  {album.name}
                </h3>
                <p className="mb-2 text-text-secondary">
                  {getArtistName(album.artist_id)}
                </p>
                <p className="mb-4 text-sm text-text-secondary">
                  {new Date(album.release_date).toLocaleDateString()}
                </p>
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(album)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(album.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingAlbum ? "Edit Album" : "Add New Album"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Album Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Album Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>

            {/* Artist Selection with SearchableSelect */}
            <SearchableSelect
              label="Artist"
              options={artists}
              value={formData.artistId}
              onChange={(value) =>
                setFormData({ ...formData, artistId: value })
              }
              placeholder="Search and select artist..."
              maxResults={20}
              required
              createNewLink="/artist"
            />

            {/* Release Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Release Date *
              </label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, releaseDate: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>

            {/* Image Search Section */}
            <div className="space-y-3 border-t border-border pt-4">
              <label className="block text-sm font-medium text-text-primary">
                Album Cover Image
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageSearchQuery}
                  onChange={(e) => setImageSearchQuery(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      await searchSpotifyImages();
                    }
                  }}
                  placeholder="Search for album cover on Spotify..."
                  className="flex h-10 flex-1 rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button
                  type="button"
                  onClick={() => searchSpotifyImages()}
                  disabled={searchingImages || !imageSearchQuery}
                  variant="outline"
                >
                  {searchingImages ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Selected Image Preview */}
              {selectedImage && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-text-secondary">
                    Selected Cover:
                  </p>
                  <div className="relative inline-block">
                    <Image
                      src={selectedImage}
                      alt="Selected cover"
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-md border-2 border-primary object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage("");
                        setFormData((prev) => ({ ...prev, imageUrl: "" }));
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-danger p-1 text-white shadow-md hover:bg-danger/80"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Image Results Grid */}
              {imageResults.length > 0 && (
                <div className="mt-4 max-h-[300px] overflow-y-auto rounded-md border border-border p-3">
                  <p className="mb-3 text-sm font-medium text-text-primary">
                    Select a cover image:
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {imageResults.map((result, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectImage(result.imageUrl)}
                        className={`group relative overflow-hidden rounded-md border-2 transition-all hover:scale-105 ${
                          selectedImage === result.imageUrl
                            ? "border-primary shadow-lg"
                            : "border-transparent hover:border-border"
                        }`}
                      >
                        <Image
                          src={result.imageUrl}
                          alt={result.albumName}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover"
                        />
                        {selectedImage === result.imageUrl && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                            <svg
                              className="h-8 w-8 text-primary"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAlbum ? "Update Album" : "Create Album"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Album;
