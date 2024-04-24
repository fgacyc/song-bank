import React, { type RefObject, useState } from "react";
import Image from "next/image";
import { RiSearch2Line } from "react-icons/ri";
import { useRouter } from "next/router";

type SearchBarProps = {
  inputRef: RefObject<HTMLInputElement>;
};

const SearchBar: React.FC<SearchBarProps> = ({ inputRef }) => {
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  const [inputWidth, setInputWidth] = useState(
    "sm:w-[220px] md:w-[220px] lg:w-[220px]",
  );

  return (
    <div className="flex h-[50dvh] w-full flex-col items-center justify-end">
      <form
        className="flex flex-col items-center justify-end"
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
        <div className="flex items-center justify-center rounded-full border px-3 py-1">
          <RiSearch2Line />
          <input
            ref={inputRef}
            autoFocus
            placeholder="Search"
            className={`${inputWidth} ps-2 duration-500`}
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
              localStorage.setItem("song-search", e.target.value.trim());
            }}
            onFocus={() => {
              setInputWidth("sm:w-[390px] md:w-[390px] lg:w-[390px]");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
