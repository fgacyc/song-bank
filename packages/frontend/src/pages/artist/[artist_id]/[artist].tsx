import ArtistPage from "@/features/artist/components/ArtistPage";
import MainLayout from "@/layouts/MainLayout";
import { db } from "@/lib/prisma";
import type { ArtistType } from "@/types/types";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

interface ArtistProps {
  artist: ArtistType | null;
}

const Artist = ({ artist }: ArtistProps) => {
  if (!artist) {
    return (
      <>
        <Head>
          <title>Artist Not Found | FGA Worship - Song Bank</title>
        </Head>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Artist Not Found
            </h1>
            <p className="text-gray-600">
              The artist you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </>
    );
  }

  const title = artist.name
    ? `${artist.name} | FGA Worship - Song Bank`
    : "Artist | FGA Worship - Song Bank";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${artist.name}`} />
      </Head>
      <ArtistPage artist={artist} />
    </>
  );
};

Artist.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { artist_id } = context.params as { artist_id: string };

  try {
    const artist = await db.artist.findUnique({
      where: { id: artist_id },
      include: {
        Album: {
          include: {
            _count: {
              select: {
                Song: true,
              },
            },
          },
        },
        Song: {
          include: {
            tags: true,
            album: true,
          },
        },
        _count: {
          select: {
            Album: true,
            Song: true,
          },
        },
      },
    });

    if (!artist) {
      console.warn(`Artist not found: ${artist_id}`);
      return {
        notFound: true,
      };
    }

    return {
      props: {
        artist: JSON.parse(
          JSON.stringify({
            ...artist,
            albums: artist.Album.map((album) => ({
              ...album,
              song_count: album._count.Song,
            })),
            songs: artist.Song,
            album_count: artist._count.Album,
            song_count: artist._count.Song,
          }),
        ) as ArtistType,
      },
    };
  } catch (error) {
    console.error(`Error fetching artist ${artist_id}:`, error);

    return {
      notFound: true,
    };
  }
};

export default Artist;
