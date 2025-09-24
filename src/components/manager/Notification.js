import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Button, ButtonToolbar } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { getIssueItems } from "../../services/AppinfoService";
import AdminApprovalModal from "./AdminApproval";
import ManagerNavigation from "../manager/ManagerNavigation";

const Notification = ({
  no,
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [note, setNote] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editNotes, setEditNotes] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    if (note.length && !isUpdated) {
      return;
    }

    getIssueItems()
      .then((data) => {
        if (mounted) {
          setNote(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => {
      mounted = false;
      setIsUpdated(false);
    };
  }, [isUpdated, note]);

  const handleUpdate = (e, item) => {
    e.preventDefault();
    setEditModalShow(true);
    setEditNotes(item);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setAddModalShow(true);
  };

  let AddModelClose = () => setAddModalShow(false);
  let EditModelClose = () => setEditModalShow(false);

  // handling accept by changing
  const handleAccept = async (item) => {
    console.log("Sending request with entry_no:", item.entry_no); // Debugging line

    try {
      const payload = {
        id: item.entry_no, // Dynamically set the id
        status: "LAB-OPEN",
      };

      const response = await fetch(
        `http://localhost:8000/update-issue-items/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (response.ok) {
        // Remove the accepted item from the UI
        setNote((prevNotes) =>
          prevNotes.filter((n) => n.entry_no !== item.entry_no)
        );
        alert("Item has been accepted.");
      } else {
        console.error("Failed to accept item:", result.error);
      }
    } catch (error) {
      console.error("Error accepting item:", error);
    }
  };

  // handling accept by changing
  const handleDecline = async (item) => {
    console.log("Sending request with entry_no:", item.entry_no); // Debugging line

    try {
      const payload = {
        id: item.entry_no, // Dynamically set the id
        status: "MGR-DCL",
      };

      const response = await fetch(
        `http://localhost:8000/update-issue-items/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (response.ok) {
        // Remove the accepted item from the UI
        setNote((prevNotes) =>
          prevNotes.filter((n) => n.entry_no !== item.entry_no)
        );
        alert("Item has been Declined.");
      } else {
        console.error("Failed to accept item:", result.error);
      }
    } catch (error) {
      console.error("Error accepting item:", error);
    }
  };
  return (
    <div>
      <div
        style={{
          backgroundColor: "#C5EA31",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ textAlign: "center", paddingTop: "15px" }}>
          NOTIFICATION
        </h2>
      </div>

      <div
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          maxHeight: "480px",
        }}
      >
        <div className="row side-row" style={{ textAlign: "center" }}>
          <p id="manage"></p>
          <Table
            striped
            bordered
            hover
            className="react-bootstrap-table"
            id="dataTable"
            style={{ margin: "auto", width: "1500px" }}
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
                  Master Type
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
                  Item Code
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
                  Request Date
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
                  Requested By
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
                  Send To
                </th>

                <th
                  colspan="2"
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {note.map((no) => (
                <tr key={no.id}>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {no.master_type || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {no.item_code || ""}
                  </td>

                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {no.item_name || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {no.project_code || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {no.project_name || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {no.issue_date || ""}
                  </td>

                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {no.issued_to || "Researcher"}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {no.lab_assistant_name || ""}
                  </td>

                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    <Button
                      style={{
                        // backgroundColor: "white",
                        border: "none",
                        color: "black",
                        marginRight: "5px",
                        padding: "5px 18px",
                      }}
                      className="mr-2"
                      onClick={() => handleAccept(no)}
                    >
                      ✔
                    </Button>
                    <button
                      style={{
                        backgroundColor: "white",
                        border: "none",
                        marginRight: "5px",
                        padding: "5px 18px",
                      }}
                      onClick={() => handleDecline(no)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Notification;
