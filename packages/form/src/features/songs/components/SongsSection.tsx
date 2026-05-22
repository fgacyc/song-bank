import React from "react";
import Image from "next/image";
import { FiEdit2, FiMusic, FiTrash2 } from "react-icons/fi";

import Polaroid from "@/features/shared/components/ui/Polaroid";

import type { AlbumRecord, ArtistRecord, SongRecord } from "../types";

interface SongsSectionProps {
  viewMode: "list" | "polaroid";
  songs: SongRecord[];
  artists: ArtistRecord[];
  albums: AlbumRecord[];
  showingStart: number;
  showingEnd: number;
  filteredSongsLength: number;
  onEditSong: (song: SongRecord) => void;
  onDeleteSong: (songId: string) => void;
}

const SongsSection = ({
  viewMode,
  songs,
  artists,
  albums,
  showingStart,
  showingEnd,
  filteredSongsLength,
  onEditSong,
  onDeleteSong,
}: SongsSectionProps) => {
  const renderSongRow = (song: SongRecord) => {
    const artistName = song.artist_id
      ? (artists.find((artist) => artist.id === song.artist_id)?.name ??
        "Unknown Artist")
      : "Unknown Artist";
    const albumName = song.album_id
      ? (albums.find((album) => album.id === song.album_id)?.name ?? "No Album")
      : "No Album";

    return (
      <tr key={song.id} className="border-b last:border-b-0">
        <td className="px-4 py-4 md:px-5">
          <div className="flex items-center gap-5">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg border bg-bg-tertiary">
              {song.cover_image_url ? (
                <Image
                  src={song.cover_image_url}
                  alt={song.name ?? "Song"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-secondary">
                  <FiMusic className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-text-primary">
                {song.name ?? "Untitled song"}
              </p>
              <p className="truncate text-xs text-text-secondary md:hidden">
                {artistName}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-xs text-text-secondary">{artistName}</td>
        <td className="px-4 py-4 text-xs text-text-secondary">{albumName}</td>
        <td className="px-4 py-4 text-xs text-text-secondary">
          {song.original_key ?? "-"}
        </td>
        <td className="px-4 py-4 text-xs text-text-secondary">
          {song.song_language ?? "-"}
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onEditSong(song)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              aria-label={`Edit ${song.name ?? "song"}`}
            >
              <FiEdit2 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteSong(song.id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-text-secondary transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${song.name ?? "song"}`}
            >
              <FiTrash2 className="h-3 w-3" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderSongCard = (song: SongRecord) => {
    const artistName = song.artist_id
      ? (artists.find((artist) => artist.id === song.artist_id)?.name ??
        "Unknown Artist")
      : "Unknown Artist";
    const albumName = song.album_id
      ? (albums.find((album) => album.id === song.album_id)?.name ?? "No Album")
      : "No Album";

    return (
      <Polaroid
        key={song.id}
        fill
        className="h-[340px]"
        imageSrc={song.cover_image_url}
        imageAlt={song.name ?? "Song cover"}
        imageContainerClassName="h-[170px]"
      >
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="space-y-2">
            <p className="line-clamp-2 text-sm font-semibold text-text-primary">
              {song.name ?? "Untitled song"}
            </p>
            <p className="truncate text-xs text-text-secondary">{artistName}</p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-text-secondary">
              <span className="rounded-full bg-bg-tertiary px-2 py-1">
                {song.original_key ?? "-"}
              </span>
              <span className="rounded-full bg-bg-tertiary px-2 py-1">
                {song.song_language ?? "-"}
              </span>
            </div>
            <p className="truncate text-xs text-text-secondary">{albumName}</p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onEditSong(song)}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            >
              <FiEdit2 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDeleteSong(song.id)}
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
          Showing {showingStart}-{showingEnd} of {filteredSongsLength}
        </p>
      </div>
      {viewMode === "list" ? (
        <div className="overflow-hidden rounded-2xl border bg-bg-primary">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead className="border-b bg-bg-tertiary text-left text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                <tr>
                  <th className="w-[34%] px-4 py-3 md:px-5">Song</th>
                  <th className="w-[18%] px-4 py-3 md:px-5">Artist</th>
                  <th className="w-[18%] px-4 py-3 md:px-5">Album</th>
                  <th className="w-[10%] px-4 py-3 md:px-5">Key</th>
                  <th className="w-[10%] px-4 py-3 md:px-5">Language</th>
                  <th className="w-[10%] px-4 py-3 text-right md:px-5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {songs.length > 0 ? (
                  songs.map(renderSongRow)
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-sm text-text-secondary"
                    >
                      No songs match the current search and filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {songs.length > 0 ? (
            songs.map(renderSongCard)
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed bg-bg-primary px-4 py-12 text-center text-sm text-text-secondary">
              No songs match the current search and filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongsSection;
