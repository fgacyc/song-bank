import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface FooterProps {
  showPagination?: boolean;
  currentPage?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  hasNextPage?: boolean;
  isLoading?: boolean;
}

const Footer = ({
  showPagination = false,
  currentPage = 1,
  onNextPage,
  onPrevPage,
  hasNextPage = false,
  isLoading = false,
}: FooterProps) => {
  return (
    <div className="fixed bottom-0 flex h-[50px] w-full flex-row items-center justify-evenly border bg-white">
      {showPagination ? (
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="flex items-center gap-1 p-2 disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <IoChevronBack
              size={20}
              className={isLoading ? "animate-pulse" : ""}
            />
          </button>
          <div className="flex items-center gap-3">
            {currentPage > 1 ? (
              <div className="h-[12.5px] w-[12.5px] rounded-full bg-gray-700" />
            ) : (
              <div className="h-[12.5px] w-[12.5px] rounded-full bg-gray-300" />
            )}
            <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-gray-700 p-1 text-xs text-white">
              {currentPage}
            </div>
            {hasNextPage ? (
              <div className="h-[12.5px] w-[12.5px] rounded-full bg-gray-700" />
            ) : (
              <div className="h-[12.5px] w-[12.5px] rounded-full bg-gray-300" />
            )}
          </div>
          <button
            onClick={onNextPage}
            disabled={!hasNextPage || isLoading}
            className="flex items-center gap-1 p-2 disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <IoChevronForward
              size={20}
              className={isLoading ? "animate-pulse" : ""}
            />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Footer;
