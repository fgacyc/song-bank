import React from "react";
import type { SearchSong, SearchAlbum, SearchArtist } from "../types";
import Link from "next/link";
import Image from "next/image";

interface SearchResultsProps {
  songs: SearchSong[];
  albums: SearchAlbum[];
  artists: SearchArtist[];
  query: string;
  isLoading: boolean;
  error: string | null;
  hasResults: boolean;
  total: number;
  className?: string;
}

const SearchResults = ({
  songs,
  albums,
  artists,
  query,
  isLoading,
  error,
  hasResults,
  total,
  className = "",
}: SearchResultsProps) => {
  return (
    <div className={`space-y-8 px-4 py-6 md:px-12 lg:px-24 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Search Results</h1>
        {query && (
          <p className="mt-2 text-lg text-text-secondary">
            Results for &quot;{query}&quot;
            {total > 0 && (
              <span className="ml-2 text-sm">
                ({total} result{total !== 1 ? "s" : ""})
              </span>
            )}
          </p>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-text-secondary">Loading...</div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {!isLoading && !error && !hasResults && query && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xl text-text-secondary">No results found</p>
          <p className="mt-2 text-sm text-text-secondary">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {!isLoading && !error && hasResults && (
        <div className="space-y-8">
          {/* Songs Section */}
          {songs.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-text-primary">
                Songs ({songs.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {songs.map((song) => (
                  <Link
                    key={song.id}
                    href={`/song/${song.id}`}
                    className="hover:border-border-hover group rounded-lg border border-border bg-bg-secondary p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      {song.cover_image_url && (
                        <Image
                          src={song.cover_image_url}
                          alt={song.name ?? "Song cover"}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium text-text-primary group-hover:text-primary">
                          {song.name ?? "Untitled"}
                        </h3>
                        {song.alt_name && (
                          <p className="text-sm text-text-secondary">
                            {song.alt_name}
                          </p>
                        )}
                        {song.artist && (
                          <p className="text-sm text-text-secondary">
                            {song.artist.name}
                          </p>
                        )}
                        <div className="text-text-tertiary flex flex-wrap gap-2 text-xs">
                          {song.original_key && (
                            <span className="rounded bg-bg-primary px-2 py-0.5">
                              Key: {song.original_key}
                            </span>
                          )}
                          {song.song_language && (
                            <span className="rounded bg-bg-primary px-2 py-0.5">
                              {song.song_language}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {albums.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-text-primary">
                Albums ({albums.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {albums.map((album) => (
                  <Link
                    key={album.id}
                    href={`/album/${album.id}`}
                    className="hover:border-border-hover group rounded-lg border border-border bg-bg-secondary p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      {album.image_cover_url && (
                        <Image
                          src={album.image_cover_url}
                          alt={album.name}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium text-text-primary group-hover:text-primary">
                          {album.name}
                        </h3>
                        {album.artist && (
                          <p className="text-sm text-text-secondary">
                            {album.artist.name}
                          </p>
                        )}
                        <div className="text-text-tertiary flex flex-wrap gap-2 text-xs">
                          <span>
                            {new Date(album.release_date).getFullYear()}
                          </span>
                          {album._count && (
                            <span>• {album._count.Song} songs</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Artists Section */}
          {artists.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-text-primary">
                Artists ({artists.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artist/${artist.id}`}
                    className="hover:border-border-hover group rounded-lg border border-border bg-bg-secondary p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      {artist.image_cover_url && (
                        <Image
                          src={artist.image_cover_url}
                          alt={artist.name}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium text-text-primary group-hover:text-primary">
                          {artist.name}
                        </h3>
                        {artist.bio && (
                          <p className="line-clamp-2 text-sm text-text-secondary">
                            {artist.bio}
                          </p>
                        )}
                        {artist._count && (
                          <div className="text-text-tertiary text-xs">
                            {artist._count.Song} songs • {artist._count.Album}{" "}
                            albums
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
