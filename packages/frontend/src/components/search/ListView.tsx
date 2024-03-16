// import Image from "next/image";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

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
}

// const classStyle = "rounded-sm border bg-gray-100 px-1 text-sm font-thin";

const ListView: React.FC<ListViewProps> = ({ songList }) => {
  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

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
                href={`/song/${items.name
                  .toLowerCase()
                  .replace(/ /g, "-")}-chords`}
              >
                <div className="flex rounded bg-white p-3 shadow-md">
                  <div className="relative h-[165px] w-[300px]">
                    <Image
                      src={thumbnailUrl}
                      alt={items.name}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="pl-5">
                    <h1 className="text-3xl">
                      <span className="font-semibold">{items.name}</span>{" "}
                      {items.alt_name && items.alt_name.trim() !== "-" && (
                        <span>{items.alt_name}</span>
                      )}
                    </h1>
                    <div className="pt-2">
                      <p className="text-sm text-neutral-500">
                        By{" "}
                        <span className="font-semibold text-black">
                          {items.original_band}
                        </span>{" "}
                        {items.album && (
                          <span>
                            on album{" "}
                            <span className="font-semibold text-black">
                              {items.album}
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="flex gap-1 pt-2 text-sm text-neutral-500">
                      Key of{" "}
                      <span className="font-semibold text-black">
                        {items.original_key} Major
                      </span>
                    </p>
                    <p className="flex gap-1 pt-2 text-sm text-neutral-500">
                      Language :
                      <span className="flex gap-1">
                        {items.song_language.split(" + ").map((lang, i) => {
                          return (
                            <div key={i} className="rounded border px-1">
                              {lang}
                            </div>
                          );
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          }
        })}
    </>
  );
};

export default ListView;
