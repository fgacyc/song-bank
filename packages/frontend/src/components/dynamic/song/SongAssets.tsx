import { type SongType } from "@/pages";
import { type FunctionComponent } from "react";
import SongDownloadBlock from "./SongDownloadBlock";

interface SongAssetsProps {
  song: SongType[];
}

export const SongAssets: FunctionComponent<SongAssetsProps> = ({ song }) => {
  const singleSong = song[0];

  return (
    <div className="rounded-lg border-2 p-5">
      <h1 className="pb-4 font-semibold">Files</h1>
      <div className="flex w-full border-collapse flex-col gap-2">
        <SongDownloadBlock
          asset_data={singleSong?.ag_link}
          asset_name="Acoustic Guitar"
        />
        <SongDownloadBlock
          asset_data={singleSong?.eg_link}
          asset_name="Electric Guitar"
        />
        <SongDownloadBlock
          asset_data={singleSong?.bass_link}
          asset_name="Bass Guitar"
        />
        <SongDownloadBlock
          asset_data={singleSong?.drum_link}
          asset_name="Drum"
        />
        <SongDownloadBlock
          asset_data={singleSong?.main_key_link}
          asset_name="Main Keyboard"
        />
        <SongDownloadBlock
          asset_data={singleSong?.sub_key_link}
          asset_name="Subordinate Keyboard"
        />
        <SongDownloadBlock
          asset_data={singleSong?.file_sec_voice}
          asset_name="Second Voice"
        />
        <SongDownloadBlock
          asset_data={singleSong?.file_sequencer}
          asset_name="Sequencer"
        />
        {/* <SongDownloadBlock
          asset_data={singleSong?.dance_steps}
          asset_name="Dance Steps"
        /> */}
      </div>
    </div>
  );
};
