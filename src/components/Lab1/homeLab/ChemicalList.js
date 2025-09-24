import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { getMasterChemicalApi } from "../../../services/AppinfoService";
import "../../../App.css";
import ChemicalUpdate from "../update/ChemicalUpdate";
import { FaEdit } from "react-icons/fa";
import "../../styles/styles.css";

const ChemicalList = () => {
  const [masters, setMasters] = useState([]);
  const [filteredMasters, setFilteredMasters] = useState([]);
  const [itemCodeFilter, setItemCodeFilter] = useState("");
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [editModalShow, setEditModalShow] = useState(false);
  const [editProjects, setEditProjects] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [stockFilter, setStockFilter] = useState("");
  const [projectCodeFilter, setProjectCodeFilter] = useState("");
  const [minReqStockFilter, setMinReqStockFilter] = useState(""); // ✅ Min Req Stock
  const [locationCodeFilter, setLocationCodeFilter] = useState(""); // ✅ Location Code
  const [projectNameFilter, setProjectNameFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const data = await getMasterChemicalApi();
        if (mounted) {
          const masterData = data.master_data; // First model data (ItemReceive)
          const secondModelData = data.second_model_data; // Second model data (ItemIssue)

          // Check the response data
          console.log("Master Data:", masterData);
          console.log("Second Model Data:", secondModelData);

          // Merge both datasets without filtering out any items
          const mergedData = [...masterData, ...secondModelData];

          // Check merged data
          console.log("Merged Data:", mergedData);

          setMasters(mergedData);
          setFilteredMasters(mergedData); // Update the filtered data as well
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      mounted = false;
      setIsUpdated(false);
    };
  }, [isUpdated]);

  // Ensure the filtering logic is not removing data
  const filterMasters = () => {
    return masters.filter(
      (master) =>
        master.item_code &&
        master.item_code.toLowerCase().includes(itemCodeFilter.toLowerCase()) &&
        master.item_name &&
        master.item_name.toLowerCase().includes(itemNameFilter.toLowerCase()) &&
        master.project_code &&
        master.project_code
          .toLowerCase()
          .includes(projectCodeFilter.toLowerCase()) &&
        master.project_name &&
        master.project_name
          .toLowerCase()
          .includes(projectNameFilter.toLowerCase()) &&
        master.quantity_received &&
        master.quantity_received
          .toString()
          .toLowerCase()
          .includes(stockFilter.toLowerCase()) &&
        master.price_unit &&
        master.price_unit.toLowerCase().includes(unitFilter.toLowerCase()) &&
        master.min_req_stock &&
        master.min_req_stock
          .toString()
          .toLowerCase()
          .includes(minReqStockFilter.toLowerCase()) &&
        master.location &&
        master.location.toLowerCase().includes(locationCodeFilter.toLowerCase())
    );
  };

  useEffect(() => {
    setFilteredMasters(filterMasters());
  }, [
    itemCodeFilter,
    itemNameFilter,
    masters,
    projectCodeFilter,
    projectNameFilter,
    stockFilter,
    unitFilter,
    minReqStockFilter,
    locationCodeFilter,
  ]);

  const handleUpdate = (e, stu) => {
    e.preventDefault();
    setEditProjects(stu);
    setEditModalShow(true);
  };

  const EditModelClose = () => setEditModalShow(false);

  return (
    <div>
      <div>
        <div
          className="row side-row"
          style={{
            textAlign: "center",
            maxHeight: "330px",
            overflowY: "scroll",
          }}
        >
          <p id="before-table"></p>
          <Table
            striped
            bordered
            hover
            className="react-bootstrap-table"
            id="dataTable"
          >
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Item Code
                  <Form.Control
                    type="text"
                    placeholder="Filter by Item Code"
                    value={itemCodeFilter}
                    onChange={(e) => setItemCodeFilter(e.target.value)}
                  />
                </th>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Item Name
                  <Form.Control
                    type="text"
                    placeholder="Filter by Item Name"
                    value={itemNameFilter}
                    onChange={(e) => setItemNameFilter(e.target.value)}
                  />
                </th>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Quantity Received
                  <Form.Control
                    type="text"
                    placeholder="Filter by Stock"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                  />
                </th>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Project Code
                  <Form.Control
                    type="text"
                    placeholder="Filter by Project Code"
                    value={projectCodeFilter}
                    onChange={(e) => setProjectCodeFilter(e.target.value)}
                  />
                </th>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Project Name
                  <Form.Control
                    type="text"
                    placeholder="Filter by Project Name"
                    value={projectNameFilter}
                    onChange={(e) => setProjectNameFilter(e.target.value)}
                  />
                </th>

                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Unit
                  <Form.Control
                    type="text"
                    placeholder="Filter by Unit"
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                  />
                </th>

                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Min Req Stock
                  <Form.Control
                    type="text"
                    placeholder="Filter by Min Req Stock"
                    value={minReqStockFilter}
                    onChange={(e) => setMinReqStockFilter(e.target.value)}
                  />
                </th>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Location Code
                  <Form.Control
                    type="text"
                    placeholder="Filter by Location Code"
                    value={locationCodeFilter}
                    onChange={(e) => setLocationCodeFilter(e.target.value)}
                  />
                </th>

                {/* <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Remarks
                </th> */}
                {/* <th style={{ backgroundColor: '#bdb76b', width: '250px', color: 'black', textAlign: 'center', border: '1px solid black' }}>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredMasters.map((master) => (
                <tr key={master.c_id}>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.item_code}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.item_name}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.quantity_received}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.project_code}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.project_name}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.price_unit || "-"}
                  </td>
                  {/* <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.manufacturer}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.supplier || "-"}
                  </td> */}
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.min_req_stock}
                  </td>
                  {/* <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.quantity_received || "-"}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.quantity_issued || "-"}
                  </td> */}
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.location || "-"}
                  </td>
                  {/* <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.remarks}
                  </td> */}
                  {/* <td style={{ textAlign: 'center', border: '1px solid black' }}>
                    <Button className="mr-2" onClick={(event) => handleUpdate(event, master)}>
                      <FaEdit />
                    </Button>
                    <ChemicalUpdate show={editModalShow} chemical={editProjects} setUpdated={setIsUpdated} onHide={EditModelClose} />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ChemicalList;
