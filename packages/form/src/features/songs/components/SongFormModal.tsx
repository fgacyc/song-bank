import React from "react";
import Image from "next/image";

import { SearchableSelect } from "@/features/shared/components/ui/SearchableSelect";
import Button from "@/features/shared/components/ui/Button";
import Modal from "@/features/shared/components/ui/Modal";

import type {
  AlbumRecord,
  ArtistRecord,
  SongFormState,
  SongRecord,
  SpotifyImageResult,
} from "../types";

interface SongFormModalProps {
  isOpen: boolean;
  editingSong: SongRecord | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  youtubeUrl: string;
  onYoutubeUrlChange: React.Dispatch<React.SetStateAction<string>>;
  extracting: boolean;
  onExtractYoutubeInfo: () => void;
  formData: SongFormState;
  onFormDataChange: React.Dispatch<React.SetStateAction<SongFormState>>;
  artists: ArtistRecord[];
  albums: AlbumRecord[];
  imageSearchQuery: string;
  onImageSearchQueryChange: React.Dispatch<React.SetStateAction<string>>;
  imageResults: SpotifyImageResult[];
  searchingImages: boolean;
  selectedImage: string;
  onSelectImage: (imageUrl: string) => void;
  onSearchSpotifyImages: () => void;
}

const SongFormModal = ({
  isOpen,
  editingSong,
  onClose,
  onSubmit,
  youtubeUrl,
  onYoutubeUrlChange,
  extracting,
  onExtractYoutubeInfo,
  formData,
  onFormDataChange,
  artists,
  albums,
  imageSearchQuery,
  onImageSearchQueryChange,
  imageResults,
  searchingImages,
  selectedImage,
  onSelectImage,
  onSearchSpotifyImages,
}: SongFormModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSong ? "Edit Song" : "Add New Song"}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="rounded-lg border border-border bg-bg-tertiary p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Step 1: YouTube Link <span className="text-destructive">*</span>
          </h3>
          <div className="space-y-3">
            <input
              type="url"
              value={youtubeUrl}
              onChange={(event) => onYoutubeUrlChange(event.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
            <Button
              type="button"
              onClick={onExtractYoutubeInfo}
              disabled={!youtubeUrl || extracting}
              className="w-full"
              variant="secondary"
            >
              {extracting ? "Extracting..." : "Extract Information"}
            </Button>
          </div>
        </div>

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
                onChange={(event) =>
                  onFormDataChange({ ...formData, name: event.target.value })
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
                onChange={(event) =>
                  onFormDataChange({ ...formData, altName: event.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <SearchableSelect
            label="Artist"
            options={artists.map((artist) => ({
              id: artist.id,
              name: artist.name,
            }))}
            value={formData.artistId}
            onChange={(value) =>
              onFormDataChange({ ...formData, artistId: value, albumId: "" })
            }
            placeholder="Select an artist"
            required
            createNewLink="/artist"
            createNewText="Create new artist"
            maxResults={20}
            emptyText="No artists found. Create one first."
          />

          <SearchableSelect
            label="Album"
            options={albums
              .filter(
                (album) =>
                  !formData.artistId || album.artist_id === formData.artistId,
              )
              .map((album) => ({ id: album.id, name: album.name }))}
            value={formData.albumId}
            onChange={(value) =>
              onFormDataChange({ ...formData, albumId: value })
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Key <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.key}
                onChange={(event) =>
                  onFormDataChange({ ...formData, key: event.target.value })
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
                onChange={(event) =>
                  onFormDataChange({
                    ...formData,
                    language: event.target.value,
                  })
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
              onChange={(event) =>
                onFormDataChange({ ...formData, lyrics: event.target.value })
              }
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-bg-tertiary p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Step 3: Cover Image <span className="text-destructive">*</span>
          </h3>

          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={imageSearchQuery}
              onChange={(event) => onImageSearchQueryChange(event.target.value)}
              placeholder="Search for cover image..."
              className="flex h-10 flex-1 rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="button"
              onClick={() => onSearchSpotifyImages()}
              disabled={!imageSearchQuery || searchingImages}
              variant="secondary"
            >
              {searchingImages ? "Searching..." : "Search"}
            </Button>
          </div>

          {selectedImage ? (
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
          ) : null}

          {imageResults.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              <p className="mb-2 text-xs text-text-secondary">
                Click to select an image:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {imageResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => onSelectImage(result.imageUrl)}
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
          ) : null}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{editingSong ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default SongFormModal;
