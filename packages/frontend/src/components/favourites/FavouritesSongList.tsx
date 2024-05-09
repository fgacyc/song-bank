import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
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

interface FavouritesSongListProps {
  favouriteSongList: Favorite[];
  filteredSongList: SongType[];
}

const FavouritesSongList: React.FC<FavouritesSongListProps> = ({
  favouriteSongList,
  filteredSongList,
}) => {
  const { isLoading, user } = useUser();

  const handleDeleteFavourite = async (id: string | undefined) => {
    if (!isLoading && user) {
      await fetch(`/api/favorite?id=${id}`, {
        method: "DELETE",
      }).catch((err) => console.error(err));
    }
  };

  const trailingActions = (songId: string) => {
    return (
      <TrailingActions>
        <SwipeAction
          destructive={true}
          onClick={() => {
            const favouriteSong = favouriteSongList.filter((favourite) => {
              return favourite.song_id === songId;
            });
            void handleDeleteFavourite(favouriteSong[0]?.id);
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
    <SwipeableList className="flex flex-col gap-2 px-3 pb-[62px] pt-[62px]">
      {filteredSongList.map((items, i) => {
        const getYoutubeVideoId = (youtubeUrl: string) => {
          const regex =
            /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
          const match = youtubeUrl.match(regex);
          return match ? match[1] : null;
        };
        const originalYoutubeUrl = items.original_youtube_url ?? "";
        const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
        const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;

        return (
          <SwipeableListItem
            key={i}
            trailingActions={trailingActions(items.id)}
          >
            <Link
              href={`/song/${items.name!.toLowerCase().replace(/ /g, "-")}`}
              className="flex w-full gap-3 rounded-lg border-2 p-3 hover:bg-[#f8f8f9]"
            >
              <div className="relative min-h-[70px] min-w-[130px] overflow-hidden rounded-md">
                <Image
                  src={thumbnailUrl}
                  alt={items.name!}
                  fill={true}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-sm font-semibold">{items.name}</h1>
                <p className="text-xs text-neutral-500">
                  {items.original_band}
                </p>
              </div>
            </Link>
          </SwipeableListItem>
        );
      })}
    </SwipeableList>
  );
};

export default FavouritesSongList;
