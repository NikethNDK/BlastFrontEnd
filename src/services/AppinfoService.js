import axios from "axios";
import { API_ENDPOINTS, API_BASE_URL } from "../config/api";

// Base URL for all API calls
export const BASE_URL = "http://127.0.0.1:8000";

export function getAppinfo() {
  return axios
    .get(API_ENDPOINTS.APP_INFO)
    .then((response) => response.data);
}

export function deleteAppinfo(infocode) {
  return axios
    .delete(`${BASE_URL}/delete_appinfo/${infocode}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting appinfo:", error);
      throw error;
    });
}

export function addAppinfo(appinfo) {
  return axios
    .post(`${BASE_URL}/add_appinfo`, {
      infocode: null,
      infovalue: appinfo.infovalue,
      remarks: appinfo.remarks,
      created_on: appinfo.created_on,
      created_by: appinfo.created_by,
      modified_on: appinfo.modified_on,
      modified_by: appinfo.modified_by,
      dev_remarks: appinfo.dev_remarks,
    })
    .then((response) => response.data);
}

export async function updateAppinfo(infoid, appinfo) {
  return axios
    .put(`${BASE_URL}/update_appinfo/${infoid}`, {
      infovalue: appinfo.infovalue,
      remarks: appinfo.remarks,
      created_on: appinfo.created_on,
      created_by: appinfo.created_by,
      modified_on: appinfo.modified_on,
      modified_by: appinfo.modified_by,
      dev_remarks: appinfo.dev_remarks,
    })
    .then((response) => response.data);
}

// ------------------------------Chemical---------------------------------------------------

export function getMasterApi() {
  return axios
    .get(`${BASE_URL}/master/`)
    .then((response) => response.data);
}

export function deleteChemicalApi(c_id) {
  return axios
    .delete(`${BASE_URL}/delete_chemical/${c_id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting appinfo:", error);
      throw error;
    });
}

export function addMasterApi(master) {
  const currentDate = new Date().toISOString().split("T")[0];

  return axios
    .post(`${BASE_URL}/add_master`, {
      entry_no: master.entry_no,
      item_code: master.item_code,
      item_name: master.item_name,
      m_date: currentDate,
      supplier: master.supplier,
      master_type: master.master_type,
      quantity: master.quantity,
      units: master.units,
      price: master.price,
      project_code: master.project_code,
      remarks: master.remarks,
      issue_date: master.issue_date,
      issue_to: master.issue_to,
      quantity_issued: master.quantity_issued,
      quantity_received: master.quantity_received,
      stock: master.stock,
      dev_remarks: master.dev_remarks,
      created_on: master.created_on,
      created_by: master.created_by,
      modified_on: master.modified_on,
      modified_by: master.modified_by,
      batch_number: master.batch_number,
    })
    .then((response) => response.data);
}

export async function updateChemicalApi(cid, master) {
  try {
    const response = await axios.put(
      `${BASE_URL}/update_master/${cid}`,
      {
        entry_no: master.entry_no,
        item_code: master.item_code,
        item_name: master.item_name,
        m_date: master.m_date,
        supplier: master.supplier,
        master_type: master.master_type,
        quantity: master.quantity,
        units: master.units,
        price: master.price,
        project_code: master.project_code,
        remarks: master.remarks,
        issue_date: master.issue_date,
        issue_to: master.issue_to,
        quantity_issued: master.quantity_issued,
        quantity_received: master.quantity_received,
        stock: master.stock,
        dev_remarks: master.dev_remarks,
        created_on: master.created_on,
        created_by: master.created_by,
        modified_on: master.modified_on,
        modified_by: master.modified_by,
        batch_number: master.batch_number,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating master:", error);
    throw error; // Throw the error to handle it in the caller function
  }
}

export function inactiveMasterApi(cid) {
  return axios
    .patch(`${BASE_URL}/inactive_master/${cid}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating Master:", error);
      throw error;
    });
}

export const getStockLevelApi = () => {
  return fetch(`${BASE_URL}/master/stockLevel`);
};

// --------------------------------Project Master------------------------------------------

export function getProjectApi() {
  return axios
    .get(`${BASE_URL}/project/`)
    .then((response) => response.data);
}

export function deleteProjectApi(project_code) {
  return axios
    .delete(`${BASE_URL}/delete_project/${project_code}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting appinfo:", error);
      throw error;
    });
}

// export function addProjectApi(project) {
//   return axios
//     .post("${BASE_URL}/add_project", {
//       project_code: null,
//       project_name: project.project_name,
//     })
//     .then((response) => response.data);
// }

export function addProjectApi(project) {
  return axios
    .post(`${BASE_URL}/add_project`, {
      project_code: project.project_code,
      project_name: project.project_name,
    })
    .then((response) => response.data);
}
export async function updateProjectApi(proCode, project) {
  return axios
    .put(`${BASE_URL}/update_project/${proCode}`, {
      project_name: project.project_name,
    })
    .then((response) => response.data);
}

export function inactiveProjectApi(project_code) {
  return axios
    .patch(`${BASE_URL}/inactive_project/${project_code}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating project:", error);
      throw error;
    });
}

// ------------------------------------------Inventory-------------------------------------------

export function getInventoryApi() {
  return axios
    .get(`${BASE_URL}/inventory`)
    .then((response) => response.data);
}

export function deleteInventoryApi(enNo) {
  return axios
    .delete(`${BASE_URL}/delete_inventory/${enNo}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting appinfo:", error);
      throw error;
    });
}

