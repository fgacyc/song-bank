import Image from "next/image";
import { type NextRouter } from "next/router";
import React from "react";
import { type Song } from "@prisma/client";
import { MdImageNotSupported } from "react-icons/md";

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
    <div className="rounded-lg border-2 p-3">
      <div className="flex items-center justify-start gap-3 truncate pb-3 md:flex-col md:items-start">
        {channelProfile ? (
          <div className="flex justify-center p-3 md:w-full">
            <div className="relative min-h-[80px] min-w-[80px] md:min-h-[125px] md:min-w-[125px]">
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
        ) : (
          <div className="flex min-h-[80px] min-w-[80px] items-center justify-center rounded-full border md:h-[125px] md:w-[125px]">
            <MdImageNotSupported />
          </div>
        )}
        <div className="text-wrap">
          <h1 className="text-sm text-neutral-500">Band</h1>
          <p className="text-lg font-semibold">
            {filteredSongList[0]?.original_band}
          </p>
        </div>
      </div>

      <hr />
      <div className="flex flex-col pb-3 pt-4">
        <h1 className="text-sm font-semibold">Total Songs</h1>
        <p className="text-sm text-neutral-500">{filteredSongList.length}</p>
      </div>
      <div className="flex flex-col">
        <h1 className="text-sm font-semibold">Total Albums</h1>
        <p className="text-sm text-neutral-500">{uniqueAlbumList.length}</p>
      </div>
    </div>
  );
};

export default BandDetails;
