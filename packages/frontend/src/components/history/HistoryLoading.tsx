import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingBandOrAlbumList = () => {
  return (
    <div className="flex items-center gap-3 rounded-lg border-2 p-3 hover:bg-[#fafafb]">
      <div className="h-[70px] w-[70px] overflow-hidden rounded-full border sm:h-[90px] sm:w-[90px] md:h-[110px] md:w-[110px] lg:h-[130px] lg:w-[130px]">
        <Skeleton height={"100%"} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-[20px] w-[150px] sm:h-[25px] sm:w-[180px] md:h-[30px] md:w-[210px] lg:h-[35px] lg:w-[240px]">
          <Skeleton height={"100%"} />
        </div>
        <div className="h-[15px] w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px]">
          <Skeleton height={"100%"} />
        </div>
      </div>
    </div>
  );
};

const LoadingSongList = () => {
  return (
    <div className="flex gap-3 rounded-lg border-2 p-3 hover:bg-[#fafafb]">
      <div className="h-[70px] w-[130px] overflow-hidden rounded-md border sm:h-[90px] sm:w-[170px] md:h-[110px] md:w-[195px] lg:h-[130px] lg:w-[230px]">
        <Skeleton height={"100%"} />
      </div>
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="h-[20px] w-[150px] sm:h-[25px] sm:w-[180px] md:h-[30px] md:w-[210px] lg:h-[35px] lg:w-[240px]">
          <Skeleton height={"100%"} />
        </div>
        <div className="h-[15px] w-[100px] sm:h-[20px] sm:w-[120px] md:h-[20px] md:w-[140px] lg:w-[160px]">
          <Skeleton height={"100%"} />
        </div>
      </div>
    </div>
  );
};

const HistoryLoading = () => {
  return (
    <div className="flex flex-col gap-2 px-3 pb-[62px] pt-[62px] sm:pb-3">
      <LoadingBandOrAlbumList />
      <LoadingSongList />
      <LoadingSongList />
      <LoadingBandOrAlbumList />
      <LoadingBandOrAlbumList />
      <LoadingSongList />
      <LoadingBandOrAlbumList />
      <LoadingSongList />
      <LoadingBandOrAlbumList />
      <LoadingBandOrAlbumList />
    </div>
  );
};

export default HistoryLoading;
