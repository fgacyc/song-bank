import Image from "next/image";
import React from "react";

const SongBox = () => (
  <div>
    <div className="border p-10"></div>
    <h3>Song name</h3>
    <p>Band & album</p>
  </div>
);

const ProfileSearchHistory = () => {
  return (
    <div className="border">
      <h1 className="text-lg font-semibold">Recent Search</h1>
      <div className="flex">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        {[...Array(3)].map((_, i) => {
          return <SongBox key={i} />;
        })}
      </div>
    </div>
  );
};

export default ProfileSearchHistory;
