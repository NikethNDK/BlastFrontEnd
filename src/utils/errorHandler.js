// Error handling utilities
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  console.error("API Error:", error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error || defaultMessage;
    
    switch (status) {
      case 400:
        return "Bad Request: " + message;
      case 401:
        return "Unauthorized: Please login again";
      case 403:
        return "Forbidden: You don't have permission to perform this action";
      case 404:
        return "Not Found: The requested resource was not found";
      case 500:
        return "Server Error: " + message;
      default:
        return message;
    }
  } else if (error.request) {
    // Network error
    return "Network Error: Please check your internet connection";
  } else {
    // Other error
    return error.message || defaultMessage;
  }
};

export const showErrorToast = (message, toast) => {
  if (toast) {
    toast.error(message);
  } else {
    alert(message);
  }
};

export const showSuccessToast = (message, toast) => {
  if (toast) {
    toast.success(message);
  } else {
    alert(message);
  }
};

export const validateForm = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field} is required`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatDate = (date, format = 'DD-MM-YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  switch (format) {
    case 'DD-MM-YYYY':
      return `${day}-${month}-${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    default:
      return d.toLocaleDateString();
  }
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0.00';
  return parseFloat(amount).toFixed(2);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
