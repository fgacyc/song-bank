import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

import Button from "@/features/shared/components/ui/Button";

import { getPageWindow } from "../utils/pagination";

interface ArtistsPaginationProps {
  currentPage: number;
  totalPages: number;
  safeCurrentPage: number;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}

const ArtistsPagination = ({
  currentPage,
  totalPages,
  safeCurrentPage,
  onPageChange,
}: ArtistsPaginationProps) => {
  return (
    <div className="rounded-2xl border bg-bg-primary px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-xs text-text-secondary">
          Page {totalPages === 0 ? 0 : safeCurrentPage} of {totalPages}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || totalPages === 0}
            className="gap-2 text-xs"
          >
            <FiChevronsLeft className="h-3 w-3" />
            First
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1 || totalPages === 0}
            className="gap-2 text-xs"
          >
            <FiChevronLeft className="h-3 w-3" />
            Previous
          </Button>

          {getPageWindow(safeCurrentPage, totalPages).map((pageNumber) => (
            <Button
              key={pageNumber}
              type="button"
              variant={pageNumber === safeCurrentPage ? "primary" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              disabled={totalPages === 0}
              className="min-w-9 px-3 text-xs"
            >
              {pageNumber}
            </Button>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onPageChange((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage >= totalPages || totalPages === 0}
            className="gap-2 text-xs"
          >
            Next
            <FiChevronRight className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="gap-2 text-xs"
          >
            Last
            <FiChevronsRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistsPagination;
