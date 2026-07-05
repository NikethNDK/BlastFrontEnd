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
import { Modal, Nav, Tab, Row, Col, Form } from "react-bootstrap";
import { FaBox, FaPlus, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import "./AddProduct.css";
import { PageLayout, PageHeader } from "../../layout/content";

const AddProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const reduxUser = useSelector((state) => state.user.user);
  const username = reduxUser?.user_name || userDetails.name;

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [masterType, setMasterType] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [units, setUnits] = useState("");
  const [reqStock, setReqStock] = useState("");

  const [masterTypes, setMasterTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [activeCategoryTab, setActiveCategoryTab] = useState("master-types");

  const [productsCurrentPage, setProductsCurrentPage] = useState(1);
  const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    fetchAllData();
  }, [username]);

  useEffect(() => {
    setCategoriesCurrentPage(1);
  }, [activeCategoryTab]);

  const fetchAllData = async () => {
    try {
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

      if (username) {
        const productsData = await getMasterApi(null, username);
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      }

      toast.success(`${selectedCategory} added successfully!`);
      handleCloseCategoryModal();
      fetchAllData();
    } catch (error) {
      toast.error(`Failed to add ${selectedCategory}.`);
      console.error("Error adding category:", error);
    }
  };

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
      fetchAllData();
    } catch (error) {
      toast.error("Failed to add product.");
      console.error("Error adding product:", error);
    }
  };

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

  const productsTotalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const productsStartIndex = (productsCurrentPage - 1) * itemsPerPage;
  const productsEndIndex = productsStartIndex + itemsPerPage;
  const currentProducts = products.slice(productsStartIndex, productsEndIndex);

  const categoryData = getCurrentCategoryData();
  const categoriesTotalPages = Math.ceil(categoryData.length / itemsPerPage) || 1;
  const categoriesStartIndex = (categoriesCurrentPage - 1) * itemsPerPage;
  const categoriesEndIndex = categoriesStartIndex + itemsPerPage;
  const currentCategories = categoryData.slice(categoriesStartIndex, categoriesEndIndex);

  const handleProductsPageChange = (pageNumber) => {
    setProductsCurrentPage(pageNumber);
  };

  const handleCategoriesPageChange = (pageNumber) => {
    setCategoriesCurrentPage(pageNumber);
  };

  const renderFieldError = (message) =>
    message ? <span className="project-field-error">{message}</span> : null;

  const renderCategoryTable = (columns, rows, emptyMessage) => (
    <section className="project-panel" aria-label="Category list">
      <div className="project-table-section">
        <div className="project-table-shell">
          <table className="project-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} scope="col" className={`pt-col ${col.colClass || ""}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.key} className="project-table-row">
                    {columns.map((col) => (
                      <td key={col.key} className={`pt-col ${col.colClass || ""}`} data-label={col.label}>
                        {col.render(row.data)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr className="project-table-row project-table-row--empty">
                  <td colSpan={columns.length}>
                    <div className="project-empty">
                      <p>{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );

  return (
    <PageLayout>
      <PageHeader
        title="Product & category management"
        actions={
          <>
            <button
              type="button"
              className="lims-header-btn"
              onClick={handleShowProductModal}
            >
              <FaPlus aria-hidden />
              Add Product
            </button>
            <button
              type="button"
              className="lims-header-btn"
              onClick={handleShowCategoryModal}
            >
              <FaPlus aria-hidden />
              Add Category
            </button>
          </>
        }
      />

      <div className="add-product-page">
        <div className="project-stats" role="list">
          <div className="project-stat-card" role="listitem">
            <div className="project-stat-icon project-stat-icon--total">
              <FaBox aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value">{products.length}</span>
              <span className="project-stat-label">Total products</span>
            </div>
          </div>
        </div>

        <section className="project-panel" aria-label="Products">
          <div className="add-product-panel-heading">
            <h2 className="add-product-panel-title">Products</h2>
          </div>
          <div className="project-table-section">
            <div className="project-table-shell">
              <table className="project-table">
                <thead>
                  <tr>
                    <th scope="col" className="pt-col pt-col--code">Item Code</th>
                    <th scope="col" className="pt-col pt-col--name">Item Name</th>
                    <th scope="col" className="pt-col pt-col--master-type">Master Type</th>
                    <th scope="col" className="pt-col pt-col--units">Units</th>
                    <th scope="col" className="pt-col pt-col--stock">Minimum Required Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr key={product.c_id || index} className="project-table-row">
                        <td className="pt-col pt-col--code" data-label="Item Code">{product.item_code || "—"}</td>
                        <td className="pt-col pt-col--name" data-label="Item Name">{product.item_name || "—"}</td>
                        <td className="pt-col pt-col--master-type" data-label="Master Type">{product.master_type || "—"}</td>
                        <td className="pt-col pt-col--units" data-label="Units">{product.units || "—"}</td>
                        <td className="pt-col pt-col--stock" data-label="Minimum Required Stock">
                          {product.min_req_stock || "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="project-table-row project-table-row--empty">
                      <td colSpan="5">
                        <div className="project-empty">
                          <div className="project-empty-icon-wrap">
                            <FaBox aria-hidden />
                          </div>
                          <h3>No products found</h3>
                          <p>Add a product to get started.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              showSummary
              showItemsPerPage={false}
              totalItems={products.length}
              startIndex={productsStartIndex}
              endIndex={productsEndIndex}
              itemsPerPage={itemsPerPage}
              currentPage={productsCurrentPage}
              totalPages={productsTotalPages}
              onPageChange={handleProductsPageChange}
              position="bottom"
            />
          </div>
        </section>

        <section className="add-product-categories" aria-label="Categories">
          <div className="add-product-panel-heading">
            <h2 className="add-product-panel-title">Categories</h2>
          </div>

          <Tab.Container
            activeKey={activeCategoryTab}
            onSelect={(k) => setActiveCategoryTab(k || "master-types")}
          >
            <Nav variant="tabs" className="add-product-category-tabs">
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
                {renderCategoryTable(
                  [
                    { key: "id", label: "ID", colClass: "pt-col--id", render: (type) => type.id },
                    { key: "name", label: "Name", colClass: "pt-col--name", render: (type) => type.name },
                  ],
                  currentCategories.map((type) => ({
                    key: type.id,
                    data: type,
                  })),
                  "No master types found."
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="locations">
                {renderCategoryTable(
                  [
                    { key: "id", label: "ID", colClass: "pt-col--id", render: (loc) => loc.id },
                    {
                      key: "location",
                      label: "Location",
                      colClass: "pt-col--location",
                      render: (loc) => loc.location,
                    },
                  ],
                  currentCategories.map((location) => ({
                    key: location.id,
                    data: location,
                  })),
                  "No locations found."
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="manufacturers">
                {renderCategoryTable(
                  [
                    { key: "id", label: "ID", colClass: "pt-col--id", render: (m) => m.id },
                    {
                      key: "manufacturer",
                      label: "Manufacturer",
                      colClass: "pt-col--manufacturer",
                      render: (m) => m.manufacturer,
                    },
                  ],
                  currentCategories.map((manufacturer) => ({
                    key: manufacturer.id,
                    data: manufacturer,
                  })),
                  "No manufacturers found."
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="suppliers">
                {renderCategoryTable(
                  [
                    { key: "id", label: "ID", colClass: "pt-col--id", render: (s) => s.id },
                    {
                      key: "supplier",
                      label: "Supplier",
                      colClass: "pt-col--supplier",
                      render: (s) => s.supplier,
                    },
                  ],
                  currentCategories.map((supplier) => ({
                    key: supplier.id,
                    data: supplier,
                  })),
                  "No suppliers found."
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="units">
                {renderCategoryTable(
                  [
                    { key: "id", label: "ID", colClass: "pt-col--id", render: (u) => u.id },
                    {
                      key: "unit_measure",
                      label: "Unit Measure",
                      colClass: "pt-col--unit",
                      render: (u) => u.unit_measure,
                    },
                  ],
                  currentCategories.map((unit) => ({
                    key: unit.id,
                    data: unit,
                  })),
                  "No units found."
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>

          <Pagination
            showSummary
            showItemsPerPage={false}
            totalItems={categoryData.length}
            startIndex={categoriesStartIndex}
            endIndex={categoriesEndIndex}
            itemsPerPage={itemsPerPage}
            currentPage={categoriesCurrentPage}
            totalPages={categoriesTotalPages}
            onPageChange={handleCategoriesPageChange}
            position="bottom"
            className="add-product-categories-pagination"
          />
        </section>
      </div>

      <Modal
        show={showCategoryModal}
        onHide={handleCloseCategoryModal}
        size="sm"
        scrollable
        centered
        backdrop="static"
        dialogClassName="project-modal project-modal--form"
        contentClassName="project-modal-content"
        aria-labelledby="add-category-modal-title"
      >
        <div className="project-modal-header">
          <button
            type="button"
            className="project-modal-close"
            onClick={handleCloseCategoryModal}
            aria-label="Close"
          >
            <FaTimes aria-hidden />
          </button>
          <h2 id="add-category-modal-title" className="project-modal-title">
            Add Category
          </h2>
          <p className="project-modal-description">
            Add a master type, location, manufacturer, or supplier.
          </p>
        </div>
        <Modal.Body className="project-modal-body">
          <Form className="project-modal-form">
            <Form.Group className="project-field">
              <Form.Label>Select Category</Form.Label>
              <Form.Select
                value={selectedCategory}
                className={`project-field-input${
                  errorMessages.category ? " project-field-input--error" : ""
                }`}
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
              </Form.Select>
              {renderFieldError(errorMessages.category)}
            </Form.Group>

            {selectedCategory && (
              <Form.Group className="project-field">
                <Form.Label>{selectedCategory} Name</Form.Label>
                <Form.Control
                  type="text"
                  value={inputValue}
                  placeholder={`Enter ${selectedCategory} name`}
                  className={`project-field-input${
                    errorMessages.category ? " project-field-input--error" : ""
                  }`}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setErrorMessages((prev) => ({ ...prev, category: "" }));
                  }}
                />
              </Form.Group>
            )}

            <div className="project-modal-form-actions">
              <button
                type="button"
                className="project-btn project-btn-outline"
                onClick={handleCloseCategoryModal}
              >
                Close
              </button>
              <button
                type="button"
                className="project-btn project-btn-primary"
                onClick={handleCategorySubmit}
              >
                Add {selectedCategory || "Category"}
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showProductModal}
        onHide={handleCloseProductModal}
        size="lg"
        scrollable
        centered
        backdrop="static"
        dialogClassName="project-modal project-modal--wide"
        contentClassName="project-modal-content"
        aria-labelledby="add-product-modal-title"
      >
        <div className="project-modal-header">
          <button
            type="button"
            className="project-modal-close"
            onClick={handleCloseProductModal}
            aria-label="Close"
          >
            <FaTimes aria-hidden />
          </button>
          <h2 id="add-product-modal-title" className="project-modal-title">
            Add Product
          </h2>
          <p className="project-modal-description">
            Define item details, master type, units, and minimum stock level.
          </p>
        </div>
        <Modal.Body className="project-modal-body">
          <Form className="project-modal-form">
            <Row>
              <Col md={6}>
                <Form.Group className="project-field">
                  <Form.Label>Master Type</Form.Label>
                  <Form.Select
                    value={masterType}
                    className={`project-field-input${
                      errorMessages.masterType ? " project-field-input--error" : ""
                    }`}
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
                  </Form.Select>
                  {renderFieldError(errorMessages.masterType)}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="project-field">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="text"
                    value={units}
                    placeholder="Enter unit"
                    className={`project-field-input${
                      errorMessages.units ? " project-field-input--error" : ""
                    }`}
                    onChange={(e) => {
                      setUnits(e.target.value);
                      setErrorMessages((prev) => ({ ...prev, units: "" }));
                    }}
                  />
                  {renderFieldError(errorMessages.units)}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="project-field">
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={itemName}
                    placeholder="Enter item name"
                    className={`project-field-input${
                      errorMessages.itemName ? " project-field-input--error" : ""
                    }`}
                    onChange={(e) => {
                      setItemName(e.target.value);
                      setErrorMessages((prev) => ({ ...prev, itemName: "" }));
                    }}
                  />
                  {renderFieldError(errorMessages.itemName)}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="project-field">
                  <Form.Label>Item Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={itemCode}
                    placeholder="Enter item code"
                    className={`project-field-input${
                      errorMessages.itemCode ? " project-field-input--error" : ""
                    }`}
                    onChange={(e) => {
                      setItemCode(e.target.value);
                      setErrorMessages((prev) => ({ ...prev, itemCode: "" }));
                    }}
                  />
                  {renderFieldError(errorMessages.itemCode)}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="project-field">
                  <Form.Label>Minimum Required Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={reqStock}
                    placeholder="Enter minimum stock"
                    className={`project-field-input${
                      errorMessages.reqStock ? " project-field-input--error" : ""
                    }`}
                    onChange={(e) => {
                      setReqStock(e.target.value);
                      setErrorMessages((prev) => ({ ...prev, reqStock: "" }));
                    }}
                  />
                  {renderFieldError(errorMessages.reqStock)}
                </Form.Group>
              </Col>
            </Row>

            <div className="project-modal-form-actions">
              <button
                type="button"
                className="project-btn project-btn-outline"
                onClick={handleCloseProductModal}
              >
                Close
              </button>
              <button
                type="button"
                className="project-btn project-btn-primary"
                onClick={handleProductSubmit}
              >
                Add Product
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </PageLayout>
  );
};

export default AddProduct;
