import Image from "next/image";
import Link from "next/link";

interface SongListProps {
  songName: string;
  artist: string;
  language: string;
  type: string;
  originalKey: string;
  imgSrc: string;
  imgAlt: string;
}

interface GalleryViewProps {
  searchString?: string;
  songList: SongListProps[];
}

const GalleryView: React.FC<GalleryViewProps> = ({ songList }) => {
  return (
    <>
      {songList.map((items, i) => (
        <Link
          href={"/song"}
          key={i}
          className="flex flex-col justify-center rounded-md border p-3"
        >
          <div className="relative h-[100px] w-full">
            <Image
              src={items.imgSrc}
              alt={items.imgAlt}
              priority={true}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-md object-cover"
            />
          </div>
          <p className="p-1">{items.songName}</p>
        </Link>
      ))}
    </>
  );
};

export default GalleryView;