export function addInventoryApi(inventory) {
  return axios
    .post(`${BASE_URL}/add_inventory`, {
      entry_no: null,
      item_code: inventory.item_code,
      item_name: inventory.item_name,
      tran_type_IR: inventory.tran_type_IR,
      i_date: inventory.i_date,
      supplier: inventory.supplier,
      units: inventory.units,
      price: inventory.price,
      quantity_issued: inventory.quantity_issued,
      quantity_received: inventory.quantity_received,
      stock: inventory.stock,
      quantity: inventory.quantity,
      ref_number: inventory.ref_number,
      ref_type: inventory.ref_type,
      batch_number: inventory.batch_number,
      remarks: inventory.remarks,
      created_on: inventory.created_on,
      created_by: inventory.created_by,
      modified_on: inventory.modified_on,
      modified_by: inventory.modified_by,
      dev_remarks: inventory.dev_remarks,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export async function updateInventoryApi(enNo, inventory) {
  return axios
    .put(`${BASE_URL}/update_inventory/${enNo}`, {
      item_code: inventory.item_code,
      item_name: inventory.item_name,
      tran_type_IR: inventory.tran_type_IR,
      qnty: inventory.qnty,
      ref_number: inventory.ref_number,
      ref_type: inventory.ref_type,
      batch_number: inventory.batch_number,
      remarks: inventory.remarks,
      created_on: inventory.created_on,
      created_by: inventory.created_by,
      modified_on: inventory.modified_on,
      modified_by: inventory.modified_by,
      quantity_issued: inventory.quantity_issued,
      quantity_recieved: inventory.quantity_recieved,
      stock: inventory.stock,
      dev_remarks: inventory.dev_remarks,
    })
    .then((response) => response.data);
}

//------------------------------------Login system----------------------------

// API_BASE_URL is now imported from config/api.js

export async function loginUserApi(credentials) {
  try {
    const response = await axios.post(`${BASE_URL}/login-view/`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function registerUserApi(userInfo) {
  try {
    const response = await axios.post(`${BASE_URL}/register/`, userInfo);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

//---------------------------------Request Approval--------------------------------

export function getRequestApi() {
  return axios
    .get(`${BASE_URL}/request`)
    .then((response) => response.data);
}

export function deleteRequestApi(id) {
  return axios
    .delete(`${BASE_URL}/delete_request/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting appinfo:", error);
      throw error;
    });
}

export function addRequestApi(request) {
  return axios
    .post(`${BASE_URL}/add_request`, {
      id: null,
      ItemCode: request.ItemCode,
      ItemType: request.ItemType,
      ItemName: request.ItemName,
      RequestDate: request.RequestDate,
      RequestStatus: request.RequestStatus,
      RequestedBy: request.RequestedBy,
      RequestDetails: request.RequestDetails,
      ApprovedBy: null,
    })
    .then((response) => response.data);
}

export async function updateRequestApi(id, request) {
  return axios
    .put(`${BASE_URL}/update_request/${id}`, {
      ItemCode: request.ItemCode,
      ItemType: request.ItemType,
      ItemName: request.ItemName,
      RequestDate: request.RequestDate,
      RequestStatus: request.RequestStatus,
      RequestedBy: request.RequestedBy,
      RequestDetails: request.RequestDetails,
      ApprovedBy: request.ApprovedBy,
    })
    .then((response) => response.data);
}

//-----------------------Issue Task..------------------------------------------

export function getIssueApi() {
  return axios
    .get(`${BASE_URL}/issues`)
    .then((response) => response.data);
}

export function addIssueApi(researcher) {
  const currentDate = new Date().toISOString().slice(0, 10);
  return axios
    .post(`${BASE_URL}/add_issue`, {
      id: null,
      researcher_name: researcher.researcher_name,
      issues_task: researcher.issues_task,
      date_time: currentDate,
      issue_raised_by: researcher.issue_raised_by,
      issue_status: researcher.issue_status,
    })
    .then((response) => response.data);
}

//-----------------------------Login Add Role-----------------------

export function getLoginApi() {
  return axios
    .get(`${BASE_URL}/view_login`)
    .then((response) => response.data);
}

export function addLoginApi(log) {
  return axios
    .post(`${BASE_URL}/add_login/`, {
      id: null,
      user_name: log.user_name,
      password: log.password,
      role: log.role,
      lab: log.lab,
      designation: log.designation,
    })
    .then((response) => response.data);
}

export async function updateLoginApi(id, log) {
  return axios
    .put(`${BASE_URL}/update_login/${id}`, {
      user_name: log.user_name,
      password: log.password,
      role: log.role,
    })
    .then((response) => response.data);
}

//---------------------------Employee---------------------------//

export function getEmployeeApi() {
  return axios
    .get(`${BASE_URL}/emp/`)
    .then((response) => response.data);
}

export function deleteEmployeeApi(emp_id) {
  return axios
    .delete(`${BASE_URL}/delete_emp/${emp_id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting appinfo:", error);
      throw error;
    });
}

export function addEmployeeApi(employee) {
  return axios
    .post(`${BASE_URL}/add_emp`, {
      // emp_id: employee.username,
      emp_id: employee.emp_id,
      role: employee.role,
      emp_name: employee.emp_name,
      designation: employee.designation_id,
      lab: employee.lab_id,
      // project_code: employee.project_code,
      project_code: Array.isArray(employee.project_code)
        ? employee.project_code // Ensure it's an array of project codes
        : [employee.project_code], // If it's a single project code, convert it to an array
    })
    .then((response) => response.data);
}
export async function updateEmployeeApi(emp_id, employee) {
  return axios
    .put(`${BASE_URL}/update_emp/${emp_id}`, {
      emp_name: employee.emp_name,
      designation: employee.designation,
      project_code: employee.project_code,
    })
    .then((response) => response.data);
}

// export function inactiveEmployeeApi(emp_id) {
//   return axios
//     .patch(`${BASE_URL}/inactive_emp/${emp_id}`)
//     .then((response) => response.data)
//     .catch((error) => {
//       console.error("Error updating Master:", error);
//       throw error;
//     });
// }

// export function inactiveEmployeeApi(emp_id) {
//   return axios
//     .patch(`${BASE_URL}/inactive_emp/${emp_id}`, {
//       deleted: 1,
//       is_active: false,
//     })
//     .then((response) => response.data)
//     .catch((error) => {
//       console.error("Error deactivating employee:", error);
//       throw error;
//     });
// }

export const inactiveEmployeeApi = async (emp_id) => {
  try {
    await axios.post(`${BASE_URL}/inactive_emp/${emp_id}`);
    alert("Employee deactivated successfully and cannot log in again.");
    // Optionally update UI state here
  } catch (error) {
    alert("Failed to deactivate employee");
  }
};

export function addEmpRegApi(emp) {
  return axios
    .post(`${BASE_URL}/add_empReg`, {
      emp_name: emp.user_name,
      designation: emp.role,
      role: emp.role, // Ensure this is included
      lab: emp.lab, // Ensure lab is provided
      project_code: emp.project_code,
    })
    .then((response) => response.data);
}

//---------------------------Get Employee name-----------------//

// export function getResEmployeeApi() {
//   return axios
//     .get("${BASE_URL}/researcherEmpName")

//     .then((response) => response.data);
// }

export const getResEmployeeApi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/researcherEmpName/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching researcher names:", error);
    return [];
  }
};

//-------------------View Status-------------------------------//

export function getStatusApi() {
  return axios
    .get(`${BASE_URL}/view_status`)
    .then((response) => response.data);
}

//-------------------------------Item Return---------------------------------//

export function addItemReturnApi(i_return) {
  const currentDate = new Date();

  // Format date to ISO string
  const isoDate = currentDate.toISOString();

  return axios
    .post(`${BASE_URL}/add_itemreturn`, {
      entry_no: null,
      c_id: i_return.c_id,
      receipt_date: isoDate,
      quantity_return: i_return.quantity_return,
    })
    .then((response) => response.data);
}

//-----------------------------Add Product Request----------------------------//

export function addProductReqApi(product) {
  const currentDate = new Date().toISOString().split("T")[0];

  return axios
    .post(`${BASE_URL}/addProduct_request`, {
      id: null,
      ItemCode: null,
      ItemType: null,
      ItemName: null,
      RequestStatus: null,
      RequestDate: currentDate,
      RequestedBy: product.RequestedBy,
      RequestDetails: product.RequestDetails,
      RequestedTo: product.RequestedTo,
    })
    .then((response) => response.data);
}

export function getProductReqApi() {
  return axios
    .get(`${BASE_URL}/viewProduct_request`)
    .then((response) => response.data);
}

export async function updateProductApi(enNo, product) {
  return axios
    .put(`${BASE_URL}/updateProduct_request/${enNo}`, {
      ItemCode: product.ItemCode,
      ItemType: product.ItemType,
      ItemName: product.ItemName,
      RequestDate: product.RequestDate,
      RequestStatus: product.RequestStatus,
      RequestedBy: product.RequestedBy,
      RequestDetails: product.RequestDetails,
      RequestedTo: product.RequestedTo,
    })
    .then((response) => response.data);
}

//-----------------------------View Entry-----------------//

export function getViewEntryApi() {
  return axios
    .get(`${BASE_URL}/view_entry`)
    .then((response) => response.data);
}

//----------------------Distinct Role---------------------------//

export function getDistinctRoleApi() {
  return axios
    .get(`${BASE_URL}/view_distinct_role/`)
    .then((response) => response.data);
}

//---------------------------------Newvwrsion Lab Assistant------------------//

export function addLabMasterApi(lab) {
  return axios
    .post(`${BASE_URL}/master_inventory/create/`, {
      c_id: null,
      master_type: lab.master_type,
      item_code: lab.item_code,
      item_name: lab.item_name,
      // location_code: lab.location_code,
      units: lab.units,
      // manufacturer:lab.manufacturer,
      // supplier:lab.supplier
      // price: lab.price,
      // make: lab.make,
      // instruction_specification: lab.instruction_specification,
      min_req_stock: lab.min_req_stock,
      // remarks: lab.remarks,
    })
    .then((response) => response.data);
}

export async function updateLAbMasterApi(c_id, master) {
  return axios
    .put(`${BASE_URL}/master_inventory/update/${c_id}/`, {
      master_type: master.master_type,
      item_code: master.item_code,
      item_name: master.item_name,
      location_code: master.location_code,
      units: master.units,
      price: master.price,
      make: master.make,
      instruction_specification: master.instruction_specification,
      min_req_stock: master.min_req_stock,
      remarks: master.remarks,
    })
    .then((response) => response.data);
}

export function getLabMasterApi() {
  return axios
    .get(`${BASE_URL}/masters/`)
    .then((response) => response.data);
}

export function getMasterChemicalApi() {
  return axios
    .get(`${BASE_URL}/masters/chemical`)
    .then((response) => response.data);
}

export function getMasterLabwareApi() {
  return axios
    .get(`${BASE_URL}/masters/labware`)
    .then((response) => response.data);
}
export function getMasterEquipmentApi() {
  return axios
    .get(`${BASE_URL}/masters/equipment`)
    .then((response) => response.data);
}
export function getChemicalDescApi() {
  return axios
    .get(`${BASE_URL}/master/chemical/desc/`)
    .then((response) => response.data);
}

export function getLabwareDescApi() {
  return axios
    .get(`${BASE_URL}/master/labware/desc/`)
    .then((response) => response.data);
}

//----------------------Temporary table----------------------------------//

export function addTempToReceiveApi() {
  return axios
    .get(`${BASE_URL}/add_itemreceive`)
    .then((response) => response.data)
    .catch((error) => {
      throw error; // Rethrow the error to handle it in the caller function
    });
}

export function addTempToIssueApi() {
  return axios
    .post(`${BASE_URL}/add_itemissue`)
    .then((response) => response.data)
    .catch((error) => {
      throw error; // Rethrow the error to handle it in the caller function
    });
}

export function getTempReceiveApi() {
  return axios
    .get(`${BASE_URL}/temp_receive`)
    .then((response) => response.data);
}

export function getTempIssueApi() {
  return (
    axios
      // .get("${BASE_URL}/get-issue-items/")
      .get(`${BASE_URL}/get-issue-items?status=LAB-OPEN`)
      .then((response) => response.data)
  );
}
export function getTempReturnApi() {
  return axios
    .get(`${BASE_URL}/temp_return`)
    .then((response) => response.data);
}

export function addItemReceiveApi(data) {
  return axios
    .post(`${BASE_URL}/add_itemreceive1`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error; // Rethrow the error to handle it in the caller function
    });
}

export function addItemIssueApi(data) {
  return axios
    .post(`${BASE_URL}/add_itemissue1`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error; // Rethrow the error to handle it in the caller function
    });
}

//---------------------------ITEM RECEIVE---------------------------//

export function getItemReceiveApi() {
  return axios
    .get(`${BASE_URL}/itemreceive/`)
    .then((response) => response.data);
}

export function addTempItemReceiveApi(receive) {
  const currentDate = new Date().toISOString();
  return axios
    .post(`${BASE_URL}/add_temp_receive_item`, {
      entry_no: null,
      bill_no: receive.bill_no,
      c_id: receive.c_id,
      item_name: receive.item_name,
      item_code: receive.item_code,
      project_code: receive.project_code,
      project_name: receive.project_name,
      invoice_number: receive.invoice_number,
      price_unit: receive.price_unit,
      expiry_date: receive.expiry_date,
      batch_lot_number: receive.batch_lot_number,
      manufacturer: receive.manufacturer,
      supplier: receive.supplier,
      instruction_specification: receive.instruction_specification,
      location: receive.location,
      receipt_date: currentDate,
      quantity_received: receive.quantity_received,
      po_number: receive.po_number,
      batch_number: receive.batch_number, 
      remarks: receive.remarks,
      master_type: receive.master_type,
      min_req_stock: receive.min_req_stock,
      unit_measure: receive.unit_measure,
      // stock: receive.stock,
    })
    .then((response) => response.data);
}

//---------------------------ITEM ISSUE---------------------------//

export function getItemIssueApi() {
  return axios
    .get(`${BASE_URL}/api/issue_data/`)
    .then((response) => response.data);
}

export function addTempItemIssueApi(receive) {
  const currentDate = new Date().toISOString();
  console.log("-----------" + receive);
  return axios
    .post(`${BASE_URL}/add_issue_item`, {
      entry_no: null,
      bill_no: receive.bill_no,
      c_id: receive.c_id,
      issue_date: currentDate,
      unit_measure: receive.unit_measure,
      quantity_issued: receive.quantity_issued,
      issued_to: receive.issued_to,
      project_code: receive.project_code,
      researcher_name: receive.researcher_name,
      batch_number: receive.batch_number,
      remarks: receive.remarks,
      expiry_date: receive.expiry_date,
      manufacturer: receive.manufacturer,
      supplier: receive.supplier,
      master_type: receive.master_type,
      item_name: receive.item_name,
      item_code: receive.item_code,
      location: receive.location,
      status: "LAB-OPEN",
      instruction_specification: receive.instruction_specification,
    })
    .then((response) => response.data);
}

export function addTempItemReturnApi(receive) {
  const currentDate = new Date().toISOString();

  return axios
    .post(`${BASE_URL}/add_temp_return_item`, {
      entry_no: null,
      bill_no: receive.bill_no,
      c_id: receive.c_id,
      receipt_date: receive.receipt_date,
      quantity_return: receive.quantity_return,
    })
    .then((response) => response.data);
}

// -----------------------------Add Master table----------------------
export const addLabApi = async (labName) => {
  try {
    const response = await axios.post(`${BASE_URL}/lab-add/`, {
      name: labName,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Network Error";
  }
};

// API to add a new Designation
export const addDesignationApi = async (designationName) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/designations-add/`,
      { title: designationName }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Network Error";
  }
};

export const fetchLabDataApi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/labs/`);
    return response.data; // Assuming the API returns an array of lab data
  } catch (error) {
    console.error("Error fetching lab data:", error);
    throw error;
  }
};
export const getLabsApi = () => {
  return axios.get(`${BASE_URL}/labs/`); // Replace with your actual API endpoint
};

export const getDesignationsApi = () => {
  return axios.get(`${BASE_URL}/designations/`); // Replace with your actual API endpoint
};

// API to add a lab

// API to delete a lab by ID
export const deleteLabApi = async (labId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/labs/${labId}/delete/`
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { error: "Something went wrong" };
  }
};

export const deleteDesignationApi = async (designationId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/designations/${designationId}/delete/`
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { error: "Something went wrong" };
  }
};

export const updateLabApi = async (labId, labName) => {
  try {
    const response = await axios.put(`${BASE_URL}labs/${labId}/`, {
      name: labName,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update lab");
  }
};

// API to update a designation by ID
export const updateDesignationApi = async (designationId, designationName) => {
  try {
    const response = await axios.put(
      `${BASE_URL}designations/${designationId}/`,
      {
        name: designationName,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update designation"
    );
  }
};

// const fetchRole = async (roleId) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/roles/${roleId}/`);
//     console.log(response.data); // Handle the role data
//   } catch (error) {
//     console.error(error.response?.data || "An error occurred");
//   }
// };

// fetchRole(1);

// API_ENDPOINTS is now imported from config/api.js

// API Functions
export const fetchRegistrations = async () => {
  const response = await axios.get(API_ENDPOINTS.REGISTRATION_LIST);
  return response.data;
};

export const createRegistration = async (data) => {
  const response = await axios.post(API_ENDPOINTS.REGISTRATION_LIST, data);
  return response.data;
};

export const updateRegistration = async (id, data) => {
  const response = await axios.put(API_ENDPOINTS.REGISTRATION_DETAIL(id), data);
  return response.data;
};

export const deleteRegistration = async (id) => {
  const response = await axios.delete(API_ENDPOINTS.REGISTRATION_DETAIL(id));
  return response.data;
};
// export const fetchUsernames = async (selectedLab, selectedRole) => {
//   try {
//     const response = await axios.get("${BASE_URL}/usernames/");

//     // Filter users based on selected lab and role
//     const filteredUsernames = response.data.filter(
//       (user) => user.lab === selectedLab && user.role === selectedRole
//     );

//     return filteredUsernames.map((user) => user.username);
//   } catch (error) {
//     console.error("Error fetching usernames:", error);
//     return [];
//   }
// };

export const fetchUsernames = async (selectedLab, selectedRole) => {
  try {
    const response = await axios.get(`${BASE_URL}/usernames/`);

    // Filter users based on selected lab and role
    const filteredUsernames = response.data.filter(
      (user) => user.lab.includes(selectedLab) && user.role === selectedRole
    );

    return filteredUsernames.map((user) => user.username);
  } catch (error) {
    console.error(`Error fetching usernames:`, error);
    return [];
  }
};

// Get all users with their labs and roles
export const getAllUsersApi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/usernames/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const createUnit = async (unitName) => {
  try {
    const response = await axios.post(`${BASE_URL}/unit/`, {
      unit_measure: unitName,
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating unit:`, error);
    throw error;
  }
};

// Create Location Code
// export const createLocationCode = async (locationCode) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/location-code/`, {
//       location: locationCode,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating location code:", error);
//     throw error;
//   }
// };
export const createLocationCode = async (locationCode, username) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/location-code/?username=${username}`,
      {
        location: locationCode,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating location code:", error);
    throw error;
  }
};

//masterType
export const createMasterType = async (masterype) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/master_type/`, {
      name: masterype,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating location code:", error);
    throw error;
  }
};
// Create Manufacturer
// export const createManufacturer = async (manufacturerName) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/manufacturer/`, {
//       manufacturer: manufacturerName,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating manufacturer:", error);
//     throw error;
//   }
// };
// Create Manufacturer
export const createManufacturer = async (manufacturerName, username) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/manufacturer/?username=${username}`,
      {
        manufacturer: manufacturerName,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating manufacturer:", error);
    throw error;
  }
};

// Create Supplier
export const createSupplier = async (supplierName, username) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/supplier/?username=${username}`,
      {
        supplier: supplierName,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }
};
// Create Supplier
// export const createSupplier = async (supplierName) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/supplier/`, {
//       supplier: supplierName,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating supplier:", error);
//     throw error;
//   }
// };
export const getMastertyApi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/master-types/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Master:", error);
    return [];
  }
};

// export const getSuppliersApi = async () => {
//   try {
//     const response = await axios.get("${BASE_URL}/suppliers/");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching suppliers:", error);
//     return [];
//   }
// };

export const getSuppliersApi = async (username) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/suppliers/?username=${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }
};

export const getUnitsApi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/units/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
};

// export const getLocationsApi = async () => {
//   try {
//     const response = await axios.get("${BASE_URL}/locations-code/");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching locations:", error);
//     return [];
//   }
// };

export const getLocationsApi = async (username) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/locations-code/?username=${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

// export const getManufacturersApi = async () => {
//   try {
//     const response = await axios.get("${BASE_URL}/manufacturers/");
//     return response.data; // Assuming the response is an array of manufacturers
//   } catch (error) {
//     console.error("Error fetching manufacturers:", error);
//     return [];
//   }
// };

// Bala

export const getManufacturersApi = async (username) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/manufacturers/?username=${username}`
    );
    return response.data; // Assuming the response is an array of manufacturers
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    return [];
  }
};

export const deleteTempIssueApi = async (entry_no) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/temp_issue/delete/${entry_no}/`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

// API to update a Temp Issue item

export function updateTempIssueApi(entry_no, updatedData) {
  return axios
    .put(`${BASE_URL}/temp_issue/update/${entry_no}/`, updatedData) // Use entry_no instead of bill_no

    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating item:", error);
      throw error;
    });
}

export function updateTempReceiveApi(billNo, updatedData) {
  return axios
    .put(`${BASE_URL}/temp-receive/update/${billNo}/`, updatedData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating item:", error);
      throw error;
    });
}

/** ❌ DELETE: Delete a temp receive record */
export function deleteTempReceiveApi(billNo) {
  return axios
    .delete(`${BASE_URL}/temp-receive/delete/${billNo}/`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting item:", error);
      throw error;
    });
}

export const getIssuesByResearcher = async (researcherName) => {
  try {
    const response = await axios.get(`${BASE_URL}/get_issues_by_researcher/`, {
      params: { issued_to: researcherName }, // Ensure correct researcher is passed
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
};

export function addIssueResearcherApi(receive) {
  const currentDate = new Date().toISOString();

  return axios
    .post(`${BASE_URL}/add_issue_item`, {
      entry_no: null,
      // bill_no: receive.bill_no,
      c_id: receive.c_id,
      issue_date: currentDate,
      // quantity_issued: receive.quantity_issued,
      issued_to: receive.issued_to,
      project_code: receive.project_code,
      project_name: receive.project_name,
      // researcher_name: receive.researcher_name,
      // batch_number: receive.batch_number,
      remarks: receive.remarks,
      // expiry_date: receive.expiry_date,
      // manufacturer: receive.manufacturer,
      // supplier: receive.supplier,
      master_type: receive.master_type,
      item_name: receive.item_name,
      item_code: receive.item_code,
      supervisor_name: receive.supervisor_name,
      lab_assistant_name: receive.lab_assistant_name,
      status: "RCH-OPEN",
    })
    .then((response) => response.data);
}

export function getmanagerEmployeeApi(userDetails) {
  return axios
    .get(`${BASE_URL}/managerEmpName/?lab=${userDetails}`)
    .then((response) => response.data);
}

export function getLabassistantEmployeeApi() {
  return axios
    .get(`${BASE_URL}/lab-assistants/`)
    .then((response) => response.data);
}
export const fetchMasterListByType = async (masterType, lab = null) => {
  try {
    const params = { master_type: masterType };
    if (lab) {
      params.lab = lab;
    }
    
    console.log("🌐 [API] fetchMasterListByType called with:", { masterType, lab, params });
    console.log("🌐 [API] Making request to:", `${BASE_URL}/api/master-list-by-type/`);
    
    const response = await axios.get(`${BASE_URL}/api/master-list-by-type/`, {
      params: params,
    });
    
    console.log("🌐 [API] fetchMasterListByType response:", response.data);
    return response.data;
  } catch (error) {
    console.error("💥 [API] Error fetching master list:", error);
    throw error;
  }
};

export const fetchItemExpiryDates = async (itemCode) => {
  try {
    console.log("🌐 [API] fetchItemExpiryDates called with itemCode:", itemCode);
    
    const response = await axios.get(`${BASE_URL}/api/item-expiry-dates/`, {
      params: { item_code: itemCode },
    });
    
    console.log("🌐 [API] fetchItemExpiryDates response:", response.data);
    return response.data;
  } catch (error) {
    console.error("💥 [API] Error fetching expiry dates:", error);
    throw error;
  }
};

export const fetchItemLocations = async (itemCode) => {
  try {
    console.log("🌐 [API] fetchItemLocations called with itemCode:", itemCode);
    
    const response = await axios.get(`${BASE_URL}/api/item-locations/`, {
      params: { item_code: itemCode },
    });
    
    console.log("🌐 [API] fetchItemLocations response:", response.data);
    return response.data;
  } catch (error) {
    console.error("💥 [API] Error fetching locations:", error);
    throw error;
  }
};
export function getTemptReceiveApi(lab = null) {
  const params = {};
  if (lab) {
    params.lab = lab;
  }
  
  console.log("🌐 [API] getTemptReceiveApi called with:", { lab, params });
  console.log("🌐 [API] Making request to:", `${BASE_URL}/api/inventoryReceive/`);
  
  return axios
    .get(`${BASE_URL}/api/inventoryReceive/`, { params })
    .then((response) => {
      console.log("🌐 [API] getTemptReceiveApi response:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("💥 [API] getTemptReceiveApi error:", error);
      throw error;
    });
}

export const createEquipmentDetails = async (equipmentData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/equipment-details/`,
      equipmentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return response data
  } catch (error) {
    console.error(
      "Error creating equipment details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// DNA & Repository

// BASE_URL is now imported from config/api.js

export function getDnaApi() {
  return axios.get(`${BASE_URL}/dna`).then((response) => response.data);
}

export function addDnaApi(dna) {
  const currentDate = new Date().toISOString().split("T")[0];

  return axios
    .post(`${BASE_URL}/add_dna`, {
      s_no: null,
      ncbi_id: dna.ncbi_id,
      class_name: dna.class_name,
      common_name: dna.common_name,
      scientific_name: dna.scientific_name,
      reference_id: dna.reference_id,
      partial_name: dna.partial_name,
      partial_data: dna.partial_data,
      submittedBy_name: dna.submittedBy_name,
      submission_date: currentDate,
      subBy_designation: dna.subBy_designation,
    })
    .then((response) => response.data);
}

//--------------------------------------Partial Name-----------------------------------//

export const getPartialApi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/partials/`);
    return response.data; // This should return the array of partial names
  } catch (error) {
    console.error("Error fetching partial names:", error);
    return []; // Return an empty array in case of an error
  }
};

export function addPartialApi(partial) {
  return axios
    .post(`${BASE_URL}/partial/`, {
      code: null,
      partial_name: partial.partial_name,
    })
    .then((response) => response.data);
}

// export const uploadAndCompareFile = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const response = await axios.post(
//       `${BASE_URL}/upload_and_compare`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     if (response.data.message) {
//       // Handle the message (e.g., no matches)
//       alert(response.data.message); // Or you could display it in the UI
//     } else {
//       // Handle the results (when matches are found)
//       console.log("Results:", response.data);
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     throw error;
//   }
// };

export const uploadAndCompareFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${BASE_URL}/upload_and_compare`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.message) {
      if (
        response.data.message === "No alignments found for the given sequences."
      ) {
        alert(response.data.message); // Or use a UI message
      } else {
        alert("Error: " + response.data.message); // General error handling
      }
      return []; // Return empty data in case of no alignments
    }

    return response.data; // Proceed if valid data is returned
  } catch (error) {
    console.error("Error uploading file:", error);
    // setError("Error uploading file. Please try again.");
    throw error; // Propagate the error
  }
};

export const fetchDnaData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dna`);
    return response.data;
  } catch (error) {
    console.error("Error fetching DNA data:", error);
    throw error;
  }
};

