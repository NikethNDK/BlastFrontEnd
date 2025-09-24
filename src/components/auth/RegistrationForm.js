import React, { useState, useEffect } from "react";
import {
  createRegistration,
  getDesignationsApi,
  getLabsApi,
} from "../../services/AppinfoService";
import { Alert } from "react-bootstrap";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    lab: "",
    designation: "",
    role: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [labs, setLabs] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [role, setRole] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLabsAndDesignations = async () => {
      try {
        const [labsResponse, designationsResponse] = await Promise.all([
          getLabsApi(),
          getDesignationsApi(),
        ]);
        console.log("Designations:", designationsResponse.data); // Log designations

        setLabs(labsResponse.data);
        setDesignations(designationsResponse.data);
      } catch (err) {
        setError("Failed to load labs or designations. Please try again.");
      }
    };

    fetchLabsAndDesignations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createRegistration(formData);
      Alert("Registration successful!");
      setErrorMessage("");
      setFormData({
        username: "",
        password: "",
        lab: "",
        designation: "",
        role: "",
      });
    } catch (error) {
      setErrorMessage("An error occurred during registration.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="registration-form">
      <h2>Register</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div>
            <label>Lab:</label>
            <input
              type="text"
              name="lab"
              value={formData.lab}
              onChange={handleChange}
              required
            />
          </div> */}
        <div>
          <label>Lab:</label>
          <select
            name="lab"
            value={formData.lab}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a lab
            </option>
            {labs.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Designation:</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a designation
            </option>
            {designations?.map((designation) => (
              <option key={designation.id} value={designation.id}>
                {designation.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: 350,
              border: "1px solid lightgray", // Border color
              backgroundColor: "lightyellow", // Background color
              padding: "8px",
            }}
          >
            <option value="">Select Role</option>
            <option value="Manager">Manager</option>
            <option value="Lab Assistant">Lab Assistant</option>
            <option value="Researcher">Researcher</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
