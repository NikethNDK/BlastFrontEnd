import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getEmployeeApi } from "../../../services/AppinfoService";
import "../../../App.css";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../../layout/content";

const Employee = () => {
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    let mounted = true;
    getEmployeeApi()
      .then((data) => {
        if (mounted) {
          setEmployee(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, []);

  return (
    <PageLayout>
      <PageHeader title="Employees" />
      <PageBody>
      <ContentCard flush>
        <div className="lims-table-wrap">
          <Table
            striped
            bordered
            hover
            className="react-bootstrap-table lims-table"
            id="dataTable"
          >
            <thead>
              <tr>
                <th>Employee Id</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Project Code</th>
                <th>Project Name</th>
              </tr>
            </thead>
            <tbody>
              {employee.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.emp_id}</td>
                  <td>{emp.emp_name}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.project_code}</td>
                  <td>{emp.project_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default Employee;
