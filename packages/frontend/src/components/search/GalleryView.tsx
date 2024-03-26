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

interface GalleryViewProps {
  searchString?: string;
  songList: Song[];
}

const GalleryView: React.FC<GalleryViewProps> = ({ songList }) => {
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
                <div className="flex flex-col items-center justify-center rounded border bg-white p-3 shadow">
                  <div className="relative h-[130px] w-full">
                    <Image
                      src={thumbnailUrl}
                      alt={items.name}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded object-cover"
                    />
                  </div>
                  <div className="w-full p-1">
                    <p className="text-lg font-semibold">{items.name}</p>
                  </div>
                </div>
              </Link>
            );
          }
        })}
    </>
  );
};

export default GalleryView;
