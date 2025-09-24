import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {
  addLoginApi,
  addEmpRegApi,
  getLabsApi,
  getDesignationsApi,
  checkUsernameExistsApi,
} from "../../services/AppinfoService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";

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
        console.error("Error fetchiAng designations data", error);
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
      alert("Please fill all fields.");
      return;
    }

    const selectedLabIds = selectedLabs.map((lab) => lab.value); // Extract lab IDs

    if (isNaN(parseInt(designation, 10))) {
      alert("Please select a valid designation.");
      return;
    }

    const requestData = {
      user_name: username,
      password,
      role,
      designation: parseInt(designation, 10), // Ensure it's a number
      lab: selectedLabIds,
    };

    const empData = {
      user_name: username,
      role,
      designation: parseInt(designation, 10), // Pass the ID
      labs: selectedLabIds,
    };

    try {
      // await addEmpRegApi(empData);
      // console.log("Employee Details Added");

      addEmpRegApi(empData)
        .then(() => console.log("Employee Details Added"))
        .catch((error) => console.log("Failed to Add Employee", error));

      await addLoginApi(requestData);
      alert("Registered Successfully");

      setUsername("");
      setPassword("");
      setRole("");
      setDesignation("");
      setSelectedLabs([]);
    } catch (error) {
      console.error("Failed to register", error);
      alert("Failed to Register");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginStyle = {
    minHeight: "100%",
    height: "77vh",
    margin: 0,
    display: "flex",
    width: "600px",
  };

  const rightSideStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "100px",
    paddingTop: "100px",
    paddingRight: "50px",
    marginTop: "-7%",
    // backgroundColor: "#C5EA31",
  };

  const imageStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    float: "left",
  };

  return (
    <div>
      {/* <div
        style={{ background: "lightpink", height: "70px" }}
        className="header"
      >
        <h2 style={{ textAlign: "center", paddingTop: "15px" }}>SIGN UP!</h2>
      </div> */}
      <div className="col-sm-4" style={rightSideStyle}>
        {/* <h3>Register Here</h3> */}
        <h2
          style={{
            textAlign: "center",

            paddingTop: "15px",
          }}
        >
          Register Here!!
        </h2>

       
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            className="form-control"
            placeholder="Enter Username"
            style={{
              width: 350,
              border: "1px solid lightgray",
              backgroundColor: "lightyellow",
              padding: "8px",
            }}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div style={{ position: "relative", width: 350 }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              className="form-control"
              placeholder="Enter Password"
              style={{
                width: "100%",
                border: "1px solid lightgray",
                backgroundColor: "lightyellow",
                padding: "8px",
                paddingRight: "30px",
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                border: "none",
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: 350,
              border: "1px solid lightgray",
              backgroundColor: "lightyellow",
              padding: "8px",
            }}
          >
            <option value="">Select Role</option>
            <option value="Manager">Manager</option>
            <option value="Lab Assistant">Lab Assistant</option>
            <option value="Researcher">Researcher</option>
          </select>
        </div>

        <div className="form-group">
          <label>Designation</label>
          <select
            className="form-control"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            style={{
              width: 350,
              border: "1px solid lightgray",
              backgroundColor: "lightyellow",
              padding: "8px",
            }}
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

        {/* <div className="form-group">
          <label>Lab</label>
          <select
            className="form-control"
            value={lab}
            onChange={(e) => setLab(e.target.value)}
            style={{
              width: 350,
              border: "1px solid lightgray",
              backgroundColor: "lightyellow",
              padding: "8px",
            }}
          >
            <option value="">Select Lab</option>
            {labs.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div> */}
        <div className="form-group" style={{ width: "353px" }}>
          <label>Labs</label>
          <Select
            options={labs}
            isMulti
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "lightyellow", // Sets the background color of the input field
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "lightyellow", // Sets the background color of the dropdown menu
              }),
              option: (base, { isFocused }) => ({
                ...base,
                backgroundColor: isFocused ? "lightyellow" : "lightyellow", // Hover effect
                color: "black",
              }),
            }}
            value={selectedLabs}
            onChange={(selectedOptions) => setSelectedLabs(selectedOptions)}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <br />

        <button
          onClick={handleRegister}
          style={{ marginLeft: "100px" }}
          className="btn btn-primary"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
