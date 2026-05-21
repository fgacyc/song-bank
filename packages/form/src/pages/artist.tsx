import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Layout from "@/layouts/Layout";

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  image_cover_url: string | null;
  album_count: number | null;
  song_count: number | null;
}

interface SpotifyResult {
  name: string;
  artist: string;
  imageUrl: string;
  albumName: string;
}

const Artist = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    imageUrl: "",
  });
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageResults, setImageResults] = useState<SpotifyResult[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [searchingImages, setSearchingImages] = useState(false);

  useEffect(() => {
    void (async () => {
      await fetchArtists();
    })();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists");
      const data = (await response.json()) as Artist[];
      setArtists(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const searchSpotifyImages = async (query?: string) => {
    const searchQuery = query ?? imageSearchQuery;
    if (!searchQuery) return;

    setSearchingImages(true);
    try {
      const response = await fetch(
        `/api/spotify-search?query=${encodeURIComponent(searchQuery)}&type=artist`,
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
    try {
      const method = editingArtist ? "PUT" : "POST";
      const body = editingArtist
        ? {
            id: editingArtist.id,
            name: formData.name,
            bio: formData.bio || null,
            image_cover_url: formData.imageUrl || null,
          }
        : {
            name: formData.name,
            bio: formData.bio || null,
            image_cover_url: formData.imageUrl || null,
          };

      const response = await fetch("/api/artists", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchArtists();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving artist:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this artist?")) {
      try {
        const response = await fetch("/api/artists", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          await fetchArtists();
        }
      } catch (error) {
        console.error("Error deleting artist:", error);
      }
    }
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio ?? "",
      imageUrl: artist.image_cover_url ?? "",
    });
    setSelectedImage(artist.image_cover_url ?? "");
    if (artist.name) {
      setImageSearchQuery(artist.name);
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      bio: "",
      imageUrl: "",
    });
    setEditingArtist(null);
    setImageSearchQuery("");
    setImageResults([]);
    setSelectedImage("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <Layout title="Artists | Song Bank Admin">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-lg text-text-secondary">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Artists | Song Bank Admin">
      <div className="container mx-auto px-4 py-8 md:px-12 lg:px-24">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Artists</h1>
          <Button onClick={openCreateModal}>Add New Artist</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="rounded-lg border border-border bg-card p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              {artist.image_cover_url && (
                <Image
                  src={artist.image_cover_url}
                  alt={artist.name}
                  width={400}
                  height={192}
                  className="mb-4 h-48 w-full rounded-md object-cover"
                />
              )}
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                {artist.name}
              </h3>
              {artist.bio && (
                <p className="mb-4 line-clamp-3 text-text-secondary">
                  {artist.bio}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  {artist.song_count && `${artist.song_count} songs`}
                  {artist.album_count && ` • ${artist.album_count} albums`}
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(artist)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(artist.id)}
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
          title={editingArtist ? "Edit Artist" : "Add New Artist"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Artist Name *
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

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
                placeholder="Artist biography or description..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Image Search Section */}
            <div className="space-y-3 border-t border-border pt-4">
              <label className="block text-sm font-medium text-text-primary">
                Artist Image
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
                  placeholder="Search for artist image on Spotify..."
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
                    Selected Image:
                  </p>
                  <div className="relative inline-block">
                    <Image
                      src={selectedImage}
                      alt="Selected artist"
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
                    Select an image:
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
                          alt={result.name ?? ""}
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

            <div className="flex justify-end space-x-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingArtist ? "Update Artist" : "Create Artist"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Artist;
