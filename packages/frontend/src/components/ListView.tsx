import { type songList } from "@/mock-data";
import Image from "next/image";

interface ListViewProps {
  songList: typeof songList;
}

const ListView: React.FC<ListViewProps> = ({ songList }) => {
  return (
    <>
      {songList.map((items, i) => (
        <div key={i} className="flex items-center rounded-lg border p-3 shadow">
          <div className="relative h-[150px] w-[300px]">
            <Image
              src={items.src}
              alt={items.alt}
              priority={true}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-md object-cover"
            />
          </div>
          <div className="h-full ps-5 pt-2">
            <div className="text-xl">{items.songName}</div>
            <p className="text-sm font-thin text-gray-500">
              by {items.composer}
            </p>
            <div className="flex pt-1">
              {items.tags.map((items, i) => (
                <p
                  key={i}
                  className="me-2 rounded-sm border bg-gray-100 px-1 text-sm font-thin"
                >
                  {items}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ListView;
