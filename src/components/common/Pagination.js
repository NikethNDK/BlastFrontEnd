import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  size = 'md',
  variant = 'outline-primary',
  className = '',
  disabled = false
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages && !disabled) {
      onPageChange(page);
    }
  };

  return (
    <div className={`pagination-wrapper ${className}`}>
      <div className="pagination-info">
        <span className="text-muted">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
      <ButtonGroup size={size} className="pagination-buttons">
        {showFirstLast && (
          <Button
            variant={variant}
            onClick={() => handlePageChange(1)}
            disabled={disabled || isFirstPage}
            className="pagination-btn first-btn"
            title="First page"
          >
            <FaAngleDoubleLeft size={16} />
          </Button>
        )}
        
        {showPrevNext && (
          <Button
            variant={variant}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || isFirstPage}
            className="pagination-btn prev-btn"
            title="Previous page"
          >
            <FaChevronLeft size={16} />
          </Button>
        )}
        
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : variant}
            onClick={() => handlePageChange(page)}
            disabled={disabled}
            className={`pagination-btn page-btn ${page === currentPage ? 'active' : ''}`}
            title={`Go to page ${page}`}
          >
            {page}
          </Button>
        ))}
        
        {showPrevNext && (
          <Button
            variant={variant}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || isLastPage}
            className="pagination-btn next-btn"
            title="Next page"
          >
            <FaChevronRight size={16} />
          </Button>
        )}
        
        {showFirstLast && (
          <Button
            variant={variant}
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || isLastPage}
            className="pagination-btn last-btn"
            title="Last page"
          >
            <FaAngleDoubleRight size={16} />
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default Pagination;
