import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import type { Favorite, Song, Tag } from "@prisma/client";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { useUser } from "@auth0/nextjs-auth0/client";

type SongType = Song & { tags: Tag[] };

interface FavouriteSongListProps {
  favouriteSongList: Favorite[];
  filteredSongList: SongType[];
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const FavouriteSongList: React.FC<FavouriteSongListProps> = ({
  favouriteSongList,
  filteredSongList,
  setCount,
}) => {
  const { isLoading, user } = useUser();
  const [activeList, setActiveList] = useState(-1);

  const handleDeleteFavourite = async (id: string | undefined) => {
    if (!isLoading && user) {
      await fetch(`/api/favorite?id=${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setCount((prev) => prev - 1);
        })
        .catch((err) => console.error(err));
    }
  };

  const trailingActions = (songId: string) => {
    return (
      <TrailingActions>
        <SwipeAction
          destructive={true}
          onClick={async () => {
            const favouriteSong = favouriteSongList.filter((favourite) => {
              return favourite.song_id === songId;
            });
            await handleDeleteFavourite(favouriteSong[0]?.id);
            setCount((prev) => prev - 1);
          }}
        >
          <div className="relative ml-2 rounded-lg border-2 border-red-500">
            <MdDelete className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[30px] w-[30px] text-red-500" />
          </div>
        </SwipeAction>
      </TrailingActions>
    );
  };
  return (
    <SwipeableList className="flex flex-col gap-2 px-3 pb-[62px] pt-[65px] sm:pb-3">
      {filteredSongList.map((items, i) => {
        const getYoutubeVideoId = (youtubeUrl: string) => {
          const regex =
            /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
          const match = youtubeUrl.match(regex);
          return match ? match[1] : null;
        };
        let thumbnailUrl = "";
        if (items.original_youtube_url) {
          const youtubeVideoId = getYoutubeVideoId(items.original_youtube_url);
          thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
        }

        return (
          <SwipeableListItem
            key={i}
            trailingActions={trailingActions(items.id)}
          >
            <Link
              href={`/song/${items
                .name!.toLowerCase()
                .trim()
                .replace(/ /g, "-")}-${items.id.slice(0, 5)}`}
              className="flex w-full justify-between truncate rounded-lg border-2 p-3 hover:bg-[#f8f8f9]"
              onMouseOver={() => setActiveList(i)}
              onMouseLeave={() => setActiveList(-1)}
            >
              <div className="flex gap-3">
                <div
                  className={`${
                    thumbnailUrl === "" && "border-2"
                  } relative min-h-[70px] min-w-[130px] overflow-hidden rounded-md sm:min-h-[90px] sm:min-w-[170px] md:min-h-[110px] md:min-w-[195px] lg:min-h-[130px] lg:min-w-[230px]`}
                >
                  <Image
                    src={
                      thumbnailUrl !== "" ? thumbnailUrl : "/no-song-cover.svg"
                    }
                    alt={items.name!}
                    fill={true}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={
                      thumbnailUrl !== ""
                        ? "object-cover"
                        : "absolute bottom-0 left-0 right-0 top-0 m-auto max-h-[80%] max-w-[80%]"
                    }
                  />
                </div>
                <div>
                  <h1 className="text-sm font-semibold sm:text-base md:text-lg lg:text-2xl">
                    {items.name}
                  </h1>
                  <p className="text-xs text-neutral-500 sm:text-sm md:text-base">
                    {items.original_band}
                  </p>
                </div>
              </div>
              {activeList === i && (
                <button
                  className="h-fit"
                  onClick={async (e) => {
                    e.preventDefault();
                    const favouriteSong = favouriteSongList.filter(
                      (favourite) => {
                        return favourite.song_id === items.id;
                      },
                    );
                    await handleDeleteFavourite(favouriteSong[0]?.id);
                    filteredSongList.splice(i, 1);
                    setCount((prev) => prev - 1);
                  }}
                >
                  <MdDeleteOutline className="h-[30px] w-[30px] hover:text-red-600" />
                </button>
              )}
            </Link>
          </SwipeableListItem>
        );
      })}
    </SwipeableList>
  );
};

export default FavouriteSongList;
