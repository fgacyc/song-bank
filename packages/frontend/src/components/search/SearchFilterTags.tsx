import React, { useEffect, useMemo, useState } from "react";
import { type Song } from "@prisma/client";
import { GiGClef } from "react-icons/gi";
import { GrLanguage } from "react-icons/gr";
// import Select from "node_modules/react-select/dist/declarations/src/Select";
import Select from "react-select";

const SearchFilterTags = () => {
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
  // const keys = [
  //   // { value: "C", label: "C" },
  //   // { value: "C#", label: "C#" },
  //   // { value: "D", label: "D" },
  //   // { value: "D#", label: "D#" },
  //   // { value: "E", label: "E" },
  //   // { value: "F", label: "F" },
  //   // { value: "F#", label: "F#" },
  //   // { value: "G", label: "G" },
  //   // { value: "G#", label: "G#" },
  //   // { value: "A", label: "A" },
  //   // { value: "A#", label: "A#" },
  //   // { value: "B", label: "B" },
  // ];
  const objectOfKeys = keys.map((key) => ({
    value: key.toLowerCase(),
    label: key,
  }));

  const [songList, setSongList] = useState<Song[]>();
  const [uniqueLanguageList, setUniqueLanguageList] = useState([""]);

  useEffect(() => {
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(async (res) => {
          await res
            .json()
            .then((result: Song[]) => {
              setSongList(result);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    })();
  }, []);

  useMemo(() => {
    const uniqueLanguageSet = new Set();
    songList?.forEach((items) => {
      if (items.song_language && !items.song_language.includes("+")) {
        uniqueLanguageSet.add(items.song_language);
      } else if (items.song_language?.includes("+")) {
        items.song_language
          .split(" + ")
          .forEach((language: string) => uniqueLanguageSet.add(language));
      }
    });
    const uniqueLanguageList = [...uniqueLanguageSet];
    setUniqueLanguageList(uniqueLanguageList as string[]);
  }, [songList]);

  return (
    <div className="flex min-w-fit gap-3 sm:w-[400px]">
      <Select
        options={objectOfKeys}
        placeholder={<GiGClef />}
        isClearable={true}
      />
      <Select
        options={uniqueLanguageList.map((language) => ({
          value: language.toLowerCase(),
          label: language,
        }))}
        placeholder={<GrLanguage />}
        isClearable={true}
      />
    </div>
  );
};

export default SearchFilterTags;
