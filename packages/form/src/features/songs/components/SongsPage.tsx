import React from "react";

import Layout from "@/layouts/Layout";

import SongFormModal from "./SongFormModal";
import SongsPageHeader from "./SongsPageHeader";
import SongsPagination from "./SongsPagination";
import SongsSearchFiltersSection from "./SongsSearchFiltersSection";
import SongsSection from "./SongsSection";

import { useSongs } from "../hooks/useSongs";

const SongsPage = () => {
  const {
    songs,
    artists,
    albums,
    loading,
    isModalOpen,
    editingSong,
    youtubeUrl,
    setYoutubeUrl,
    extracting,
    formData,
    setFormData,
    imageSearchQuery,
    setImageSearchQuery,
    imageResults,
    searchingImages,
    selectedImage,
    searchQuery,
    setSearchQuery,
    selectedArtistFilter,
    setSelectedArtistFilter,
    selectedAlbumFilter,
    setSelectedAlbumFilter,
    selectedKeyFilter,
    setSelectedKeyFilter,
    selectedLanguageFilter,
    setSelectedLanguageFilter,
    isFiltersOpen,
    setIsFiltersOpen,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    artistOptions,
    albumOptions,
    keyOptions,
    languageOptions,
    filteredSongs,
    pagedSongs,
    totalPages,
    safeCurrentPage,
    showingStart,
    showingEnd,
    openCreateModal,
    closeModal,
    handleEdit,
    handleSubmit,
    handleDelete,
    clearFilters,
    selectImage,
    searchSpotifyImages,
    extractYoutubeInfo,
  } = useSongs();

  if (loading) {
    return (
      <Layout title="Songs | Song Bank Admin">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-lg text-text-secondary">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Songs | Song Bank Admin">
      <div className="mx-auto flex w-full flex-col items-center justify-center bg-bg-tertiary p-10">
        <div className="w-full max-w-6xl">
          <SongsPageHeader
            songCount={songs.length}
            onAddSong={openCreateModal}
          />
          <section className="space-y-6 overflow-hidden">
            <SongsSearchFiltersSection
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              isFiltersOpen={isFiltersOpen}
              onToggleFilters={() => setIsFiltersOpen((current) => !current)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              artistOptions={artistOptions}
              albumOptions={albumOptions}
              keyOptions={keyOptions}
              languageOptions={languageOptions}
              selectedArtistFilter={selectedArtistFilter}
              onSelectedArtistFilterChange={setSelectedArtistFilter}
              onSelectedAlbumFilterChange={setSelectedAlbumFilter}
              selectedAlbumFilter={selectedAlbumFilter}
              selectedKeyFilter={selectedKeyFilter}
              onSelectedKeyFilterChange={setSelectedKeyFilter}
              selectedLanguageFilter={selectedLanguageFilter}
              onSelectedLanguageFilterChange={setSelectedLanguageFilter}
              onClearFilters={clearFilters}
            />
            <SongsSection
              viewMode={viewMode}
              songs={pagedSongs}
              artists={artists}
              albums={albums}
              showingStart={showingStart}
              showingEnd={showingEnd}
              filteredSongsLength={filteredSongs.length}
              onEditSong={handleEdit}
              onDeleteSong={handleDelete}
            />
            <SongsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              safeCurrentPage={safeCurrentPage}
              onPageChange={setCurrentPage}
            />
          </section>
          <SongFormModal
            isOpen={isModalOpen}
            editingSong={editingSong}
            onClose={closeModal}
            onSubmit={handleSubmit}
            youtubeUrl={youtubeUrl}
            onYoutubeUrlChange={setYoutubeUrl}
            extracting={extracting}
            onExtractYoutubeInfo={extractYoutubeInfo}
            formData={formData}
            onFormDataChange={setFormData}
            artists={artists}
            albums={albums}
            imageSearchQuery={imageSearchQuery}
            onImageSearchQueryChange={setImageSearchQuery}
            imageResults={imageResults}
            searchingImages={searchingImages}
            selectedImage={selectedImage}
            onSelectImage={selectImage}
            onSearchSpotifyImages={searchSpotifyImages}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SongsPage;
