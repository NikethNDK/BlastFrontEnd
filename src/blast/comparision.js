import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import "../styles/blast.css";
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
      {/* Fixed Header */}
      <header className="header-blast">
        <Header />
      </header>

      {/* Main Container with Sidebar and Content */}
      <div className="blast-container">
        {/* Sidebar */}
        <BlastSidebar userDetails={userDetails}/>

        {/* Main Content Area */}
        <div className="blast-main-content">
          {/* Upload Section */}
          <div className="blast-upload-card">
              <div className="blast-header">
                  <p className="blast-prompt">
                      Upload your query sequence file (<span className="format-highlight">FASTA Format</span>):
                  </p>
              </div>
              
              <form onSubmit={handleSubmit} className="blast-form-controls">
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".txt,.fasta,.csv"
                      className="file-input-style"
                  />
                  
                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      className="run-blast-button"
                  >
                      {loading ? "Running Sequence Search..." : "Run BLAST Search"}
                  </Button>
              </form>
              
              {error && <Typography color="error" className="error-message">{error}</Typography>}
          </div>

          {/* Results Header */}
          <div className="blast-results-header">
            <h4>Blast Results</h4>
            <FiDownload
              size={20}
              className="download-icon"
              onClick={handleDownloadSequences}
              title="Download All Sequences"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <CircularProgress />
              <p>Processing...</p>
            </div>
          )}

          {/* Results Table */}
          {results.length > 0 && (
    <div className={`results-table-container ${results.length > 10 ? 'scrollable' : ''}`}>
        <table className="results-table blast-results-style">
            <thead>
                <tr>
                    {/* Headers are static and don't require inline filters */}
                    <th className="table-header">Query ID</th>
                    <th className="table-header">AIWC Reference ID</th>
                    <th className="table-header">Gene Name</th>
                    <th className="table-header">Identity (%)</th>
                    <th className="table-header">Query Coverage (%)</th>
                    <th className="table-header">Length</th>
                    <th className="table-header">Query Length</th>
                    <th className="table-header">Subject Length</th>
                    <th className="table-header">Mismatches</th>
                    <th className="table-header">Gap Opens</th>
                    <th className="table-header">E-Value</th>
                    <th className="table-header">Class Name</th>
                    <th className="table-header">Common Name</th>
                    <th className="table-header">Scientific Name</th>
                    <th className="table-header action-header">Actions</th>
                </tr>
            </thead>
            <tbody>
                {results.map((row, index) => (
                    <tr key={index} className="data-row">
                        {/* Assuming the results array is structured to match the headers */}
                        {/* Note: You might need to adjust the Object.values(row) logic if 'row' is a plain array 
                           and not an object that excludes the final 'Actions' column data. */}
                        
                        {/* Example structure assuming 'row' is an array [queryId, refId, identity, ...] */}
                        <td className="table-cell">{row[0]}</td> 
                        <td className="table-cell">{row[1]}</td> 
                        <td className="table-cell">{row[13]}</td> 
                        <td className="table-cell number-cell">{row[2]}</td>
                        <td className="table-cell number-cell">{row[3]}</td>
                        <td className="table-cell number-cell">{row[4]}</td>
                        <td className="table-cell number-cell">{row[5]}</td>
                        <td className="table-cell number-cell">{row[6]}</td>
                        <td className="table-cell number-cell">{row[7]}</td>
                        <td className="table-cell number-cell">{row[8]}</td>
                        <td className="table-cell number-cell e-value-cell">{row[9]}</td>
                        <td className="table-cell taxonomy-cell">{row[10]}</td>
                        <td className="table-cell taxonomy-cell">{row[11]}</td>
                        <td className="table-cell taxonomy-cell">{row[12]}</td>
                        
                        {/* Action Cell */}
                        <td className="table-cell action-icons">
                            <FiCopy
                                size={16}
                                className="icon copy-icon"
                                onClick={() => handleCopySequence(row[1])}
                                title="Copy Sequence"
                            />
                            <FiDownload
                                size={16}
                                className="icon download-icon"
                                onClick={() => handleDownload(row[1])}
                                title="Download Sequence"
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}

          {/* No Results Message */}
          {!loading && results.length === 0 && file === null && (
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
              <p>Upload a FASTA file to see BLAST results here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blast;