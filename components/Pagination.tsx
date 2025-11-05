import React from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`h-10 w-10 flex items-center justify-center rounded-md font-medium text-sm transition-colors ${
            currentPage === i 
              ? 'bg-[#D4AF37] text-[#0A0A0A]' 
              : 'bg-[#1A1A1A] text-[#F5F5F0] hover:bg-[#D4AF37]/20'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <nav className="flex items-center justify-center space-x-2 mt-12">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="h-10 w-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-[#F5F5F0] disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-[#D4AF37]/20 transition-colors"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      
      {currentPage > 3 && totalPages > 5 && (
        <>
          <button 
            onClick={() => onPageChange(1)} 
            className="h-10 w-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-[#F5F5F0] hover:bg-[#D4AF37]/20 transition-colors text-sm"
          >
            1
          </button>
          <span className="text-gray-500">...</span>
        </>
      )}

      {renderPageNumbers()}

      {currentPage < totalPages - 2 && totalPages > 5 && (
        <>
          <span className="text-gray-500">...</span>
          <button 
            onClick={() => onPageChange(totalPages)} 
            className="h-10 w-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-[#F5F5F0] hover:bg-[#D4AF37]/20 transition-colors text-sm"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="h-10 w-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-[#F5F5F0] disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-[#D4AF37]/20 transition-colors"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Pagination;