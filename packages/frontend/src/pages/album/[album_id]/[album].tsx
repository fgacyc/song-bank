import Head from "next/head";
import React from "react";
import AlbumPage from "../../../features/album/components/AlbumPage";
import MainLayout from "@/layouts/MainLayout";
import type { GetServerSideProps } from "next";
import { albumService } from "@/features/album/services/albumService";
import type { AlbumTypeWithSongs } from "@/features/album/types/types";

interface AlbumProps {
  album: AlbumTypeWithSongs | null;
}

const Album = ({ album }: AlbumProps) => {
  // TODO: implement custom 404 page
  if (!album) {
    return (
      <>
        <Head>
          <title>Album Not Found | FGA Worship - Song Bank</title>
        </Head>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Album Not Found
            </h1>
            <p className="text-gray-600">
              The album you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </>
    );
  }

  const title = album.name
    ? `${album.name} | FGA Worship - Song Bank`
    : "Album | FGA Worship - Song Bank";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={`${album.name} by ${album.artist.name}`}
        />
      </Head>
      <AlbumPage album={album} />
    </>
  );
};

Album.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { album_id } = context.params as { album_id: string };

  try {
    const album = await albumService.getAlbumById(album_id);

    if (!album) {
      console.warn(`Album not found: ${album_id}`);
      return {
        notFound: true,
      };
    }

    return {
      props: {
        album: JSON.parse(JSON.stringify(album)) as AlbumTypeWithSongs,
      },
    };
  } catch (error) {
    console.error(`Error fetching album ${album_id}:`, error);

    return {
      notFound: true,
    };
  }
};

export default Album;
