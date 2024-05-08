import React, { useEffect, useMemo, useState } from "react";
import { type Tag, type Song, type Favorite } from "@prisma/client";
import Link from "next/link";
import { PiShareNetworkFill, PiShareNetworkThin } from "react-icons/pi";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
// import { FcCancel } from "react-icons/fc";

interface SongDetailsProps {
  embedUrl: string;
  items: Song & { tags: Tag[] };
}

const SongDetails: React.FC<SongDetailsProps> = ({ embedUrl, items }) => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const [favouriteData, setFavouriteData] = useState<Favorite>();
  const [favourite, setFavourite] = useState(false);
  const [share, setShare] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      void (async () => {
        await fetch(`/api/favorite?song_id=${items.id}&user_id=${user.sub}`, {
          method: "GET",
        })
          .then(async (res) => {
            await res
              .json()
              .then((result: Favorite) => {
                setFavouriteData(result);
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => {
            console.error(err);
          });
      })();
    }
  }, [isLoading, user, items.id, favourite]);

  useMemo(() => {
    if (favouriteData) {
      setFavourite(true);
    }
  }, [favouriteData]);

  const handleCreateFavourite = async () => {
    if (!isLoading && user) {
      await fetch("/api/favorite", {
        method: "POST",
        body: JSON.stringify({
          song_id: items.id,
          user_id: user.sub,
        }),
      })
        .then(async () => {
          setFavourite(true);
        })
        .catch((err) => console.error(err));
    } else {
      void router.push("/api/auth/login");
    }
  };

  const handleDeleteFavourite = async () => {
    if (!isLoading && user) {
      await fetch(`/api/favorite?id=${favouriteData?.id}`, {
        method: "DELETE",
      })
        .then(async () => {
          setFavourite(false);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="flex h-fit flex-col rounded-lg border-2 p-5">
      <div className="h-[150px] w-full md:w-[200px] lg:h-[150px] lg:w-[300px]">
        <iframe
          src={embedUrl}
          allowFullScreen
          className="me-5 h-full w-full rounded md:me-0"
        ></iframe>
      </div>
      <div>
        <div className="flex flex-col gap-2 py-3">
          <div className="flex flex-col truncate">
            <h1 className="font-semibold">Song Name</h1>
            <p className="text-sm text-neutral-500">
              {items.name}{" "}
              {items.alt_name &&
                items.alt_name.trim() !== "-" &&
                items.alt_name}
            </p>
          </div>
          {items.album && (
            <div className="flex flex-col truncate">
              <h1 className="font-semibold">Album</h1>
              <Link
                href={`/album/${items.album.toLowerCase().replace(/ /g, "-")}`}
                className="w-fit text-sm text-neutral-500 underline md:no-underline md:hover:underline"
              >
                {items.album}
              </Link>
            </div>
          )}
          <div className="flex flex-col truncate">
            <h1 className="font-semibold">Band</h1>
            <Link
              href={`/band/${items
                .original_band!.toLowerCase()
                .replace(/ /g, "-")}`}
              className="w-fit text-sm text-neutral-500 underline md:no-underline md:hover:underline"
            >
              {items.original_band}
            </Link>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2 py-3">
          <div className="flex flex-col truncate">
            <h1 className="font-semibold">Original Key</h1>
            <p className="text-sm text-neutral-500">{items.original_key}</p>
          </div>
          {items.tags.length > 0 && (
            <div className="flex flex-col gap-2 truncate">
              <h1 className="font-semibold">Others</h1>
              <div className="flex gap-2 text-sm text-neutral-500">
                {items.tags.map((tag, i) => {
                  return (
                    <div
                      key={i}
                      className="w-fit rounded border px-2 py-1 brightness-90"
                      style={{ borderColor: tag.color, color: tag.color }}
                    >
                      {tag.content}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <hr />
        <div className="flex items-center justify-between gap-2 truncate pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (favourite) {
                  await handleDeleteFavourite();
                } else {
                  await handleCreateFavourite();
                }
              }}
              className={`${
                favourite && "border-yellow-500 text-yellow-500"
              } flex h-[30px] items-center justify-center gap-1 rounded border px-2`}
            >
              {favourite ? <FaStar className="text-yellow-400" /> : <CiStar />}
              <p className="text-sm">{favourite ? "Saved" : "Favourite"}</p>
            </button>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                setShare(true);
              }}
              className={`${
                share && "bg-[#f5f5f6]"
              } flex h-[30px] items-center justify-center gap-1 rounded border px-2`}
            >
              {share ? <PiShareNetworkFill /> : <PiShareNetworkThin />}
              <p className="text-sm">{share ? "Link copied" : "Share"}</p>
            </button>
          </div>
          {/* TODO: report button */}
          {/* <button className="flex h-[30px] items-center justify-center gap-1 rounded border border-[#d50000] px-2">
            <FcCancel />
            <p className="text-sm text-[#d50000]">Report</p>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
