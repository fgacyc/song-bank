/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect } from "react";
import Layout from "@/layouts/Layout";
import { extractYoutubeVideoId } from "@/helpers/spotifyHelpers";
import Image from "next/image";
import { SearchableSelect } from "@/features/shared/components/Inputs/SearchableSelect";
import Button from "@/features/shared/components/ui/Button";
import Modal from "@/features/shared/components/ui/Modal";

interface Song {
  id: string;
  name: string | null;
  album_old: string | null;
  original_band: string | null;
  original_key: string | null;
  song_language: string | null;
  chord_lyrics: string | null;
  original_youtube_url: string | null;
  created_at: string | null;
  cover_image_url: string | null;
  artist_id: string | null;
  album_id: string | null;
}

interface Artist {
  id: string;
  name: string;
}

interface Album {
  id: string;
  name: string;
  artist_id: string;
}

interface SpotifyResult {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
}

const Song = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  // Form state
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    altName: "",
    artistId: "",
    albumId: "",
    key: "",
    language: "",
    lyrics: "",
    coverImageUrl: "",
  });

  // Image search state
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageResults, setImageResults] = useState<SpotifyResult[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetchSongs().catch((error) => {
      console.error("Error fetching songs:", error);
    });
    fetchArtists().catch((error) => {
      console.error("Error fetching artists:", error);
    });
    fetchAlbums().catch((error) => {
      console.error("Error fetching albums:", error);
    });
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch("/api/songs");
      const data = (await response.json()) as Song[];
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
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

  const fetchAlbums = async () => {
    try {
      const response = await fetch("/api/albums");
      const data = (await response.json()) as Album[];
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  // TODO: remove this feature soon
  const extractYoutubeInfo = async () => {
    if (!youtubeUrl) return;

    const videoId = extractYoutubeVideoId(youtubeUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    setExtracting(true);
    try {
      // Fetch YouTube metadata
      const ytResponse = await fetch(
        `/api/youtube-metadata?videoId=${videoId}`,
      );
      if (ytResponse.ok) {
        const ytData = await ytResponse.json();

        // Auto-fill form with YouTube data
        setFormData((prev) => ({
          ...prev,
          name: ytData.title ?? prev.name,
          coverImageUrl: ytData.thumbnail ?? prev.coverImageUrl,
        }));

        setSelectedImage(ytData.thumbnail ?? "");

        // Auto-search Spotify for better cover image
        if (ytData.title) {
          setImageSearchQuery(ytData.title);
          await searchSpotifyImages(ytData.title);
        }
      }
    } catch (error) {
      console.error("Error extracting YouTube info:", error);
    } finally {
      setExtracting(false);
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
          setFormData((prev) => ({
            ...prev,
            coverImageUrl: data[0]!.imageUrl,
          }));
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
    setFormData((prev) => ({ ...prev, coverImageUrl: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.artistId) {
      alert("Please select an artist. Create one first if it doesn't exist.");
      return;
    }

    try {
      const method = editingSong ? "PUT" : "POST";
      const body = editingSong
        ? {
            id: editingSong.id,
            name: formData.name,
            alt_name: formData.altName,
            artist_id: formData.artistId,
            album_id: formData.albumId || null,
            original_key: formData.key,
            song_language: formData.language,
            chord_lyrics: formData.lyrics,
            original_youtube_url: youtubeUrl,
            cover_image_url: formData.coverImageUrl,
          }
        : {
            name: formData.name,
            alt_name: formData.altName,
            artist_id: formData.artistId,
            album_id: formData.albumId || null,
            original_key: formData.key,
            song_language: formData.language,
            chord_lyrics: formData.lyrics,
            original_youtube_url: youtubeUrl,
            cover_image_url: formData.coverImageUrl,
          };

      const response = await fetch("/api/songs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchSongs();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving song:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      try {
        const response = await fetch("/api/songs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          await fetchSongs();
        }
      } catch (error) {
        console.error("Error deleting song:", error);
      }
    }
  };

  const handleEdit = (song: Song) => {
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

  const resetForm = () => {
    setYoutubeUrl("");
    setFormData({
      name: "",
      altName: "",
      artistId: "",
      albumId: "",
      key: "",
      language: "",
      lyrics: "",
      coverImageUrl: "",
    });
    setEditingSong(null);
    setImageSearchQuery("");
    setImageResults([]);
    setSelectedImage("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const getArtistName = (artistId: string | null) => {
    if (!artistId) return "Unknown Artist";
    const artist = artists.find((a) => a.id === artistId);
    return artist?.name ?? "Unknown Artist";
  };

  const getAlbumName = (albumId: string | null) => {
    if (!albumId) return "No Album";
    const album = albums.find((a) => a.id === albumId);
    return album?.name ?? "No Album";
  };

  if (loading) {
    return (
      <Layout title="Songs | Song Bank Admin">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-lg text-text-secondary">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Songs | Song Bank Admin">
      <div className="container mx-auto px-4 py-8 md:px-12 lg:px-24">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Songs</h1>
          <Button onClick={openCreateModal}>Add New Song</Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Cover
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Artist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Album
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {songs.map((song) => (
                <tr
                  key={song.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    {song.cover_image_url ? (
                      <Image
                        src={song.cover_image_url}
                        alt={song.name ?? "Song"}
                        className="h-12 w-12 rounded object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-card-foreground">
                    {song.name ?? "Untitled"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary">
                    {getArtistName(song.artist_id)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary">
                    {getAlbumName(song.album_id)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary">
                    {song.original_key ?? "N/A"}
                  </td>
                  <td className="space-x-2 whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(song)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(song.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingSong ? "Edit Song" : "Add New Song"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: YouTube URL */}
            <div className="rounded-lg border border-border bg-bg-tertiary p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-primary">
                Step 1: YouTube Link <span className="text-destructive">*</span>
              </h3>
              <div className="space-y-3">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
                <Button
                  type="button"
                  onClick={extractYoutubeInfo}
                  disabled={!youtubeUrl || extracting}
                  className="w-full"
                  variant="secondary"
                >
                  {extracting ? "Extracting..." : "Extract Information"}
                </Button>
              </div>
            </div>

            {/* Step 2: Song Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">
                Step 2: Song Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Song Name <span className="text-destructive">*</span>
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
                    Alternative Song Name
                  </label>
                  <input
                    type="text"
                    value={formData.altName}
                    onChange={(e) =>
                      setFormData({ ...formData, altName: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {/* Artist Selection */}
              <SearchableSelect
                label="Artist"
                options={artists.map((a) => ({ id: a.id, name: a.name }))}
                value={formData.artistId}
                onChange={(value) =>
                  setFormData({ ...formData, artistId: value, albumId: "" })
                }
                placeholder="Select an artist"
                required
                createNewLink="/artist"
                createNewText="Create new artist"
                maxResults={20}
                emptyText="No artists found. Create one first."
              />

              {/* Album Selection */}
              <SearchableSelect
                label="Album"
                options={albums
                  .filter(
                    (album) =>
                      !formData.artistId ||
                      album.artist_id === formData.artistId,
                  )
                  .map((a) => ({ id: a.id, name: a.name }))}
                value={formData.albumId}
                onChange={(value) =>
                  setFormData({ ...formData, albumId: value })
                }
                placeholder="No album (optional)"
                createNewLink="/album"
                createNewText="Create new album"
                maxResults={20}
                emptyText={
                  formData.artistId
                    ? "No albums found for this artist"
                    : "Select an artist first"
                }
              />

              {/* TODO: use select filter input for both fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Key <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) =>
                      setFormData({ ...formData, key: e.target.value })
                    }
                    placeholder="C, Dm, etc."
                    className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Language <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                    placeholder="English, Chinese, etc."
                    className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Lyrics/Chords <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.lyrics}
                  onChange={(e) =>
                    setFormData({ ...formData, lyrics: e.target.value })
                  }
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Step 3: Cover Image */}
            <div className="rounded-lg border border-border bg-bg-tertiary p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-primary">
                Step 3: Cover Image <span className="text-destructive">*</span>
              </h3>

              <div className="mb-3 flex gap-2">
                <input
                  type="text"
                  value={imageSearchQuery}
                  onChange={(e) => setImageSearchQuery(e.target.value)}
                  placeholder="Search for cover image..."
                  className="flex h-10 flex-1 rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button
                  type="button"
                  onClick={() => searchSpotifyImages()}
                  disabled={!imageSearchQuery || searchingImages}
                  variant="secondary"
                >
                  {searchingImages ? "Searching..." : "Search"}
                </Button>
              </div>

              {selectedImage && (
                <div className="mb-3">
                  <p className="mb-2 text-xs text-text-secondary">
                    Selected Image:
                  </p>
                  <Image
                    src={selectedImage}
                    alt="Selected cover"
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-md object-cover"
                  />
                </div>
              )}

              {imageResults.length > 0 && (
                <div className="max-h-64 overflow-y-auto">
                  <p className="mb-2 text-xs text-text-secondary">
                    Click to select an image:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {imageResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => selectImage(result.imageUrl)}
                        className={`cursor-pointer rounded-md border-2 p-1 transition-all hover:scale-105 ${
                          selectedImage === result.imageUrl
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={result.imageUrl}
                          alt={result.name}
                          width={80}
                          height={80}
                          className="h-20 w-full rounded object-cover"
                        />
                        <p className="mt-1 truncate text-xs text-text-secondary">
                          {result.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{editingSong ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Song;
