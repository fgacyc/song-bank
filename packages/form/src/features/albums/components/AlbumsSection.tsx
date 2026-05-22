import React from "react";
import Image from "next/image";
import { FiCalendar, FiEdit2, FiMusic, FiTrash2 } from "react-icons/fi";

import Polaroid from "@/features/shared/components/ui/Polaroid";

import type { AlbumRecord, ArtistRecord } from "../types";
import { LuMicVocal } from "react-icons/lu";

interface AlbumsSectionProps {
  viewMode: "list" | "polaroid";
  albums: AlbumRecord[];
  artists: ArtistRecord[];
  showingStart: number;
  showingEnd: number;
  filteredAlbumsLength: number;
  onEditAlbum: (album: AlbumRecord) => void;
  onDeleteAlbum: (albumId: string) => void;
}

const AlbumsSection = ({
  viewMode,
  albums,
  artists,
  showingStart,
  showingEnd,
  filteredAlbumsLength,
  onEditAlbum,
  onDeleteAlbum,
}: AlbumsSectionProps) => {
  const getArtistName = (artistId: string) => {
    return (
      artists.find((artist) => artist.id === artistId)?.name ?? "Unknown Artist"
    );
  };

  const renderAlbumRow = (album: AlbumRecord) => {
    const artistName = getArtistName(album.artist_id);

    return (
      <tr key={album.id} className="border-b last:border-b-0">
        <td className="px-4 py-4 md:px-5">
          <div className="flex items-center gap-5">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg border bg-bg-tertiary">
              {album.image_cover_url ? (
                <Image
                  src={album.image_cover_url}
                  alt={album.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-secondary">
                  <LuMicVocal className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-text-primary">
                {album.name}
              </p>
              <p className="truncate text-xs text-text-secondary md:hidden">
                {artistName}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-xs text-text-secondary">{artistName}</td>
        <td className="px-4 py-4 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <FiCalendar className="h-3 w-3" />
            {new Date(album.release_date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </td>
        <td className="px-4 py-4 text-xs text-text-secondary">
          <span
            style={{ backgroundColor: "#a6a9c826" }}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-[#a6a9c8]"
          >
            <FiMusic className="h-3 w-3" />
            {album.song_count} {album.song_count === 1 ? "song" : "songs"}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onEditAlbum(album)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              aria-label={`Edit ${album.name}`}
            >
              <FiEdit2 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteAlbum(album.id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-text-secondary transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${album.name}`}
            >
              <FiTrash2 className="h-3 w-3" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderAlbumCard = (album: AlbumRecord) => {
    const artistName = getArtistName(album.artist_id);

    return (
      <Polaroid
        key={album.id}
        fill
        className="h-[340px]"
        imageSrc={album.image_cover_url}
        imageAlt={album.name}
        imageContainerClassName="h-[170px]"
      >
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="space-y-2">
            <p className="line-clamp-2 text-sm font-semibold text-text-primary">
              {album.name}
            </p>
            <p className="truncate text-xs text-text-secondary">{artistName}</p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-text-secondary">
              <span className="rounded-full bg-bg-tertiary px-2 py-1">
                <FiCalendar className="mr-1 inline-block h-3 w-3" />
                {new Date(album.release_date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span
                style={{ backgroundColor: "#a6a9c826" }}
                className="rounded-full px-2 py-1 text-[#a6a9c8]"
              >
                <FiMusic className="mr-1 inline-block h-3 w-3" />
                {album.song_count} {album.song_count === 1 ? "song" : "songs"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onEditAlbum(album)}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            >
              <FiEdit2 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDeleteAlbum(album.id)}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </Polaroid>
    );
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[10px] text-text-secondary">
        <p>
          Showing {showingStart}-{showingEnd} of {filteredAlbumsLength}
        </p>
      </div>

      {viewMode === "list" ? (
        <div className="overflow-hidden rounded-2xl border bg-bg-primary">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead className="border-b bg-bg-tertiary text-left text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                <tr>
                  <th className="w-[24%] px-4 py-3 md:px-5">Album Name</th>
                  <th className="w-[20%] px-4 py-3 md:px-5">Artist</th>
                  <th className="w-[16%] px-4 py-3 md:px-5">Release Date</th>
                  <th className="w-[12%] px-4 py-3 md:px-5">Total Songs</th>
                  <th className="w-[10%] px-4 py-3 text-right md:px-5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {albums.length > 0 ? (
                  albums.map(renderAlbumRow)
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-sm text-text-secondary"
                    >
                      No albums match the current search and filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {albums.length > 0 ? (
            albums.map(renderAlbumCard)
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed bg-bg-primary px-4 py-12 text-center text-sm text-text-secondary">
              No albums match the current search and filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumsSection;
