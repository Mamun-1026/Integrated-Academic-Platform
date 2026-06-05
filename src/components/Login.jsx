import "../App.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cuLogo.jpeg";

import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    document.body.classList.remove("student-dark", "teacher-dark");
    document.body.classList.add("student-light");
  }, []);

  const userId = useRef();
  const userPass = useRef();
  const role = useRef();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const username = userId.current.value.trim();
    const password = userPass.current.value.trim();
    const userRole = role.current.value;

    if (
      username === "admin" &&
      password === "admin" &&
      userRole === "Administrator"
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", "admin");
      localStorage.setItem("userId", "ADMIN001");
      localStorage.setItem("role", "Administrator");
      navigate("/admin-dashboard");
      return;
    }

    // --- Student Login ---
    if (userRole === "Student") {
      const students = JSON.parse(localStorage.getItem("students") || "[]");
      const student = students.find(
        (s) =>
          (s.studentId === username ||
            s.name?.toLowerCase() === username.toLowerCase()) &&
          s.password === password,
      );
      if (student) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", student.name);
        localStorage.setItem("userId", student.studentId); //  studentId as userId
        localStorage.setItem("role", "Student");
        navigate("/dashboard");
        return;
      }
    }

    // --- Teacher Login ---
    if (userRole === "Teacher") {
      const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
      const teacher = teachers.find(
        (t) =>
          (t.teacherId === username ||
            t.name?.toLowerCase() === username.toLowerCase() ||
            t.fullName?.toLowerCase() === username.toLowerCase()) &&
          t.password === password,
      );
      if (teacher) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", teacher.name || teacher.fullName);
        localStorage.setItem("teacherId", teacher.teacherId); //  teacherId
        localStorage.setItem("role", "Teacher");
        navigate("/teacher-dashboard");
        return;
      }
    }

    alert("Invalid username, password, or role");
  };

  return (
    <div className="login-page">
      {/* Background */}
      <div className="login-bg"></div>

      {/* Header */}
      <div className="container text-center header-section">
        <img src={logo} alt="logo" className="university-logo mb-3" />
        <p className="university-subtitle">Student • Teacher • Admin Portal</p>
      </div>

      {/* Login Card */}
      <div className="container d-flex justify-content-center">
        <div className="card login-card shadow border-0 animate-card">
          <div className="card-body p-4">
            <h4 className="text-center mb-4 text-danger fw-bold">Login</h4>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Username / ID</label>
                <input ref={userId} className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  ref={userPass}
                  type="password"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select ref={role} className="form-select">
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <button className="btn btn-danger w-100 fw-semibold">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
