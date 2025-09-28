import React, { useState, useMemo } from 'react';
import { Table, Button, Badge, Dropdown, Form } from 'react-bootstrap';
import { FaChevronUp, FaChevronDown, FaEllipsisV, FaEye, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import './EnhancedTable.css';

const EnhancedTable = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  onSort,
  onFilter,
  onEdit,
  onDelete,
  onView,
  onExport,
  pagination = true,
  pageSize = 10,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  searchable = true,
  searchPlaceholder = 'Search...',
  sortable = true,
  selectable = false,
  onRowSelect,
  onSelectAll,
  actions = [],
  className = '',
  striped = true,
  hover = true,
  bordered = true,
  responsive = true,
  size = 'md',
  emptyMessage = 'No data available',
  showHeader = true,
  stickyHeader = false,
  maxHeight = '500px'
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm && searchable) {
      filtered = data.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key && sortable) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, searchable, sortable, columns]);

  // Reset to first page when data changes or search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, data]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = processedData.slice(startIndex, endIndex);
    
    
    return paginated;
  }, [processedData, currentPage, pageSize, pagination]);

  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    if (onSort) onSort(key, direction);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRowSelect = (row, isSelected) => {
    if (!selectable) return;
    
    let newSelectedRows;
    if (isSelected) {
      newSelectedRows = [...selectedRows, row];
    } else {
      newSelectedRows = selectedRows.filter(r => r.id !== row.id);
    }
    
    setSelectedRows(newSelectedRows);
    if (onRowSelect) onRowSelect(newSelectedRows);
  };

  const handleSelectAll = (isSelected) => {
    if (!selectable) return;
    
    const newSelectedRows = isSelected ? [...paginatedData] : [];
    setSelectedRows(newSelectedRows);
    if (onSelectAll) onSelectAll(newSelectedRows);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />;
  };

  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    
    if (column.type === 'badge') {
      const value = row[column.key];
      const variant = column.badgeVariant || 'primary';
      return <Badge bg={variant}>{value}</Badge>;
    }
    
    if (column.type === 'date') {
      const date = new Date(row[column.key]);
      return date.toLocaleDateString();
    }
    
    if (column.type === 'boolean') {
      return row[column.key] ? 'Yes' : 'No';
    }
    
    return row[column.key] || '-';
  };

  const renderActions = (row) => {
    if (actions.length === 0) return null;
    
    return (
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm" className="action-toggle">
          <FaEllipsisV size={16} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {actions.map((action, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => action.onClick(row)}
              className={action.variant ? `text-${action.variant}` : ''}
            >
              {action.icon && <span className="me-2">{action.icon}</span>}
              {action.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  if (loading) {
    return (
      <div className="enhanced-table-container">
        <LoadingSpinner size="large" text="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="enhanced-table-container">
        <div className="error-message">
          <h5>Error loading data</h5>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`enhanced-table-container ${className}`}>
      {/* Search and Controls */}
      {searchable && (
        <div className="table-controls">
          <div className="search-control">
            <Form.Control
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              size={size}
              className="search-input"
            />
          </div>
          {onExport && (
            <Button
              variant="outline-primary"
              size={size}
              onClick={() => onExport(processedData)}
              className="export-btn"
            >
              <FaDownload size={16} className="me-1" />
              Export
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper" style={{ maxHeight: stickyHeader ? maxHeight : 'none' }}>
        <Table
          striped={striped}
          hover={hover}
          bordered={bordered}
          responsive={responsive}
          size={size}
          className={`enhanced-table ${stickyHeader ? 'sticky-header' : ''}`}
        >
          {showHeader && (
            <thead>
              <tr>
                {selectable && (
                  <th className="select-column">
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`${column.sortable !== false && sortable ? 'sortable' : ''} ${column.className || ''}`}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                    style={{ cursor: column.sortable !== false && sortable ? 'pointer' : 'default', ...column.headerStyle }}
                  >
                    <div className="th-content">
                      <span>{column.title}</span>
                      {column.sortable !== false && sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="actions-column">Actions</th>
                )}
              </tr>
            </thead>
          )}
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="text-center py-4">
                  <div className="empty-state">
                    <p className="text-muted mb-0">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={row.id || index} className={row.className || ''}>
                  {selectable && (
                    <td className="select-column">
                      <Form.Check
                        type="checkbox"
                        checked={selectedRows.some(r => r.id === row.id)}
                        onChange={(e) => handleRowSelect(row, e.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={column.className || ''}
                      style={column.cellStyle}
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="actions-column">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && processedData.length > pageSize && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(processedData.length / pageSize)}
            onPageChange={onPageChange}
            size={size}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedTable;
