import { useState, useEffect } from "react";
import {
  createUnit,
  createLocationCode,
  createManufacturer,
  createSupplier,
  createMasterType,
  addLabMasterApi,
  getMastertyApi,
  getLabsApi,
  getMasterApi,
  getLocationsApi,
  getManufacturersApi,
  getSuppliersApi,
  getUnitsApi,
} from "../../../services/AppinfoService";
import toast from "react-hot-toast";
import { Button, Modal, Nav, Tab, Row, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../homeLab/inventory.css";
import "./AddProduct.css";

const AddProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // Get user from Redux store (preferred over userDetails prop)
  const reduxUser = useSelector((state) => state.user.user);
  const username = reduxUser?.user_name || userDetails.name;

  // Category Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Product Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [masterType, setMasterType] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [units, setUnits] = useState("");
  const [reqStock, setReqStock] = useState("");

  // Data States
  const [masterTypes, setMasterTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  // Category Tab State
  const [activeCategoryTab, setActiveCategoryTab] = useState("master-types");

  // Pagination States
  const [productsCurrentPage, setProductsCurrentPage] = useState(1);
  const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Error Messages
  const [errorMessages, setErrorMessages] = useState({});

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, [username]);

  // Reset categories pagination when tab changes
  useEffect(() => {
    setCategoriesCurrentPage(1);
  }, [activeCategoryTab]);

  const fetchAllData = async () => {
    try {
      // Fetch categories
      const masterTypesData = await getMastertyApi();
      setMasterTypes(masterTypesData);

      if (username) {
        const locationsData = await getLocationsApi(username);
        setLocations(locationsData || []);

        const manufacturersData = await getManufacturersApi(username);
        setManufacturers(manufacturersData || []);

        const suppliersData = await getSuppliersApi(username);
        setSuppliers(suppliersData || []);
      }

      // Fetch products
      if (username) {
        const productsData = await getMasterApi(null, username);
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Category Modal Handlers
  const handleShowCategoryModal = () => {
    setShowCategoryModal(true);
    setSelectedCategory("");
    setInputValue("");
    setErrorMessages({});
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory("");
    setInputValue("");
    setErrorMessages({});
  };

  const handleCategorySubmit = async () => {
    if (!selectedCategory || !inputValue.trim()) {
      setErrorMessages({ category: "Please select a category and enter a value." });
      return;
    }

    try {
      if (selectedCategory === "Location") {
        await createLocationCode(inputValue, username);
      } else if (selectedCategory === "Manufacturer") {
        await createManufacturer(inputValue, username);
      } else if (selectedCategory === "Supplier") {
        await createSupplier(inputValue, username);
      } else if (selectedCategory === "Master Type") {
        await createMasterType(inputValue);
      } else if (selectedCategory === "Unit") {
        await createUnit(inputValue);
      }

      toast.success(`${selectedCategory} added successfully!`);
      handleCloseCategoryModal();
      fetchAllData(); // Refresh data
    } catch (error) {
      toast.error(`Failed to add ${selectedCategory}.`);
      console.error("Error adding category:", error);
    }
  };

  // Product Modal Handlers
  const handleShowProductModal = () => {
    setShowProductModal(true);
    setMasterType("");
    setItemCode("");
    setItemName("");
    setUnits("");
    setReqStock("");
    setErrorMessages({});
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setMasterType("");
    setItemCode("");
    setItemName("");
    setUnits("");
    setReqStock("");
    setErrorMessages({});
  };

  const handleProductSubmit = async () => {
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

    // Get lab ID
    let labId = null;
    let labName = null;

    const userLab = reduxUser?.lab || userDetails.lab;
    if (userLab && Array.isArray(userLab) && userLab.length > 0) {
      labName = userLab[0];
      try {
        const labsResponse = await getLabsApi();
        const userLabObj = labsResponse.data.find((l) => l.name === labName);
        if (userLabObj) {
          labId = userLabObj.id;
        } else {
          toast.error("Unable to determine your lab. Please contact administrator.");
          return;
        }
      } catch (error) {
        toast.error("Unable to determine your lab. Please contact administrator.");
        return;
      }
    } else {
      toast.error("Unable to determine your lab. Please contact administrator.");
      return;
    }

    const masterData = {
      master_type: masterType,
      item_code: itemCode,
      item_name: itemName,
      min_req_stock: reqStock,
      units: units,
      lab: labId,
    };

    try {
      await addLabMasterApi(masterData, userDetails);
      toast.success("Product added successfully");
      handleCloseProductModal();
      fetchAllData(); // Refresh products
    } catch (error) {
      toast.error("Failed to add product.");
      console.error("Error adding product:", error);
    }
  };

  // Get current category data based on active tab
  const getCurrentCategoryData = () => {
    switch (activeCategoryTab) {
      case "master-types":
        return masterTypes;
      case "locations":
        return locations;
      case "manufacturers":
        return manufacturers;
      case "suppliers":
        return suppliers;
      default:
        return [];
    }
  };

  // Products pagination calculations
  const productsTotalPages = Math.ceil(products.length / itemsPerPage);
  const productsStartIndex = (productsCurrentPage - 1) * itemsPerPage;
  const productsEndIndex = productsStartIndex + itemsPerPage;
  const currentProducts = products.slice(productsStartIndex, productsEndIndex);

  // Categories pagination calculations
  const categoryData = getCurrentCategoryData();
  const categoriesTotalPages = Math.ceil(categoryData.length / itemsPerPage);
  const categoriesStartIndex = (categoriesCurrentPage - 1) * itemsPerPage;
  const categoriesEndIndex = categoriesStartIndex + itemsPerPage;
  const currentCategories = categoryData.slice(categoriesStartIndex, categoriesEndIndex);

  // Pagination handlers
  const handleProductsPageChange = (pageNumber) => {
    setProductsCurrentPage(pageNumber);
  };

  const handleCategoriesPageChange = (pageNumber) => {
    setCategoriesCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Header with Buttons */}
      <div className="add-product-header">
        <h1 className="add-product-title">Product & Category Management</h1>
        <div className="add-product-actions">
          <Button 
            variant="outline-primary" 
            onClick={handleShowCategoryModal}
            className="add-product-btn-modern"
          >
            Add Category
          </Button>
          <Button 
            variant="primary" 
            onClick={handleShowProductModal}
            className="add-product-btn-modern"
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className="add-product-modern-container">
      {/* Products Card */}
      <div className="add-product-card-modern">
        <div className="add-product-card-header-modern">
          <h2 className="add-product-card-title">Products</h2>
          <span className="add-product-count-badge">{products.length} items</span>
        </div>
        <div className="add-product-card-body-modern">
          <div className="table-wrapper-modern">
            <table className="inventory-table-modern">
              <thead>
                <tr>
                  <th className="table-header-modern">Item Code</th>
                  <th className="table-header-modern">Item Name</th>
                  <th className="table-header-modern">Master Type</th>
                  <th className="table-header-modern">Units</th>
                  <th className="table-header-modern">Minimum Required Stock</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product, index) => (
                    <tr key={product.c_id || index} className="data-row-modern">
                      <td className="table-cell-modern">{product.item_code || "-"}</td>
                      <td className="table-cell-modern">{product.item_name || "-"}</td>
                      <td className="table-cell-modern">{product.master_type || "-"}</td>
                      <td className="table-cell-modern">{product.units || "-"}</td>
                      <td className="table-cell-modern">{product.min_req_stock || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data-cell-modern">
                      No products found. Add a product to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Products Pagination */}
          {productsTotalPages > 1 && (
            <div className="pagination-controls bottom">
              <div className="pagination-navigation">
                <button
                  onClick={() => handleProductsPageChange(Math.max(1, productsCurrentPage - 1))}
                  disabled={productsCurrentPage === 1}
                  className="pagination-btn prev-btn"
                >
                  <FaChevronLeft size={14} />
                  Previous
                </button>
                <div className="pagination-numbers">
                  {Array.from({ length: productsTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleProductsPageChange(page)}
                      className={`pagination-btn page-btn ${
                        productsCurrentPage === page ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleProductsPageChange(Math.min(productsTotalPages, productsCurrentPage + 1))}
                  disabled={productsCurrentPage === productsTotalPages}
                  className="pagination-btn next-btn"
                >
                  Next
                  <FaChevronRight size={14} />
                </button>
              </div>
              <div className="pagination-summary">
                Page {productsCurrentPage} of {productsTotalPages}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories Card */}
      <div className="add-product-card-modern">
        <div className="add-product-card-header-modern">
          <h2 className="add-product-card-title">Categories</h2>
        </div>
        <div className="add-product-card-body-modern">
          <Tab.Container activeKey={activeCategoryTab} onSelect={(k) => setActiveCategoryTab(k || "master-types")}>
            <Nav variant="tabs" className="add-product-tabs-modern">
              <Nav.Item>
                <Nav.Link eventKey="master-types">Master Types</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="locations">Locations</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="manufacturers">Manufacturers</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="suppliers">Suppliers</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="add-product-tab-content">
              <Tab.Pane eventKey="master-types">
                <div className="table-wrapper-modern">
                  <table className="inventory-table-modern">
                    <thead>
                      <tr>
                        <th className="table-header-modern">ID</th>
                        <th className="table-header-modern">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategories.length > 0 ? (
                        currentCategories.map((type) => (
                          <tr key={type.id} className="data-row-modern">
                            <td className="table-cell-modern">{type.id}</td>
                            <td className="table-cell-modern">{type.name}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="no-data-cell-modern">
                            No master types found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="locations">
                <div className="table-wrapper-modern">
                  <table className="inventory-table-modern">
                    <thead>
                      <tr>
                        <th className="table-header-modern">ID</th>
                        <th className="table-header-modern">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategories.length > 0 ? (
                        currentCategories.map((location) => (
                          <tr key={location.id} className="data-row-modern">
                            <td className="table-cell-modern">{location.id}</td>
                            <td className="table-cell-modern">{location.location}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="no-data-cell-modern">
                            No locations found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="manufacturers">
                <div className="table-wrapper-modern">
                  <table className="inventory-table-modern">
                    <thead>
                      <tr>
                        <th className="table-header-modern">ID</th>
                        <th className="table-header-modern">Manufacturer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategories.length > 0 ? (
                        currentCategories.map((manufacturer) => (
                          <tr key={manufacturer.id} className="data-row-modern">
                            <td className="table-cell-modern">{manufacturer.id}</td>
                            <td className="table-cell-modern">{manufacturer.manufacturer}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="no-data-cell-modern">
                            No manufacturers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="suppliers">
                <div className="table-wrapper-modern">
                  <table className="inventory-table-modern">
                    <thead>
                      <tr>
                        <th className="table-header-modern">ID</th>
                        <th className="table-header-modern">Supplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategories.length > 0 ? (
                        currentCategories.map((supplier) => (
                          <tr key={supplier.id} className="data-row-modern">
                            <td className="table-cell-modern">{supplier.id}</td>
                            <td className="table-cell-modern">{supplier.supplier}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="no-data-cell-modern">
                            No suppliers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="units">
                <div className="table-wrapper-modern">
                  <table className="inventory-table-modern">
                    <thead>
                      <tr>
                        <th className="table-header-modern">ID</th>
                        <th className="table-header-modern">Unit Measure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategories.length > 0 ? (
                        currentCategories.map((unit) => (
                          <tr key={unit.id} className="data-row-modern">
                            <td className="table-cell-modern">{unit.id}</td>
                            <td className="table-cell-modern">{unit.unit_measure}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="no-data-cell-modern">
                            No units found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
          {/* Categories Pagination */}
          {categoriesTotalPages > 1 && (
            <div className="pagination-controls bottom">
              <div className="pagination-navigation">
                <button
                  onClick={() => handleCategoriesPageChange(Math.max(1, categoriesCurrentPage - 1))}
                  disabled={categoriesCurrentPage === 1}
                  className="pagination-btn prev-btn"
                >
                  <FaChevronLeft size={14} />
                  Previous
                </button>
                <div className="pagination-numbers">
                  {Array.from({ length: categoriesTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleCategoriesPageChange(page)}
                      className={`pagination-btn page-btn ${
                        categoriesCurrentPage === page ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleCategoriesPageChange(Math.min(categoriesTotalPages, categoriesCurrentPage + 1))}
                  disabled={categoriesCurrentPage === categoriesTotalPages}
                  className="pagination-btn next-btn"
                >
                  Next
                  <FaChevronRight size={14} />
                </button>
              </div>
              <div className="pagination-summary">
                Page {categoriesCurrentPage} of {categoriesTotalPages}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Add Category Modal */}
      <Modal show={showCategoryModal} onHide={handleCloseCategoryModal} centered>
        <Modal.Header closeButton className="add-product-modal-header">
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="add-product-modal-body">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Category</Form.Label>
              <select
                value={selectedCategory}
                className="form-control add-product-form-control-modern"
                style={{ borderColor: errorMessages.category ? "red" : "#e2e8f0" }}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setErrorMessages((prev) => ({ ...prev, category: "" }));
                }}
              >
                <option value="">-- Select --</option>
                <option value="Master Type">Master Type</option>
                <option value="Location">Location</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Supplier">Supplier</option>
                <option value="Unit">Unit</option>
              </select>
              {errorMessages.category && (
                <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", display: "block" }}>
                  {errorMessages.category}
                </span>
              )}
            </Form.Group>

            {selectedCategory && (
              <Form.Group className="mb-3">
                <Form.Label>{selectedCategory} Name</Form.Label>
                <Form.Control
                  type="text"
                  value={inputValue}
                  placeholder={`Enter ${selectedCategory} name`}
                  className="add-product-form-control-modern"
                  style={{ borderColor: errorMessages.category ? "red" : "#e2e8f0" }}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setErrorMessages((prev) => ({ ...prev, category: "" }));
                  }}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="add-product-modal-footer">
          <Button variant="outline-secondary" onClick={handleCloseCategoryModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCategorySubmit}>
            Add {selectedCategory || "Category"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Product Modal */}
      <Modal show={showProductModal} onHide={handleCloseProductModal} size="lg" scrollable>
        <Modal.Header closeButton className="add-product-modal-header">
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body className="add-product-modal-body">
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Master Type</Form.Label>
                  <select
                    value={masterType}
                    className="form-control add-product-form-control-modern"
                    style={{ borderColor: errorMessages.masterType ? "red" : "#e2e8f0" }}
                    onChange={(e) => {
                      setMasterType(e.target.value);
                      setErrorMessages((prev) => ({ ...prev, masterType: "" }));
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
                    <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", display: "block" }}>
                      {errorMessages.masterType}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="text"
                    value={units}
                    placeholder="Enter unit"
                    className="add-product-form-control-modern"
                    style={{ borderColor: errorMessages.units ? "red" : "#e2e8f0" }}
                    onChange={(e) => {
                      setUnits(e.target.value);
                      setErrorMessages((prev) => ({ ...prev, units: "" }));
                    }}
                  />
                  {errorMessages.units && (
                    <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", display: "block" }}>
                      {errorMessages.units}
                    </span>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={itemName}
                    placeholder="Enter item name"
                    className="add-product-form-control-modern"
                    style={{ borderColor: errorMessages.itemName ? "red" : "#e2e8f0" }}
                    onChange={(e) => {
                      setItemName(e.target.value);
                      setErrorMessages((prev) => ({ ...prev, itemName: "" }));
                    }}
                  />
                  {errorMessages.itemName && (
                    <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", display: "block" }}>
                      {errorMessages.itemName}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Item Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={itemCode}
                    placeholder="Enter item code"
                    className="add-product-form-control-modern"
                    style={{ borderColor: errorMessages.itemCode ? "red" : "#e2e8f0" }}
                    onChange={(e) => {
                      setItemCode(e.target.value);
                      setErrorMessages((prev) => ({ ...prev, itemCode: "" }));
                    }}
                  />
                  {errorMessages.itemCode && (
                    <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", display: "block" }}>
                      {errorMessages.itemCode}
                    </span>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Minimum Required Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={reqStock}
                    placeholder="Enter minimum stock"
                    className="add-product-form-control-modern"
                    style={{ borderColor: errorMessages.reqStock ? "red" : "#e2e8f0" }}
                    onChange={(e) => {
                      setReqStock(e.target.value);
                      setErrorMessages((prev) => ({ ...prev, reqStock: "" }));
                    }}
                  />
                  {errorMessages.reqStock && (
                    <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", display: "block" }}>
                      {errorMessages.reqStock}
                    </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="add-product-modal-footer">
          <Button variant="outline-secondary" onClick={handleCloseProductModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleProductSubmit}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProduct;
