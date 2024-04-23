import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export type Song = {
  id?: string;
  name: string;
  alt_name?: string;
  song_language: string;
  original_key: string;
  original_band: string;
  album?: string;
  original_youtube_url?: string;
  chord_lyrics: string;
  main_key_link?: string;
  sub_key_link?: string;
  eg_link?: string;
  ag_link?: string;
  bass_link?: string;
  drum_link?: string;
  tags?: string[];
  sequencer_files?: string[];
  sub_voice_file?: string;
};

interface ListViewProps {
  songList?: Song[];
  isLoading: boolean;
}

const LoadingList = () => {
  return (
    <div className="flex flex-col truncate rounded sm:flex-row sm:border-2 sm:p-5">
      <div className="relative h-[25dvh] w-full overflow-hidden sm:h-[125px] sm:w-[260px] sm:rounded md:h-[145px] md:w-[280px] lg:h-[165px] lg:w-[300px]">
        <Skeleton height={"100%"} />
      </div>
      <div className="flex w-full flex-col gap-3 pl-5 pt-5 sm:pt-0">
        <h1 className="w-[300px]">
          <Skeleton />
        </h1>
        <p className="h-[15px] w-[260px]">
          <Skeleton height={"100%"} />
        </p>
        <p className="h-[15px] w-[280px]">
          <Skeleton height={"100%"} />
        </p>
        <p className="hidden h-[15px] w-[200px] sm:block">
          <Skeleton height={"100%"} />
        </p>
        <p className="hidden h-[15px] w-[180px] md:block">
          <Skeleton height={"100%"} />
        </p>
      </div>
    </div>
  );
};

const ListView: React.FC<ListViewProps> = ({ songList, isLoading }) => {
  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 7 }, (_, i) => (
          <LoadingList key={i} />
        ))}
      </div>
    );
  } else {
    return (
      <>
        {songList &&
          songList.length !== 0 &&
          songList.map((items, i) => {
            const originalYoutubeUrl = items.original_youtube_url ?? "";
            const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
            if (youtubeVideoId) {
              const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
              return (
                <Link
                  key={i}
                  href={`/song/${items.name.toLowerCase().replace(/ /g, "-")}`}
                  className="flex flex-col overflow-hidden sm:flex-row sm:rounded sm:border-2 sm:p-3 sm:pb-3"
                >
                  <div className="relative h-[25dvh] w-full overflow-hidden sm:h-[125px] sm:w-[260px] sm:rounded md:h-[145px] md:w-[280px] lg:h-[165px] lg:w-[300px]">
                    <Image
                      src={thumbnailUrl}
                      alt={items.name}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3 sm:pl-5 sm:pt-0">
                    <h1 className="truncate text-base sm:py-1 sm:text-lg md:py-1 md:text-2xl lg:py-1 lg:text-3xl">
                      <span className="font-semibold">{items.name}</span>{" "}
                      {items.alt_name && items.alt_name.trim() !== "-" && (
                        <span className=" font-light">{items.alt_name}</span>
                      )}
                    </h1>
                    <p className="flex gap-1 truncate pt-2 text-xs text-neutral-500 lg:text-sm">
                      By{" "}
                      <Link
                        href={`/band/${items.original_band
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                        className="pointer-events-none hover:underline md:pointer-events-auto md:font-semibold md:text-black"
                      >
                        {items.original_band}
                      </Link>{" "}
                      {items.album && (
                        <span>
                          on album{" "}
                          <Link
                            href={`/album/${items.album
                              ?.toLowerCase()
                              .replace(/ /g, "-")}`}
                            className="pointer-events-none hover:underline md:pointer-events-auto md:font-semibold md:text-black"
                          >
                            {items.album}
                          </Link>
                        </span>
                      )}
                    </p>
                    {items.original_key && (
                      <p className="flex gap-1 truncate pt-2 text-xs text-neutral-500 lg:text-sm">
                        Key of {items.original_key} Major
                      </p>
                    )}
                    {items.song_language && (
                      <p className="flex gap-1 truncate pt-2 text-xs text-neutral-500 lg:text-sm">
                        Language :
                        <span className="flex gap-1">
                          {items.song_language.split(" + ").map((lang, i) => {
                            return (
                              <span key={i} className="rounded border px-1">
                                {lang}
                              </span>
                            );
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                </Link>
              );
            }
          })}
      </>
    );
  }
};

export default ListView;
