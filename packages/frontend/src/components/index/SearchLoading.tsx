import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingList = () => {
  return (
    <div className="flex flex-col gap-3 truncate border-b p-3 hover:bg-[#fafafb] md:flex-row md:rounded-lg md:border-2">
      <div className="relative h-[30dvh] w-full overflow-hidden md:h-[110px] md:h-[140px] md:w-[200px] md:w-[250px] md:min-w-[200px] md:min-w-[250px] md:rounded lg:h-[165px] lg:w-[300px] lg:min-w-[300px]">
        <Skeleton height={"100%"} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-[35px] w-[330px]">
          <Skeleton height={"100%"} />
        </div>
        <div className="h-[15px] w-[250px]">
          <Skeleton height={"100%"} />
        </div>
        <div className="h-[15px] w-[300px]">
          <Skeleton height={"100%"} />
        </div>
        <div className="hidden h-[15px] w-[230px] md:block">
          <Skeleton height={"100%"} />
        </div>
        <div className="hidden h-[15px] w-[220px] lg:block">
          <Skeleton height={"100%"} />
        </div>
      </div>
    </div>
  );
};

const SearchLoading = () => {
  return (
    <div className="flex flex-col gap-3 p-3">
      {new Array(7).fill(null).map((_, i) => (
        <LoadingList key={i} />
      ))}
    </div>
  );
};

export default SearchLoading;
