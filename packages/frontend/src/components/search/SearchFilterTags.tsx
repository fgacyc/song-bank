import React, { useEffect, useMemo, useState } from "react";
import { type Song } from "@prisma/client";
import { GiGClef } from "react-icons/gi";
import { GrLanguage } from "react-icons/gr";
// import Select from "react-select";

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
    <div className="flex min-w-fit gap-3 truncate sm:w-[400px]">
      <select className="rounded border">
        <option value="">{/* <GiGClef /> */}</option>
        {keys.map((key, i) => {
          return (
            <option key={i} value={key.toLowerCase()}>
              {key}
            </option>
          );
        })}
      </select>

      <select className="rounded border">
        <option value="">{/* <GrLanguage /> */}</option>
        {uniqueLanguageList.map((language, i) => {
          return (
            <option key={i} value={language.toLowerCase()}>
              {language}
            </option>
          );
        })}
      </select>
      {/* <Select placeholder={<GiGClef />} />
      <Select placeholder={<GrLanguage />} /> */}
    </div>
  );
};

export default SearchFilterTags;
