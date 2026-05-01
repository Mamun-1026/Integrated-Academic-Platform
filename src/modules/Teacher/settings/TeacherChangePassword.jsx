import { useState } from "react";
import {
  FaLock,
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";

const TeacherChangePassword = ({ darkMode }) => {
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

    const teacherId = localStorage.getItem("teacherId");
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");

    const currentTeacher = teachers.find((t) => t.teacherId === teacherId);

    if (!currentTeacher) return setError("Teacher not found");
    if (currentTeacher.password !== oldPassword)
      return setError("Old password incorrect");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    const updated = teachers.map((t) =>
      t.teacherId === teacherId
        ? { ...t, password: newPassword, previousPassword: t.password }
        : t,
    );

    localStorage.setItem("teachers", JSON.stringify(updated));

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
        {/* LEFT PANEL (same style as student) */}
        <div className="col-lg-4">
          <div className="p-4 rounded-4 shadow-sm h-100 bg-dark text-white">
            <FaUserShield size={28} className="mb-3 text-info" />

            <h4 className="fw-bold">Faculty Security</h4>

            <p className="text-white-50">
              Manage your teacher account password securely inside ERP system.
            </p>

            <hr className="border-light opacity-25" />

            <div className="mb-3">
              <div className="text-white-50 small">Account Status</div>
              <div className="fw-semibold text-success">Active & Protected</div>
            </div>

            <div className="mb-3">
              <div className="text-white-50 small">Recommendation</div>
              <div className="fw-semibold">
                Use strong password (8+ characters recommended)
              </div>
            </div>

            <div className="mt-4 small text-white-50">
              Teacher Management System
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-lg-8">
          <div className="bg-white rounded-4 shadow-sm p-4">
            {/* HEADER */}
            <div className="mb-4">
              <h3 className="fw-bold mb-1">Change Password</h3>
              <p className="text-muted">
                Update your teacher account credentials
              </p>
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

            {/* STRENGTH BAR */}
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

export default TeacherChangePassword;
