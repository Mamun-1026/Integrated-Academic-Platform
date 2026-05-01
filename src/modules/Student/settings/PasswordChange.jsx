import { useState } from "react";
import {
  FaLock,
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const PasswordChange = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = () => {
    setError("");

    const userId = localStorage.getItem("userId");
    const students = JSON.parse(localStorage.getItem("students") || "[]");

    let currentUser = students.find((s) => s.studentId === userId);

    if (!currentUser) return setError("User not found");
    if (currentUser.password !== oldPassword)
      return setError("Old password incorrect");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    const updated = students.map((s) =>
      s.studentId === userId
        ? { ...s, password: newPassword, previousPassword: s.password }
        : s,
    );

    localStorage.setItem("students", JSON.stringify(updated));

    setSuccess(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccess(false), 3000);
  };

  const strength =
    newPassword.length >= 10
      ? "Strong"
      : newPassword.length >= 6
        ? "Medium"
        : "Weak";

  const bar =
    strength === "Strong"
      ? "bg-success"
      : strength === "Medium"
        ? "bg-warning"
        : "bg-danger";

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {/* LEFT PANEL */}
        <div className="col-lg-4">
          <div className="p-4 rounded-4 shadow-sm h-100 bg-dark text-white">
            <FaLock size={28} className="mb-3 text-info" />

            <h4 className="fw-bold">Security Center</h4>

            <p className="text-white-50">
              Manage your password securely inside the university system.
            </p>

            <hr className="border-light opacity-25" />

            <div className="mb-3">
              <div className="text-white-50 small">Account Status</div>
              <div className="fw-semibold text-success">Active & Secure</div>
            </div>

            <div className="mb-3">
              <div className="text-white-50 small">Recommendation</div>
              <div className="fw-semibold">
                Use strong password with 8+ characters
              </div>
            </div>

            <div className="mt-4 small text-white-50">
              University ERP System
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-lg-8">
          <div className="bg-white rounded-4 shadow-sm p-4">
            {/* HEADER */}
            <div className="mb-4">
              <h3 className="fw-bold mb-1">Change Password</h3>
              <p className="text-muted">Update your account credentials</p>
            </div>

            {/* ALERTS */}
            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2">
                <FaCheckCircle /> Password updated successfully
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <FaExclamationTriangle /> {error}
              </div>
            )}

            {/* OLD PASSWORD */}
            <label className="form-label fw-semibold">Old Password</label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaKey />
              </span>
              <input
                type={showOld ? "text" : "password"}
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* NEW PASSWORD */}
            <label className="form-label fw-semibold">New Password</label>
            <div className="input-group mb-2">
              <span className="input-group-text">
                <FaKey />
              </span>
              <input
                type={showNew ? "text" : "password"}
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* STRENGTH */}
            <div className="progress mb-2" style={{ height: "6px" }}>
              <div
                className={`progress-bar ${bar}`}
                style={{
                  width:
                    strength === "Strong"
                      ? "100%"
                      : strength === "Medium"
                        ? "60%"
                        : "25%",
                }}
              />
            </div>

            <small className="text-muted d-block mb-3">
              Strength: <strong>{strength}</strong>
            </small>

            {/* CONFIRM PASSWORD */}
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="input-group mb-4">
              <span className="input-group-text">
                <FaKey />
              </span>
              <input
                type={showConfirm ? "text" : "password"}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              className="btn btn-dark w-100 py-2 fw-semibold rounded-3"
              onClick={handleUpdate}
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
