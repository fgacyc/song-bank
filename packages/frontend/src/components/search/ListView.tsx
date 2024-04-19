import Image from "next/image";
import Link from "next/link";

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
                href={`/song/${items.name.toLowerCase().replace(/ /g, "-")}`}
              >
                <div className="flex flex-col overflow-hidden rounded border p-3 shadow sm:flex-row">
                  <div className="relative h-[25dvh] w-full sm:h-[125px] sm:w-[260px] md:h-[145px] md:w-[280px] lg:h-[165px] lg:w-[300px]">
                    <Image
                      src={thumbnailUrl}
                      alt={items.name}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="pt-3 sm:pl-5 sm:pt-0">
                    <h1 className="truncate text-base sm:py-1 sm:text-lg md:py-1 md:text-2xl lg:py-1 lg:text-3xl">
                      <span className="font-semibold">{items.name}</span>{" "}
                      {items.alt_name && items.alt_name.trim() !== "-" && (
                        <span className=" font-light">{items.alt_name}</span>
                      )}
                    </h1>
                    <div className="pt-2">
                      <p className="truncate text-xs text-neutral-500 lg:text-sm">
                        By{" "}
                        <Link
                          href={`/band/${items.original_band
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                          className="font-semibold text-black hover:underline"
                        >
                          {items.original_band}
                        </Link>{" "}
                        {items.album && (
                          <span>
                            on album{" "}
                            <Link
                              href={`/album/${items.album
                                .toLowerCase()
                                .replace(/ /g, "-")}`}
                              className="font-semibold text-black hover:underline"
                            >
                              {items.album}
                            </Link>
                          </span>
                        )}
                      </p>
                    </div>
                    {items.original_key && (
                      <p className="flex gap-1 truncate pt-2 text-xs text-neutral-500 lg:text-sm">
                        Key of{" "}
                        <span className="font-semibold text-black">
                          {items.original_key} Major
                        </span>
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
                </div>
              </Link>
            );
          }
        })}
    </>
  );
};

export default ListView;
