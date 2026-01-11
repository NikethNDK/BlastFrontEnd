import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { getLoginApi, loginUserApi } from "../../services/AppinfoService";
import { setUser, clearUser } from "../../store/slices/userSlice";
import AIWC_LIMS from "../../assets/AIWC_LIMS.png";
import AdminApp from "../../AdminApp";
import ManagerApp from "../../ManagerApp";
import LabApp from "../../LabApp";
import ResearcherAccessApp from "../../researcheracess";
import ManagerAccessApp from "../../manageracess";
import ResearcherApp from "../../ResearcherApp";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CareApp from "../../dnacar";
import Header from "../Lab1/homeLab/Header";
import toast, { Toaster } from "react-hot-toast";

// Temporary flag to enable all features (BLAST, Repository, Inventory) for all users regardless of labs
// Set to false to restore lab-based routing
const ENABLE_ALL_FEATURES = false;

function Login({ initialAuthState = { isAuthenticated: false, user: null } }) {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.user);
  const isReduxAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useCookies(["mytoken"]);
  const [showPassword, setShowPassword] = useState(false);

  // Use Redux state or initial state for authentication
  const [isLoggedIn, setLoggedIn] = useState(initialAuthState.isAuthenticated);
  const [userRole, setUserRole] = useState(initialAuthState.user?.role || "");
  const [userLabs, setUserLabs] = useState(initialAuthState.user?.lab || []);
  const [userId, setUserId] = useState(initialAuthState.user?.id || "");
  const [userDetails, setUserDetails] = useState({
    name: initialAuthState.user?.user_name || "",
    lab: initialAuthState.user?.lab || "N/A",
    designation: initialAuthState.user?.designation || "Not Assigned"
  });

  // Sync with Redux state changes (for page refresh)
  // Sync with Redux state changes (for page refresh and logout)
  useEffect(() => {
    setLoggedIn(isReduxAuthenticated);

    if (isReduxAuthenticated && reduxUser) {
      setUserRole(reduxUser.role || "");
      setUserLabs(reduxUser.lab || []);
      setUserId(reduxUser.id || "");
      setUserDetails({
        name: reduxUser.user_name || "",
        lab: reduxUser.lab || "N/A",
        designation: reduxUser.designation || "Not Assigned"
      });
    }
  }, [isReduxAuthenticated, reduxUser]);

  const handleLogin = async () => {
    if (!username?.trim()) {
      toast.error("Please enter username");
      return;
    }

    if (!password?.trim()) {
      toast.error("Please enter password");
      return;
    }

    try {
      // First, try server-side login to set JWT cookie
      try {
        await loginUserApi({ user_name: username, password: password });
      } catch (loginErr) {
        // If server login fails, still try the old flow for backward compatibility
        console.log("Server login returned error, trying fallback:", loginErr);
      }

      // Get user details (keeping existing flow for backward compatibility)
      const response = await getLoginApi();
      // console.log("API Response:", response);

      if (response.length > 0) {
        let foundUser = response.find(
          (user) => user.user_name === username && user.password === password
        );
        if (!foundUser) {
          toast.error("The username or password you entered is incorrect. Please try again.");
        } else if (!foundUser.is_active) {
          toast.error("You are blocked");
        } else {
          console.log("Logged in User:", foundUser);

          // Dispatch to Redux store
          dispatch(setUser(foundUser));

          // Keep existing local state for backward compatibility with props
          setLoggedIn(true);
          setUserRole(foundUser.role);
          setUserLabs(foundUser.lab || []);
          setUserId(foundUser.id);

          setUserDetails({
            name: foundUser.user_name,
            lab: foundUser.lab || "N/A",
            designation: foundUser.designation || "Not Assigned"
          });
        }
      } else {
        toast.error("No user found in system");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="App" style={{
      backgroundColor: "#f2f5e6",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {isLoggedIn ? (
        (() => {
          switch (userRole) {
            case "Admin":
              return <AdminApp userDetails={userDetails} />;
            case "Manager":
              if (ENABLE_ALL_FEATURES || (Array.isArray(userLabs) && userLabs.some((lab) => 
                ["DNA", "Animal Care"].some(allowedLab => 
                  lab?.toLowerCase() === allowedLab.toLowerCase()
                )
              ))) {
                return <ManagerApp userId={userId} userDetails={userDetails} />;
              }
              else {
                return <ManagerAccessApp userId={userId} userDetails={userDetails} />;
              }
            case "Lab Assistant":
              if (ENABLE_ALL_FEATURES || (Array.isArray(userLabs) && userLabs.some((lab) => 
                ["DNA", "Animal Care"].some(allowedLab => 
                  lab?.toLowerCase() === allowedLab.toLowerCase()
                )
              ))) {
                return <LabApp userId={userId} userDetails={userDetails} />;
              } else {
                return <CareApp userDetails={userDetails} />;
              }
            case "Researcher":
              if (ENABLE_ALL_FEATURES || (Array.isArray(userLabs) && userLabs.some((lab) => 
                ["DNA", "Animal Care"].some(allowedLab => 
                  lab?.toLowerCase() === allowedLab.toLowerCase()
                )
              ))) {
                return <ResearcherApp userDetails={userDetails} />;
              } else {
                return <ResearcherAccessApp userDetails={userDetails} />;
              }
            default:
              toast.error("Something went wrong. Please contact support.");
              setLoggedIn(false);
              return null;
          }
        })()
      ) : (
        <>
          <div className="login-container">
            <Header />

            <div className="login-content">
              <div className="login-grid">
                {/* Left side - Image */}
                <div className="login-image-section">
                  <div className="image-wrapper">
                    <img src={AIWC_LIMS} alt="AIWC LIMS" className="login-main-image" />
                    <div className="image-overlay"></div>
                  </div>
                </div>

                {/* Right side - Login Form */}
                <div className="login-form-section">
                  <div className="login-card">
                    <div className="login-header">
                      <h2 className="login-title">Welcome Back</h2>
                      <p className="login-subtitle">Sign in to access your dashboard</p>
                    </div>

                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                      <div className="form-group-modern">
                        <label className="form-label-modern">Username</label>
                        <input
                          type="text"
                          value={username}
                          className="form-input-modern"
                          placeholder="Enter your username"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>

                      <div className="form-group-modern">
                        <label className="form-label-modern">Password</label>
                        <div className="password-input-wrapper">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            className="form-input-modern"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="password-toggle-btn"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="login-submit-btn"
                      >
                        Sign In
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            .login-container {
              height: 100vh;
              background: #f5f5f5; 
              display: flex;
              flex-direction: column;
            }

            .login-content {
              flex: 1;
              max-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              // padding: 40px 20px;
            }

            .login-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              max-width: 1200px;
              width: 100%;
              gap: 40px;
              align-items: center;
            }

            .login-image-section {
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .image-wrapper {
              // position: relative;
              width: 100%;
              max-width: 500px;
              padding: 20px;
            }

            .login-main-image {
              width: 100%;
              height: auto;
              border-radius: 20px;
              // box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.15);
              // transition: transform 0.3s ease;
            }

            .image-overlay {
              position: absolute;
              inset: 0;
              background: linear-gradient(135deg, rgba(197, 234, 49, 0.1) 0%, transparent 100%);
              border-radius: 20px;
              pointer-events: none;
            }

            .login-form-section {
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .login-card {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              border-radius: 24px;
              padding: 48px 40px;
              // box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.1), 
              //             0 0 0 1px rgba(255, 255, 255, 0.5);
              max-width: 440px;
              width: 100%;
              // transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .login-header {
              text-align: center;
              margin-bottom: 36px;
            }

            .login-title {
              font-family: 'Poppins', sans-serif;
              font-size: 28px;
              font-weight: 600;
              color: #1a3d2a;
              margin: 0 0 8px 0;
              letter-spacing: -0.5px;
            }

            .login-subtitle {
              font-size: 15px;
              color: #6b7280;
              margin: 0;
              font-weight: 400;
            }

            .login-form {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }

            .form-group-modern {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .form-label-modern {
              font-size: 14px;
              font-weight: 600;
              color: #374151;
              margin: 0;
            }

            .form-input-modern {
              width: 100%;
              padding: 14px 16px;
              font-size: 15px;
              color: #1f2937;
              background: #f9fafb;
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              transition: all 0.3s ease;
              font-family: 'Inter', sans-serif;
            }

            .form-input-modern:focus {
              outline: none;
              background: #ffffff;
              border-color: #c5ea31;
              box-shadow: 0 0 0 4px rgba(197, 234, 49, 0.1);
            }

            .form-input-modern::placeholder {
              color: #9ca3af;
            }

            .password-input-wrapper {
              position: relative;
              display: flex;
              align-items: center;
            }

            .password-toggle-btn {
              position: absolute;
              right: 12px;
              background: transparent;
              border: none;
              color: #6b7280;
              cursor: pointer;
              padding: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: color 0.2s ease;
              font-size: 18px;
            }

            .password-toggle-btn:hover {
              color: #374151;
            }

            .login-submit-btn {
              width: 100%;
              padding: 14px 24px;
              font-size: 16px;
              font-weight: 600;
              color: #1a3d2a;
              background: linear-gradient(135deg, #c5ea31 0%, #b5da21 100%);
              border: none;
              border-radius: 12px;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 12px rgba(197, 234, 49, 0.3);
              margin-top: 12px;
            }

            .login-submit-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(197, 234, 49, 0.4);
              background: linear-gradient(135deg, #d4f941 0%, #c5ea31 100%);
            }

            .login-submit-btn:active {
              transform: translateY(0);
              transition-duration: 0.1s;
            }

            /* Responsive Design */
            @media (max-width: 1024px) {
              .login-grid {
                grid-template-columns: 1fr;
                gap: 32px;
              }

              .login-image-section {
                order: 2;
              }

              .login-form-section {
                order: 1;
              }
            }

            @media (max-width: 640px) {
              .login-content {
                padding: 24px 16px;
              }

              .login-card {
                padding: 32px 24px;
              }

              .login-title {
                font-size: 24px;
              }

              .login-subtitle {
                font-size: 14px;
              }

              .image-wrapper {
                max-width: 100%;
              }
            }

            @media (max-width: 480px) {
              .login-card {
                padding: 28px 20px;
              }

              .login-title {
                font-size: 22px;
              }

              .form-input-modern {
                padding: 12px 14px;
                font-size: 14px;
              }

              .login-submit-btn {
                padding: 12px 20px;
                font-size: 15px;
              }
            }
          `}</style>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </>
      )}
    </div>
  );
}

export default Login;