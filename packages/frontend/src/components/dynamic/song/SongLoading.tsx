import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const SongLoading = () => {
  useEffect(() => {
    import("ldrs")
      .then(({ bouncy }) => {
        bouncy.register();
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="flex flex-col gap-5 p-5 pb-[70px] sm:pb-5">
      <div className="flex h-[35px] items-center gap-2 rounded-lg border-2 px-3 text-sm text-neutral-500">
        <div className="h-[40%] w-[40px] overflow-hidden rounded">
          <Skeleton height={"100%"} />
        </div>
        /
        <div className="h-[40%] w-[80px] overflow-hidden rounded">
          <Skeleton height={"100%"} />
        </div>
        /
        <div className="h-[40%] w-[100px] overflow-hidden rounded">
          <Skeleton height={"100%"} />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex h-fit flex-col gap-3 rounded-lg border-2 p-5 md:min-w-[244px] lg:min-w-[344px]">
          <div className="h-[150px]">
            <Skeleton height={"100%"} />
          </div>
          <div className="flex flex-col font-semibold">
            <div>
              <h1>Song Name</h1>
              <Skeleton height={10} width={100} />
            </div>
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
              <h1>Original Key</h1>
              <Skeleton height={10} width={40} />
            </div>
            <div>
              <h1>Others</h1>
              <Skeleton height={10} width={60} />
            </div>
          </div>
          <hr />
          <div className="flex gap-3 font-semibold">
            <Skeleton height={10} width={40} />
            <Skeleton height={10} width={40} />
          </div>
        </div>
        <div className="flex w-full flex-col gap-5">
          <div className="hidden h-[60px] items-center rounded-lg border-2 px-3 md:flex">
            <Skeleton width={300} containerClassName="flex-1" />
          </div>
          <div className="rounded-lg border-2 p-5">
            <h1 className="pb-4 font-semibold">Transpose Key</h1>
            <div className="grid grid-cols-6 gap-4 sm:grid-cols-12 md:grid-cols-6 lg:grid-cols-12">
              {keys.map((key, i) => {
                return (
                  <button key={i} className="h-[35px] rounded border text-sm">
                    {key}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex h-[450px] items-center justify-center rounded-lg border-2 lg:h-[500px]">
            <l-bouncy color={"lightgray"}></l-bouncy>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongLoading;
