import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import MainLayout from "@/layouts/MainLayout";

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

  useEffect(() => {
    fetchAlbums();
    fetchArtists();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch("/api/albums");
      const data = await response.json();
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
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingAlbum ? "PUT" : "POST";
      const body = editingAlbum
        ? { id: editingAlbum.id, ...formData }
        : formData;

      const response = await fetch("/api/albums", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchAlbums();
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
          fetchAlbums();
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
      imageUrl: album.image_cover_url || "",
      artistId: album.artist_id,
    });
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
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const getArtistName = (artistId: string) => {
    const artist = artists.find((a) => a.id === artistId);
    return artist?.name || "Unknown Artist";
  };

  if (loading) {
    return (
      <MainLayout title="Albums | Song Bank Admin">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-lg text-text-secondary">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Albums | Song Bank Admin">
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
                <img
                  src={album.image_cover_url}
                  alt={album.name}
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
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Name
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
                Artist
              </label>
              <select
                value={formData.artistId}
                onChange={(e) =>
                  setFormData({ ...formData, artistId: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">Select an artist</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Release Date
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

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAlbum ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Album;
