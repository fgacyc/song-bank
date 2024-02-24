import { type songList } from "@/mock-data";
import Image from "next/image";

interface GalleryViewProps {
  searchString?: string;
  songList: typeof songList;
}

const GalleryView: React.FC<GalleryViewProps> = ({ songList }) => {
  return (
    <>
      {/* {items
        .filter((item) => {
          if (!filterKey) {
            return true;
          } else
            return item.songName
              .toLowerCase()
              .includes(filterKey.toLowerCase());
        }) */}
      {songList.map((items, i) => (
        <div
          key={i}
          className="flex flex-col justify-center rounded-md border p-3 shadow"
        >
          <div className="relative h-[100px] w-full">
            <Image
              src={items.src}
              alt={items.alt}
              fill={true}
              className="rounded-md object-cover"
            />
          </div>
          <p className="p-1">{items.songName}</p>
        </div>
      ))}
    </>
  );
};

export default GalleryView;
