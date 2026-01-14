import React from "react";

interface SearchHeroProps {
  total: number;
  query?: string;
}

const SearchHero = ({ total, query }: SearchHeroProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-text-primary">Search Results</h1>
      {query && (
        <p className="mt-2 text-sm text-text-secondary">
          Found {total} result{total !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}
    </div>
  );
};

export default SearchHero;
