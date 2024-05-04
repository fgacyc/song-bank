import React, { type Dispatch, type SetStateAction, useRef } from "react";
import Image from "next/image";
import { RiSearch2Line } from "react-icons/ri";
import { useRouter } from "next/router";

interface IndexSearchBarProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  setShowAutoComplete: Dispatch<SetStateAction<boolean>>;
}

const IndexSearchBar: React.FC<IndexSearchBarProps> = ({
  searchString,
  setSearchString,
  setShowAutoComplete,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

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
          className="flex w-[75%] max-w-[390px] items-center justify-center rounded-full border px-3 py-1 duration-500"
          onClick={() => {
            inputRef?.current?.focus();
          }}
        >
          <RiSearch2Line />
          <input
            ref={inputRef}
            autoFocus
            placeholder="Search songs..."
            className="w-full ps-2"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
              localStorage.setItem("song-search", e.target.value.trim());
              setShowAutoComplete(true);
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default IndexSearchBar;
