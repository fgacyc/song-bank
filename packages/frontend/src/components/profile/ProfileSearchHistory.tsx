import React from "react";

const SongBox = () => (
  <div>
    <div className="rounded-lg border px-16 py-10"></div>
    <h1 className="text-sm font-semibold">Song name</h1>
    <p className="text-xs text-neutral-500">Band & album</p>
  </div>
);

const ProfileSearchHistory = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">Recent search</h1>
      <div className="flex gap-5 overflow-scroll">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        {[...Array(10)].map((_, i) => {
          return <SongBox key={i} />;
        })}
      </div>
    </div>
  );
};

export default ProfileSearchHistory;
