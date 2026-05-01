import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import defaultImage from "../assets/face.webp";
import { FaUser, FaKey, FaSignOutAlt } from "react-icons/fa";

const Header = ({ setSelectedTab, userRole }) => {
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  const userId =
    userRole === "Teacher"
      ? localStorage.getItem("teacherId")
      : localStorage.getItem("userId");

  // unified key (IMPORTANT FIX)
  const imgKey = "profileImage_" + userId;

  let info = {};

  try {
    info =
      userRole === "Teacher"
        ? JSON.parse(localStorage.getItem("teacherInfo_" + userId) || "{}")
        : JSON.parse(localStorage.getItem("studentInfo_" + userId) || "{}");
  } catch {
    info = {};
  }

  const fullName =
    userRole === "Teacher"
      ? info.fullName || username
      : info.firstName && info.lastName
        ? info.firstName + " " + info.lastName
        : username;

  const designation = info.designation || "Lecturer";
  const batch = info.batch || "-";

  // LOAD IMAGE
  const loadImage = () => {
    const img = localStorage.getItem(imgKey);
    setProfileImage(img || defaultImage);
  };

  useEffect(() => {
    loadImage();

    window.addEventListener("profileUpdate", loadImage);
    window.addEventListener("storage", loadImage);
    return () => window.removeEventListener("profileUpdate", loadImage);
  }, [imgKey]);

  // CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const toggleDropdown = () => setDropdownOpen((p) => !p);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    if (userRole === "Teacher") {
      localStorage.removeItem("teacherId");
    } else {
      localStorage.removeItem("userId");
    }

    navigate("/");
  };

  const handleMyProfile = () => {
    setSelectedTab?.("Profile");
    setDropdownOpen(false);
  };

  const handleChangePassword = () => {
    setSelectedTab?.("Password Change");
    setDropdownOpen(false);
  };

  return (
    <header
      style={{ background: "#ff4d4d", padding: "10px 20px", color: "white" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        {/* LOGO */}
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="logo"
            style={{ width: "40px", marginRight: "10px" }}
          />
          <h5 style={{ margin: 0 }}>City University of Bangladesh</h5>
        </div>

        {/* TITLE */}
        <h5 style={{ margin: 0 }}>
          {userRole === "Teacher" ? "Teacher Portal" : "Student Portal"}
        </h5>

        {/* PROFILE DROPDOWN */}
        <div className="position-relative profile-dropdown">
          <button
            onClick={toggleDropdown}
            className="btn btn-light d-flex align-items-center"
          >
            <img
              src={profileImage}
              alt="profile"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                marginRight: "10px",
                objectFit: "cover",
              }}
            />

            {username}

            <span style={{ marginLeft: "6px", fontSize: "12px" }}>
              {userRole === "Teacher" ? `• ${designation}` : `• ID: ${userId}`}
            </span>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "45px",
                background: "white",
                color: "black",
                padding: "15px",
                width: "220px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                zIndex: 1050,
              }}
            >
              <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {fullName}
              </p>

              {userRole === "Teacher" && (
                <p style={{ marginBottom: "10px", fontSize: "0.9rem" }}>
                  Designation: {designation}
                </p>
              )}

              {userRole === "Student" && (
                <p style={{ marginBottom: "10px", fontSize: "0.9rem" }}>
                  Batch: {batch}
                </p>
              )}

              <button
                className="btn btn-light w-100 d-flex align-items-center mb-2"
                onClick={handleMyProfile}
              >
                <FaUser style={{ marginRight: "8px" }} />
                My Profile
              </button>

              <button
                className="btn btn-light w-100 d-flex align-items-center mb-2"
                onClick={handleChangePassword}
              >
                <FaKey style={{ marginRight: "8px" }} />
                Change Password
              </button>

              <button
                className="btn btn-danger w-100 d-flex align-items-center"
                onClick={handleLogout}
              >
                <FaSignOutAlt style={{ marginRight: "8px" }} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
