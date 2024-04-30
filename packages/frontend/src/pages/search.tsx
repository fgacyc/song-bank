import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import SearchBar from "@/components/search/SearchBar";
import Layout from "@/components/layout/Layout";
import { type Song } from "@prisma/client";
import SearchFilterTags from "@/components/search/SearchFilterTags";
import SearchBand from "@/components/search/SearchBand";
import SearchAlbum from "@/components/search/SearchAlbum";
import SearchSongList from "@/components/search/SearchSongList";
import SearchAlbumList from "@/components/search/SearchAlbumList";
import SearchLoading from "@/components/search/SearchLoading";

const Search = () => {
  const [mounted, setMounted] = useState(false);
  const [songList, setSongList] = useState<Song[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<Song[]>([]);
  const [showBand, setShowBand] = useState<boolean | undefined>(false);
  const [showAlbum, setShowAlbum] = useState<boolean | undefined>(false);
  const [channelProfile, setChannelProfile] = useState("");
  const [searchString, setSearchString] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const searchSong = async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(async (res) => {
          await res
            .json()
            .then((result: Song[]) => {
              setSongList(result);
              setIsLoading(false);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    };

    void searchSong();
    setSearchString(localStorage.getItem("song-search") ?? "");
    localStorage.removeItem("song-search");
  }, [mounted]);

  useEffect(() => {
    const apiKey = "AIzaSyACcxuHB_5vduPISTHPH5XjJNlZWjSd8R4";

    const getYoutubeVideoId = (youtubeUrl: string | null | undefined) => {
      const regex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
      const match = youtubeUrl?.match(regex);
      return match ? match[1] : null;
    };

    void (async () => {
      const videoId = getYoutubeVideoId(
        filteredSongList[0]?.original_youtube_url,
      );
      await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`,
        { method: "GET" },
      ).then(async (res) => {
        await res.json().then((result) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const channelId = result.items[0]?.snippet.channelId;
          if (channelId) {
            void (async () => {
              await fetch(
                `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`,
                { method: "GET" },
              ).then(async (res) => {
                await res.json().then((result) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  const channelProfile: string =
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    result.items[0]?.snippet.thumbnails.high.url;
                  setChannelProfile(channelProfile);
                  setIsLoading(false);
                });
              });
            })();
          }
        });
      });
    })();
  }, [filteredSongList]);

  // useMemo(() => {
  //   const test = songList.filter((items) => {
  //     const matchingLyrics = items.chord_lyrics
  //       ?.toLowerCase()
  //       .replace(/\[.*?\]|\n| /g, " ")
  //       .includes(searchString.toLowerCase().trim());
  //     return matchingLyrics;
  //   });

  //   console.log(test);
  // }, [songList, searchString]);

  useMemo(() => {
    const filteredSongListWithoutFilterTags = songList.filter((items) => {
      const songName = items.name?.concat(
        " ",
        items.alt_name ? items.alt_name : "",
      );
      const matchingSongName = songName!
        .toLowerCase()
        .replace(/[', ]/g, "")
        .includes(searchString.toLowerCase().replace(/[', ]/g, ""));
      const matchingBand = items
        .original_band!.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, ""));
      const matchingAlbum = items.album
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, ""));
      const matchingLyrics =
        items
          .chord_lyrics!.toLowerCase()
          .replace(/\[.*?\]|\n| /g, " ")
          .includes(searchString.toLowerCase().trim()) &&
        items
          .chord_lyrics!.toLowerCase()
          .replace(/\[.*?\]|\n| /g, " ")
          .split(" ")
          .filter(
            (word) => word && searchString.toLowerCase().trim().includes(word),
          );
      return (
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        matchingSongName || matchingBand || matchingAlbum || matchingLyrics
      );
    });

    let filteredSongList = filteredSongListWithoutFilterTags;
    if (selectedKey && selectedLanguage) {
      filteredSongList = filteredSongListWithoutFilterTags.filter((items) => {
        return (
          items.original_key?.toString().toLowerCase().trim() ===
            selectedKey.toString().toLowerCase() &&
          items.song_language
            ?.toString()
            .toLowerCase()
            .trim()
            .includes(selectedLanguage.toString().toLowerCase())
        );
      });
    } else if (selectedKey && !selectedLanguage) {
      filteredSongList = filteredSongListWithoutFilterTags.filter((items) => {
        return (
          items.original_key?.toString().toLowerCase().trim() ===
          selectedKey.toString().toLowerCase()
        );
      });
    } else if (!selectedKey && selectedLanguage) {
      filteredSongList = filteredSongListWithoutFilterTags.filter((items) => {
        return items.song_language
          ?.toString()
          .toLowerCase()
          .trim()
          .includes(selectedLanguage.toString().toLowerCase());
      });
    }
    setFilteredSongList(filteredSongList);

    const showBand =
      searchString.trim() !== "" &&
      filteredSongList[0]?.original_band
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, "")) &&
      filteredSongList.every(
        (items, _, array) => items.original_band === array[0]?.original_band,
      );
    setShowBand(showBand);
    const showAlbum =
      searchString.trim() !== "" &&
      filteredSongList[0]?.album
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, "")) &&
      filteredSongList.every(
        (items, _, array) => items.album === array[0]?.album,
      );
    setShowAlbum(showAlbum);
  }, [songList, searchString, selectedKey, selectedLanguage]);

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };
  return (
    <>
      <div className="sticky top-[70px] z-10 justify-between border-b bg-white p-3 sm:flex sm:px-5 md:flex lg:flex">
        <div className="z-20 flex items-center justify-between gap-4">
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <SearchFilterTags
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
      </div>
      {isLoading ? (
        <SearchLoading />
      ) : (
        <div className="flex gap-5 sm:h-fit sm:p-5">
          <div className="flex w-full flex-col gap-3">
            <SearchBand
              showBand={showBand}
              searchString={searchString}
              songList={songList}
              filteredSongList={filteredSongList}
              channelProfile={channelProfile}
            />
            <SearchAlbum
              showAlbum={showAlbum}
              searchString={searchString}
              songList={songList}
              filteredSongList={filteredSongList}
            />
            <SearchSongList
              showBand={showBand}
              showAlbum={showAlbum}
              filteredSongList={filteredSongList}
              getYoutubeVideoId={getYoutubeVideoId}
              searchString={searchString}
            />
          </div>
          <SearchAlbumList
            showBand={showBand}
            searchString={searchString}
            songList={songList}
            filteredSongList={filteredSongList}
          />
        </div>
      )}
    </>
  );
};

export default Search;

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
