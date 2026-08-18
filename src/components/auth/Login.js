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
import AppShell from "../layout/AppShell";
import toast, { Toaster } from "react-hot-toast";
import "./Login.css";

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
  const [userFullAccess, setUserFullAccess] = useState(
    !!initialAuthState.user?.full_access
  );
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
      setUserFullAccess(!!reduxUser.full_access);
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

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    try {
      await loginUserApi({ user_name: trimmedUser, password: trimmedPass });

      const response = await getLoginApi();
      const foundUser = response.find(
        (user) => user.user_name.toLowerCase() === trimmedUser.toLowerCase()
      );

      if (!foundUser) {
        toast.error("The username or password you entered is incorrect. Please try again.");
      } else if (!foundUser.is_active) {
        toast.error("You are blocked");
      } else {
        dispatch(setUser(foundUser));

        sessionStorage.setItem('lims-header-intro', '1');
        setLoggedIn(true);
        setUserRole(foundUser.role);
        setUserLabs(foundUser.lab || []);
        setUserFullAccess(!!foundUser.full_access);
        setUserId(foundUser.id);

        setUserDetails({
          name: foundUser.user_name,
          lab: foundUser.lab || "N/A",
          designation: foundUser.designation || "Not Assigned"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("The username or password you entered is incorrect. Please try again.");
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
              if (userFullAccess) {
                return <ManagerApp userId={userId} userDetails={userDetails} />;
              }
              else {
                return <ManagerAccessApp userId={userId} userDetails={userDetails} />;
              }
            case "Lab Assistant":
              if (userFullAccess) {
                return <LabApp userId={userId} userDetails={userDetails} />;
              } else {
                return <CareApp userId={userId} userDetails={userDetails} />;
              }
            case "Researcher":
              if (userFullAccess) {
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
          <AppShell auth>
            <div className="login-container login-page">
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
                    <img
                      src={AIWC_LIMS}
                      alt=""
                      className="login-card-logo"
                      aria-hidden="true"
                      loading="lazy"
                    />
                    <div className="login-header">
                      <h2 className="login-title">Welcome Back</h2>
                      <p className="login-subtitle">Sign in to access your dashboard</p>
                    </div>

                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                      <div className="form-group-modern">
                        <label className="form-label-modern" htmlFor="login-username">
                          Username
                        </label>
                        <input
                          id="login-username"
                          type="text"
                          value={username}
                          className="form-input-modern"
                          placeholder="Enter your username"
                          autoComplete="username"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>

                      <div className="form-group-modern">
                        <label className="form-label-modern" htmlFor="login-password">
                          Password
                        </label>
                        <div className="password-input-wrapper">
                          <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            className="form-input-modern"
                            placeholder="Enter your password"
                            autoComplete="current-password"
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
          </AppShell>

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