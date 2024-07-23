import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoCloudDownload, IoCloudDownloadOutline } from "react-icons/io5";

interface SongDownloadBlockProps {
  assetData?: string | null;
  assetName: string;
}

const SongDownloadBlock: React.FC<SongDownloadBlockProps> = ({
  assetData,
  assetName,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {assetData && (
        <button
          onClick={() =>
            user
              ? window.open(String(assetData))
              : void router.push("/api/auth/login")
          }
          onMouseOver={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
          className="flex rounded-md border text-neutral-500 hover:bg-[#f9f9fa]"
        >
          <div className="flex h-[40px] w-full items-center ps-3">
            {assetName}
          </div>
          <div className="flex h-[40px] w-[50px] items-center justify-center">
            {isActive ? (
              <IoCloudDownload className="h-5 w-5" />
            ) : (
              <IoCloudDownloadOutline className="h-5 w-5" />
            )}
          </div>
        </button>
      )}
    </>
  );
};

export default SongDownloadBlock;