export const deleteDnaRecord = async (reference_id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/delete-dna/${reference_id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting DNA record:", error);
    throw error;
  }
};
export const runBlast = async (file) => {
  const formData = new FormData();
  formData.append("queryFile", file);

  try {
    const response = await fetch(`${BASE_URL}/run_blast/`, {
      // Update to correct backend URL
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error running BLAST");
    }

    return data.results; // Return results as an array
  } catch (error) {
    console.error("Error in runBlast:", error);
    throw error;
  }
};

// Function to download sequences as a FASTA file
export const downloadSequences = async () => {
  try {
    const response = await axios({
      url: `${BASE_URL}/download-sequences/`,
      method: "GET",
      responseType: "blob",
    });

    // Create a downloadable link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "blast_sequences.fasta");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading sequences:", error);
    throw error;
  }
};

export const copySequence = async (reference_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/copy-sequence/${reference_id}/`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching sequence:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

export const downloadSequenceByReference = async (reference_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/download-sequence/ref/${reference_id}/`,
      {
        responseType: "blob", // Important for handling file downloads
      }
    );

    // Create a downloadable link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${reference_id}_sequence.fasta`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading sequence:", error);
    alert("Failed to download sequence. Please try again.");
  }
};

export const updateItemStatus = async (entry_no, status) => {
  try {
    const response = await axios.post(`${BASE_URL}/update-item-status/`, {
      entry_no: entry_no,
      status: status,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating item status:", error);
    return error.response ? error.response.data : { error: "Network error" };
  }
};

// export const getUpdatedIssueApi = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/pending-issues/`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching pending issues:", error);
//     return [];
//   }
// };

export const getIssueItems = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/get-issue-items?status=RCH-OPEN`
      // `${BASE_URL}/get-issue-items`
    );
    return response.data; // Returning response data
  } catch (error) {
    console.error("Error fetching issue items:", error);
    throw error; // Throwing error to handle in the frontend
  }
};

export const revertStock = async (entry_no) => {
  try {
    console.log("Sending request to revertStock with:", { entry_no });

    const response = await axios.post(`${BASE_URL}/revert-stock/`, {
      entry_no: entry_no,
    });

    console.log("Response from backend:", response.data);
    alert(response.data.message); // Show success message
    return response.data;
  } catch (error) {
    console.error(
      "Error reverting stock:",
      error.response?.data || error.message
    );
    alert(error.response?.data?.error || "An error occurred.");
    return error.response ? error.response.data : { error: "Network error" };
  }
};

export const getItemReturnsForManager = async (managerId) => {
  try {
    console.log("Fetching data for managerId:", managerId);
    const response = await axios.get(`${BASE_URL}/item_returns/${managerId}/`);
    console.log("Response data from API:", response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching item returns:", error);
    return []; // Return empty array on error
  }
};
