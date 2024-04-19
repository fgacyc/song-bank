import React from "react";

const tags = ["Lyrics", "Title", "Album", "Band", "Key", "Language"];

const FilterTags = () => {
  return (
    <div className="hidden gap-3 ps-1 md:flex">
      {tags.map((tag, i) => (
        <button
          key={i}
          className="rounded border px-2 py-1 text-xs text-neutral-500"
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default FilterTags;
