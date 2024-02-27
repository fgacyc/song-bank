import React from "react";
import Image from "next/image";
import { RiSearch2Line } from "react-icons/ri";

interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({ inputRef }) => {
  return (
    <div className="w-dvh flex h-dvh flex-col items-center justify-center">
      <div className="flex h-[300px] flex-col items-center">
        <Image
          src={"/img/logo.png"}
          alt="logo"
          width={100}
          height={100}
          className="pb-10"
        />
        <div className="flex items-center justify-center rounded-full border px-3 py-1">
          <RiSearch2Line />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            className="w-[350px] ps-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
