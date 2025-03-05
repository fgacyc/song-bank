import React, {
  type Dispatch,
  type SetStateAction,
  // useMemo,
  // useState,
} from "react";
// import { type Song } from "@prisma/client";
import { GiGClef } from "react-icons/gi";
import { GrLanguage } from "react-icons/gr";
import Select from "react-select";

interface SearchFilterTagsProps {
  selectedKey: string | null;
  setSelectedKey: Dispatch<SetStateAction<string | null>>;
  selectedLanguage: string | null;
  setSelectedLanguage: Dispatch<SetStateAction<string | null>>;
}

const SearchFilterTags: React.FC<SearchFilterTagsProps> = ({
  selectedKey,
  setSelectedKey,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const keys = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const objectOfKeys = keys.map((key) => ({
    value: key,
    label: key,
  }));

  const languages = [
    { value: "EN", label: "EN" },
    { value: "BM", label: "BM" },
    { value: "CHI", label: "CHI" },
  ];

  return (
    <div className="flex min-w-fit gap-2">
      <Select
        instanceId={"keys"}
        options={objectOfKeys}
        placeholder={<GiGClef className="text-sm md:text-base lg:text-lg" />}
        isClearable={true}
        aria-label="Select key"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#a1a1a2",
            primary50: "#f1f1f2",
            primary25: "#f8f8f9",
          },
        })}
        value={objectOfKeys.find((option) => option.value === selectedKey)}
        onChange={(e) => {
          setSelectedKey(e?.value ?? null);
        }}
      />
      <Select
        instanceId={"languages"}
        options={languages}
        placeholder={<GrLanguage className="text-sm md:text-base lg:text-lg" />}
        isClearable={true}
        aria-label="Select language"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#a1a1a2",
            primary50: "#f1f1f2",
            primary25: "#f8f8f9",
          },
        })}
        value={languages.find((option) => option.value === selectedLanguage)}
        onChange={(e) => {
          setSelectedLanguage(e?.value ?? null);
        }}
      />
    </div>
  );
};

export default SearchFilterTags;
