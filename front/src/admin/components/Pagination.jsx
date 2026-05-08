import { MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage } from 'react-icons/md';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      }

      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6 bg-background rounded-none">
      {/* Info */}
      <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest text-lightText text-center sm:text-left">
        <span className="hidden sm:inline">
          Displaying <span className="text-mainText">{startItem}</span> – <span className="text-mainText">{endItem}</span>
          <span className="mx-1.5 sm:mx-2 opacity-30">|</span>
        </span>
        Total <span className="text-primary font-black">{totalItems}</span> Records
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* First Page - Hidden on mobile */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden md:flex p-2 sm:p-2.5 rounded-none border border-border bg-white text-mainText hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-mainText transition-all shadow-sm active:scale-95"
          title="First Page"
        >
          <MdFirstPage size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 sm:p-2.5 rounded-none border border-border bg-white text-mainText hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-mainText transition-all shadow-sm active:scale-95"
          title="Previous Page"
        >
          <MdChevronLeft size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Page Numbers - Desktop only */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5 mx-1 lg:mx-2">
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="w-8 lg:w-10 text-center text-lightText/40 font-black text-xs">
                ···
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 lg:w-10 lg:h-10 rounded-none text-[11px] lg:text-xs font-black transition-all flex items-center justify-center shadow-sm active:scale-90 ${currentPage === page
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110 z-10'
                    : 'bg-white border border-border text-mainText hover:border-primary hover:text-primary'
                  }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Mobile & Tablet: Current Page Display */}
        <div className="md:hidden px-4 sm:px-6 py-2 sm:py-2.5 bg-mainBG border border-border rounded-none shadow-inner">
          <span className="text-[11px] sm:text-xs font-black text-mainText tracking-wider sm:tracking-widest uppercase">
            {currentPage} <span className="opacity-30 mx-0.5 sm:mx-1">/</span> {totalPages}
          </span>
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 sm:p-2.5 rounded-none border border-border bg-white text-mainText hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-mainText transition-all shadow-sm active:scale-95"
          title="Next Page"
        >
          <MdChevronRight size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Last Page - Hidden on mobile */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden md:flex p-2 sm:p-2.5 rounded-none border border-border bg-white text-mainText hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-mainText transition-all shadow-sm active:scale-95"
          title="Last Page"
        >
          <MdLastPage size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
