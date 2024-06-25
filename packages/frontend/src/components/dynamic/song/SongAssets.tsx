import { type SongType } from "@/pages";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { type FunctionComponent } from "react";
import { FaDownload } from "react-icons/fa";

interface SongAssetsProps {
  song: SongType[];
}

export const SongAssets: FunctionComponent<SongAssetsProps> = ({ song }) => {
  const singleSong = song[0];
  const { user } = useUser();
  const router = useRouter();
  return (
    <div className="rounded-lg border-2 p-5">
      <h1 className="pb-4 font-semibold">Files</h1>

      {/* {keys.map((key, i) => {
          return (
            <button
              key={i}
              className={`${"bg-[#f1f1f2]"} h-[35px] rounded border text-sm`}
            >
              {key}
            </button>
          );
        })} */}

      <table className="w-full border-collapse">
        {singleSong?.ag_link && (
          <tr>
            <td>Acoustic Guitar</td>
            <td>
              <FaDownload
                className="cursor-pointer"
                onClick={() =>
                  user
                    ? window.open(String(singleSong.ag_link))
                    : void router.push("/api/auth/login")
                }
              />
            </td>
          </tr>
        )}
        {singleSong?.eg_link && (
          <tr>
            <td>Electric Guitar</td>
            <td>
              <FaDownload
                className="cursor-pointer"
                onClick={() =>
                  user
                    ? window.open(String(singleSong.eg_link))
                    : void router.push("/api/auth/login")
                }
              />
            </td>
          </tr>
        )}
        {singleSong?.bass_link && (
          <tr>
            <td>Bass Guitar</td>
            <td>
              <FaDownload
                className="cursor-pointer"
                onClick={() =>
                  user
                    ? window.open(String(singleSong.bass_link))
                    : void router.push("/api/auth/login")
                }
              />
            </td>
          </tr>
        )}
        {singleSong?.drum_link && (
          <tr>
            <td>Drum</td>
            <td>
              <FaDownload
                className="cursor-pointer"
                onClick={() =>
                  user
                    ? window.open(String(singleSong.drum_link))
                    : void router.push("/api/auth/login")
                }
              />
            </td>
          </tr>
        )}
        {singleSong?.main_key_link && (
          <tr>
            <td>Main Keyboard</td>
            <td>
              <FaDownload
                className="cursor-pointer"
                onClick={() =>
                  user
                    ? window.open(String(singleSong.main_key_link))
                    : void router.push("/api/auth/login")
                }
              />
            </td>
          </tr>
        )}
        {singleSong?.sub_key_link && (
          <tr>
            <td>2nd Keyboard</td>
            <td>
              <FaDownload
                className="cursor-pointer"
                onClick={() =>
                  user
                    ? window.open(String(singleSong.sub_key_link))
                    : void router.push("/api/auth/login")
                }
              />
            </td>
          </tr>
        )}
        {singleSong?.file_sec_voice && (
          <tr>
            <td>2nd Voice</td>
            <td>
              <FaDownload
                className="cursor-pointer"
                onClick={() =>
                  user
                    ? window.open(String(singleSong.file_sec_voice))
                    : void router.push("/api/auth/login")
                }
              />
            </td>
          </tr>
        )}
        {singleSong?.file_sequencer && (
          <tr>
            <td>Sequencer</td>
            <td>
              <FaDownload
                className="cursor-pointer"
                onClick={() =>
                  user
                    ? window.open(String(singleSong.file_sequencer[0]?.url))
                    : void router.push("/api/auth/login")
                }
              />
            </td>
          </tr>
        )}
        {false && (
          <tr>
            <td>Dance Steps</td>
            <td>
              <FaDownload className="cursor-pointer" />
            </td>
          </tr>
        )}
      </table>
    </div>
  );
};
