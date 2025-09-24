import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getTempReceiveApi,
  updateTempReceiveApi,
  deleteTempReceiveApi,
  getManufacturersApi,
  getProjectApi,
  getUnitsApi,
  getSuppliersApi,
  getLocationsApi,
  getMasterApi,
} from "../../../services/AppinfoService";
import "../../../App.css";

const TempReceiveTable = () => {
  const [receive, setReceive] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [units, setUnits] = useState([]);
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [projectCodes, setProjectCodes] = useState([]);
  const [itemsCodes, setItemsCodes] = useState([]);
  const [itemsNames, setItemsNames] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDropdownData();
  }, []);

  const fetchData = () => {
    getTempReceiveApi()
      .then((data) => setReceive(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const fetchDropdownData = async () => {
    try {
      const [manData, projData, unitData, supData, locData, masterData] =
        await Promise.all([
          getManufacturersApi(),
          getProjectApi(),
          getUnitsApi(),
          getSuppliersApi(),
          getLocationsApi(),
          getMasterApi(),
        ]);

      setManufacturers(manData.map((item) => ({ label: item.manufacturer })));
      setSuppliers(supData.map((item) => ({ label: item.supplier })));
      setUnits(
        unitData.map((item) => ({ value: item.id, label: item.unit_measure }))
      );
      setLocations(
        locData.map((item) => ({ value: item.id, label: item.location }))
      );

      setProjectNames(
        projData.map((item) => ({
          value: item.project_name,
          label: item.project_name,
        }))
      );
      setProjectCodes(
        projData.map((item) => ({
          value: item.project_code,
          label: item.project_code,
        }))
      );

      setItemsCodes(
        masterData.map((item) => ({ value: item.c_id, label: item.item_code }))
      );
      setItemsNames(
        masterData.map((item) => ({ value: item.c_id, label: item.item_name }))
      );
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    try {
      await updateTempReceiveApi(selectedItem.bill_no, selectedItem);
      alert("Updated Successfully!");
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Update Failed!");
    }
  };

  const handleDelete = async (billNo) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteTempReceiveApi(billNo);
      setReceive(receive.filter((item) => item.bill_no !== billNo));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleChange = (e) => {
    setSelectedItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <div style={{ overflowY: "auto", maxHeight: "280px" }}>
        <Table striped bordered hover className="react-bootstrap-table">
          <thead>
            <tr>
              <th style={headerStyle}>Catalogue No</th>
              <th style={headerStyle}>PO Number</th>
              <th style={headerStyle}>Item Code</th>
              <th style={headerStyle}>Item Name</th>
              <th style={headerStyle}>Project Name</th>
              <th style={headerStyle}>Project Code</th>
              <th style={headerStyle}>Quantity Received</th>
              <th style={headerStyle}>Price</th>
              <th style={headerStyle}>Expiry Date</th>
              <th style={headerStyle}>Manufacturer</th>
              <th style={headerStyle}>Supplier</th>
              <th style={headerStyle}>Invoice No</th>
              <th style={headerStyle}>Location</th>
              <th style={headerStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {receive.map((item) => (
              <tr key={item.bill_no}>
                <td style={cellStyle}>{item.bill_no}</td>
                <td style={cellStyle}>{item.po_number}</td>
                <td style={cellStyle}>{item.item_code}</td>
                <td style={cellStyle}>{item.item_name}</td>
                <td style={cellStyle}>{item.project_name}</td>
                <td style={cellStyle}>{item.project_code}</td>
                <td style={cellStyle}>{item.quantity_received}</td>
                <td style={cellStyle}>{item.price_unit}</td>
                <td style={cellStyle}>{item.expiry_date}</td>
                <td style={cellStyle}>{item.manufacturer}</td>
                <td style={cellStyle}>{item.supplier}</td>
                <td style={cellStyle}>{item.invoice_number}</td>
                <td style={cellStyle}>{item.location}</td>
                <td style={cellStyle}>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    style={{ marginRight: "5px", padding: "5px" }}
                  >
                    <FaEdit color="black" />
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => handleDelete(item.bill_no)}
                    style={{ padding: "5px" }}
                  >
                    <FaTrash color="black" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <Form>
              {/* PO Number */}
              <Form.Group>
                <Form.Label>PO Number</Form.Label>
                <Form.Control
                  type="text"
                  name="po_number"
                  value={selectedItem.po_number}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Item Code */}
              <Form.Group>
                <Form.Label>Item Code</Form.Label>
                <Form.Select
                  name="item_code"
                  value={selectedItem.item_code}
                  onChange={handleChange}
                >
                  <option value="">Select Item Code</option>
                  {itemsCodes.map((item) => (
                    <option key={item.value} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Item Name */}
              <Form.Group>
                <Form.Label>Item Name</Form.Label>
                <Form.Select
                  name="item_name"
                  value={selectedItem.item_name}
                  onChange={handleChange}
                >
                  <option value="">Select Item Name</option>
                  {itemsNames.map((item) => (
                    <option key={item.value} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Quantity Received */}
              <Form.Group>
                <Form.Label>Quantity Received</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity_received"
                  value={selectedItem.quantity_received}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Unit Price */}
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  name="price_unit"
                  value={selectedItem.price_unit}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Expiry Date */}
              <Form.Group>
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  name="expiry_date"
                  value={selectedItem.expiry_date}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Invoice No */}
              <Form.Group>
                <Form.Label>Invoice No</Form.Label>
                <Form.Control
                  type="text"
                  name="invoice_number"
                  value={selectedItem.invoice_number}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Location */}
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Select
                  name="location"
                  value={selectedItem.location || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc.value} value={loc.label}>
                      {loc.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Project Name */}
              <Form.Group>
                <Form.Label>Project Name</Form.Label>
                <Form.Select
                  name="project_name"
                  value={selectedItem?.project_name || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Project Name</option>
                  {projectNames.map((proj) => (
                    <option key={proj.value} value={proj.value}>
                      {proj.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Project Code */}
              <Form.Group>
                <Form.Label>Project Code</Form.Label>
                <Form.Select
                  name="project_code"
                  value={selectedItem?.project_code || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Project Code</option>
                  {projectCodes.map((proj) => (
                    <option key={proj.value} value={proj.value}>
                      {proj.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Manufacturer */}
              <Form.Group>
                <Form.Label>Manufacturer</Form.Label>
                <Form.Select
                  name="manufacturer"
                  value={selectedItem.manufacturer}
                  onChange={handleChange}
                >
                  <option value="">Select Manufacturer</option>
                  {manufacturers.map((man) => (
                    <option key={man.value} value={man.value}>
                      {man.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Supplier */}
              <Form.Group>
                <Form.Label>Supplier</Form.Label>
                <Form.Select
                  name="supplier"
                  value={selectedItem.supplier}
                  onChange={handleChange}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup.value} value={sup.value}>
                      {sup.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const headerStyle = {
  backgroundColor: "#C5EA31",
  color: "black",
  textAlign: "center",
};
const cellStyle = { textAlign: "center" };

export default TempReceiveTable;
