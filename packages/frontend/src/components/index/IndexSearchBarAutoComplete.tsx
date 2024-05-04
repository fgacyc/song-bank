import Link from "next/link";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import { type Song } from "@prisma/client";

interface IndexSearchBarAutoCompleteProps {
  showAutoComplete: boolean;
  filteredSongList: Song[] | undefined;
  setShowAutoComplete: Dispatch<SetStateAction<boolean>>;
}

const IndexSearchBarAutoComplete: React.FC<IndexSearchBarAutoCompleteProps> = ({
  showAutoComplete,
  filteredSongList,
  setShowAutoComplete,
}) => {
  const [activeList, setActiveList] = useState(-1);

  return (
    <>
      {/* <div
        className="absolute top-0 border p-5"
        onClick={() => {
          setShowAutoComplete(true);
        }}
        onBlur={() => {
          setShowAutoComplete(false);
        }}
      ></div> */}
      <div
        className={`${
          showAutoComplete ? "block" : "hidden"
        } flex items-center justify-center pt-3`}
      >
        <div className="flex w-[75%] max-w-[390px] flex-col rounded-lg border py-2">
          {filteredSongList?.map((items, i) => {
            return (
              <Link
                key={i}
                href={`/song/${items.name?.toLowerCase().replace(/ /g, "-")}`}
                className={`${
                  activeList === i ? "bg-[#f5f5f6]" : ""
                } px-4 py-2`}
                onMouseOver={() => setActiveList(i)}
                onMouseLeave={() => setActiveList(-1)}
              >
                {items.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default IndexSearchBarAutoComplete;
