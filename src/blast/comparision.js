import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/blast.css";
import { FiEye, FiCopy, FiDownload, FiTrash } from "react-icons/fi";
import leftLogo from "../assets/elephant.png";
import rightLogo from "../assets/logo.jpg";
import AIWC_DNA_sequencing from "../assets/AIWC_DNA_sequencing.png";
import AIWC_LIMS from "../assets/AIWC_LIMS.png";

import TN_Transparent_Logo from "../assets/TN_Transparent_Logo.png";
import { FileDownload } from "@mui/icons-material";
import {
  runBlast,
  copySequence,
  downloadSequences,
  downloadSequenceByReference,
} from "../services/AppinfoService";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import AWIC_INTRANET from "../assets/AIWC_INTRANET.png";
import {
  Table,
  TextField,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const Header = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sequenceId, setSequenceId] = useState("");
  const [sequenceData, setSequenceData] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const fileInputRef = useRef(null);
  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  //   setError("");
  //   setResults([]);
  // };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setResults([]);
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file.");
      return;
    }
    setResults([]);
    setError("");
    setLoading(true);
    try {
      console.log("Uploading file:", file);
      const response = await runBlast(file);
      console.log("BLAST response:", response);
      if (response && Array.isArray(response)) {
        setResults(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        console.error("Unexpected response format:", response);
        throw new Error("Invalid response format");
      }

      setError("");
    } catch (err) {
      console.error("BLAST Error:", err);
      alert("> Missing OR Invalid fasta file");
    } finally {
      setLoading(false);
      // ✅ Allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null);
    }
  };

  // Function to copy row data to clipboard
  const handleCopy = (row) => {
    const text = Object.values(row).join("\t"); // Convert row data to tab-separated text
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // const handleDownload = (row) => {
  //   const content =
  //     `>${row["Query Seq ID"]}\n${row["Query Sequence"]}\n\n` +
  //     `>${row["Reference Seq ID"]}\n${row["Reference Sequence"]}\n`;

  //   const blob = new Blob([content], { type: "text/plain" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `Sequence_${row["Query Seq ID"]}.fasta`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleSeqDownload = () => {
    if (!results.length) {
      alert("No results available for download.");
      return;
    }

    let content = results
      .map(
        (result, index) =>
          `>${result["Query Seq ID"]}\n${
            result["Query Sequence"] || "N/A"
          }\n\n` +
          `>${result["Reference Seq ID"]}\n${
            result["Reference Sequence"] || "N/A"
          }\n`
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Query_Reference_Sequences.fasta";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = (reference_id) => {
    console.log("Reference ID:", reference_id);

    if (!reference_id || reference_id.trim() === "") {
      alert("Please enter a valid Reference ID.");
      return;
    }

    downloadSequenceByReference(reference_id);
  };

  const handleCopySequence = async (reference_id) => {
    console.log("Reference ID:", reference_id);

    try {
      const data = await copySequence(reference_id);

      if (data?.actual_sequence) {
        setSequenceData(data.actual_sequence); // Store sequence in state (optional)
        await navigator.clipboard.writeText(data.actual_sequence);
        alert("Sequence copied to clipboard!");
      } else {
        alert("Sequence not found!");
      }
    } catch (error) {
      alert("Error fetching sequence! Check console for details.");
    }
  };

  // Handle Download Button Click
  const handleDownloadSequences = async () => {
    try {
      await downloadSequences();
    } catch (error) {
      alert("Error downloading sequences!");
    }
  };

  return (
    <>
      <header
        style={{ background: "#e1dede", height: "187px" }}
        className="header-blast"
      >
        <div className="header-logo">
          <img src={TN_Transparent_Logo} alt="left Logo" />
          <img src={leftLogo} alt="left Logo" />{" "}
          <div>
            <img
              style={{ margintop: "-17px" }}
              src={AWIC_INTRANET}
              alt="Left Logo"
            />
          </div>
        </div>
        <div
          className="header-title"
          style={{ background: "#e1dede", height: "190px" }}
        >
          <h1
            style={{
              color: "rgb(25, 25, 25)",
              fontFamily: "Poppins, sans-serif",
              marginTop: "2px",
            }}
          >
            Advanced Institute for Wildlife Conservation
          </h1>
          <div style={{ textAlign: "center", lineHeight: "1.5" }}>
            <h6
              style={{
                color: "rgb(16, 16, 16)",
                margin: "5px 0",
                fontSize: "15px",
              }}
            >
              (RESEARCH, TRAINING AND EDUCATION)
            </h6>
            <h4
              style={{
                color: "rgb(16, 16, 16)",
                margin: "5px 0",
                fontSize: "20px",
              }}
            >
              Tamil Nadu Forest Department
            </h4>
            <h5
              style={{
                color: "rgb(16, 16, 16)",
                margin: "5px 0",
                fontSize: "20px",
              }}
            >
              Vandalur, Chennai - 600048.
            </h5>
            <h5
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                display: "flex",
                marginLeft: "20%",
                height: "38px",
                gap: "17px",
                color: "rgb(16, 16, 16)",
              }}
            >
              LABORATORY INFORMATION MANAGEMENT SYSTEM
              <button
                onClick={() => navigate("/")}
                className="btn btn-primary"
                style={{ marginRight: "10px" }}
              >
                Back
              </button>
              <button
                onClick={() => navigate("/dna")}
                className="btn btn-primary"
                style={{ marginRight: "10px" }}
              >
                Repository
              </button>
            </h5>
          </div>
        </div>
        <div
          className="header-logo"
          style={{ marginTop: "-40px", height: "130px" }}
        >
          <img src={AIWC_LIMS} alt="Right Logo" />
          <img src={AIWC_DNA_sequencing} alt="AIWC_DNA_sequencing" />
        </div>
      </header>
      <div style={{ backgroundColor: "rgb(197, 234, 49)", marginTop: "-3%" }}>
        <div
          className="upload-section"
          style={{ display: "flex", gap: "15px" }}
        >
          <p style={{ marginTop: "14px" }}>
            Upload query file (FASTA Format):{"   "}
          </p>
          <form
            onSubmit={handleSubmit}
            style={{ marginBottom: "20px", display: "flex", marginTop: "14px" }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.fasta,.csv"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginLeft: "10px" }}
              disabled={loading}
            >
              {loading ? "Running..." : "Run Blast"}
            </Button>
          </form>

          {error && <Typography color="error">{error}</Typography>}
        </div>
      </div>
      <p></p>
      {/* Blast Results Section */}
      <div style={{ display: "flex", marginLeft: "44%", gap: "20px" }}>
        <h4 style={{ textAlign: "center" }}>Blast Results</h4>

        <FiDownload
          size={10}
          style={{
            cursor: "pointer",
            margin: "0 5px",
            backgroundColor: "#1976d2",
            height: "30px",
            color: "white",
            width: "30px",
            borderRadius: "5px",
            marginLeft: "58%",
          }}
          onClick={handleDownloadSequences}
          title="Download"
        />

        {/* <Button
          variant="contained"
          // color="secondary"
          onClick={handleDownloadSequences}
          style={{
            height: "40px",
            alignSelf: "center",
            marginLeft: "58%",
            width: "30%",
          }}
        >
          <FileDownload />
        </Button> */}
      </div>

      {loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
          <p>Processing...</p>
        </div>
      )}
      <p></p>
      {/* <div
        style={{
          margin: "auto",
          width: "73%",
          maxHeight: results.length > 5 ? "195px" : "auto",
          overflowY: results.length > 5 ? "auto" : "visible",
          border: "3px solid #ddd",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Table
          striped
          bordered
          hover
          style={{
            fontSize: "14px",
            width: "100%",
            textAlign: "center",
            // borderCollapse: "collapse",
            // borderSpacing: "0 5px",
          }}
        >
          <thead>
            <tr>
              <th style={{ fontSize: "12px", width: "5%" }}>Query ID</th>
              <th style={{ fontSize: "12px", width: "10%" }}>Reference ID</th>
              <th style={{ fontSize: "12px", width: "10%" }}>Identity (%)</th>
              <th style={{ fontSize: "12px", width: "10%" }}>
                Query Coverage (%)
              </th>
              <th style={{ fontSize: "12px", width: "8%" }}>Length</th>
              <th style={{ fontSize: "12px", width: "8%" }}>Query Length</th>
              <th style={{ fontSize: "12px", width: "8%" }}>Subject Length</th>
              <th style={{ fontSize: "12px", width: "8%" }}>Mismatches</th>
              <th style={{ fontSize: "12px", width: "8%" }}>Gap Opens</th>
              <th style={{ fontSize: "12px", width: "8%" }}>E-Value</th>
              <th style={{ fontSize: "12px", width: "10%" }}>Class Name</th>
              <th style={{ fontSize: "12px", width: "10%" }}>Common Name</th>
              <th style={{ fontSize: "12px", width: "10%" }}>
                Scientific Name
              </th>
              <th style={{ fontSize: "12px", width: "10%" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, i) => (
                  <td key={i} style={{ fontSize: "12px", textAlign: "center" }}>
                    {cell}
                  </td>
                ))}
                <td style={{ textAlign: "center" }}>
                  <FiCopy
                    size={20}
                    style={{
                      cursor: "pointer",
                      margin: "0 5px",
                      color: "grey",
                    }}
                    onClick={() => handleCopySequence(row[1])}
                    title="Copy"
                  />
                  <FiDownload
                    size={20}
                    style={{
                      cursor: "pointer",
                      margin: "0 5px",
                      color: "grey",
                    }}
                    onClick={() => handleDownload(row[1])}
                    title="Download"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div> */}
      <div
        style={{
          margin: "auto",
          width: "73%",
          maxHeight: results.length > 5 ? "195px" : "auto",
          overflowY: results.length > 5 ? "auto" : "visible",
          border: "3px solid #ddd",
          display: "flex",
          justifyContent: "center",
        }}
      >
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
        <Table
          striped
          bordered
          hover
          style={{
            fontSize: "14px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <thead style={{ backgroundColor: "rgb(197, 234, 49)" }}>
            <tr>
              <th style={{ fontSize: "12px", width: "5%" }}>Query ID</th>
              <th style={{ fontSize: "12px", width: "10%" }}>
                AIWC reference ID
              </th>
              <th style={{ fontSize: "12px", width: "10%" }}>Identity (%)</th>
              <th style={{ fontSize: "12px", width: "10%" }}>
                Query Coverage (%)
              </th>
              <th style={{ fontSize: "12px", width: "8%" }}>Length</th>
              <th style={{ fontSize: "12px", width: "8%" }}>Query Length</th>
              <th style={{ fontSize: "12px", width: "8%" }}>Subject Length</th>
              <th style={{ fontSize: "12px", width: "8%" }}>Mismatches</th>
              <th style={{ fontSize: "12px", width: "8%" }}>Gap Opens</th>
              <th style={{ fontSize: "12px", width: "8%" }}>E-Value</th>
              <th style={{ fontSize: "12px", width: "10%" }}>Class Name</th>
              <th style={{ fontSize: "12px", width: "10%" }}>Common Name</th>
              <th style={{ fontSize: "12px", width: "10%" }}>
                Scientific Name
              </th>
              <th style={{ fontSize: "12px", width: "10%" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "white" : "#f0f0f0", // Alternates row color
                }}
              >
                {Object.values(row).map((cell, i) => (
                  <td key={i} style={{ fontSize: "12px", textAlign: "center" }}>
                    {cell}
                  </td>
                ))}
                <td style={{ textAlign: "center" }}>
                  <FiCopy
                    size={20}
                    style={{
                      cursor: "pointer",
                      margin: "0 5px",
                      color: "grey",
                    }}
                    onClick={() => handleCopySequence(row[1])}
                    title="Copy"
                  />
                  <FiDownload
                    size={20}
                    style={{
                      cursor: "pointer",
                      margin: "0 5px",
                      color: "grey",
                    }}
                    onClick={() => handleDownload(row[1])}
                    title="Download"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default Header;
