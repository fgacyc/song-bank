import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Song } from "@prisma/client";
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

  const [songList, setSongList] = useState<Song[]>();
  const [objectOfLanguages, setObjectOfLanguages] =
    useState<{ value: string; label: string }[]>();
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
    const objectOfLanguages = uniqueLanguageList.map((language) => ({
      value: language as string,
      label: language as string,
    }));
    setObjectOfLanguages(objectOfLanguages);
  }, [songList]);

  return (
    <div className="flex min-w-fit gap-3 sm:w-[400px]">
      <Select
        instanceId={"keys"}
        options={objectOfKeys}
        placeholder={<GiGClef />}
        isClearable={true}
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
        options={objectOfLanguages}
        placeholder={<GrLanguage />}
        isClearable={true}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#a1a1a2",
            primary50: "#f1f1f2",
            primary25: "#f8f8f9",
          },
        })}
        value={objectOfLanguages?.find(
          (option) => option.value === selectedLanguage,
        )}
        onChange={(e) => {
          setSelectedLanguage(e?.value ?? null);
        }}
      />
    </div>
  );
};

export default SearchFilterTags;
