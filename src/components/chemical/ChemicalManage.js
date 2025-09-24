import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import { Button, ButtonToolbar } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import AddChemicalModal from "./AddChemicalModal";
import UpdateChemicalModal from "./UpdateChemicalModal";
import {
  getMasterApi,
  inactiveMasterApi,
  getRequestApi,
} from "../../services/AppinfoService";
import { useNavigate } from "react-router-dom";
import { HiArrowCircleUp } from "react-icons/hi";
import ApprovalChemicalModal from "./ApprovalChemicalModal";
import { FaBell } from "react-icons/fa";
import NoteStatus from "./NoteStatus";

const ChemicalManage = () => {
  const [chemicals, setChemicals] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editChemicals, setEditChemicals] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [approvalModalShow, setApprovalModalShow] = useState(false);
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const handleShowModal = () => {
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  useEffect(() => {
    let mounted = true;

    console.log("Effect triggered. Checking conditions...");

    if (chemicals.length && !isUpdated) {
      console.log("Data already present and not updated. Returning early.");
      return;
    }

    console.log("Fetching new data...");

    getMasterApi()
      .then((data) => {
        if (mounted) {
          console.log("Chemical Data received:", data);
          setChemicals(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => {
      console.log("Cleanup: Effect will unmount.");
      mounted = false;
      setIsUpdated(false);
    };
  }, [isUpdated, chemicals]);

  const handleUpdate = (e, stu, item_code, item_name) => {
    e.preventDefault();

    // Fetch request data from the API
    getRequestApi()
      .then((response) => {
        console.log("API Response:", response);

        // Check if there is at least one request in the array
        if (response.length > 0) {
          let found = false;

          for (let i = 0; i < response.length; i++) {
            const request = response[i];

            // Check if the current request meets all conditions
            if (
              (request.ItemType === "Chemical" ||
                request.ItemType === "Labware") &&
              request.ItemCode === item_code &&
              request.ItemName === item_name &&
              request.RequestStatus === "Approved"
            ) {
              found = true;

              // Perform actions if all conditions are met
              setEditModalShow(true);
              setEditChemicals(stu);
            }
          }

          if (!found) {
            console.log("No request found with matching conditions.");
            alert("Request is not approved."); // Alert if conditions are not met
          }
        } else {
          console.log("No requests found in the response.");
          alert("Please send a request."); // Alert if there are no requests
        }
      })
      .catch((error) => {
        console.error("Error fetching request data:", error);
      });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setAddModalShow(true);
  };

  const handleOpenApp = (e, itemCode, itemName, itemType) => {
    e.preventDefault();
    setApprovalModalShow(true);
    setItemCode(itemCode); // assuming you have a state variable to store itemCode
    setItemName(itemName);
    setItemType(itemType);
  };

  const handleInactive = (e, m_id) => {
    e.preventDefault();
    inactiveMasterApi(m_id)
      .then((data) => {
        alert("Master Data Inctived");
        console.log("Master Data inactive:", data);
        // Handle successful response, if needed
      })
      .catch((error) => {
        console.error("Failed to delete Master Data:", error);
        alert("Failed to Delete Master Data");
      });
  };

  let AddModelClose = () => setAddModalShow(false);
  let EditModelClose = () => setEditModalShow(false);
  let ApprovalModalClose = () => setApprovalModalShow(false);

  return (
    <div>
      <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2
          style={{
            textAlign: "center",
            paddingTop: "15px",
            marginRight: "8px",
          }}
        >
          Dashboard{" "}
          <FaBell onClick={handleShowModal} style={{ float: "right" }} />
          <NoteStatus
            show={modalShow}
            setUpdated={setIsUpdated}
            onHide={handleCloseModal}
          />
        </h2>
      </div>
      <div style={{ overflowY: "scroll", maxHeight: "460px" }}>
        <div className="row side-row" style={{ textAlign: "center" }}>
          <ButtonToolbar>
            <Button variant="primary" onClick={handleAdd}>
              Add
            </Button>
            <AddChemicalModal
              show={addModalShow}
              setUpdated={setIsUpdated}
              onHide={AddModelClose}
            ></AddChemicalModal>
          </ButtonToolbar>
          <p id="manage"></p>
          <Table
            striped
            bordered
            hover
            className="react-bootstrap-table"
            id="dataTable"
            style={{ margin: "auto", width: "1000px" }}
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
                  Entry No.
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
                  Date
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
                  Supplier
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
                  Quantity
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
                  Units
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
                  Price
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
                  Remarks
                </th>
                <th
                  colspan="3"
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
              {chemicals.map((chem) => (
                <tr key={chem.c_id}>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.c_id}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.item_code || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.item_name || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.m_date || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.supplier || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.master_type || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.quantity || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.units || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.price || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {chem.remarks || ""}
                  </td>
                  {/*<td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>
                          <Button className="mr-2" variant="danger" onClick={(event) => handleDelete(event, chem.c_id)}>
                              <RiDeleteBin5Line />
                          </Button>
                </td> */}
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    <Button
                      className="mr-2"
                      onClick={(event) =>
                        handleUpdate(
                          event,
                          chem,
                          chem.item_code,
                          chem.item_name
                        )
                      }
                    >
                      <FaEdit style={{ fontSize: "24px" }} />
                    </Button>
                    <UpdateChemicalModal
                      show={editModalShow}
                      chemical={editChemicals}
                      setUpdated={setIsUpdated}
                      onHide={EditModelClose}
                    />
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    <Button
                      className="mr-2"
                      onClick={(e) =>
                        handleOpenApp(
                          e,
                          chem.item_code,
                          chem.item_name,
                          chem.master_type
                        )
                      }
                      style={{ backgroundColor: "green", color: "white" }}
                    >
                      <HiArrowCircleUp style={{ fontSize: "24px" }} />
                    </Button>
                    <ApprovalChemicalModal
                      show={approvalModalShow}
                      setUpdated={setIsUpdated}
                      onHide={ApprovalModalClose}
                      itemCode={itemCode}
                      itemName={itemName}
                      itemType={itemType}
                    />
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    <Button
                      className="mr-2"
                      variant="secondary"
                      onClick={(event) => handleInactive(event, chem.c_id)}
                      style={{ backgroundColor: "thickgray" }}
                    >
                      Inactive
                    </Button>
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

export default ChemicalManage;
