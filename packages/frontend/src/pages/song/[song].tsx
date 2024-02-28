import React, { useState, type ReactElement } from "react";
import DirLayout from "@/components/dir/layout/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

let videoSrc = "https://www.youtube.com/watch?v=5KiQDoWo5t4";
const songName = "You Are Good";
const altSongName = "null";
const artist = "Israel & New Breed";
const album = "null";
const originalKey = "E";
const lyrics =
  "[Chorus] We [E]worship [B]you, [D]hallelujah, [A]hallelujah. We [E]worship [B]you, for who you [D]are.";

const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

if (videoSrc.includes("watch?v=")) {
  videoSrc = videoSrc.replace("watch?v=", "embed/");
}

const Song = () => {
  const [currentKey, setCurrentKey] = useState(originalKey);
  const router = useRouter();

  return (
    <div className="flex gap-5">
      <div className="flex w-[25%] flex-col rounded border p-5">
        <div className="h-48 w-full">
          {
            <iframe
              src={videoSrc}
              allowFullScreen
              className="h-full w-full rounded border"
            />
          }
        </div>
        <div className="w-full pt-2">
          <p>Song Name</p>
          <div className="flex items-center">
            <Link
              href={""}
              className="text-sm text-neutral-500 underline hover:text-blue-800"
            >
              {songName}
            </Link>
            {altSongName && (
              <>
                <span className="px-1">,</span>
                <Link
                  href={""}
                  className="text-sm text-neutral-500 underline hover:text-blue-800"
                >
                  {altSongName}
                </Link>
              </>
            )}
          </div>
          <p>Artist</p>
          <Link
            href={""}
            className="text-sm text-neutral-500 underline hover:text-blue-800"
          >
            {artist}
          </Link>
          {album && (
            <>
              <p>Album</p>
              <Link
                href={""}
                className="text-sm text-neutral-500 underline hover:text-blue-800"
              >
                {album}
              </Link>
            </>
          )}
          <hr className="mt-3" />
          <div className="pt-1">
            <div className="flex items-center">
              <p>Original Key</p>
              <p className="px-1 pb-1">:</p>
              <p className="text-sm text-neutral-500">{originalKey} Major</p>
            </div>
            <div className="flex items-center">
              <p>Original Key</p>
              <p className="px-1 pb-1">:</p>
              <p className="text-sm text-neutral-500">{originalKey} Major</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[75%]">
        <h1 className="pb-1 text-2xl font-semibold">{songName}</h1>
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
          <p className="text-neutral-500">{lyrics}</p>
        </div>
      </div>
    </div>
  );
};

export default Song;

Song.getLayout = function getLayout(page: ReactElement) {
  return <DirLayout>{page}</DirLayout>;
};
