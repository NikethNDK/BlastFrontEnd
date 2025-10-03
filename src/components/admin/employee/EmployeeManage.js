import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUsers, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import AddEmployeeModal from "./AddEmployeeModal";
import UpdateEmployeeModal from "./UpdateEmployeeModal";
import {
  getEmployeeApi,
  inactiveEmployeeApi,
} from "../../../services/AppinfoService";
import toast from "react-hot-toast";

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
  }, [isUpdated]);

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
    if (!window.confirm("Are you sure you want to mark this employee as inactive?")) {
      return;
    }
    try {
      await inactiveEmployeeApi(emp_id);
      toast.success("Employee marked as inactive");
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
      toast.error("Failed to update Employee status");
    }
  };

  const styles = {
    container: {
      backgroundColor: "#f2f5e6",
      minHeight: "100vh",
      padding: "1rem",
    },
    wrapper: {
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      backgroundColor: "white",
      padding: "1rem",
      borderRadius: "0.5rem",
      boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
      marginBottom: "1rem",
      border: "1px solid #dee2e6",
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1rem",
    },
    headerTitle: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      color: "#495057",
      fontSize: "1.6rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      margin: "0 0 0.5rem 0",
    },
    subtitle: {
      color: "#6c757d",
      margin: "0",
      fontSize: "0.95rem",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "1rem",
      marginBottom: "1rem",
    },
    statCard: {
      backgroundColor: "white",
      border: "1px solid #dee2e6",
      borderRadius: "0.375rem",
      padding: "1rem",
      textAlign: "center",
      justifyContent: "space-evenly",
      display: "flex",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    statIcon: {
      fontSize: "1.3rem",
    },
    statValue: {
      fontSize: "1.3rem",
      fontWeight: "700",
      color: "#495057",
      marginBottom: "0.25rem",
    },
    statLabel: {
      color: "#6c757d",
      fontSize: "0.875rem",
      margin: "auto 0",
    },
    contentCard: {
      backgroundColor: "white",
      border: "1px solid #dee2e6",
      borderRadius: "0.5rem",
      boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    },
    contentHeader: {
      padding: "1.25rem 1.5rem",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6",
      borderTopLeftRadius: "0.5rem",
      borderTopRightRadius: "0.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1rem",
    },
    contentTitle: {
      margin: "0",
      color: "#495057",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "1.1rem",
    },
    addButton: {
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "1px solid #007bff",
      borderRadius: "0.25rem",
      cursor: "pointer",
      transition: "all 0.15s ease-in-out",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    contentBody: {
      padding: "1.5rem",
    },
    tableWrapper: {
      overflowX: "auto",
      border: "1px solid #dee2e6",
      borderRadius: "0.375rem",
    },
    table: {
      width: "100%",
      marginBottom: "0",
      borderCollapse: "collapse",
      backgroundColor: "#fff",
      fontSize: "0.875rem",
    },
    tableHead: {
      backgroundColor: "#6c757d",
    },
    th: {
      padding: "0.75rem 0.5rem",
      borderBottom: "2px solid #5a6268",
      fontWeight: "600",
      color: "#fff",
      fontSize: "0.875rem",
      textAlign: "center",
      verticalAlign: "middle",
      border: "1px solid #5a6268",
    },
    td: {
      padding: "0.75rem 0.5rem",
      borderBottom: "1px solid #dee2e6",
      color: "#495057",
      fontSize: "0.875rem",
      verticalAlign: "middle",
      textAlign: "center",
      border: "1px solid #dee2e6",
    },
    badge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      fontSize: "0.75rem",
      fontWeight: "600",
      lineHeight: "1",
      textAlign: "center",
      whiteSpace: "nowrap",
      verticalAlign: "baseline",
      borderRadius: "0.25rem",
    },
    badgeSuccess: {
      color: "#fff",
      backgroundColor: "#28a745",
    },
    badgeSecondary: {
      color: "#fff",
      backgroundColor: "#6c757d",
    },
    actionButton: {
      padding: "0.375rem 0.75rem",
      fontSize: "0.75rem",
      fontWeight: "400",
      borderRadius: "0.25rem",
      cursor: "pointer",
      transition: "all 0.15s ease-in-out",
      border: "1px solid transparent",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.25rem",
      color: "#fff",
    },
    buttonDanger: {
      backgroundColor: "#dc3545",
      borderColor: "#dc3545",
    },
    buttonSecondary: {
      backgroundColor: "#6c757d",
      borderColor: "#6c757d",
      opacity: "0.65",
      cursor: "not-allowed",
    },
  };

  const activeCount = employees.filter(emp => !inactiveEmployees.has(emp.emp_id)).length;
  const inactiveCount = employees.filter(emp => inactiveEmployees.has(emp.emp_id)).length;

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerTitle}>
              <h1 style={styles.title}>
                <FaUsers />
                EMPLOYEE MANAGEMENT
              </h1>
              <p style={styles.subtitle}>Manage and organize employee information</p>
            </div>
            <button
              style={styles.addButton}
              onClick={handleAdd}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3";
                e.currentTarget.style.borderColor = "#004085";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
                e.currentTarget.style.borderColor = "#007bff";
              }}
            >
              <FaUserPlus />
              Add Employee
            </button>
          </div>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: "#007bff"}}>
              <FaUsers />
            </div>
            <div style={styles.statValue}>{employees.length}</div>
            <p style={styles.statLabel}>Total Employees</p>
          </div>
          
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: "#28a745"}}>
              <FaCheckCircle />
            </div>
            <div style={styles.statValue}>{activeCount}</div>
            <p style={styles.statLabel}>Active Employees</p>
          </div>
          
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: "#ffc107"}}>
              <FaTimesCircle />
            </div>
            <div style={styles.statValue}>{inactiveCount}</div>
            <p style={styles.statLabel}>Inactive Employees</p>
          </div>
        </div>

        <div style={styles.contentCard}>
          <div style={styles.contentHeader}>
            <h4 style={styles.contentTitle}>
              <FaEye />
              Employee List
            </h4>
          </div>

          <div style={styles.contentBody}>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.tableHead}>
                  <tr>
                    <th style={styles.th}>Employee ID</th>
                    <th style={styles.th}>Employee Name</th>
                    <th style={styles.th}>Project Code</th>
                    <th style={styles.th}>Project Name</th>
                    <th style={styles.th}>Lab</th>
                    <th style={styles.th}>Designation</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const isInactive = inactiveEmployees.has(emp.emp_id);
                    return (
                      <tr
                        key={emp.emp_id}
                        style={{
                          backgroundColor: isInactive ? "#f8f9fa" : "white",
                        }}
                        onMouseEnter={(e) => {
                          if (!isInactive) {
                            e.currentTarget.style.backgroundColor = "#f8f9fa";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isInactive ? "#f8f9fa" : "white";
                        }}
                      >
                        <td style={styles.td}>{emp.emp_id}</td>
                        <td style={{...styles.td, fontWeight: "500"}}>{emp.emp_name || ""}</td>
                        <td style={styles.td}>
                          {Array.isArray(emp.project_code)
                            ? emp.project_code.join(", ")
                            : emp.project_code || ""}
                        </td>
                        <td style={styles.td}>
                          {Array.isArray(emp.project_name)
                            ? emp.project_name.join(", ")
                            : emp.project_name || ""}
                        </td>
                        <td style={styles.td}>{emp.lab || ""}</td>
                        <td style={styles.td}>{emp.designation || ""}</td>
                        <td style={styles.td}>
                          <span
                            style={isInactive ? {...styles.badge, ...styles.badgeSecondary} : {...styles.badge, ...styles.badgeSuccess}}
                          >
                            {isInactive ? "Inactive" : "Active"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            style={isInactive ? {...styles.actionButton, ...styles.buttonSecondary} : {...styles.actionButton, ...styles.buttonDanger}}
                            disabled={isInactive}
                            onClick={(e) => handleInactive(e, emp.emp_id)}
                            onMouseEnter={(e) => {
                              if (!isInactive) {
                                e.currentTarget.style.backgroundColor = "#c82333";
                                e.currentTarget.style.borderColor = "#bd2130";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isInactive) {
                                e.currentTarget.style.backgroundColor = "#dc3545";
                                e.currentTarget.style.borderColor = "#dc3545";
                              }
                            }}
                          >
                            {isInactive ? "Inactive" : "Mark Inactive"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
                  
      < AddEmployeeModal
        show={addModalShow}
        setUpdated={setIsUpdated}
        onHide={() => setAddModalShow(false)}
       />              

      <UpdateEmployeeModal
        show={editModalShow}
        setUpdated={setIsUpdated}
        onHide={() => setEditModalShow(false)}
        employee={editEmployees}
      />
    </div>
  );
};

export default EmployeeManage