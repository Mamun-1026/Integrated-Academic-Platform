import "../App.css";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUserShield } from "react-icons/fa";
import logo from "../assets/cuLogo.jpeg";

const Login = () => {
  useEffect(() => {
    document.body.classList.remove("student-dark", "teacher-dark");
    document.body.classList.add("student-light");
  }, []);

  const userId = useRef();
  const userPass = useRef();
  const role = useRef();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = userId.current.value.trim();
    const password = userPass.current.value.trim();
    const userRole = role.current.value;

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role: userRole }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        if (data.role === "Student") {
          localStorage.setItem("userId", data.userId);
          navigate("/dashboard");
        } else if (data.role === "Teacher") {
          localStorage.setItem("teacherId", data.teacherId);
          localStorage.setItem("userId", data.teacherId);
          navigate("/teacher-dashboard");
        } else {
          localStorage.setItem("userId", data.userId);
          navigate("/admin-dashboard");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login network error, falling back locally:", err);

      if (userRole === "Student") {
        const students = JSON.parse(localStorage.getItem("students") || "[]");
        const student = students.find(
          (s) =>
            (s.studentId === username || s.userId === username) &&
            s.password === password,
        );
        if (student) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem(
            "username",
            student.fullName || student.name || username,
          );
          localStorage.setItem("role", "Student");
          localStorage.setItem("userId", student.studentId || student.userId);
          navigate("/dashboard");
          return;
        }
      } else if (userRole === "Teacher") {
        const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
        const teacher = teachers.find(
          (t) =>
            (t.teacherId === username || t.email === username) &&
            t.password === password,
        );
        if (teacher) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem(
            "username",
            teacher.fullName || teacher.name || username,
          );
          localStorage.setItem("role", "Teacher");
          localStorage.setItem("teacherId", teacher.teacherId);
          localStorage.setItem("userId", teacher.teacherId);
          navigate("/teacher-dashboard");
          return;
        }
      }

      alert("Server connection failed and local credentials check failed!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg"></div>

      <div
        className="login-content-wrapper position-relative"
        style={{ zIndex: 2 }}
      >
        {/* Header Branding */}
        <div className="text-center brand-header mb-3">
          <div className="logo-wrapper shadow-sm mb-2">
            <img src={logo} alt="University Logo" className="university-logo" />
          </div>
          <h3 className="fw-bold text-dark tracking-wide mb-1">
            University ERP Portal
          </h3>
          <p className="text-muted small mb-0">
            Student • Teacher • Administrator System
          </p>
        </div>

        {/* Login Card */}
        <div className="card login-card shadow-lg border-0 p-4">
          <div className="card-body">
            <h4 className="text-center mb-4 text-danger fw-bold">Sign In</h4>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">
                  Username / ID
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <FaUser />
                  </span>
                  <input
                    ref={userId}
                    className="form-control border-start-0 ps-0 shadow-none"
                    placeholder="Enter ID or Username"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <FaLock />
                  </span>
                  <input
                    ref={userPass}
                    type="password"
                    className="form-control border-start-0 ps-0 shadow-none"
                    placeholder="Enter Password"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">
                  Select Role
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <FaUserShield />
                  </span>
                  <select
                    ref={role}
                    className="form-select border-start-0 ps-0 shadow-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-danger w-100 py-2 fw-semibold rounded-3 shadow-sm login-submit-btn">
                Secure Login
              </button>
            </form>
          </div>
        </div>

        <div className="mt-3 text-muted small text-center opacity-75">
          &copy; 2026 University ERP System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
