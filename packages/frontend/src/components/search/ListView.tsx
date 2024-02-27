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

interface ListViewProps {
  songList: SongListProps[];
}

const classStyle = "rounded-sm border bg-gray-100 px-1 text-sm font-thin";

const ListView: React.FC<ListViewProps> = ({ songList }) => {
  return (
    <>
      {songList.map((items, i) => (
        <Link
          href={"/song"}
          key={i}
          className="flex items-center rounded-lg border p-3"
        >
          <div className="relative h-[150px] w-[300px]">
            <Image
              src={items.imgSrc}
              alt={items.imgAlt}
              priority={true}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-md object-cover"
            />
          </div>
          <div className="h-full ps-5 pt-2">
            <div className="text-xl">{items.songName}</div>
            <p className="text-sm font-thin text-gray-500">by {items.artist}</p>
            <div className="flex w-fit gap-2 pt-1">
              <p className={classStyle}>{items.language}</p>
              <p className={classStyle}>{items.type}</p>
              <p className={classStyle}>{items.originalKey}</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default ListView;
