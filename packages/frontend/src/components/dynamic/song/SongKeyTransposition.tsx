import React from "react";

interface SongKeyTranspositionProps {
  originalKey?: string | null;
  selectedKey: string | null | undefined;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
}

const SongKeyTransposition: React.FC<SongKeyTranspositionProps> = ({
  selectedKey,
  setSelectedKey,
}) => {
  const keys = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  return (
    <div className="rounded-lg border-2 p-3">
      <h1 className="pb-4 font-semibold">Transpose Key</h1>
      <div className="grid grid-cols-6 gap-2 md:grid-cols-12 md:grid-cols-6 lg:grid-cols-12">
        {keys.map((key, i) => {
          return (
            <button
              key={i}
              className={`${
                selectedKey === key ? "bg-[#f1f1f2]" : "hover:bg-[#f9f9fa]"
              } h-[35px] rounded border text-sm`}
              onClick={() => setSelectedKey(key)}
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SongKeyTransposition;
