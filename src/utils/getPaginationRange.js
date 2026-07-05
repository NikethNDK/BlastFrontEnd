/**
 * Returns page numbers with ellipsis markers for compact pagination.
 * e.g. [1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]
 */
export function getPaginationRange(currentPage, totalPages, siblingCount = 1) {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(2, currentPage - siblingCount);
  const right = Math.min(totalPages - 1, currentPage + siblingCount);
  const items = [1];

  if (left > 2) {
    items.push('ellipsis');
  } else {
    for (let i = 2; i < left; i += 1) items.push(i);
  }

  for (let i = left; i <= right; i += 1) {
    items.push(i);
  }

  if (right < totalPages - 1) {
    items.push('ellipsis');
  } else {
    for (let i = right + 1; i < totalPages; i += 1) items.push(i);
  }

  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items;
}

export default getPaginationRange;
