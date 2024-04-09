import React, { useState } from "react";
import Image from "next/image";
import { RiSearch2Line } from "react-icons/ri";
import { useRouter } from "next/router";

interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ inputRef, setIsLoading }) => {
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  const [inputWidth, setInputWidth] = useState(
    "sm:w-[220px] md:w-[220px] lg:w-[220px]",
  );

  const handleOnSubmit = async () => {
    if (searchString.trim() != "") {
      setIsLoading(true);
      localStorage.setItem("song-search", searchString.trim());
      await router.push("/search");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex h-[50dvh] w-full flex-col items-center justify-end">
      <form
        className="flex flex-col items-center justify-end"
        onSubmit={(e) => {
          e.preventDefault();
          handleOnSubmit().catch((err) => {
            console.error(err);
          });
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
            type="text"
            placeholder="Search"
            className={`${inputWidth} ps-2 duration-500`}
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
            onFocus={() => {
              setInputWidth("sm:w-[390px] md:w-[390px] lg:w-[390px]");
            }}
            onBlur={() => {
              setInputWidth("sm:w-[220px] md:w-[220px] lg:w-[220px]");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
