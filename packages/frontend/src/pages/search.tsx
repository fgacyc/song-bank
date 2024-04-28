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
import SearchLyrics from "@/components/search/SearchLyrics";
import SearchAlbumList from "@/components/search/SearchAlbumList";

const Search = () => {
  const [mounted, setMounted] = useState(false);
  const [songList, setSongList] = useState<Song[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<Song[]>([]);
  const [filteredSongListByLyrics, setFilteredSongListByLyrics] = useState<
    Song[]
  >([]);
  const [showBand, setShowBand] = useState<boolean | undefined>(false);
  const [showAlbum, setShowAlbum] = useState<boolean | undefined>(false);
  const [showLyrics, setShowLyrics] = useState<boolean | undefined>(false);
  const [channelProfile, setChannelProfile] = useState("");
  const [searchString, setSearchString] = useState("");
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

  useMemo(() => {
    const filteredSongList = songList.filter((items) => {
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
      return matchingSongName || matchingBand || matchingAlbum;
    });
    setFilteredSongList(filteredSongList);

    // TODO: lyrics
    const filteredSongListByLyrics = songList.filter((items) => {
      return items
        .chord_lyrics!.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, ""));
    });
    setFilteredSongListByLyrics(filteredSongListByLyrics);

    const showBand =
      filteredSongList[0]?.original_band
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, "")) &&
      filteredSongList.every(
        (items, _, array) => items.original_band === array[0]?.original_band,
      );
    setShowBand(showBand);
    const showAlbum =
      filteredSongList[0]?.album
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, "")) &&
      filteredSongList.every(
        (items, _, array) => items.album === array[0]?.album,
      );
    setShowAlbum(showAlbum);

    // TODO: lyrics
    if (filteredSongList.length === 0 && filteredSongListByLyrics.length > 0) {
      setShowLyrics(true);
    } else {
      setShowLyrics(false);
    }
  }, [songList, searchString]);

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };
  if (isLoading) {
  } else
    return (
      <>
        <div className="sticky top-[70px] z-10 justify-between border-b bg-white p-3 sm:flex md:flex lg:flex">
          <div className="flex items-center gap-3">
            <SearchBar
              searchString={searchString}
              setSearchString={setSearchString}
            />
            <SearchFilterTags />
          </div>
        </div>

        <div className="flex gap-5 sm:p-5">
          <div className="flex w-full flex-col gap-3">
            <SearchBand
              showBand={showBand}
              filteredSongList={filteredSongList}
              channelProfile={channelProfile}
            />
            <SearchAlbum
              showAlbum={showAlbum}
              filteredSongList={filteredSongList}
            />
            <SearchSongList
              showBand={showBand}
              showAlbum={showAlbum}
              filteredSongList={filteredSongList}
              getYoutubeVideoId={getYoutubeVideoId}
            />
            {/* <SearchLyrics /> */}
            {showLyrics &&
              filteredSongListByLyrics.map((items, i) => {
                return <div key={i}>{items.chord_lyrics}</div>;
              })}
          </div>
          <SearchAlbumList
            showBand={showBand}
            filteredSongList={filteredSongList}
          />
        </div>
      </>
    );
};

export default Search;

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
