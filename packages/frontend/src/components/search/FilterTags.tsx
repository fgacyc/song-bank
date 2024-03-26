import React from "react";

const tags = ["Title only", "Album only", "Artist only"];

const FilterTags = () => {
  return (
    <div className="flex gap-3 ps-1 ">
      {tags.map((tag, i) => (
        <button key={i} className="rounded border p-1 text-xs text-neutral-500">
          {tag}
        </button>
      ))}
    </div>
  );
};

export default FilterTags;
