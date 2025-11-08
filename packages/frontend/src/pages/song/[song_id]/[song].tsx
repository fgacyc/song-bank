import type { GetServerSideProps } from "next";
import { db } from "@/lib/prisma";
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import React from "react";
import SongPage from "@/features/song/components/SongPage";
import type { SongType } from "@/types/types";

interface SongProps {
  song: SongType | null;
}

const Song = ({ song }: SongProps) => {
  // TODO: implement custom 404 page
  if (!song) {
    return (
      <>
        <Head>
          <title>Song Not Found | FGA Worship - Song Bank</title>
        </Head>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Song Not Found
            </h1>
            <p className="text-gray-600">
              The song you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </>
    );
  }

  const title = song.name
    ? `${song.name} | FGA Worship - Song Bank`
    : "Song | FGA Worship - Song Bank";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={`${song.name} by ${song.original_band}`}
        />
      </Head>
      <SongPage song={song} />
    </>
  );
};

Song.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { song_id } = context.params as { song_id: string };

  try {
    const song = await db.song.findUnique({
      where: { id: song_id },
      include: {
        artist: true,
        album: true,
        tags: true,
      },
    });

    if (!song) {
      console.warn(`Song not found: ${song_id}`);
      return {
        notFound: true,
      };
    }

    return {
      props: {
        song: JSON.parse(JSON.stringify(song)) as SongType,
      },
    };
  } catch (error) {
    console.error(`Error fetching song ${song_id}:`, error);

    return {
      notFound: true,
    };
  }
};

export default Song;
