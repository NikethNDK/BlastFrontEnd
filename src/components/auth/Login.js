import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { getLoginApi, registerUserApi } from "../../services/AppinfoService";
import AIWC_LIMS from "../../assets/AIWC_LIMS.png";
import AdminApp from "../../AdminApp";
import ManagerApp from "../../ManagerApp";
import LabApp from "../../LabApp";
import ResearcherAccessApp from "../../researcheracess";
import ManagerAccessApp from "../../manageracess";
import ResearcherApp from "../../ResearcherApp";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CareApp from "../../dnacar";
import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";
import AIWC_Transparent_Logo from "../../assets/AIWC_Transparent_Logo.png";
import AIWC_DNA_sequencing from "../../assets/AIWC_DNA_sequencing.png";
import AWIC_INTRANET from "../../assets/AIWC_INTRANET.png";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useCookies(["mytoken"]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userLabs, setUserLabs] = useState([]); // Stores user lab IDs
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    lab: "",
    designation: ""
  });

  const handleLogin = async () => {
    // Check if username is empty
    if (!username?.trim()) {
      alert("Please enter username");
      return;
    }
  
    // Check if password is empty
    if (!password?.trim()) {
      alert("Please enter password");
      return;
    }
  
    try {
      const response = await getLoginApi(); // Fetch user list from API
      console.log("API Response:", response);
  
      if (response.length > 0) {
        let foundUser = response.find(
          (user) => user.user_name === username && user.password === password
        );
  
        if (foundUser) {
          console.log("Logged in User:", foundUser);
          console.log("User ID:", foundUser.id);
          console.log("User Role:", foundUser.role);
          console.log("User Designation:", foundUser.designation);
  
          setLoggedIn(true);
          setUserRole(foundUser.role);
          setUserLabs(foundUser.lab || []);
          setUserId(foundUser.id);
  
          setUserDetails({
            name: foundUser.user_name,
            lab: foundUser.lab || "N/A",
            designation: foundUser.designation || "Not Assigned"
          });
  
        } else {
          alert("The username or password you entered is incorrect. Please try again.");
        }
      } else {
        alert("No users found in system");
      }
  
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };
  

  const handleRegister = async () => {
    try {
      if (username.trim() && password.trim()) {
        alert("Registered Successfully");
        await registerUserApi({ username, password });
      } else {
        alert("Please enter both Username and Password to register.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        (() => {
          console.log("Inside isLoggedIn block");
          console.log("User Role:", userRole);
          console.log("User Labs:", userLabs);

          switch (userRole) {
            case "1":
              return <AdminApp userDetails={userDetails}/>;

            case "Manager":
              if (
                Array.isArray(userLabs) &&
                userLabs.some((lab) => ["DNA", "Animal Care"].includes(lab))
              ) {
                return <ManagerApp  userId={userId} userDetails={userDetails}/>;
              } else {
                return <ManagerAccessApp userId={userId} userDetails={userDetails}/>;
              }

            case "2":
              if (
                Array.isArray(userLabs) &&
                userLabs.some((lab) => ["DNA", "Animal Care"].includes(lab))
              ) {
                return <LabApp  userDetails={userDetails}/>;
              } else {
                return <CareApp userDetails={userDetails}/>;
              }

            case "Researcher":
              if (
                Array.isArray(userLabs) &&
                userLabs.some((lab) => ["DNA", "Animal Care"].includes(lab))
              ) {
                return <ResearcherApp userDetails={userDetails} />;
              } else {
                return <ResearcherAccessApp userDetails={userDetails}/>;
              }

            default:
              alert("Something went wrong. Please contact support.");
              setLoggedIn(false);
              return null;
          }
        })()
      ) : (
        <>
          <div className="container-fluid">
            <div className="row">
                   <header className="header" style={{ background:"#e1dede"}} >
                     <div className="header-logo">
                     <img src={TN_Transparent_Logo} alt="left Logo"  />
                       <img src={AIWC_Transparent_Logo} alt="Left Logo" />
                       <div >
                       <img   src={AWIC_INTRANET} style={{ margintop: "48px",}}alt="Left Logo" />
                       </div>
                       
                     </div >
                     <div className="header-title" style={{ background:"#e1dede" }}>
                       <h1 style={{ color: "rgb(25, 25, 25)", fontFamily: "Poppins, sans-serif" }}>
                         Advanced Institute for Wildlife Conservation
                       </h1>
                       <div style={{ textAlign: "center", lineHeight: "1.5" }}>
               <h6 style={{ color: "rgb(16, 16, 16)", margin: "5px 0", fontSize: "15px" }}>
                 (RESEARCH, TRAINING AND EDUCATION)
               </h6>
               <h4 style={{ color: "rgb(16, 16, 16)", margin: "5px 0" , fontSize: "20px"}}>
                 Tamil Nadu Forest Department
               </h4>
               <h5 style={{ color: "rgb(16, 16, 16)", margin: "5px 0", fontSize: "20px" }}>
                 Vandalur, Chennai - 600048.
               </h5>
             </div>
             
                       <h6 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold", fontSize: "25px" , color: "rgb(16, 16, 16)",}}>LABORATORY INFORMATION MANAGEMENT SYSTEM</h6>
                     </div>
                     <div className="header-logo" style={{marginTop:"-40px",height:"130px",}}>
                     <img src={AIWC_LIMS} alt="Right Logo" />
                       <img src={AIWC_DNA_sequencing} alt="Right Logo" />
                     </div>
                   </header>
             
              <div
                className="col-sm-8 full-img"
                style={{ display: "flex", width: "500px" }}
              >
                <div style={{ flex: 1, paddingRight: "20px" ,marginLeft:"20px"}}>
                  <img
                    src={AIWC_LIMS}
                    alt="Logo"
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              </div>

              <div
  className="col-sm-4"
  style={{
    flexDirection: "column",
    padding: "30px 20px",
    backgroundColor: "#e1dede",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', sans-serif",
    maxWidth: "400px",
    margin: "auto",
  }}
>
  <h3 style={{ textAlign: "center", marginBottom: "30px", fontSize: "24px" }}>
    Login
  </h3>

  <div className="form-group">
    <label style={{ fontWeight: "500", marginBottom: "5px" }}>Username</label>
    <input
      type="text"
      value={username}
      className="form-control"
      placeholder="Enter Username"
      style={{
        width: "100%",
        backgroundColor: "lightyellow",
        padding: "10px",
        marginBottom: "20px",
        fontSize: "16px",
        borderRadius: "5px",
      }}
      onChange={(e) => setUsername(e.target.value)}
    />
  </div>

  <div className="form-group">
    <label style={{ fontWeight: "500", marginBottom: "5px" }}>Password</label>
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        className="form-control"
        placeholder="Enter Password"
        style={{
          width: "100%",
          backgroundColor: "lightyellow",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
        }}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={togglePasswordVisibility}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  </div>

  <div style={{ textAlign: "center", marginTop: "30px" }}>
    <button
      onClick={handleLogin}
      className="btn btn-primary"
      style={{
        padding: "10px 25px",
        fontSize: "16px",
        borderRadius: "5px",
        transition: "background-color 0.3s ease",
      }}
    >
      Login
    </button>
  </div>
</div>


            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
