import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {
  addLoginApi,
  addEmpRegApi,
  getLabsApi,
  getDesignationsApi,
  checkUsernameExistsApi,
} from "../../services/AppinfoService";
import { FaEye, FaEyeSlash, FaUserPlus, FaUser, FaLock, FaBriefcase, FaFlask } from "react-icons/fa";
import Select from "react-select";
import toast from "react-hot-toast";
import "./Register.css";

function Register({ userDetails = { name: "", lab: "", designation: "" } }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [designation, setDesignation] = useState("");
  const [designations, setDesignations] = useState([]);
  const [lab, setLab] = useState("");
  const [labs, setLabs] = useState([]);
  const [token, setToken] = useCookies(["mytoken"]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLabs, setSelectedLabs] = useState([]);

  useEffect(() => {
    getLabsApi()
      .then((response) => {
        setLabs(
          response.data.map((lab) => ({
            value: lab.id,
            label: lab.name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching labs data", error);
      });

    getDesignationsApi()
      .then((response) => {
        setIsLoading(false);
        if (Array.isArray(response.data)) {
          setDesignations(response.data);
        } else {
          console.error(
            "Unexpected API response for designations:",
            response.data
          );
          setDesignations([]);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching designations data", error);
        setDesignations([]);
      });
  }, []);

  const handleRegister = async () => {
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Role:", role);
    console.log("Designation:", designation);
    console.log("Selected Labs:", selectedLabs);

    if (
      !username ||
      !password ||
      !role ||
      !designation ||
      selectedLabs.length === 0
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    const selectedLabIds = selectedLabs.map((lab) => lab.value);

    if (isNaN(parseInt(designation, 10))) {
      toast.error("Please select a valid designation.");
      return;
    }

    const requestData = {
      user_name: username,
      password,
      role,
      designation: parseInt(designation, 10),
      lab: selectedLabIds,
    };

    const empData = {
      user_name: username,
      role,
      designation: parseInt(designation, 10),
      labs: selectedLabIds,
    };

    try {
      await addLoginApi(requestData);
      toast.success("Registered Successfully");

      setUsername("");
      setPassword("");
      setRole("");
      setDesignation("");
      setSelectedLabs([]);
    } catch (error) {
      console.error("Failed to register", error);
      toast.error("Failed to Register");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderColor: "#dee2e6",
      padding: "0.125rem",
      fontSize: "0.875rem",
      "&:hover": {
        borderColor: "#007bff",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      fontSize: "0.875rem",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#007bff" : isFocused ? "#f8f9fa" : "#fff",
      color: isSelected ? "#fff" : "#495057",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e7f3ff",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#007bff",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#007bff",
      "&:hover": {
        backgroundColor: "#007bff",
        color: "#fff",
      },
    }),
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <h1>REGISTER</h1>
            <p>Register new Employee</p>
          </div>

          <div className="register-form">
            <div className="form-group-register">
              <label className="form-label-register">
                <FaUser className="label-icon" />
                Username
              </label>
              <input
                type="text"
                value={username}
                className="form-input-register"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group-register">
              <label className="form-label-register">
                <FaLock className="label-icon" />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="form-input-register"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle-btn"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <div className="form-group-register">
              <label className="form-label-register">
                <FaBriefcase className="label-icon" />
                Role
              </label>
              <select
                className="form-select-register"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Lab Assistant">Lab Assistant</option>
                <option value="Researcher">Researcher</option>
              </select>
            </div>

            <div className="form-group-register">
              <label className="form-label-register">
                <FaBriefcase className="label-icon" />
                Designation
              </label>
              <select
                className="form-select-register"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="">Select Designation</option>
                {isLoading ? (
                  <option>Loading...</option>
                ) : (
                  designations.map((designation) => (
                    <option key={designation.id} value={designation.id}>
                      {designation.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group-register">
              <label className="form-label-register">
                <FaFlask className="label-icon" />
                Labs
              </label>
              <Select
                options={labs}
                isMulti
                styles={customSelectStyles}
                value={selectedLabs}
                onChange={(selectedOptions) => setSelectedLabs(selectedOptions)}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select labs..."
                menuPosition="fixed"
                menuPlacement="auto"
              />
            </div>

            <button onClick={handleRegister} className="register-btn">
              <FaUserPlus />
              Register Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;