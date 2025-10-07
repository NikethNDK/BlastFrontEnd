import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { getPartialApi, addDnaApi } from "../../../services/AppinfoService";
import { FcPlus } from "react-icons/fc";
import PartialNameModal from "./PartialNameModal";
import Header from "../../../components/Lab1/homeLab/Header";
import Navigation from "../../navigation/Navigation";
import { useNavigate } from "react-router-dom";
import "./AddDNA.css";

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
  
  const navigate = useNavigate();

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
  const AddModelClose = () => setAddModalShow(false);

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

    addDnaApi(dna)
      .then((response) => {
        console.log("Data saved successfully:", response);

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

  return (
    <div className="add-dna-container">
      <header>
        <Header />
      </header>
      <div className="add-dna-content">
        <Navigation userDetails={userDetails} />
        <div className="add-dna-main">
          <div className="add-dna-header">
            <h2 className="add-dna-title">NEW SUBMISSION</h2>
          </div>

          <div className="form-container">
            {/* Class, Scientific Name, and Common Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Class</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Enter class name"
                />
              </div>

              <div className="form-group">
                <label>Scientific Name</label>
                <input
                  type="text"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  placeholder="Enter scientific name"
                />
              </div>

              <div className="form-group">
                <label>Common Name</label>
                <input
                  type="text"
                  value={commonName}
                  onChange={(e) => setCommonName(e.target.value)}
                  placeholder="Enter common name"
                />
              </div>
            </div>

            {/* NCBI ID, Submitted By Name and Designation */}
            <div className="form-row mt-20">
              <div className="form-group">
                <label>NCBI ID</label>
                <input
                  type="text"
                  value={ncbiId}
                  onChange={(e) => setNcbiId(e.target.value)}
                  placeholder="Enter NCBI ID"
                />
              </div>

              <div className="form-group">
                <label>Submitted By Name</label>
                <input
                  type="text"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  placeholder="Enter submitter name"
                />
              </div>

              <div className="form-group">
                <label>Submitted By Designation</label>
                <input
                  type="text"
                  value={submittedByDes}
                  onChange={(e) => setSubmittedByDes(e.target.value)}
                  placeholder="Enter designation"
                />
              </div>
            </div>

            {/* Reference ID, Partial Gene Sequence ID, and Actions */}
            <div className="reference-row">
              <div className="form-group-narrow">
                <label>Reference ID</label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenId(e.target.value)}
                  placeholder="Enter reference ID"
                />
              </div>

              <div className="form-group-partial">
                <label>Partial Gene Sequence ID</label>
                <select
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

              <div className="action-buttons-wrapper">
                <FcPlus
                  className="add-icon"
                  onClick={() => setAddModalShow(true)}
                  title="Add New Partial Gene"
                />

                <Button
                  onClick={() => setShowModal(true)}
                  className="upload-button"
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Modal for Partial Data */}
          <Modal 
            show={showModal} 
            onHide={() => setShowModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Paste your sequences here...</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-info-section">
                <h6>Reference ID: {referenceId || "N/A"}</h6>
                <h6>Partial Gene Sequence ID: {partialName || "N/A"}</h6>
              </div>
              <textarea
                rows="6"
                value={partialData}
                onChange={(e) => setPartialData(e.target.value)}
                className="modal-textarea"
                placeholder="Paste sequence data here..."
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
      </div>
    </div>
  );
};

export default AddDNA;