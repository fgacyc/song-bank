import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  image_cover_url: string | null;
  album_count: number | null;
  song_count: number | null;
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

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists");
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingArtist ? "PUT" : "POST";
      const body = editingArtist
        ? { id: editingArtist.id, ...formData }
        : formData;

      const response = await fetch("/api/artists", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchArtists();
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
          fetchArtists();
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
      bio: artist.bio || "",
      imageUrl: artist.image_cover_url || "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      bio: "",
      imageUrl: "",
    });
    setEditingArtist(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Artists</h1>
        <Button onClick={openCreateModal}>Add New Artist</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <div key={artist.id} className="rounded-lg bg-white p-6 shadow-md">
            {artist.image_cover_url && (
              <img
                src={artist.image_cover_url}
                alt={artist.name}
                className="mb-4 h-48 w-full rounded-md object-cover"
              />
            )}
            <h3 className="mb-2 text-xl font-semibold">{artist.name}</h3>
            {artist.bio && (
              <p className="mb-4 line-clamp-3 text-gray-600">{artist.bio}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {artist.song_count && `${artist.song_count} songs`}
                {artist.album_count && ` • ${artist.album_count} albums`}
              </div>
              <div className="space-x-2">
                <Button size="sm" onClick={() => handleEdit(artist)}>
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
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{editingArtist ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Artist;
