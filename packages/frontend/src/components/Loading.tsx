import React, { useEffect, useState } from "react";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IoIosClose } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";

const LoadingList = () => {
  return (
    <>
      <div className="flex flex-col overflow-hidden rounded border p-3 shadow sm:flex-row md:items-center lg:items-stretch">
        <div className="h-[25dvh] w-full sm:h-[125px] sm:w-[400px] md:h-[145px] md:w-[370px] lg:h-[165px] lg:w-[370px]">
          <Skeleton height={"95%"} />
        </div>
        <div className="flex w-full flex-col justify-between gap-2 pt-3 sm:pl-5 sm:pt-0 ">
          <Skeleton height={30} containerClassName="flex-1" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton />
            <Skeleton />
            <div className="hidden sm:block md:block lg:block">
              <Skeleton />
            </div>
            <div className="hidden md:block lg:block">
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Loading = () => {
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    const param = localStorage.getItem("song-search");
    if (param) {
      setSearchString(String(param));
    }
  }, []);
  const tags = ["Lyrics", "Title", "Album", "Band", "Key", "Language"];
  return (
    <>
      <div className="sticky top-[70px] z-10 flex justify-between border-b bg-white p-3">
        <div className="flex w-full items-center gap-3">
          <div className="flex h-[30px] w-full items-center justify-between rounded-md border sm:w-fit sm:justify-evenly md:w-fit md:justify-evenly lg:w-fit lg:justify-evenly">
            <input
              type="text"
              defaultValue={searchString}
              placeholder="Search"
              className="ps-2"
            />
            <button
              type="reset"
              className="flex h-full w-[30px] items-center justify-center rounded-e-md border-s"
            >
              {searchString === "" ? <RiSearch2Line /> : <IoIosClose />}
            </button>
          </div>
          <div className="hidden gap-3 ps-1 md:flex">
            {tags.map((tag, i) => (
              <button
                key={i}
                className="rounded border px-2 py-1 text-xs text-neutral-500"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden w-[74px] grid-cols-2 gap-1 sm:grid md:grid lg:grid">
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-md border">
            <CiGrid2H className="h-[20px] w-[20px]" />
          </button>
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-md border">
            <CiGrid41 className="h-[20px] w-[20px]" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {Array.from({ length: 7 }, (_, i) => (
          <LoadingList key={i} />
        ))}
      </div>
    </>
  );
};

export default Loading;
