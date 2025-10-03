import { useState, useEffect } from "react";
import {
  createUnit,
  createLocationCode,
  createManufacturer,
  createSupplier,
  createMasterType,
  addLabMasterApi,
  getMastertyApi,
} from "../../../services/AppinfoService";
import toast from "react-hot-toast";
import { Button } from "react-bootstrap";
import LabNavigation1 from "../homeLab/LabNavigation1";
import "./AddProduct.css";

const AddProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [masterTypes, setMasterTypes] = useState([]);
  const [masterType, setMasterType] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [units, setUnits] = useState("");
  const [reqStock, setReqStock] = useState("");

  const [data, setData] = useState({
    location: [],
    manufacturer: [],
    supplier: [],
    name: [],
  });

  const [errorMessages, setErrorMessages] = useState({});

  const handleSubmit = async () => {
    if (!selectedCategory || !inputValue) {
      toast.error("Please select a category and enter a value.");
      return;
    }

    try {
      if (selectedCategory === "Location") {
        await createLocationCode(inputValue, userDetails.name);
      } else if (selectedCategory === "Manufacturer") {
        await createManufacturer(inputValue, userDetails.name);
      } else if (selectedCategory === "Supplier") {
        await createSupplier(inputValue, userDetails.name);
      } else if (selectedCategory === "Master") {
        await createMasterType(inputValue);
      }

      setData((prev) => ({
        ...prev,
        [selectedCategory.toLowerCase()]: [
          ...(prev[selectedCategory.toLowerCase()] || []),
          inputValue,
        ],
      }));

      toast.success(`${selectedCategory} added successfully!`);
      setInputValue("");
    } catch (error) {
      toast.error(`Failed to add ${selectedCategory}.`);
    }
  };

  const handleMasterSubmit = async () => {
    const newErrorMessages = {};

    // Validate required fields
    if (!masterType) {
      newErrorMessages.masterType = "Please select a master type";
    }
    if (!itemCode.trim()) {
      newErrorMessages.itemCode = "Please enter an item code";
    }
    if (!itemName.trim()) {
      newErrorMessages.itemName = "Please enter an item name";
    }
    if (!units.trim()) {
      newErrorMessages.units = "Please enter units";
    }
    if (!reqStock.trim()) {
      newErrorMessages.reqStock = "Please enter minimum required stock";
    }

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    const masterData = {
      master_type: masterType,
      item_code: itemCode,
      item_name: itemName,
      min_req_stock: reqStock,
      units: units,
    };

    try {
      await addLabMasterApi(masterData, userDetails);
      toast.success("Data added successfully");
      setMasterType("");
      setItemCode("");
      setItemName("");
      setUnits("");
      setReqStock("");
      setErrorMessages({});
    } catch (error) {
      toast.error("Failed to add data.");
    }
  };

  useEffect(() => {
    const fetchMasterTypes = async () => {
      try {
        const data = await getMastertyApi();
        setMasterTypes(data);
      } catch (error) {
        console.error("Error fetching Master Types:", error);
      }
    };
    fetchMasterTypes();
  }, []);

  return (
    <div className="add-product-container">
      <div className="add-product-wrapper">
        <div className="add-product-cards-container">
          {/* Category Management Card */}
          <div className="add-product-card category-card">
            <div className="add-product-card-header">
              <strong>Category Management</strong>
            </div>
            <div className="add-product-card-body">
              <div className="add-product-form-group">
                <label className="add-product-form-label">Select Category</label>
                <select
                  value={selectedCategory}
                  className="add-product-select"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="Master">Master Type</option>
                  <option value="Location">Location</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Supplier">Supplier</option>
                </select>
              </div>

              {selectedCategory && (
                <div className="add-product-mt-3">
                  <div className="add-product-form-group">
                    <label className="add-product-form-label">
                      {selectedCategory} Name
                    </label>
                    <input
                      type="text"
                      value={inputValue}
                      className="add-product-form-control"
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={`Enter ${selectedCategory} name`}
                    />
                  </div>
                  <button 
                    onClick={handleSubmit} 
                    className="add-product-btn add-product-btn-block add-product-mt-2"
                  >
                    Add {selectedCategory}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Master Item Entry Card */}
          <div className="add-product-card master-card">
            <div className="add-product-card-header">
              <strong>Master Item Entry</strong>
            </div>
            <div className="add-product-card-body">
              <div className="add-product-flex add-product-justify-between add-product-mb-3">
                <div className="add-product-w-48">
                  <div className="add-product-form-group">
                    <label className="add-product-form-label">Master Type</label>
                    <select
                      value={masterType}
                      className={`add-product-select ${
                        errorMessages.masterType ? "add-product-form-control-error" : ""
                      }`}
                      onChange={(e) => {
                        setMasterType(e.target.value);
                        setErrorMessages(prev => ({...prev, masterType: ""}));
                      }}
                    >
                      <option value="">Select Master Type</option>
                      {masterTypes.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {errorMessages.masterType && (
                      <span className="add-product-error">
                        {errorMessages.masterType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="add-product-w-48">
                  <div className="add-product-form-group">
                    <label className="add-product-form-label">Unit</label>
                    <input
                      type="text"
                      value={units}
                      className={`add-product-form-control ${
                        errorMessages.units ? "add-product-form-control-error" : ""
                      }`}
                      placeholder="Enter unit"
                      onChange={(e) => {
                        setUnits(e.target.value);
                        setErrorMessages(prev => ({...prev, units: ""}));
                      }}
                    />
                    {errorMessages.units && (
                      <span className="add-product-error">
                        {errorMessages.units}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="add-product-flex add-product-justify-between add-product-mb-3">
                <div className="add-product-w-48">
                  <div className="add-product-form-group">
                    <label className="add-product-form-label">Item Name</label>
                    <input
                      type="text"
                      value={itemName}
                      className={`add-product-form-control ${
                        errorMessages.itemName ? "add-product-form-control-error" : ""
                      }`}
                      placeholder="Enter item name"
                      onChange={(e) => {
                        setItemName(e.target.value);
                        setErrorMessages(prev => ({...prev, itemName: ""}));
                      }}
                    />
                    {errorMessages.itemName && (
                      <span className="add-product-error">
                        {errorMessages.itemName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="add-product-w-48">
                  <div className="add-product-form-group">
                    <label className="add-product-form-label">Item Code</label>
                    <input
                      type="text"
                      value={itemCode}
                      className={`add-product-form-control ${
                        errorMessages.itemCode ? "add-product-form-control-error" : ""
                      }`}
                      placeholder="Enter item code"
                      onChange={(e) => {
                        setItemCode(e.target.value);
                        setErrorMessages(prev => ({...prev, itemCode: ""}));
                      }}
                    />
                    {errorMessages.itemCode && (
                      <span className="add-product-error">
                        {errorMessages.itemCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="add-product-flex add-product-justify-between add-product-mt-3">
                <div className="add-product-w-48">
                  <div className="add-product-form-group">
                    <label className="add-product-form-label">Minimum Required Stock</label>
                    <input
                      type="number"
                      value={reqStock}
                      className={`add-product-form-control ${
                        errorMessages.reqStock ? "add-product-form-control-error" : ""
                      }`}
                      placeholder="Enter minimum stock"
                      onChange={(e) => {
                        setReqStock(e.target.value);
                        setErrorMessages(prev => ({...prev, reqStock: ""}));
                      }}
                    />
                    {errorMessages.reqStock && (
                      <span className="add-product-error">
                        {errorMessages.reqStock}
                      </span>
                    )}
                  </div>
                </div>

                <div className="add-product-w-48 add-product-align-self-end">
                  <button 
                    onClick={handleMasterSubmit} 
                    className="add-product-btn add-product-btn-block"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;