import { useState } from "react";

type SearchType = "track" | "album" | "artist";

interface SearchResult {
  name: string;
  artist?: string;
  cover: string;
  type: SearchType;
}

export default function Test() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("track");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Mock data for testing when Spotify API is not available
  const mockData: Record<SearchType, SearchResult[]> = {
    track: [
      {
        name: "Blinding Lights",
        artist: "The Weeknd",
        cover:
          "https://i.scdn.co/image/ab67616d0000b273c98fdb5197b69d02e6e8df83",
        type: "track",
      },
      {
        name: "Shape of You",
        artist: "Ed Sheeran",
        cover:
          "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        type: "track",
      },
      {
        name: "Bohemian Rhapsody",
        artist: "Queen",
        cover:
          "https://i.scdn.co/image/ab67616d0000b273e319baafd16e84f0408af2a0",
        type: "track",
      },
    ],
    album: [
      {
        name: "Abbey Road",
        artist: "The Beatles",
        cover:
          "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25",
        type: "album",
      },
      {
        name: "Dark Side of the Moon",
        artist: "Pink Floyd",
        cover:
          "https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe",
        type: "album",
      },
      {
        name: "Thriller",
        artist: "Michael Jackson",
        cover:
          "https://i.scdn.co/image/ab67616d0000b2734121faee8df82c526cbab2be",
        type: "album",
      },
    ],
    artist: [
      {
        name: "Taylor Swift",
        cover:
          "https://i.scdn.co/image/ab67616100005174859e4c14fa59296c8649e0e4",
        type: "artist",
      },
      {
        name: "Drake",
        cover:
          "https://i.scdn.co/image/ab6761610000517440b5c07ab77b6b1a9075fdc0",
        type: "artist",
      },
      {
        name: "The Beatles",
        cover:
          "https://i.scdn.co/image/ab6761610000517410ff90057d6cc0c8c4d2496c",
        type: "artist",
      },
    ],
  };

  const handleMockSearch = () => {
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const mockResults = mockData[searchType].filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.artist?.toLowerCase().includes(query.toLowerCase()),
      );

      setResults(
        mockResults.length > 0 ? mockResults : mockData[searchType].slice(0, 3),
      );
      setLoading(false);
    }, 500);
  };

  const handleRealSearch = async () => {
    setLoading(true);
    setResults([]);

    try {
      console.log(`Searching Spotify for ${searchType}: "${query}"`);

      if (searchType === "track") {
        // For tracks, we need to search and get the raw Spotify data
        const data = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=6`,
          {
            headers: {
              Authorization: `Bearer ${await getSpotifyToken()}`,
            },
          },
        );

        if (data.ok) {
          const spotifyResponse = await data.json();
          const tracks = spotifyResponse.tracks?.items || [];
          const trackResults: SearchResult[] = tracks.map((track: any) => ({
            name: track.name,
            artist: track.artists?.[0]?.name,
            cover: track.album?.images?.[0]?.url || "",
            type: "track",
          }));
          setResults(trackResults);
        }
      } else if (searchType === "album") {
        // Search for albums
        const data = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=6`,
          {
            headers: {
              Authorization: `Bearer ${await getSpotifyToken()}`,
            },
          },
        );

        if (data.ok) {
          const spotifyResponse = await data.json();
          const albums = spotifyResponse.albums?.items || [];
          const albumResults: SearchResult[] = albums.map((album: any) => ({
            name: album.name,
            artist: album.artists?.[0]?.name,
            cover: album.images?.[0]?.url || "",
            type: "album",
          }));
          setResults(albumResults);
        }
      } else if (searchType === "artist") {
        // Search for artists
        const data = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=6`,
          {
            headers: {
              Authorization: `Bearer ${await getSpotifyToken()}`,
            },
          },
        );

        if (data.ok) {
          const spotifyResponse = await data.json();
          const artists = spotifyResponse.artists?.items || [];
          const artistResults: SearchResult[] = artists.map((artist: any) => ({
            name: artist.name,
            cover: artist.images?.[0]?.url || "",
            type: "artist",
          }));
          setResults(artistResults);
        }
      }
    } catch (error) {
      console.error("Spotify search error:", error);
      // Fallback to mock data on error
      handleMockSearch();
    }

    setLoading(false);
  };

  const getSpotifyToken = async (): Promise<string> => {
    try {
      const response = await fetch("/api/spotify/token");
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Failed to get Spotify token:", error);
      throw error;
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    if (useMockData) {
      handleMockSearch();
    } else {
      handleRealSearch();
    }
  };

  const loadSampleData = (type: SearchType) => {
    setSearchType(type);
    setResults(mockData[type]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Spotify Cover Image Search Test</h1>

        {/* Search Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Type:</label>
          <div className="flex gap-2">
            {(["track", "album", "artist"] as SearchType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`rounded-md px-3 py-1 text-sm capitalize ${
                  searchType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Mock Data Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="mockData"
            checked={useMockData}
            onChange={(e) => setUseMockData(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="mockData" className="text-sm">
            Use Mock Data (when Spotify API is unavailable)
          </label>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Search ${searchType} (e.g. ${
              searchType === "track"
                ? "Blinding Lights"
                : searchType === "album"
                  ? "Abbey Road"
                  : "The Beatles"
            })`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 rounded-md border border-gray-300 p-2 text-black"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Sample Data Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Test:</label>
          <div className="flex gap-2">
            <button
              onClick={() => loadSampleData("track")}
              className="rounded-md bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
            >
              Load Sample Songs
            </button>
            <button
              onClick={() => loadSampleData("album")}
              className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
            >
              Load Sample Albums
            </button>
            <button
              onClick={() => loadSampleData("artist")}
              className="rounded-md bg-pink-600 px-3 py-1 text-sm text-white hover:bg-pink-700"
            >
              Load Sample Artists
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {results.length > 0 && (
        <div className="text-sm text-gray-600">
          Found {results.length} {searchType}
          {results.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Searching Spotify...</div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result, i) => (
          <div
            key={i}
            className="space-y-2 rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="relative">
              <img
                src={result.cover || "/carousel-1.jpg"}
                alt={result.name}
                className="aspect-square w-full rounded-md object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/carousel-1.jpg";
                }}
              />
              <div className="absolute right-2 top-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs text-white ${
                    result.type === "track"
                      ? "bg-green-500"
                      : result.type === "album"
                        ? "bg-blue-500"
                        : "bg-purple-500"
                  }`}
                >
                  {result.type}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="line-clamp-1 font-semibold text-gray-900">
                {result.name}
              </h3>
              {result.artist && (
                <p className="line-clamp-1 text-sm text-gray-600">
                  {result.artist}
                </p>
              )}
              <p className="break-all text-xs text-gray-400">
                {result.cover ? new URL(result.cover).hostname : "No image"}
              </p>
            </div>

            {/* Copy URL Button */}
            {result.cover && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.cover);
                  alert("Image URL copied!");
                }}
                className="w-full rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
              >
                Copy Image URL
              </button>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {!loading && results.length === 0 && query && (
        <div className="py-8 text-center text-gray-500">
          No {searchType}s found for "{query}". Try a different search term.
        </div>
      )}

      {/* Debug Info */}
      <details className="space-y-2 rounded-md bg-gray-50 p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Debug Info
        </summary>
        <div className="space-y-2 text-xs">
          <div>
            <strong>Search Type:</strong> {searchType}
          </div>
          <div>
            <strong>Query:</strong> {query}
          </div>
          <div>
            <strong>Using Mock Data:</strong> {useMockData ? "Yes" : "No"}
          </div>
          <div>
            <strong>Results Count:</strong> {results.length}
          </div>
          <div>
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </div>
        </div>
      </details>
    </div>
  );
}
