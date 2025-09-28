import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Dropdown, Badge, Row, Col } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTimes, FaChevronDown, FaRedo } from 'react-icons/fa';
import './SearchFilter.css';

const SearchFilter = ({
  searchFields = [],
  filterOptions = {},
  onSearch,
  onFilter,
  onClear,
  placeholder = 'Search...',
  showAdvanced = false,
  className = '',
  size = 'md'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    const count = Object.values(selectedFilters).filter(value => 
      value && (Array.isArray(value) ? value.length > 0 : value !== '')
    ).length;
    setActiveFiltersCount(count);
  }, [selectedFilters]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterKey]: value
    };
    setSelectedFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setSearchTerm('');
    onClear();
  };

  const handleClearSingleFilter = (filterKey) => {
    const newFilters = { ...selectedFilters };
    delete newFilters[filterKey];
    setSelectedFilters(newFilters);
    onFilter(newFilters);
  };

  const renderFilterDropdown = (filterKey, options) => {
    const currentValue = selectedFilters[filterKey] || '';
    
    return (
      <Dropdown key={filterKey} className="filter-dropdown">
        <Dropdown.Toggle 
          variant="outline-secondary" 
          size={size}
          className="filter-toggle"
        >
          <FaFilter size={16} />
          {filterKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          {currentValue && (
            <Badge bg="primary" className="ms-1">
              {Array.isArray(currentValue) ? currentValue.length : 1}
            </Badge>
          )}
        </Dropdown.Toggle>
        
        <Dropdown.Menu className="filter-menu">
          <Dropdown.Header>
            <div className="d-flex justify-content-between align-items-center">
              <span>Filter by {filterKey.replace(/_/g, ' ')}</span>
              {currentValue && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-danger"
                  onClick={() => handleClearSingleFilter(filterKey)}
                >
                  <FaTimes size={14} />
                </Button>
              )}
            </div>
          </Dropdown.Header>
          
          {options.map((option) => (
            <Dropdown.Item
              key={option.value}
              onClick={() => handleFilterChange(filterKey, option.value)}
              className={currentValue === option.value ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <div className={`filter-option-indicator ${currentValue === option.value ? 'selected' : ''}`} />
                <span className="ms-2">{option.label}</span>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const renderMultiSelectFilter = (filterKey, options) => {
    const currentValues = selectedFilters[filterKey] || [];
    
    return (
      <Dropdown key={filterKey} className="filter-dropdown">
        <Dropdown.Toggle 
          variant="outline-secondary" 
          size={size}
          className="filter-toggle"
        >
          <FaFilter size={16} />
          {filterKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          {currentValues.length > 0 && (
            <Badge bg="primary" className="ms-1">
              {currentValues.length}
            </Badge>
          )}
        </Dropdown.Toggle>
        
        <Dropdown.Menu className="filter-menu multi-select">
          <Dropdown.Header>
            <div className="d-flex justify-content-between align-items-center">
              <span>Filter by {filterKey.replace(/_/g, ' ')}</span>
              {currentValues.length > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-danger"
                  onClick={() => handleClearSingleFilter(filterKey)}
                >
                  <FaTimes size={14} />
                </Button>
              )}
            </div>
          </Dropdown.Header>
          
          {options.map((option) => {
            const isSelected = currentValues.includes(option.value);
            return (
              <Dropdown.Item
                key={option.value}
                onClick={() => {
                  const newValues = isSelected
                    ? currentValues.filter(v => v !== option.value)
                    : [...currentValues, option.value];
                  handleFilterChange(filterKey, newValues);
                }}
                className={isSelected ? 'active' : ''}
              >
                <div className="d-flex align-items-center">
                  <div className={`filter-option-indicator ${isSelected ? 'selected' : ''}`} />
                  <span className="ms-2">{option.label}</span>
                </div>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <div className={`search-filter-container ${className}`}>
      <Row className="g-2">
        <Col md={showAdvanced ? 6 : 8}>
          <InputGroup size={size}>
            <InputGroup.Text className="search-icon">
              <FaSearch size={16} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
                className="clear-search-btn"
              >
                <FaTimes size={16} />
              </Button>
            )}
          </InputGroup>
        </Col>
        
        <Col md={showAdvanced ? 6 : 4}>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size={size}
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle-btn"
            >
              <FaFilter size={16} />
              <span className="d-none d-sm-inline ms-1">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge bg="primary" className="ms-1">
                  {activeFiltersCount}
                </Badge>
              )}
              <FaChevronDown 
                size={16} 
                className={`ms-1 transition ${showFilters ? 'rotate-180' : ''}`}
              />
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="outline-danger"
                size={size}
                onClick={handleClearFilters}
                className="clear-filters-btn"
                title="Clear all filters"
              >
                <FaRedo size={16} />
                <span className="d-none d-sm-inline ms-1">Clear</span>
              </Button>
            )}
          </div>
        </Col>
      </Row>
      
      {showFilters && (
        <div className="filters-panel">
          <Row className="g-2">
            {Object.entries(filterOptions).map(([filterKey, options]) => (
              <Col key={filterKey} md={6} lg={4}>
                {options.multiSelect 
                  ? renderMultiSelectFilter(filterKey, options.options)
                  : renderFilterDropdown(filterKey, options.options)
                }
              </Col>
            ))}
          </Row>
        </div>
      )}
      
      {activeFiltersCount > 0 && (
        <div className="active-filters">
          <div className="d-flex flex-wrap gap-1">
            {Object.entries(selectedFilters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              const displayValue = Array.isArray(value) 
                ? `${value.length} selected`
                : value;
                
              return (
                <Badge 
                  key={key} 
                  bg="primary" 
                  className="active-filter-badge"
                >
                  {key.replace(/_/g, ' ')}: {displayValue}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 ms-1 text-white"
                    onClick={() => handleClearSingleFilter(key)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
