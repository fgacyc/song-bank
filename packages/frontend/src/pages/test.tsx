import { spotifyService } from "@/features/spotify/services/spotifyService";
import { useState } from "react";

export default function Test() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    const data = await spotifyService.search(query, "track");
    console.log("Spotify raw response:", data);

    const tracks = data.tracks?.items || [];
    const images = tracks.map((t: any) => ({
      name: t.name,
      artist: t.artists[0]?.name,
      cover: t.album.images[0]?.url,
    }));

    console.table(images);
    setResults(images);
  };

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">Spotify Search Test</h1>

      <input
        type="text"
        placeholder="Search song (e.g. Blinding Lights)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-80 rounded-md border p-2"
      />

      <button
        onClick={handleSearch}
        className="rounded-md bg-green-600 px-4 py-2 text-white"
      >
        Search
      </button>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {results?.map((r: any, i: number) => (
          <div key={i} className="rounded-md border p-2">
            <img
              src={r.cover}
              alt={r.name}
              className="h-40 w-full rounded-md object-cover"
            />
            <h3 className="mt-2 font-semibold">{r.cover}</h3>
            <p className="text-sm text-gray-500">{r.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
