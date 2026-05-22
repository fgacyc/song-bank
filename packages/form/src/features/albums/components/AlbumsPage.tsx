import React from "react";

import Layout from "@/layouts/Layout";

import AlbumFormModal from "./AlbumFormModal";
import AlbumsPageHeader from "./AlbumsPageHeader";
import AlbumsPagination from "./AlbumsPagination";
import AlbumsSearchFiltersSection from "./AlbumsSearchFiltersSection";
import AlbumsSection from "./AlbumsSection";

import { useAlbums } from "../hooks/useAlbums";

const AlbumsPage = () => {
  const {
    albums,
    artists,
    loading,
    isModalOpen,
    editingAlbum,
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
    selectedReleaseYearFilter,
    setSelectedReleaseYearFilter,
    isFiltersOpen,
    setIsFiltersOpen,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    artistOptions,
    releaseYearOptions,
    filteredAlbums,
    pagedAlbums,
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
  } = useAlbums();

  if (loading) {
    return (
      <Layout title="Albums | Song Bank Admin">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-lg text-text-secondary">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Albums | Song Bank Admin">
      <div className="mx-auto flex w-full flex-col items-center justify-center bg-bg-tertiary p-10">
        <div className="w-full max-w-6xl">
          <AlbumsPageHeader
            albumCount={albums.length}
            onAddAlbum={openCreateModal}
          />
          <section className="space-y-6 overflow-hidden">
            <AlbumsSearchFiltersSection
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              isFiltersOpen={isFiltersOpen}
              onToggleFilters={() => setIsFiltersOpen((current) => !current)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              artistOptions={artistOptions}
              selectedArtistFilter={selectedArtistFilter}
              onSelectedArtistFilterChange={setSelectedArtistFilter}
              releaseYearOptions={releaseYearOptions}
              selectedReleaseYearFilter={selectedReleaseYearFilter}
              onSelectedReleaseYearFilterChange={setSelectedReleaseYearFilter}
              onClearFilters={clearFilters}
            />
            <AlbumsSection
              viewMode={viewMode}
              albums={pagedAlbums}
              artists={artists}
              showingStart={showingStart}
              showingEnd={showingEnd}
              filteredAlbumsLength={filteredAlbums.length}
              onEditAlbum={handleEdit}
              onDeleteAlbum={handleDelete}
            />
            <AlbumsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              safeCurrentPage={safeCurrentPage}
              onPageChange={setCurrentPage}
            />
          </section>
          <AlbumFormModal
            isOpen={isModalOpen}
            editingAlbum={editingAlbum}
            onClose={closeModal}
            onSubmit={handleSubmit}
            formData={formData}
            onFormDataChange={setFormData}
            artists={artists}
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

export default AlbumsPage;
