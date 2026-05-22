import Image from "next/image";
import React from "react";
import { FiEdit2, FiMusic, FiTrash2 } from "react-icons/fi";
import { LuDisc3, LuMicVocal } from "react-icons/lu";
import Polaroid from "@/features/shared/components/ui/Polaroid";

import type { ArtistRecord } from "../types";

interface ArtistsSectionProps {
  viewMode: "list" | "polaroid";
  artists: ArtistRecord[];
  filteredArtistsLength: number;
  showingStart: number;
  showingEnd: number;
  onEditArtist: (artist: ArtistRecord) => void;
  onDeleteArtist: (artistId: string) => void;
}

const countBadgeStyle = {
  songs: {
    backgroundColor: "#a6a9c826",
    color: "#a6a9c8",
  },
  albums: {
    backgroundColor: "#796ea826",
    color: "#796ea8",
  },
} as const;

const ArtistsSection = ({
  viewMode,
  artists,
  filteredArtistsLength,
  showingStart,
  showingEnd,
  onEditArtist,
  onDeleteArtist,
}: ArtistsSectionProps) => {
  const renderArtistRow = (artist: ArtistRecord) => {
    return (
      <tr key={artist.id} className="border-b last:border-b-0">
        <td className="px-4 py-4 md:px-5">
          <div className="flex items-center gap-5">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border bg-bg-tertiary">
              {artist.image_cover_url ? (
                <Image
                  src={artist.image_cover_url}
                  alt={artist.name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-secondary">
                  <LuDisc3 className="h-3 w-3" />
                </div>
              )}
            </div>
            <h3 className="text-xs font-semibold text-text-primary">
              {artist.name}
            </h3>
          </div>
        </td>
        <td className="px-3 py-2 text-center">
          <span
            style={countBadgeStyle.songs}
            className="inline-flex min-w-10 items-center justify-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
          >
            <FiMusic />
            {artist.song_count}
          </span>
        </td>
        <td className="px-3 py-2 text-center">
          <span
            style={countBadgeStyle.albums}
            className="inline-flex min-w-10 items-center justify-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
          >
            <LuMicVocal />
            {artist.album_count}
          </span>
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center justify-end gap-2 text-text-secondary">
            <button
              type="button"
              onClick={() => onEditArtist(artist)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              aria-label={`Edit ${artist.name}`}
            >
              <FiEdit2 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteArtist(artist.id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-text-secondary transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${artist.name}`}
            >
              <FiTrash2 className="h-3 w-3" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderArtistCard = (artist: ArtistRecord) => {
    return (
      <Polaroid
        key={artist.id}
        fill
        className="h-[340px]"
        imageSrc={artist.image_cover_url}
        imageAlt={artist.name}
        imageContainerClassName="h-[150px]"
      >
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-text-primary">
                  {artist.name}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.24em] text-text-secondary">
                  Artist profile
                </p>
              </div>
              <span
                style={countBadgeStyle.songs}
                className="inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-semibold"
              >
                {artist.song_count} songs
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-[10px] text-text-secondary">
              <span
                style={countBadgeStyle.songs}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold"
              >
                {artist.song_count} Songs
              </span>
              <span
                style={countBadgeStyle.albums}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold"
              >
                {artist.album_count} Albums
              </span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onEditArtist(artist)}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteArtist(artist.id)}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </Polaroid>
    );
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[10px] text-text-secondary">
        <p>
          Showing {showingStart}-{showingEnd} of {filteredArtistsLength}
        </p>
      </div>
      {viewMode === "list" ? (
        <div className="overflow-hidden rounded-2xl border bg-bg-primary">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead className="border-b bg-bg-tertiary text-left text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                <tr>
                  <th className="w-[60%] px-4 py-4 text-left">Artist Name</th>
                  <th className="w-[15%] px-4 py-4 text-center">Total Songs</th>
                  <th className="w-[15%] px-4 py-4 text-center">
                    Total Albums
                  </th>
                  <th className="w-[10%] px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artists.length > 0 ? (
                  artists.map(renderArtistRow)
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-14 text-center text-sm text-text-secondary"
                    >
                      No artists match the current search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {artists.length > 0 ? (
            artists.map(renderArtistCard)
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed bg-bg-primary px-4 py-12 text-center text-sm text-text-secondary">
              No artists match the current search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistsSection;
