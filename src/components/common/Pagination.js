import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getPaginationRange } from '../../utils/getPaginationRange';
import './Pagination.css';

/**
 * Unified LIMS pagination — ellipsis page numbers, optional items-per-page bar.
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  showPageNumbers = true,
  showItemsPerPage = false,
  showSummary = true,
  position = 'bottom',
  className = '',
  disabled = false,
}) => {
  const showNav = showPageNumbers && totalPages > 1;
  const showBar = showItemsPerPage || (showSummary && totalItems != null);

  if (!showNav && !showBar) return null;

  const pages = getPaginationRange(currentPage, totalPages);

  const handleChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages && !disabled) {
      onPageChange(page);
    }
  };

  return (
    <div
      className={`lims-pagination lims-pagination--${position}${className ? ` ${className}` : ''}`}
      role="navigation"
      aria-label="Pagination"
    >
      {showBar && (
        <div className="lims-pagination-meta">
          {showSummary && totalItems != null && startIndex != null && endIndex != null && (
            <span className="lims-pagination-count">
              Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems}
            </span>
          )}
          {showSummary && totalItems != null && startIndex == null && (
            <span className="lims-pagination-count">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </span>
          )}
          {showItemsPerPage && onItemsPerPageChange && (
            <label className="lims-pagination-per-page">
              <span>Rows per page</span>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                disabled={disabled}
              >
                {itemsPerPageOptions.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      {showNav && (
        <div className="lims-pagination-nav">
          <button
            type="button"
            className="lims-pagination-btn lims-pagination-btn--nav"
            onClick={() => handleChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            aria-label="Previous page"
          >
            <FaChevronLeft size={12} aria-hidden />
            <span>Previous</span>
          </button>

          <div className="lims-pagination-pages">
            {pages.map((page, idx) =>
              page === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="lims-pagination-ellipsis" aria-hidden>
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  className={`lims-pagination-btn lims-pagination-btn--page${
                    page === currentPage ? ' is-active' : ''
                  }`}
                  onClick={() => handleChange(page)}
                  disabled={disabled}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            className="lims-pagination-btn lims-pagination-btn--nav"
            onClick={() => handleChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            aria-label="Next page"
          >
            <span>Next</span>
            <FaChevronRight size={12} aria-hidden />
          </button>
        </div>
      )}

      {showNav && showSummary && (
        <span className="lims-pagination-summary">
          Page {currentPage} of {totalPages}
        </span>
      )}
    </div>
  );
};

export default Pagination;
