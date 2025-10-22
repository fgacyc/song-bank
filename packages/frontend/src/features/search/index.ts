export { default as SearchBar } from "./components/SearchBar";
export { default as SearchResults } from "./components/SearchResults";
export { default as FilterTag, FilterTags } from "./components/FilterTags";
export { useSearch } from "./hooks/useSearch";
export { searchService } from "./services/searchService";
export type {
  Song,
  SearchFilters,
  SearchResult,
  FilterOption,
  FilterTagProps,
} from "./types";
export {
  LANGUAGE_OPTIONS,
  KEY_SIGNATURE_OPTIONS,
} from "./constants/filterOptions";
