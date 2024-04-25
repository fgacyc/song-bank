import React, { type Dispatch, type SetStateAction } from "react";

interface FilterTagsProps {
  activeTag: string;
  setActiveTag: Dispatch<SetStateAction<string>>;
}

const tags = ["Key", "Language"];

const FilterTags: React.FC<FilterTagsProps> = ({ activeTag, setActiveTag }) => {
  const handleSetActiveTag = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag("");
    } else {
      setActiveTag(tag);
    }
  };

  return (
    <div className="hidden gap-3 truncate ps-1 sm:flex">
      {tags.map((tag: string, i) => {
        return (
          <button
            key={i}
            className={`${
              activeTag === tag ? "bg-neutral-100" : ""
            } rounded border px-2 py-1 text-xs text-neutral-500`}
            onClick={() => handleSetActiveTag(tag)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTags;
