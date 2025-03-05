import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BandLoading = () => {
  return (
    <div className="flex flex-col gap-3 p-3 pb-[70px] md:pb-5">
      <div className="flex h-[35px] items-center gap-2 rounded-lg border-2 px-3 text-sm text-neutral-500">
        <div className="h-[40%] w-[40px] overflow-hidden rounded">
          <Skeleton height={"100%"} />
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex flex-col gap-3">
          <div className="flex h-fit flex-col gap-3 rounded-lg border-2 p-3 md:min-w-[204px] md:flex-col lg:min-w-[294px]">
            <div className="flex gap-3 md:flex-col">
              <div className="h-[100px] w-[100px] md:h-[200px] md:w-full lg:h-[250px]">
                <Skeleton height={"100%"} />
              </div>
              <div className="flex flex-col gap-1 pt-6 md:pt-0">
                <p className="pl-1 text-sm text-neutral-500">Band</p>
                <div className="w-[200px] overflow-hidden">
                  <Skeleton />
                </div>
              </div>
            </div>
            <hr />
            <div className="flex flex-col gap-3 font-semibold">
              <div>
                <h1>Total Songs</h1>
                <Skeleton height={10} width={30} />
              </div>
              <div>
                <h1>Total Albums</h1>
                <Skeleton height={10} width={30} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border-2 p-3">
            <h1 className="font-semibold">Songs Without Albums</h1>
            <div className="h-[10px] w-[100px] overflow-hidden">
              <Skeleton />
            </div>
            <div className="h-[10px] w-[120px] overflow-hidden">
              <Skeleton />
            </div>
            <div className="h-[10px] w-[80px] overflow-hidden">
              <Skeleton />
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array(4)
            .fill(null)
            .map((_, i) => {
              return (
                <div
                  key={i}
                  className="flex h-fit flex-col gap-3 truncate rounded-lg border-2 p-3"
                >
                  <div className="h-[230px] w-full">
                    <Skeleton height={"100%"} />
                  </div>
                  <h1 className="h-[10px] w-full overflow-hidden">
                    <Skeleton />
                  </h1>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BandLoading;
