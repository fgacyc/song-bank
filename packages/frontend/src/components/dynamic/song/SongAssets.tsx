import { type SongType } from "@/pages";
import { type FunctionComponent } from "react";
import SongDownloadBlock from "./SongDownloadBlock";

interface SongAssetsProps {
  song?: SongType;
}

export const SongAssets: FunctionComponent<SongAssetsProps> = ({ song }) => {
  return (
    <div className="rounded-lg border-2 p-5">
      <h1 className="pb-4 font-semibold">Files</h1>
      <div className="flex w-full border-collapse flex-col gap-2">
        <SongDownloadBlock
          assetData={song?.ag_link}
          assetName="Acoustic Guitar"
        />
        <SongDownloadBlock
          assetData={song?.eg_link}
          assetName="Electric Guitar"
        />
        <SongDownloadBlock
          assetData={song?.bass_link}
          assetName="Bass Guitar"
        />
        <SongDownloadBlock assetData={song?.drum_link} assetName="Drum" />
        <SongDownloadBlock
          assetData={song?.main_key_link}
          assetName="Main Keyboard"
        />
        <SongDownloadBlock
          assetData={song?.sub_key_link}
          assetName="Subordinate Keyboard"
        />
        <SongDownloadBlock
          assetData={song?.file_sec_voice}
          assetName="Second Voice"
        />
        <SongDownloadBlock
          assetData={song?.file_sequencer[0]?.url}
          assetName="Sequencer"
        />
        {/* <SongDownloadBlock
          assetData={singleSong?.dance_steps}
          assetName="Dance Steps"
        /> */}
      </div>
    </div>
  );
};
