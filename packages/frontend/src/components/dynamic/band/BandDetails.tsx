import Image from "next/image";
import { type NextRouter } from "next/router";
import React from "react";
import { type Song } from "@prisma/client";

interface BandDetailsProps {
  channelProfile: string;
  router: NextRouter;
  filteredSongList: Song[];
  uniqueAlbumList: string[];
}

const BandDetails: React.FC<BandDetailsProps> = ({
  channelProfile,
  router,
  filteredSongList,
  uniqueAlbumList,
}) => {
  return (
    <div className="h-fit w-full rounded-lg border-2 p-5 md:w-[200px] lg:w-[300px]">
      <div className="flex w-full items-center justify-start gap-5 truncate pb-5 md:flex-col md:items-start md:pt-5">
        {channelProfile && (
          <div className="flex justify-center md:w-full">
            <div className="relative h-[100px] w-[100px] md:h-[100px] md:w-[100px] lg:h-[200px] lg:w-[200px]">
              <Image
                src={channelProfile}
                alt={router.query.band as string}
                fill={true}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <div className="text-wrap pt-4">
          <h1 className="pl-1 text-sm text-neutral-500">Band</h1>
          <p className="w-full text-3xl font-semibold">
            {filteredSongList[0]?.original_band}
          </p>
        </div>
      </div>

      <hr />
      <div className="flex flex-col pb-3 pt-4">
        <h1 className="font-semibold">Total Songs</h1>
        <p className="text-sm text-neutral-500">{filteredSongList.length}</p>
      </div>
      <div className="flex flex-col">
        <h1 className="font-semibold">Total Albums</h1>
        <p className="text-sm text-neutral-500">{uniqueAlbumList.length}</p>
      </div>
    </div>
  );
};

export default BandDetails;