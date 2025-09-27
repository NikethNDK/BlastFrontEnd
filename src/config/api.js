// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/view_login`,
  REGISTER: `${API_BASE_URL}/add_login/`,
  
  // App Info
  APP_INFO: `${API_BASE_URL}/appinfo/`,
  ADD_APP_INFO: `${API_BASE_URL}/add_appinfo`,
  UPDATE_APP_INFO: (id) => `${API_BASE_URL}/update_appinfo/${id}`,
  DELETE_APP_INFO: (id) => `${API_BASE_URL}/delete_appinfo/${id}`,
  
  // Master Data
  MASTER: `${API_BASE_URL}/master/`,
  ADD_MASTER: `${API_BASE_URL}/add_master/`,
  UPDATE_MASTER: (id) => `${API_BASE_URL}/update_master/${id}`,
  INACTIVE_MASTER: (id) => `${API_BASE_URL}/inactive_master/${id}`,
  
  // Projects
  PROJECTS: `${API_BASE_URL}/project/`,
  ADD_PROJECT: `${API_BASE_URL}/add_project`,
  UPDATE_PROJECT: (id) => `${API_BASE_URL}/update_project/${id}`,
  INACTIVE_PROJECT: (id) => `${API_BASE_URL}/inactive_project/${id}`,
  
  // Inventory
  INVENTORY: `${API_BASE_URL}/inventory/`,
  ADD_INVENTORY: `${API_BASE_URL}/add_inventory`,
  UPDATE_INVENTORY: (id) => `${API_BASE_URL}/update_inventory/${id}`,
  DELETE_INVENTORY: (id) => `${API_BASE_URL}/delete_inventory/${id}`,
  
  // Requests
  REQUESTS: `${API_BASE_URL}/request/`,
  ADD_REQUEST: `${API_BASE_URL}/add_request/`,
  UPDATE_REQUEST: (id) => `${API_BASE_URL}/update_request/${id}`,
  DELETE_REQUEST: (id) => `${API_BASE_URL}/delete_request/${id}`,
  
  // Issues
  ISSUES: `${API_BASE_URL}/issues`,
  ADD_ISSUE: `${API_BASE_URL}/add_issue`,
  
  // Employee Management
  EMPLOYEES: `${API_BASE_URL}/emp/`,
  ADD_EMPLOYEE: `${API_BASE_URL}/add_emp/`,
  UPDATE_EMPLOYEE: (id) => `${API_BASE_URL}/update_emp/${id}`,
  INACTIVE_EMPLOYEE: (id) => `${API_BASE_URL}/inactive_emp/${id}`,
  
  // Item Management
  ITEM_ISSUE: `${API_BASE_URL}/itemissue/`,
  ADD_ITEM_ISSUE: `${API_BASE_URL}/add_itemissue`,
  ADD_ITEM_ISSUE_1: `${API_BASE_URL}/add_itemissue1`,
  
  ITEM_RECEIVE: `${API_BASE_URL}/itemreceive/`,
  ADD_ITEM_RECEIVE: `${API_BASE_URL}/add_itemreceive`,
  ADD_ITEM_RECEIVE_1: `${API_BASE_URL}/add_itemreceive1`,
  
  // Labs
  LABS: `${API_BASE_URL}/labs/`,
  ADD_LAB: `${API_BASE_URL}/lab-add/`,
  UPDATE_LAB: (id) => `${API_BASE_URL}/labs/${id}/`,
  DELETE_LAB: (id) => `${API_BASE_URL}/labs/${id}/delete/`,
  
  // Designations
  DESIGNATIONS: `${API_BASE_URL}/designations/`,
  ADD_DESIGNATION: `${API_BASE_URL}/designations-add/`,
  UPDATE_DESIGNATION: (id) => `${API_BASE_URL}/designations/${id}/`,
  DELETE_DESIGNATION: (id) => `${API_BASE_URL}/designations/${id}/delete/`,
  
  // Master Types
  MASTER_TYPES: `${API_BASE_URL}/master-types/`,
  ADD_MASTER_TYPE: `${API_BASE_URL}/master-types-add/`,
  UPDATE_MASTER_TYPE: (id) => `${API_BASE_URL}/master-types-update/${id}/`,
  DELETE_MASTER_TYPE: (id) => `${API_BASE_URL}/master-types-dlt/${id}/`,
  
  // Locations
  LOCATIONS: `${API_BASE_URL}/locations/`,
  LOCATIONS_LIST: `${API_BASE_URL}/locations-list/`,
  ADD_LOCATION: `${API_BASE_URL}/locations/`,
  UPDATE_LOCATION: (id) => `${API_BASE_URL}/locations/${id}/update/`,
  DELETE_LOCATION: (id) => `${API_BASE_URL}/locations/${id}/delete/`,
  
  // Item Codes
  ITEM_CODES: `${API_BASE_URL}/item-code/create/`,
  ADD_ITEM_CODE: `${API_BASE_URL}/item-code/create/`,
  UPDATE_ITEM_CODE: (id) => `${API_BASE_URL}/item-code/update/${id}/`,
  DELETE_ITEM_CODE: (id) => `${API_BASE_URL}/item-code/delete/${id}/`,
  
  // Entry Types
  ENTRY_TYPES: `${API_BASE_URL}/entry-type/create/`,
  ADD_ENTRY_TYPE: `${API_BASE_URL}/entry-type/create/`,
  UPDATE_ENTRY_TYPE: (id) => `${API_BASE_URL}/entry-type/update/${id}/`,
  DELETE_ENTRY_TYPE: (id) => `${API_BASE_URL}/entry-type/delete/${id}/`,
  
  // Unit Measures
  UNIT_MEASURES: `${API_BASE_URL}/unit-measure/create/`,
  ADD_UNIT_MEASURE: `${API_BASE_URL}/unit-measure/create/`,
  UPDATE_UNIT_MEASURE: (id) => `${API_BASE_URL}/unit-measure/update/${id}/`,
  DELETE_UNIT_MEASURE: (id) => `${API_BASE_URL}/unit-measure/delete/${id}/`,
  
  // Items
  ITEMS: `${API_BASE_URL}/item/create/`,
  ADD_ITEM: `${API_BASE_URL}/item/create/`,
  UPDATE_ITEM: (id) => `${API_BASE_URL}/item/update/${id}/`,
  DELETE_ITEM: (id) => `${API_BASE_URL}/item/delete/${id}/`,
  
  // Roles
  ROLES: `${API_BASE_URL}/role/create/`,
  ADD_ROLE: `${API_BASE_URL}/role/create/`,
  UPDATE_ROLE: (id) => `${API_BASE_URL}/role/update/${id}/`,
  DELETE_ROLE: (id) => `${API_BASE_URL}/role/delete/${id}/`,
  
  // DNA Repository
  DNA: `${API_BASE_URL}/dna`,
  ADD_DNA: `${API_BASE_URL}/add_dna`,
  DELETE_DNA: (id) => `${API_BASE_URL}/delete-dna/${id}/`,
  PARTIAL: `${API_BASE_URL}/view_partial`,
  ADD_PARTIAL: `${API_BASE_URL}/partial/`,
  UPLOAD_COMPARE: `${API_BASE_URL}/upload_and_compare`,
  RUN_BLAST: `${API_BASE_URL}/run_blast/`,
  BLAST: `${API_BASE_URL}/blast`,
  DOWNLOAD_SEQUENCES: `${API_BASE_URL}/download-sequences/`,
  DOWNLOAD_SEQUENCE: (id) => `${API_BASE_URL}/download-sequence/${id}/`,
  COPY_SEQUENCE: (id) => `${API_BASE_URL}/copy-sequence/${id}/`,
  DOWNLOAD_SEQUENCE_REF: (id) => `${API_BASE_URL}/download-sequence/ref/${id}/`,
  
  // Utility endpoints
  UNITS: `${API_BASE_URL}/units/`,
  LOCATIONS_CODE: `${API_BASE_URL}/locations-code/`,
  SUPPLIERS: `${API_BASE_URL}/suppliers/`,
  MANUFACTURERS: `${API_BASE_URL}/manufacturers/`,
  USERNAMES: `${API_BASE_URL}/usernames/`,
  
  // Temp operations
  TEMP_RECEIVE: `${API_BASE_URL}/temp_receive/`,
  ADD_TEMP_RECEIVE: `${API_BASE_URL}/add_temp_receive_item/`,
  TEMP_ISSUE: `${API_BASE_URL}/temp_issue/`,
  ADD_TEMP_ISSUE: `${API_BASE_URL}/add_temp_issue_item/`,
  TEMP_RETURN: `${API_BASE_URL}/temp_return/`,
  ADD_TEMP_RETURN: `${API_BASE_URL}/add_temp_return_item/`,
  
  // Transfer operations
  TRANSFER_RECEIVE: `${API_BASE_URL}/transfer/receive/`,
  TRANSFER_ISSUE: `${API_BASE_URL}/transfer/issue/`,
  TRANSFER_RETURN: `${API_BASE_URL}/transfer/return/`,
  
  // Status and management
  STATUS: `${API_BASE_URL}/view_status/`,
  PENDING_ISSUES: `${API_BASE_URL}/pending-issues/`,
  DECLINED_ITEMS: `${API_BASE_URL}/get_all_declined_items/`,
  PENDING_ITEMS: `${API_BASE_URL}/get_pending_items/`,
  ITEM_RETURNS: (id) => `${API_BASE_URL}/item_returns/${id}/`,
  
  // Equipment
  EQUIPMENT_DETAILS: `${API_BASE_URL}/equipment-details/`,
  GET_EQUIPMENT: `${API_BASE_URL}/equipment/get/`,
  
  // Excel operations
  UPLOAD_EXCEL: `${API_BASE_URL}/upload_excel/`,
  UPLOAD_EXCEL_API: `${API_BASE_URL}/api/upload-excel/`,
  
  // Registration endpoints
  REGISTRATION_LIST: `${API_BASE_URL}/registrations/`,
  REGISTRATION_DETAIL: (id) => `${API_BASE_URL}/registrations/${id}/`,
};

export { API_BASE_URL };
export default API_BASE_URL;
