# Common Components

This directory contains reusable UI components that provide a consistent and modern user experience across the application.

## Components

### 1. EnhancedTable
A powerful, feature-rich table component with built-in pagination, sorting, searching, and actions.

**Features:**
- ✅ Pagination with customizable page sizes
- ✅ Column sorting (ascending/descending)
- ✅ Global search across all columns
- ✅ Row actions (edit, delete, view, etc.)
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Export functionality
- ✅ Customizable columns and cell rendering
- ✅ Row selection (optional)

**Usage:**
```jsx
import EnhancedTable from '../common/EnhancedTable';

const columns = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    headerStyle: { minWidth: '150px' }
  },
  {
    key: 'status',
    title: 'Status',
    render: (value) => (
      <span className={`badge ${value === 'active' ? 'bg-success' : 'bg-secondary'}`}>
        {value}
      </span>
    )
  }
];

const actions = [
  {
    label: 'Edit',
    icon: <FaEdit size={14} />,
    onClick: (row) => handleEdit(row)
  },
  {
    label: 'Delete',
    icon: <FaTrash size={14} />,
    variant: 'danger',
    onClick: (row) => handleDelete(row)
  }
];

<EnhancedTable
  data={data}
  columns={columns}
  actions={actions}
  loading={loading}
  error={error}
  onSearch={handleSearch}
  onSort={handleSort}
  onExport={handleExport}
  pagination={true}
  pageSize={10}
  currentPage={currentPage}
  onPageChange={handlePageChange}
  searchable={true}
  searchPlaceholder="Search items..."
  sortable={true}
  striped={true}
  hover={true}
  responsive={true}
  emptyMessage="No data found"
/>
```

### 2. Pagination
A modern, accessible pagination component with customizable styling.

**Features:**
- ✅ First/Last page navigation
- ✅ Previous/Next page navigation
- ✅ Page number display with ellipsis
- ✅ Customizable page size
- ✅ Responsive design
- ✅ Accessibility support
- ✅ Loading states

**Usage:**
```jsx
import Pagination from '../common/Pagination';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  showFirstLast={true}
  showPrevNext={true}
  maxVisiblePages={5}
  size="md"
  variant="outline-primary"
/>
```

### 3. LoadingSpinner
A versatile loading spinner component with multiple variants and sizes.

**Features:**
- ✅ Multiple sizes (small, medium, large, xlarge)
- ✅ Multiple colors (primary, secondary, success, warning, danger, info)
- ✅ Full screen overlay option
- ✅ Inline and button spinners
- ✅ Custom text support
- ✅ Accessibility support

**Usage:**
```jsx
import LoadingSpinner, { InlineSpinner, ButtonSpinner } from '../common/LoadingSpinner';

// Basic spinner
<LoadingSpinner size="large" text="Loading data..." />

// Full screen overlay
<LoadingSpinner size="xlarge" text="Processing..." fullScreen />

// Inline spinner
<InlineSpinner size="small" color="primary" />

// Button spinner
<ButtonSpinner size="small" />
```

### 4. SearchFilter
A comprehensive search and filter component with advanced filtering options.

**Features:**
- ✅ Global search input
- ✅ Multiple filter types (dropdown, multi-select)
- ✅ Filter state management
- ✅ Clear filters functionality
- ✅ Active filter display
- ✅ Responsive design
- ✅ Advanced filter panel

**Usage:**
```jsx
import SearchFilter from '../common/SearchFilter';

const filterOptions = {
  status: {
    multiSelect: false,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  category: {
    multiSelect: true,
    options: [
      { value: 'tech', label: 'Technology' },
      { value: 'business', label: 'Business' }
    ]
  }
};

<SearchFilter
  searchFields={['name', 'description']}
  filterOptions={filterOptions}
  onSearch={handleSearch}
  onFilter={handleFilter}
  onClear={handleClearFilters}
  placeholder="Search items..."
  showAdvanced={true}
/>
```

## Design System

All components use a consistent design system with:

- **Colors**: CSS custom properties for primary, secondary, success, warning, danger, and info colors
- **Spacing**: Consistent spacing scale (0.25rem to 6rem)
- **Typography**: Modern font stack with consistent sizing
- **Shadows**: Subtle shadow system for depth
- **Border Radius**: Consistent border radius scale
- **Transitions**: Smooth transitions for better UX
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG compliant with proper focus management

## CSS Custom Properties

The design system uses CSS custom properties defined in `index.css`:

```css
:root {
  --primary-500: #0d6efd;
  --secondary-500: #6c757d;
  --success-500: #198754;
  --warning-500: #ffc107;
  --danger-500: #dc3545;
  --info-500: #0dcaf0;
  
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## Best Practices

1. **Consistent Usage**: Always use these components instead of creating custom table/pagination implementations
2. **Props Validation**: All components include proper prop validation
3. **Accessibility**: Components are built with accessibility in mind
4. **Performance**: Components are optimized for performance with proper memoization
5. **Responsive**: All components work seamlessly across different screen sizes
6. **Customization**: Use CSS custom properties for consistent theming

## Migration Guide

To migrate existing table components to use `EnhancedTable`:

1. **Replace Table Structure**: Replace `<Table>` with `<EnhancedTable>`
2. **Define Columns**: Create a columns array with proper configuration
3. **Define Actions**: Create an actions array for row actions
4. **Update State**: Add pagination and search state management
5. **Update Handlers**: Implement search, sort, and pagination handlers
6. **Remove Custom Styling**: Remove custom table styling in favor of component styling

## Examples

See `ProjectManage.js` for a complete example of how to use these components together.
