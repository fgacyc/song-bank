import { type UserProfile } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import React from "react";

interface ProfileUserInfoProps {
  user: UserProfile | undefined;
}

const ProfileUserInfo: React.FC<ProfileUserInfoProps> = ({ user }) => {
  return (
    <div className="flex gap-3">
      <div
        className={`${
          !user && "border"
        } relative h-[60px] w-[60px] overflow-hidden rounded-full`}
      >
        {user && (
          <Image
            src={user?.picture ?? ""}
            alt={user?.name ?? "pfp"}
            fill={true}
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-lg font-bold">{user?.name}</h1>
        <p className="text-xs text-neutral-500">{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfileUserInfo;
