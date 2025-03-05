import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingList = () => {
  return (
    <div className="flex min-h-[82px] items-center gap-5 truncate rounded-md border-2 px-5 hover:bg-[#fafafb]">
      <div className="h-[40px] w-[40px] overflow-hidden rounded-full">
        <Skeleton height={"100%"} />
      </div>
      <div className="pb-2">
        <div className="h-[20px] w-[100px] md:w-[120px]">
          <Skeleton height={"100%"} />
        </div>
        <div className="h-[10px] w-[80px]">
          <Skeleton height={"100%"} />
        </div>
      </div>
    </div>
  );
};

const HistoryLoading = () => {
  return (
    <div className="px-3 pb-[62px] pt-[58px] md:pb-3">
      <Skeleton height={12} width={70} />
      <div className="flex flex-col gap-3 pt-1">
        {Array(10)
          .fill(null)
          .map((_, i) => {
            return <LoadingList key={i} />;
          })}
      </div>
    </div>
  );
};

export default HistoryLoading;
