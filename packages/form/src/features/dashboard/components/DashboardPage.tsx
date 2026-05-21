import React from "react";
import { FiCalendar, FiClock, FiMusic } from "react-icons/fi";
import { LuDisc3, LuMicVocal } from "react-icons/lu";
import DashboardQuickButtons from "./DashboardQuickButtons";
import { useDashboard } from "../hooks/useDashboard";
import { FaArrowTrendUp } from "react-icons/fa6";
import DashboardSection from "./DashboardSection";
import Image from "next/image";
import { CiImageOff } from "react-icons/ci";
import Polaroid from "@/features/shared/components/ui/Polaroid";
import Link from "next/link";
import slugify from "slugify";

const DashboardPage = () => {
  const { counts, overview, isLoading, error } = useDashboard();

  const quickStats = [
    {
      title: "Songs",
      count: counts?.songs ?? 0,
      color: "#a6a9c8",
      icon: <FiMusic />,
    },
    {
      title: "Albums",
      count: counts?.albums ?? 0,
      color: "#796ea8",
      icon: <LuMicVocal />,
    },
    {
      title: "Artists",
      count: counts?.artists ?? 0,
      color: "#554d74",
      icon: <LuDisc3 />,
    },
  ];

  const topArtists = (overview?.popular_artists ?? []).slice(0, 5);
  const newAlbums = (overview?.new_albums ?? []).slice(0, 5);
  const recentSongs = (overview?.top_new_songs ?? []).slice(0, 10);

  const renderLoadingList = () => (
    <div className="space-y-2 py-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`loading-${index}`}
          className="h-14 animate-pulse rounded-xl bg-bg-tertiary"
        />
      ))}
    </div>
  );

  return (
    <div className="flex w-full justify-center bg-bg-tertiary p-10">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl text-primary">Dashboard</h1>
          <p className="text-xs font-semibold text-text-secondary">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div
                key={stat.title}
                className="h-[92px] animate-pulse rounded-2xl bg-bg-primary"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-bg-primary px-4 py-3 text-sm text-destructive">
            Failed to load dashboard counts.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <DashboardQuickButtons
                key={stat.title}
                icon={stat.icon}
                title={stat.title}
                count={stat.count}
                color={stat.color}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DashboardSection
            title="Top Artists"
            icon={<FaArrowTrendUp className="h-3.5 w-3.5" />}
            href="/artist"
          >
            {isLoading ? (
              renderLoadingList()
            ) : topArtists.length === 0 ? (
              <p className="py-2 text-sm text-text-secondary">
                No artist activity yet.
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {topArtists.map((artist, index) => (
                  <Link
                    href={`/artist/${artist.id}/${slugify(artist.name, { lower: true })}`}
                    key={artist.id}
                    className="group"
                  >
                    <div className="flex items-center justify-between rounded-lg px-4 py-4 transition-all group-hover:bg-bg-tertiary">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary text-xs text-text-primary">
                          {index + 1}
                        </div>
                        <div className="relative h-14 w-14 overflow-hidden rounded-full">
                          {artist.image_cover_url ? (
                            <Image
                              src={artist.image_cover_url}
                              alt={artist.name}
                              fill={true}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full border bg-bg-secondary text-text-secondary transition-transform duration-300 group-hover/polaroid:scale-110">
                              <CiImageOff className="h-4 w-4" />{" "}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-start justify-center gap-1">
                          <span className="text-sm font-semibold text-text-primary">
                            {artist.name}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                            {artist.song_count > 0 && (
                              <span>
                                {artist.song_count}{" "}
                                {artist.song_count === 1 ? "Song" : "Songs"}
                              </span>
                            )}
                            {artist.song_count > 0 &&
                              artist.album_count > 0 && (
                                <span className="text-[6px] font-semibold text-text-secondary">
                                  •
                                </span>
                              )}
                            {artist.album_count > 0 && (
                              <span>
                                {artist.album_count}{" "}
                                {artist.album_count === 1 ? "Album" : "Albums"}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{ backgroundColor: "#a6a9c826" }}
                        className="flex min-w-11 items-center justify-center gap-1 rounded-full px-2 py-1 text-[10px] text-[#a6a9c8]"
                      >
                        <FiMusic className="" />
                        <span className="">{artist.song_count}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection
            title="New Albums"
            icon={<FiCalendar className="h-4 w-4" />}
            href="/album"
          >
            {isLoading ? (
              renderLoadingList()
            ) : newAlbums.length === 0 ? (
              <p className="py-2 text-sm text-text-secondary">No albums yet.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {newAlbums.map((album, _) => (
                  <Link
                    href={`/album/${album.id}/${slugify(album.name, { lower: true })}`}
                    key={album.id}
                    className="group"
                  >
                    <div className="flex items-center justify-start gap-4 rounded-lg px-4 py-4 transition-all group-hover:bg-bg-tertiary">
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                        {album.image_cover_url ? (
                          <Image
                            src={album.image_cover_url}
                            alt={album.name}
                            fill={true}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-lg border bg-bg-secondary text-text-secondary transition-transform duration-300 group-hover/polaroid:scale-110">
                            <CiImageOff className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-text-primary">
                          {album.name}
                        </h3>
                        <p className="text-xs font-semibold text-text-secondary">
                          {album.artist_name ?? "Unknown artist"}
                        </p>
                        <div className="flex w-fit items-center justify-center gap-2 text-[10px] text-neutral-400">
                          <span className="flex items-center justify-center gap-1">
                            <FiCalendar />
                            {album.release_date
                              ? new Date(album.release_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "-"}
                          </span>
                          <span className="flex items-center justify-center gap-1">
                            <FiMusic />
                            {album.song_count > 0 && (
                              <>
                                <span>
                                  {album.song_count}{" "}
                                  {album.song_count === 1 ? "song" : "songs"}
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </DashboardSection>
        </div>

        <DashboardSection
          title="Recently Added Songs"
          icon={<FiClock className="h-4 w-4 text-text-secondary" />}
          href="/song"
        >
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={`song-loading-${index}`}
                  className="h-20 animate-pulse rounded-xl bg-bg-tertiary"
                />
              ))}
            </div>
          ) : recentSongs.length === 0 ? (
            <p className="py-2 text-sm text-text-secondary">
              No songs have been added yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {recentSongs.map((song) => (
                <Polaroid
                  key={song.id}
                  fill
                  className="h-[320px] w-full"
                  imageSrc={song.image_cover_url ?? null}
                  imageContainerClassName="h-[120px] sm:h-[180px] md:h-[200px] lg:h-[220px]"
                  contentClassName="bg-bg-tertiary px-4 py-4"
                >
                  <div className="flex h-full flex-col justify-between gap-4">
                    <div className="space-y-1">
                      <p className="line-clamp-2 text-sm font-semibold text-text-primary">
                        {song.name}
                      </p>
                      <p className="truncate text-xs text-text-secondary">
                        {song.artist_name ?? "Unknown artist"}
                      </p>
                      {song.album_name ? (
                        <p className="truncate pt-2 text-xs text-text-secondary">
                          {song.album_name}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Polaroid>
              ))}
            </div>
          )}
        </DashboardSection>
      </div>
    </div>
  );
};

export default DashboardPage;
