import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingBandOrAlbumList = () => {
  return (
    <div className="flex items-center gap-3 rounded-lg border-2 p-3">
      <div className="h-[70px] w-[70px] overflow-hidden rounded-full border">
        <Skeleton height={"100%"} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-[20px] w-[150px]">
          <Skeleton height={"100%"} />
        </div>
        <div className="h-[15px] w-[100px]">
          <Skeleton height={"100%"} />
        </div>
      </div>
    </div>
  );
};

const LoadingSongList = () => {
  return (
    <div className="flex gap-3 rounded-lg border-2 p-3">
      <div className="h-[70px] w-[130px] overflow-hidden rounded-md border">
        <Skeleton height={"100%"} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-[20px] w-[150px]">
          <Skeleton height={"100%"} />
        </div>
        <div className="h-[15px] w-[100px]">
          <Skeleton height={"100%"} />
        </div>
      </div>
    </div>
  );
};

const HistoryLoading = () => {
  return (
    <div className="flex flex-col gap-2 px-3 py-[62px]">
      <LoadingBandOrAlbumList />
      <LoadingSongList />
      <LoadingSongList />
      <LoadingBandOrAlbumList />
      <LoadingBandOrAlbumList />
      <LoadingSongList />
      <LoadingBandOrAlbumList />
    </div>
  );
};

export default HistoryLoading;
