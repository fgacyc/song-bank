import React, { type RefObject, useState } from "react";
import Image from "next/image";
import { RiSearch2Line } from "react-icons/ri";
import { useRouter } from "next/router";

type IndexSearchBarProps = {
  inputRef: RefObject<HTMLInputElement>;
};

const IndexSearchBar: React.FC<IndexSearchBarProps> = ({ inputRef }) => {
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  const [inputWidth, setInputWidth] = useState("max-w-[200px]");

  return (
    <div className="flex h-[50dvh] w-full flex-col items-center justify-end">
      <form
        className="flex w-full flex-col items-center justify-end"
        onSubmit={async (e) => {
          e.preventDefault();
          await router.push("/search");
        }}
      >
        <Image
          src={"/img/logo.png"}
          alt="logo"
          width={100}
          height={100}
          priority={true}
          className="pb-10"
        />
        <div
          className={`${inputWidth} flex w-[75%] items-center justify-center rounded-full border px-3 py-1 duration-500`}
        >
          <RiSearch2Line />
          <input
            ref={inputRef}
            autoFocus
            placeholder="Search"
            className="w-full ps-2"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
              localStorage.setItem("song-search", e.target.value.trim());
            }}
            onFocus={() => {
              setInputWidth("max-w-[390px]");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default IndexSearchBar;
