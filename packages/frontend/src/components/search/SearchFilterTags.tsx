import React from "react";

const tags = ["Key", "Language"];

const SearchFilterTags = () => {
  return (
    <div className="hidden gap-3 truncate ps-1 sm:flex">
      {tags.map((tag: string, i) => {
        return (
          <button
            key={i}
            className="rounded border px-2 py-1 text-xs text-neutral-500"
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default SearchFilterTags;
