import { useState } from "react";
import {
  FaUserTie,
  FaIdCard,
  FaLock,
  FaPlusCircle,
  FaChalkboardTeacher,
} from "react-icons/fa";

const CreateTeacher = ({
  teachers,
  setTeachers,
  setSelectedTeacherId,
  setActiveTab,
}) => {
  const [teacherFormData, setTeacherFormData] = useState({
    fullName: "",
    teacherId: "",
    password: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
  });

  const handleCreateTeacher = async () => {
    if (
      !teacherFormData.fullName ||
      !teacherFormData.teacherId ||
      !teacherFormData.password
    ) {
      alert("Fill all fields");
      return;
    }
    const exists = teachers.some(
      (t) =>
        t.teacherId.toLowerCase() === teacherFormData.teacherId.toLowerCase(),
    );
    if (exists) {
      alert("Teacher ID already exists!");
      return;
    }

    const newTeacher = {
      ...teacherFormData,
      createdAt: new Date().toLocaleString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacher),
      });
      const data = await res.json();
      if (data.success) {
        const updated = [...teachers, newTeacher];
        setTeachers(updated);
        localStorage.setItem(
          "teacherInfo_" + teacherFormData.teacherId,
          JSON.stringify(newTeacher),
        );
        setSelectedTeacherId(teacherFormData.teacherId);
        setActiveTab("infoTeacher");
        setTeacherFormData({
          fullName: "",
          teacherId: "",
          password: "",
          designation: "",
          department: "",
          email: "",
          phone: "",
        });
        alert("Teacher Created & Saved to Database!");
      } else {
        alert("Failed to save teacher to database.");
      }
    } catch (err) {
      console.error(err);
      alert("Database error! Check if server is running.");
    }
  };

  const handleChange = (e) => {
    setTeacherFormData({
      ...teacherFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container py-3">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-3">
        <FaChalkboardTeacher className="text-primary fs-4 me-2" />
        <h4 className="mb-0 fw-bold">Create Teacher</h4>
      </div>

      {/* CARD */}
      <div className="card border-0 shadow-sm p-3 p-md-4">
        <div className="row g-3">
          {/* Name */}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">
              <FaUserTie className="me-1 text-primary" />
              Full Name
            </label>
            <input
              className="form-control"
              name="fullName"
              placeholder="Enter teacher name"
              value={teacherFormData.fullName}
              onChange={handleChange}
            />
          </div>

          {/* ID */}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">
              <FaIdCard className="me-1 text-primary" />
              Teacher ID
            </label>
            <input
              className="form-control"
              name="teacherId"
              placeholder="Enter teacher ID"
              value={teacherFormData.teacherId}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">
              <FaLock className="me-1 text-primary" />
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter password"
              value={teacherFormData.password}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">Email</label>
            <input
              className="form-control"
              name="email"
              placeholder="Email (optional)"
              value={teacherFormData.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">Phone</label>
            <input
              className="form-control"
              name="phone"
              placeholder="Phone (optional)"
              value={teacherFormData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Designation */}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">Designation</label>
            <input
              className="form-control"
              name="designation"
              placeholder="Lecturer / Professor"
              value={teacherFormData.designation}
              onChange={handleChange}
            />
          </div>

          {/* Department */}
          <div className="col-12">
            <label className="form-label fw-semibold">Department</label>
            <input
              className="form-control"
              name="department"
              placeholder="CSE / EEE / BBA etc."
              value={teacherFormData.department}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-4 d-flex justify-content-end">
          <button
            className="btn btn-success d-flex align-items-center gap-2 px-4"
            onClick={handleCreateTeacher}
          >
            <FaPlusCircle /> Create Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeacher;
