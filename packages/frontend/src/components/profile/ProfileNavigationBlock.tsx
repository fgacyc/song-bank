import { useRouter } from "next/router";
import React, { type ReactElement } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface ProfileNavigationBlockProps {
  children: ReactElement;
  link: string;
  name: string;
  logout?: boolean;
}

const ProfileNavigationBlock: React.FC<ProfileNavigationBlockProps> = ({
  children,
  link,
  name,
  logout,
}) => {
  const router = useRouter();
  return (
    <button
      className="flex h-[40px] w-full items-center justify-between px-3 hover:bg-[#f8f8f9]"
      onClick={() => {
        if (link.includes("http")) {
          window.open(link);
        } else {
          void router.push(link);
        }
      }}
    >
      <div className="flex items-center justify-center gap-3">
        <div className={`${logout && "text-red-500"} text-lg`}>{children}</div>
        <p>{name}</p>
      </div>
      <IoIosArrowForward className="text-neutral-400" />
    </button>
  );
};

export default ProfileNavigationBlock;
