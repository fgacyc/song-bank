export const ITEMS_PER_PAGE = 10;

export const getPageWindow = (currentPage: number, totalPages: number) => {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const windowSize = 4;
  const maxStart = Math.max(1, totalPages - windowSize + 1);
  const startPage = Math.min(
    maxStart,
    Math.max(1, currentPage - Math.floor(windowSize / 2)),
  );

  return Array.from({ length: windowSize }, (_, index) => startPage + index);
};
