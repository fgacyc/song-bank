import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingList = () => {
  return (
    <div className="flex gap-3 rounded-lg border-2 p-3 hover:bg-[#fafafb]">
      <div className="h-[70px] w-[130px] overflow-hidden rounded-md border md:min-h-[110px] md:min-h-[90px] md:min-w-[170px] md:min-w-[195px] lg:min-h-[130px] lg:min-w-[230px]">
        <Skeleton height={"100%"} />
      </div>
      <div className="flex flex-col gap-2 md:gap-3">
        <div className="h-[20px] w-[150px] md:h-[25px] md:h-[30px] md:w-[180px] md:w-[210px] lg:h-[35px] lg:w-[240px]">
          <Skeleton height={"100%"} />
        </div>
        <div className="h-[15px] w-[100px] md:h-[20px] md:h-[20px] md:w-[120px] md:w-[140px] lg:w-[160px]">
          <Skeleton height={"100%"} />
        </div>
      </div>
    </div>
  );
};

const FavouriteLoading = () => {
  return (
    <div className="flex flex-col gap-2 px-3 pb-[62px] pt-[65px] md:pb-3">
      {new Array(4).fill(null).map((_, i) => {
        return <LoadingList key={i} />;
      })}
    </div>
  );
};

export default FavouriteLoading;
