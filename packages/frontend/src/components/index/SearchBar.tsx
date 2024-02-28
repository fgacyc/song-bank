import React, { useState } from "react";
import Image from "next/image";
import { RiSearch2Line } from "react-icons/ri";
import { useRouter } from "next/router";

interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({ inputRef }) => {
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  const handleOnSubmit = async () => {
    if (searchString.trim() != "") {
      try {
        await router.push({
          pathname: "/search",
          query: { q: searchString.trim() },
        });
      } catch (error) {
        console.error("Error handleOnSubmit:", error);
      }
    }
  };
  return (
    <form
      className="w-dvh flex h-[50dvh] flex-col items-center justify-end"
      onSubmit={(e) => {
        e.preventDefault();
        handleOnSubmit().catch((error) => {
          console.error("Error handleOnSubmit:", error);
        });
      }}
    >
      <div className="flex flex-col items-center justify-end">
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
            className="w-[350px] ps-2"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
