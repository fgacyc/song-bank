import MainLayout from "@/layouts/MainLayout";
import {
  type SearchFilters,
  SearchResults,
  useSearch,
} from "@/features/search";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Search = () => {
  const router = useRouter();
  const {
    search,
    isLoading,
    songs,
    albums,
    artists,
    total,
    error,
    hasMore,
    loadMore,
  } = useSearch();
  const { query, language, keySignature, date } = router.query;

  useEffect(() => {
    void (async () => {
      if (router.isReady && query) {
        const filters: SearchFilters = {
          query: query as string,
        };

        if (language && language !== "all")
          filters.language = language as string;
        if (keySignature && keySignature !== "all")
          filters.keySignature = keySignature as string;
        if (date) filters.date = date as string;

        await search(filters);
      }
    })();
  }, [router.isReady, query, language, keySignature, date, search]);

  const hasResults =
    songs.length > 0 || albums.length > 0 || artists.length > 0;

  return (
    <SearchResults
      songs={songs}
      albums={albums}
      artists={artists}
      query={query as string}
      isLoading={isLoading}
      error={error}
      hasResults={hasResults}
      total={total}
      hasMore={hasMore}
      onLoadMore={loadMore}
    />
  );
};

Search.getLayout = (page: React.ReactElement) => {
  return (
    <MainLayout title="Search | FGA Worship - Song Bank">{page}</MainLayout>
  );
};

export default Search;
