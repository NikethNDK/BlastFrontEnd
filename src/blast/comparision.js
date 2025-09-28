import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/blast.css";
import { FiEye, FiCopy, FiDownload, FiTrash } from "react-icons/fi";
import leftLogo from "../assets/elephant.png";
import rightLogo from "../assets/logo.jpg";
import AIWC_DNA_sequencing from "../assets/AIWC_DNA_sequencing.png";
import AIWC_LIMS from "../assets/AIWC_LIMS.png";
import "./comparison.css"
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
import Header from "../components/Lab1/homeLab/Header";
import BlastSidebar from "./BlastSidebar";

const Blast = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sequenceId, setSequenceId] = useState("");
  const [sequenceData, setSequenceData] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const fileInputRef = useRef(null);

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
      <header className="header-blast">
        <Header/>
        {/* <div className="header-logo">
          <img src={TN_Transparent_Logo} alt="left Logo" />
          <img src={leftLogo} alt="left Logo" />
          <div>
            <img src={AWIC_INTRANET} alt="Left Logo" />
          </div>
        </div>
        <div className="header-title">
          <h1>Advanced Institute for Wildlife Conservation</h1>
          <div className="header-subtitle">
            <h6>(RESEARCH, TRAINING AND EDUCATION)</h6>
            <h4>Tamil Nadu Forest Department</h4>
            <h5>Vandalur, Chennai - 600048.</h5>
            <h5 className="header-navigation">
              LABORATORY INFORMATION MANAGEMENT SYSTEM
              <button
                onClick={() => navigate("/")}
                className="btn btn-primary"
              >
                Back
              </button>
              <button
                onClick={() => navigate("/dna")}
                className="btn btn-primary"
              >
                Repository
              </button>
            </h5>
          </div>
        </div>
        <div className="header-logo header-logo-right">
          <img src={AIWC_LIMS} alt="Right Logo" />
          <img src={AIWC_DNA_sequencing} alt="AIWC_DNA_sequencing" />
        </div> */}
      </header>
      
      <div className="upload-section-wrapper">
        <div className="upload-section">
          <p>Upload query file (FASTA Format):</p>
          <form onSubmit={handleSubmit} className="upload-form">
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
              disabled={loading}
            >
              {loading ? "Running..." : "Run Blast"}
            </Button>
          </form>
          {error && <Typography color="error">{error}</Typography>}
        </div>
      </div>
      <BlastSidebar/>
      
      {/* Blast Results Section */}
      <div className="blast-results-header">
        <h4>Blast Results</h4>
        <FiDownload
          size={10}
          className="download-icon"
          onClick={handleDownloadSequences}
          title="Download"
        />
      </div>

      {loading && (
        <div className="loading-container">
          <CircularProgress />
          <p>Processing...</p>
        </div>
      )}
      
      <p></p>
      
      <div className={`results-table-container ${results.length > 5 ? 'scrollable' : ''}`}>
        <div className="user-details">
          <p>User: {userDetails.name}</p>
          <p>Lab: {userDetails.lab}</p>
          <p>designation: {userDetails.designation}</p>
        </div>
        <Table
          striped
          bordered
          hover
          className="results-table"
        >
          <thead>
            <tr>
              <th className="col-width-5">Query ID</th>
              <th className="col-width-10">AIWC reference ID</th>
              <th className="col-width-10">Identity (%)</th>
              <th className="col-width-10">Query Coverage (%)</th>
              <th className="col-width-8">Length</th>
              <th className="col-width-8">Query Length</th>
              <th className="col-width-8">Subject Length</th>
              <th className="col-width-8">Mismatches</th>
              <th className="col-width-8">Gap Opens</th>
              <th className="col-width-8">E-Value</th>
              <th className="col-width-10">Class Name</th>
              <th className="col-width-10">Common Name</th>
              <th className="col-width-10">Scientific Name</th>
              <th className="col-width-10">Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
                <td className="action-icons">
                  <FiCopy
                    size={20}
                    className="icon"
                    onClick={() => handleCopySequence(row[1])}
                    title="Copy"
                  />
                  <FiDownload
                    size={20}
                    className="icon"
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

export default Blast;