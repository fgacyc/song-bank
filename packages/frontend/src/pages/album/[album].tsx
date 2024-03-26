import React, { type ReactElement } from "react";
import Layout from "@/components/dir/layout/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const album = "Saat Teduh Bersama - Israel Edition";
const artist = "GMS Live ";

const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const Album = () => {
  const router = useRouter();

  return (
    <div className="flex gap-5">
      <div className="flex w-[25%] flex-col rounded border p-5">
        <div className="relative h-48 w-full">
          <Image
            src={""}
            alt={"alt"}
            fill={true}
            priority={true}
            className="border"
          />
        </div>
        <div className="w-full pt-2">
          <p>Album</p>
          <div className="flex items-center">
            <Link
              href={""}
              className="text-sm text-neutral-500 underline hover:text-blue-800"
            >
              {album}
            </Link>
          </div>
          <p>Artist</p>
          <div className="flex items-center">
            <Link
              href={""}
              className="text-sm text-neutral-500 underline hover:text-blue-800"
            >
              {artist}
            </Link>
          </div>
        </div>
      </div>
      <div className="w-[75%]">
        <h1 className="pb-1 text-2xl font-semibold">{}</h1>
        <div className="h-[300px] rounded border p-3">
          <h3 className="pb-3 font-semibold">Lyrics</h3>
          <div className="flex items-center gap-1 pb-3">
            <p className="h-full rounded pb-[2px] text-center text-sm">Key</p>
            <p className="pb-1 text-sm">:</p>
            {keys.map((key, i) => (
              <button
                key={i}
                className="h-full w-[30px] rounded border text-sm text-neutral-500"
              >
                {key}
              </button>
            ))}
          </div>
          <p className="text-neutral-500">{}</p>
        </div>
      </div>
    </div>
  );
};

export default Album;

Album.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
