import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { getPartialApi, addDnaApi } from "../../../services/AppinfoService";
import { FcPlus } from "react-icons/fc";
import PartialNameModal from "./PartialNameModal";
import Header from "../../navigation/Header";
import Navigation from "../../navigation/Navigation";
import { useNavigate } from "react-router-dom";

const AddDNA = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const [className, setClassName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [commonName, setCommonName] = useState("");
  const [partialName, setPartialName] = useState("");
  const [partialData, setPartialData] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [ncbi, setNcbi] = useState("");
  const [submittedByDes, setSubmittedByDes] = useState("");
  const [partialId, setPartialId] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [referenceId, setReferenId] = useState("");
  const [ncbiId, setNcbiId] = useState("");
  useEffect(() => {
    getPartialApi()
      .then((data) => {
        setPartialId(
          data.map((item) => ({
            value: item.partial_Name,
            label: item.partial_name,
          }))
        );
      })
      .catch((error) => console.error("Error fetching partial data:", error));
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  let AddModelClose = () => setAddModalShow(false);

  const handleUpdate = () => {
    handleShowModal();
  };

  const handleSave = () => {
    console.log("Entering handleSave function");

    if (
      scientificName !== scientificName.trim() ||
      commonName !== commonName.trim() ||
      referenceId !== referenceId.trim()
    ) {
      alert(
        "The scientific name, common name, and reference ID should not contain leading or trailing spaces."
      );
      return;
    }

    if (
      scientificName !==
        scientificName.charAt(0).toUpperCase() + scientificName.slice(1) ||
      commonName !== commonName.charAt(0).toUpperCase() + commonName.slice(1)
    ) {
      alert(
        "The scientific name and common name should start with an uppercase letter."
      );
      return;
    }

    // Prepare the DNA object to be sent to the API
    const dna = {
      ncbi_id: ncbiId,
      class_name: className,
      common_name: commonName,
      scientific_name: scientificName,
      reference_id: referenceId,
      partial_name: partialName,
      partial_data: `>${referenceId}-${partialName}\n${partialData}`,
      submittedBy_name: submittedBy,
      subBy_designation: submittedByDes,
    };
    console.log("Dna Data: ", dna);

    const dataToSave = `>${referenceId}-${partialName}\n${partialData}`;

    // Call addDnaApi with the DNA object
    addDnaApi(dna)
      .then((response) => {
        console.log("Data saved successfully:", response);

        // Reset form fields after saving
        setPartialData("");
        setClassName("");
        setCommonName("");
        setScientificName("");
        setPartialName("");
        setReferenId("");
        setSubmittedBy("");
        setSubmittedByDes("");
        handleCloseModal();

        alert(
          `${referenceId} ${partialName} of ${commonName} by ${submittedBy} uploaded successfully!`
        );

        // Save partialData to a text file
        const blob = new Blob([dataToSave], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "PartialData.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error saving data:", error);

        // Extract error response
        if (error.response && error.response.data) {
          console.log("API Error Response:", error.response.data);

          if (error.response.data.reference_id) {
            const errorMessage = error.response.data.reference_id[0];
            alert(errorMessage);
            return;
          }
        }

        alert("An error occurred while saving data. Please try again.");
      });
  };

  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Navigation />
      <div
        className="header_add"
        style={{ background: "#C5EA31", height: "53px" }}
      >
        <h3
          style={{
            textAlign: "center",
            paddingTop: "8px",
            marginLeft: "15%",
            color: "rgb(24, 81, 12)",
          }}
        >
          NEW SUBMISSION
        </h3>
        {/* <div style={{ marginLeft: "85%", marginTop: "-40px" }}>
          <button
            onClick={() => navigate("/dna")}
            className="btn btn-primary"
            style={{ marginRight: "10px" }}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/add_dna")}
            className="btn btn-primary"
          >
            New
          </button>{" "}
        </div> */}
      </div>
      <div
        style={{
          position: "absolute",
          left: "1350px",
          top: "100px",
          height: "100px",
        }}
      >
        <p style={{ margin: 0, marginright: "100px" }}>
          User: {userDetails.name}
        </p>
        <p style={{ margin: 0, marginright: "100px" }}>
          Lab: {userDetails.lab}
        </p>
        <p style={{ margin: 0, marginright: "100px" }}>
          designation: {userDetails.designation}
        </p>
      </div>
      <div
        style={{
          // display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "40px",
          width: "100%",
          marginLeft: "23%",
          marginRight: "auto",
        }}
      >
        {/* Class, Scientific Name, and Common Name Fields in a Single Row */}
        <div style={{ display: "flex", gap: "30px", width: "75%" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label>Class</label>
            <input
              style={{ height: "40px" }}
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label>Scientific Name</label>
            <input
              style={{ height: "40px" }}
              type="text"
              value={scientificName}
              onChange={(e) => setScientificName(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label>Common Name</label>
            <input
              style={{ height: "40px" }}
              type="text"
              value={commonName}
              onChange={(e) => setCommonName(e.target.value)}
            />
          </div>
        </div>

        {/* Submitted By and Reference ID Fields */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            marginTop: "20px",
            width: "75%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <label>NCBI Id</label>
            <input
              style={{ height: "40px" }}
              type="text"
              value={ncbiId}
              onChange={(e) => setNcbiId(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label>Submitted By Name</label>
            <input
              style={{ height: "40px" }}
              type="text"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label>Submitted By Designation</label>
            <input
              style={{ height: "40px" }}
              type="text"
              value={submittedByDes}
              onChange={(e) => setSubmittedByDes(e.target.value)}
            />
          </div>
        </div>

        {/* Partial Gene Sequence ID Section (Aligned to Left) */}
        <div
          style={{
            display: "flex",
            gap: "80px",
            marginTop: "20px",
            width: "75%",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              maxWidth: "350px",
            }}
          >
            <label>Reference ID</label>
            <input
              style={{ height: "40px", width: "83%" }}
              type="text"
              value={referenceId}
              onChange={(e) => setReferenId(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "-11%",
              width: "30%",
            }}
          >
            <label>Partial Gene Sequence ID</label>
            <select
              style={{ height: "40px" }}
              value={partialName}
              onChange={(e) => setPartialName(e.target.value)}
            >
              <option value="">Select Partial Gene Sequence ID...</option>
              {partialId.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Plus Icon and Upload Button Wrapped Together */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "19px",
              marginLeft: "-51px",
            }}
          >
            {/* Plus Icon */}
            <FcPlus
              style={{
                fontSize: "40px",
                cursor: "pointer",
                marginRight: "110px",
              }}
              onClick={() => setAddModalShow(true)}
            />

            {/* Upload Button */}
            <Button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: "#C5EA31",
                color: "black",
                fontWeight: "bold",
                height: "35px",
                width: "80px",
                marginLeft: "-39%",
                fontSize: "14px",
                marginTop: "2px", // Adds some space above the button
              }}
            >
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Modal for Partial Data */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Paste your sequences here...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
            <h6 style={{ fontWeight: "8px" }}>
              Reference ID: {referenceId || "N/A"}
            </h6>
            <h6>Partial Gene Sequence ID: {partialName || "N/A"}</h6>
          </div>
          <textarea
            rows="4"
            cols="50"
            value={partialData}
            onChange={(e) => setPartialData(e.target.value)}
            style={{ width: "100%", height: "100px" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Partial Name Modal */}
      <PartialNameModal
        show={addModalShow}
        onHide={() => setAddModalShow(false)}
      />
    </div>
  );
};

export default AddDNA;
