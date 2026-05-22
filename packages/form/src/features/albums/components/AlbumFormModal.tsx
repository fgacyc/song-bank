import React from "react";
import Image from "next/image";

import { SearchableSelect } from "@/features/shared/components/Inputs/SearchableSelect";
import Button from "@/features/shared/components/ui/Button";
import Modal from "@/features/shared/components/ui/Modal";

import type {
  AlbumFormState,
  AlbumRecord,
  ArtistRecord,
  SpotifyImageResult,
} from "../types";

interface AlbumFormModalProps {
  isOpen: boolean;
  editingAlbum: AlbumRecord | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  formData: AlbumFormState;
  onFormDataChange: React.Dispatch<React.SetStateAction<AlbumFormState>>;
  artists: ArtistRecord[];
  imageSearchQuery: string;
  onImageSearchQueryChange: React.Dispatch<React.SetStateAction<string>>;
  imageResults: SpotifyImageResult[];
  searchingImages: boolean;
  selectedImage: string;
  onSelectImage: (imageUrl: string) => void;
  onSearchSpotifyImages: () => void;
}

const AlbumFormModal = ({
  isOpen,
  editingAlbum,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  artists,
  imageSearchQuery,
  onImageSearchQueryChange,
  imageResults,
  searchingImages,
  selectedImage,
  onSelectImage,
  onSearchSpotifyImages,
}: AlbumFormModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAlbum ? "Edit Album" : "Add New Album"}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="rounded-lg border border-border bg-bg-tertiary p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Step 1: Album Cover <span className="text-destructive">*</span>
          </h3>

          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={imageSearchQuery}
              onChange={(event) => onImageSearchQueryChange(event.target.value)}
              placeholder="Search for an album cover..."
              className="flex h-10 flex-1 rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="button"
              onClick={onSearchSpotifyImages}
              disabled={!imageSearchQuery || searchingImages}
              variant="secondary"
            >
              {searchingImages ? "Searching..." : "Search"}
            </Button>
          </div>

          {selectedImage ? (
            <div className="mb-3">
              <p className="mb-2 text-xs text-text-secondary">
                Selected Cover:
              </p>
              <Image
                src={selectedImage}
                alt="Selected album cover"
                width={160}
                height={160}
                className="h-40 w-40 rounded-md object-cover"
              />
            </div>
          ) : null}

          {imageResults.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              <p className="mb-2 text-xs text-text-secondary">
                Click to select a cover:
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

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Step 2: Album Details
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Album Name <span className="text-destructive">*</span>
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
                Release Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(event) =>
                  onFormDataChange({
                    ...formData,
                    releaseDate: event.target.value,
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
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
              onFormDataChange({ ...formData, artistId: value })
            }
            placeholder="Select an artist"
            required
            createNewLink="/artist"
            createNewText="Create new artist"
            maxResults={20}
            emptyText="No artists found. Create one first."
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{editingAlbum ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AlbumFormModal;
