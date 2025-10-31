import MainLayout from "@/layouts/MainLayout";
import { useRouter } from "next/router";
import Head from "next/head";
import React from "react";
import SongPage from "@/features/song/components/SongPage";
import { useSong } from "@/features/song/hooks/useSong";

const Song = () => {
  const router = useRouter();
  const songParam = router.query.song as string | undefined;

  const { data: song, isLoading, error } = useSong(songParam);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const title = song?.name
    ? `${song.name} | FGA Worship - Song Bank`
    : "Song | FGA Worship - Song Bank";

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <SongPage song={song} />
    </>
  );
};

Song.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Song;
