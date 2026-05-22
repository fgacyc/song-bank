import React from "react";

import Layout from "@/layouts/Layout";

import ArtistFormModal from "./ArtistFormModal";
import ArtistsPageHeader from "./ArtistsPageHeader";
import ArtistsPagination from "./ArtistsPagination";
import ArtistsSearchFiltersSection from "./ArtistsSearchFiltersSection";
import ArtistsSection from "./ArtistsSection";

import { useArtists } from "../hooks/useArtists";

const ArtistsPage = () => {
  const {
    artists,
    filteredArtists,
    pagedArtists,
    totalPages,
    safeCurrentPage,
    showingStart,
    showingEnd,
    currentPage,
    setCurrentPage,
    loading,
    isModalOpen,
    editingArtist,
    formData,
    setFormData,
    imageSearchQuery,
    setImageSearchQuery,
    imageResults,
    searchingImages,
    selectedImage,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    openCreateModal,
    closeModal,
    handleEdit,
    handleSubmit,
    handleDelete,
    selectImage,
    searchSpotifyImages,
  } = useArtists();

  if (loading) {
    return (
      <Layout title="Artists | Song Bank Admin">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-lg text-text-secondary">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Artists | Song Bank Admin">
      <div className="mx-auto flex w-full flex-col items-center justify-center bg-bg-tertiary p-10">
        <div className="w-full max-w-6xl">
          <ArtistsPageHeader
            artistCount={artists.length}
            onAddArtist={openCreateModal}
          />

          <section className="space-y-6 overflow-hidden">
            <ArtistsSearchFiltersSection
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <ArtistsSection
              viewMode={viewMode}
              artists={pagedArtists}
              filteredArtistsLength={filteredArtists.length}
              showingStart={showingStart}
              showingEnd={showingEnd}
              onEditArtist={handleEdit}
              onDeleteArtist={handleDelete}
            />
            <ArtistsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              safeCurrentPage={safeCurrentPage}
              onPageChange={setCurrentPage}
            />
          </section>

          <ArtistFormModal
            isOpen={isModalOpen}
            editingArtist={editingArtist}
            onClose={closeModal}
            onSubmit={handleSubmit}
            formData={formData}
            onFormDataChange={setFormData}
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

export default ArtistsPage;
