import React from "react";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { RiSearch2Line } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingList = () => {
  return (
    <>
      <div className="flex flex-col overflow-hidden rounded border p-3 shadow sm:flex-row md:items-center lg:items-stretch">
        <div className="h-[25dvh] w-full sm:h-[125px] sm:w-[260px] md:h-[145px] md:w-[280px] lg:h-[165px] lg:w-[300px]">
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
  return (
    <>
      <div className="sticky top-[70px] z-10 flex justify-between border-b bg-white p-3">
        <div className="flex w-full items-center gap-3">
          <div className="flex h-[30px] w-full items-center justify-between rounded-md border sm:w-fit sm:justify-evenly md:w-fit md:justify-evenly lg:w-fit lg:justify-evenly">
            <input type="text" placeholder="Search" className="ps-2" />
            <button
              type="reset"
              className="flex h-full w-[30px] items-center justify-center rounded-e-md border-s"
            >
              <RiSearch2Line />
            </button>
          </div>
        </div>
        <div className="hidden w-[70px] grid-cols-2 gap-1 sm:grid md:grid lg:grid">
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-md border">
            <CiGrid2H className="h-[20px] w-[20px]" />
          </button>
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-md border">
            <CiGrid41 className="h-[20px] w-[20px]" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-5 px-5 pt-5">
        <LoadingList />
        <LoadingList />
        <LoadingList />
      </div>
    </>
  );
};

export default Loading;
