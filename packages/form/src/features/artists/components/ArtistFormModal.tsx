import Image from "next/image";
import React from "react";

import Button from "@/features/shared/components/ui/Button";
import Modal from "@/features/shared/components/ui/Modal";

import type {
  ArtistFormState,
  ArtistRecord,
  SpotifyImageResult,
} from "../types";

interface ArtistFormModalProps {
  isOpen: boolean;
  editingArtist: ArtistRecord | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  formData: ArtistFormState;
  onFormDataChange: React.Dispatch<React.SetStateAction<ArtistFormState>>;
  imageSearchQuery: string;
  onImageSearchQueryChange: React.Dispatch<React.SetStateAction<string>>;
  imageResults: SpotifyImageResult[];
  searchingImages: boolean;
  selectedImage: string;
  onSelectImage: (imageUrl: string) => void;
  onSearchSpotifyImages: () => void;
}

const ArtistFormModal = ({
  isOpen,
  editingArtist,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  imageSearchQuery,
  onImageSearchQueryChange,
  imageResults,
  searchingImages,
  selectedImage,
  onSelectImage,
  onSearchSpotifyImages,
}: ArtistFormModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingArtist ? "Edit Artist" : "Add New Artist"}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="rounded-lg border bg-bg-tertiary p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Step 1: Artist Cover <span className="text-destructive">*</span>
          </h3>

          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={imageSearchQuery}
              onChange={(event) => onImageSearchQueryChange(event.target.value)}
              placeholder="Search for an artist cover..."
              className="flex h-10 flex-1 rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="button"
              onClick={onSearchSpotifyImages}
              disabled={!imageSearchQuery || searchingImages}
              variant="secondary"
              className="shrink-0"
            >
              {searchingImages ? "Searching..." : "Search"}
            </Button>
          </div>

          {selectedImage ? (
            <div className="mb-3 flex items-center gap-3 rounded-lg border bg-bg-secondary p-3">
              <Image
                src={selectedImage}
                alt="Selected artist cover"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary">
                  Selected cover
                </p>
                <p className="truncate text-xs text-text-secondary">
                  {selectedImage}
                </p>
              </div>
            </div>
          ) : null}

          {imageResults.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              <p className="mb-2 text-xs text-text-secondary">
                Click to select a cover:
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {imageResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => onSelectImage(result.imageUrl)}
                    className={`overflow-hidden rounded-md border-2 p-1 text-left transition-all hover:scale-[1.02] ${
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
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Step 2: Artist Details
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Artist Name <span className="text-destructive">*</span>
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Bio
              </label>
              <textarea
                value={String(formData.bio)}
                onChange={(event) =>
                  onFormDataChange({ ...formData, bio: event.target.value })
                }
                className="flex min-h-28 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows={5}
                placeholder="Add a short artist bio..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editingArtist ? "Update Artist" : "Create Artist"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ArtistFormModal;
