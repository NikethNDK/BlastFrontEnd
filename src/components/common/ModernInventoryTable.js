import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Badge, 
  Dropdown, 
  Form, 
  Card,
  Row,
  Col,
  InputGroup
} from 'react-bootstrap';
import { 
  FaChevronUp, 
  FaChevronDown, 
  FaEllipsisV, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaDownload,
  FaSearch,
  FaFilter,
  FaSort,
  FaPlus
} from 'react-icons/fa';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import './ModernInventoryTable.css';

const ModernInventoryTable = ({
  data = [],
  columns = [],
  keyField = 'id',
  loading = false,
  error = null,
  onSort,
  onSearch,
  onFilter,
  pagination = true,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  searchable = true,
  searchPlaceholder = 'Search inventory...',
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
  emptyMessage = "No inventory items found.",
  onExport,
  onAdd,
  title = "Inventory Items",
  subtitle = "Manage your laboratory inventory",
  size = 'md'
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
    onPageChange && onPageChange(1);
  }, [searchTerm, data]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage, pageSize, pagination]);

  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    onSort && onSort(key, direction);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch && onSearch(value);
  };

  const handleRowSelect = (row, checked) => {
    if (checked) {
      setSelectedRows(prev => [...prev, row]);
    } else {
      setSelectedRows(prev => prev.filter(r => r[keyField] !== row[keyField]));
    }
    onRowSelect && onRowSelect(row, checked);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(paginatedData);
    } else {
      setSelectedRows([]);
    }
    onSelectAll && onSelectAll(checked);
  };

  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    return row[column.key];
  };

  const renderActions = (row) => {
    return (
      <div className="modern-table-actions">
        {actions.map((action, index) => {
          if (action.condition && !action.condition(row)) return null;
          
          return (
            <Button
              key={index}
              variant={action.variant || 'outline-primary'}
              size="sm"
              className="modern-table-action-btn"
              onClick={() => action.onClick(row)}
              title={action.label}
            >
              {action.icon}
            </Button>
          );
        })}
      </div>
    );
  };

  const totalPages = Math.ceil(processedData.length / pageSize);

  return (
    <div className={`modern-inventory-table ${className}`}>
      {/* Header */}
      <Card className="modern-table-header">
        <Card.Header className="modern-table-header-content">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="modern-table-title-section">
                <h4 className="modern-table-title">{title}</h4>
                <p className="modern-table-subtitle">{subtitle}</p>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <div className="modern-table-actions-header">
                {onAdd && (
                  <Button
                    variant="primary"
                    className="modern-table-add-btn"
                    onClick={onAdd}
                  >
                    <FaPlus className="me-2" />
                    Add Item
                  </Button>
                )}
                {onExport && (
                  <Button
                    variant="outline-primary"
                    className="modern-table-export-btn"
                    onClick={() => onExport(processedData)}
                  >
                    <FaDownload className="me-2" />
                    Export
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="modern-table-body">
          {/* Search and Filter Bar */}
          {searchable && (
            <Row className="mb-4">
              <Col md={8}>
                <div className="modern-table-search">
                  <FaSearch className="modern-table-search-icon" />
                  <Form.Control
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="modern-table-search-input"
                  />
                </div>
              </Col>
              <Col md={4} className="text-end">
                <div className="modern-table-filters">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="modern-table-filter-btn"
                    onClick={() => {
                      setSearchTerm('');
                      setSortConfig({ key: null, direction: 'asc' });
                    }}
                  >
                    <FaFilter className="me-1" />
                    Clear
                  </Button>
                </div>
              </Col>
            </Row>
          )}

          {/* Loading State */}
          {loading && (
            <LoadingSpinner message="Loading inventory items..." />
          )}

          {/* Error State */}
          {error && (
            <div className="modern-table-error">
              <div className="alert alert-danger">
                {error}
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <>
              <div className="modern-table-container">
                <Table 
                  striped={striped} 
                  hover={hover} 
                  bordered={bordered} 
                  responsive={responsive}
                  className="modern-table"
                >
                  <thead className="modern-table-header">
                    <tr>
                      {selectable && (
                        <th className="modern-table-select-column">
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
                          className={`modern-table-header-cell ${sortable ? 'sortable' : ''}`}
                          style={column.headerStyle}
                          onClick={() => sortable && handleSort(column.key)}
                        >
                          <div className="modern-table-header-content">
                            <span>{column.title}</span>
                            {sortable && (
                              <div className="modern-table-sort-icons">
                                <FaChevronUp 
                                  className={`modern-table-sort-icon ${
                                    sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'active' : ''
                                  }`}
                                />
                                <FaChevronDown 
                                  className={`modern-table-sort-icon ${
                                    sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'active' : ''
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                      {actions.length > 0 && (
                        <th className="modern-table-actions-column">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="modern-table-body">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="modern-table-empty">
                          <div className="modern-table-empty-content">
                            <FaSearch size={48} className="modern-table-empty-icon" />
                            <h5 className="modern-table-empty-title">No items found</h5>
                            <p className="modern-table-empty-message">{emptyMessage}</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((row, index) => (
                        <tr key={row[keyField] || index} className="modern-table-row">
                          {selectable && (
                            <td className="modern-table-select-column">
                              <Form.Check
                                type="checkbox"
                                checked={selectedRows.some(r => r[keyField] === row[keyField])}
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
                            <td className="modern-table-actions-column">
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
              {pagination && totalPages > 1 && (
                <div className="modern-table-pagination">
                  <div className="modern-table-pagination-info">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} items
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    size={size}
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ModernInventoryTable;
