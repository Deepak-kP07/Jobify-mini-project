import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function PageBtnContainer({ currentPage, numOfPages }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Don't show pagination if there's only one page or no pages
  if (numOfPages <= 1) return null;

  const pages = Array.from({ length: numOfPages }, (_, i) => i + 1);

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };

  const addPageButton = ({ page, activeClass }) => {
    return (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`w-10 h-10 rounded-md font-semibold transition-colors duration-200 ${
          activeClass
            ? "bg-[#2EB0BC] text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
        }`}
      >
        {page}
      </button>
    );
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    // First page
    pageButtons.push(addPageButton({ page: 1, activeClass: currentPage === 1 }));

    // Dots before current page
    if (currentPage > 3) {
      pageButtons.push(
        <span key="dots-1" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // Pages around current page
    if (currentPage !== 1 && currentPage !== 2) {
      pageButtons.push(
        addPageButton({ page: currentPage - 1, activeClass: false })
      );
    }
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageButtons.push(
        addPageButton({ page: currentPage, activeClass: true })
      );
    }
    if (currentPage !== numOfPages && currentPage !== numOfPages - 1) {
      pageButtons.push(
        addPageButton({ page: currentPage + 1, activeClass: false })
      );
    }

    // Dots after current page
    if (currentPage < numOfPages - 2) {
      pageButtons.push(
        <span key="dots-2" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // Last page
    if (numOfPages > 1) {
      pageButtons.push(
        addPageButton({ page: numOfPages, activeClass: currentPage === numOfPages })
      );
    }

    return pageButtons;
  };

  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < numOfPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-8 flex items-center justify-end gap-2 flex-wrap">
      {/* Previous Button */}
      <button
        onClick={prevPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2 ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">{renderPageButtons()}</div>

      {/* Next Button */}
      <button
        onClick={nextPage}
        disabled={currentPage === numOfPages}
        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2 ${
          currentPage === numOfPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

