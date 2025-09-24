import React, { useEffect, useState } from "react";
import axios from "axios";
import LabNavigation1 from "./LabNavigation1";
import "../entries/TransferredDataTable.css";

const EquipmentList = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    id: "",
    item_name: "",
    item_code: "",
    last_service_date: "",
    calibration_dates: "",
    expiry_date: "",
    min_req_stock: "",
    price_unit: "",
    project_code: "",
    location: "",
    quantity_received: "",
  });

  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/equipment/get/"
        );
        if (response.data && response.data.data) {
          setEquipmentData(response.data.data);
          setFilteredData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, []);

  useEffect(() => {
    const filtered = equipmentData.filter((item) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        return String(item[key])
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      });
    });
    setFilteredData(filtered);
  }, [filters, equipmentData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2 style={{ backgroundColor: "#C5EA31", padding: "8px" }}>
        Equipment Details
      </h2>
      <table
        style={{
          width: "77%",
          marginLeft: "22%",
          borderCollapse: "collapse",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              ID
              <br />
              <input
                placeholder="Filter"
                type="text"
                value={filters.id}
                onChange={(e) => handleFilterChange("id", e.target.value)}
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Item Name
              <br />
              <input
                type="text"
                placeholder="Filter"
                value={filters.item_name}
                onChange={(e) =>
                  handleFilterChange("item_name", e.target.value)
                }
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Item Code
              <br />
              <input
                type="text"
                placeholder="Filter"
                value={filters.item_code}
                onChange={(e) =>
                  handleFilterChange("item_code", e.target.value)
                }
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Last Service Date
              <br />
              <input
                type="text"
                placeholder="Filter"
                value={filters.last_service_date}
                onChange={(e) =>
                  handleFilterChange("last_service_date", e.target.value)
                }
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Calibration dates
              <br />
              <input
                type="text"
                placeholder="Filter"
                value={filters.calibration_dates}
                onChange={(e) =>
                  handleFilterChange("calibration_dates", e.target.value)
                }
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Expiry Date
              <br />
              <input
                type="text"
                placeholder="Filter"
                value={filters.expiry_date}
                onChange={(e) =>
                  handleFilterChange("expiry_date", e.target.value)
                }
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Min Stock
              <br />
              <input
                type="text"
                placeholder="Filter"
                value={filters.min_req_stock}
                onChange={(e) =>
                  handleFilterChange("min_req_stock", e.target.value)
                }
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Price/Unit
              <br />
              <input
                type="text"
                placeholder="Filter"
                value={filters.price_unit}
                onChange={(e) =>
                  handleFilterChange("price_unit", e.target.value)
                }
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Project Code
              <br />
              <input
                type="text"
                placeholder="Filter"
                value={filters.project_code}
                onChange={(e) =>
                  handleFilterChange("project_code", e.target.value)
                }
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Location
              <br />
              <input
                type="text"
                placeholder="Filter"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                style={{ width: "80%" }}
              />
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#C5EA31",
              }}
            >
              Quantity Received
              <br />
              <input
                placeholder="Filter"
                type="text"
                value={filters.quantity_received}
                onChange={(e) =>
                  handleFilterChange("quantity_received", e.target.value)
                }
                style={{ width: "80%" }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.item_name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.item_code}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.last_service_date}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.calibration_dates}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.expiry_date}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.min_req_stock}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.price_unit}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.project_code}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.location}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.quantity_received}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="11"
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentList;
