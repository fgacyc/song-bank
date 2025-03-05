import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AlbumLoading = () => {
  return (
    <div className="flex flex-col gap-3 p-3 pb-[70px] md:pb-5">
      <div className="flex h-[35px] items-center gap-2 rounded-lg border-2 px-3 text-sm text-neutral-500">
        <div className="h-[40%] w-[40px] overflow-hidden rounded">
          <Skeleton height={"100%"} />
        </div>
        /
        <div className="h-[40%] w-[80px] overflow-hidden rounded">
          <Skeleton height={"100%"} />
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex h-fit flex-col gap-3 rounded-lg border-2 p-3 md:min-w-[244px] lg:min-w-[344px]">
          <div className="h-[250px] md:h-[200px] lg:h-[250px]">
            <Skeleton height={"100%"} />
          </div>
          <div className="flex flex-col font-semibold">
            <div>
              <h1>Album</h1>
              <Skeleton height={10} width={120} />
            </div>
            <div>
              <h1>Band</h1>
              <Skeleton height={10} width={80} />
            </div>
          </div>
          <hr />
          <div className="flex flex-col font-semibold">
            <div>
              <h1>Total Songs</h1>
              <Skeleton height={10} width={40} />
            </div>
          </div>
        </div>
        <div className="grid h-fit w-full gap-3 md:grid-cols-1 lg:grid-cols-2">
          {Array(4)
            .fill(null)
            .map((_, i) => {
              return (
                <div
                  key={i}
                  className="flex h-fit gap-3 truncate rounded-lg border-2 p-3 lg:flex-col xl:flex-row"
                >
                  <div className="h-[105px] w-[200px] lg:h-[150px] lg:w-full xl:h-[105px] xl:w-[200px]">
                    <Skeleton height={"100%"} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="h-[20px] w-[120px] md:w-[200px]">
                      <Skeleton height={"100%"} />
                    </div>
                    <div className="h-[15px] w-[100px] md:w-[120px]">
                      <Skeleton height={"100%"} />
                    </div>
                    <div className="h-[15px] w-[60px] md:w-[140px]">
                      <Skeleton height={"100%"} />
                    </div>
                    <div className="hidden h-[15px] w-[100px] xl:block">
                      <Skeleton height={"100%"} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AlbumLoading;
