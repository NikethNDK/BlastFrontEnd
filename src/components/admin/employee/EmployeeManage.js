import React, { useEffect, useState } from "react";
import { Table, Button, ButtonToolbar } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import AddEmployeeModal from "./AddEmployeeModal";
import UpdateEmployeeModal from "./UpdateEmployeeModal";
import {
  getEmployeeApi,
  inactiveEmployeeApi,
} from "../../../services/AppinfoService";

const EmployeeManage = () => {
  const [employees, setEmployees] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editEmployees, setEditEmployees] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [inactiveEmployees, setInactiveEmployees] = useState(new Set());

  useEffect(() => {
    let mounted = true;

    const fetchEmployees = async () => {
      try {
        const data = await getEmployeeApi();
        if (mounted) {
          setEmployees(data);

          // Retrieve and update inactive employees from localStorage
          const storedInactive =
            JSON.parse(localStorage.getItem("inactiveEmployees")) || [];
          const inactiveSet = new Set(storedInactive);
          data.forEach((emp) => {
            if (emp.is_inactive === true) {
              inactiveSet.add(emp.emp_id);
            }
          });

          setInactiveEmployees(inactiveSet);
          localStorage.setItem(
            "inactiveEmployees",
            JSON.stringify([...inactiveSet])
          );
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
    return () => {
      mounted = false;
    };
  }, [isUpdated]); // Re-fetch when `isUpdated` changes

  const handleUpdate = (e, emp) => {
    e.preventDefault();
    setEditModalShow(true);
    setEditEmployees(emp);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setAddModalShow(true);
  };

  const handleInactive = async (e, emp_id) => {
    e.preventDefault();
    try {
      await inactiveEmployeeApi(emp_id);
      alert("Employee marked as inactive");
      setInactiveEmployees((prev) => {
        const updatedSet = new Set(prev).add(emp_id);
        localStorage.setItem(
          "inactiveEmployees",
          JSON.stringify([...updatedSet])
        );
        return updatedSet;
      });
    } catch (error) {
      console.error("Failed to mark Employee as inactive:", error);
      alert("Failed to update Employee status");
    }
  };

  return (
    <div>
      <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2
          style={{ textAlign: "center", paddingTop: "15px", marginLeft: "40%" }}
        >
          EMPLOYEE MASTER
        </h2>
      </div>
      <div style={{ overflowX: "hidden", maxHeight: "510px" }}>
        <div className="row side-row" style={{ textAlign: "center" }}>
          <ButtonToolbar>
            <Button variant="primary" onClick={handleAdd}>
              Add Employee
            </Button>
            <AddEmployeeModal
              show={addModalShow}
              setUpdated={setIsUpdated}
              onHide={() => setAddModalShow(false)}
            />
          </ButtonToolbar>
          <Table striped bordered hover className="react-bootstrap-table">
            <thead>
              <tr>
                {[
                  "Employee Id",
                  "Employee Name",
                  "Project Code",
                  "Project Name",
                  "Lab",
                  "Designation",
                  "Action",
                ].map((header, index) => (
                  <th
                    key={index}
                    style={{
                      backgroundColor: "#C5EA31",
                      color: "black",
                      textAlign: "center",
                      border: "1px solid black",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const isInactive = inactiveEmployees.has(emp.emp_id);
                return (
                  <tr
                    key={emp.emp_id}
                    style={{
                      backgroundColor: isInactive ? "#d3d3d3" : "white",
                    }}
                  >
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {emp.emp_id}
                    </td>
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {emp.emp_name || ""}
                    </td>
                    {/* <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {emp.project_code || ""}
                    </td> */}
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {Array.isArray(emp.project_code)
                        ? emp.project_code.join(", ")
                        : emp.project_code || ""}
                    </td>

                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {Array.isArray(emp.project_code)
                        ? emp.project_name.join(", ")
                        : emp.project_name || ""}
                    </td>
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {emp.lab || ""}
                    </td>
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {emp.designation || ""}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {/* <Button
                        variant="warning"
                        onClick={(e) => handleUpdate(e, emp)}
                      >
                        <FaEdit /> Edit
                      </Button> */}
                      <Button
                        variant={isInactive ? "secondary" : "danger"}
                        style={{ marginLeft: "10px" }}
                        disabled={isInactive}
                        onClick={(e) => handleInactive(e, emp.emp_id)}
                      >
                        {isInactive ? "Inactive" : "Active"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
      <UpdateEmployeeModal
        show={editModalShow}
        setUpdated={setIsUpdated}
        onHide={() => setEditModalShow(false)}
        employee={editEmployees}
      />
    </div>
  );
};

export default EmployeeManage;
