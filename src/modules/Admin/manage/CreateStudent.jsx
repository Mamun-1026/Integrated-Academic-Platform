import { useState } from "react";
import {
  FaUserGraduate,
  FaIdCard,
  FaLock,
  FaUniversity,
  FaLayerGroup,
  FaUsers,
  FaPlusCircle,
} from "react-icons/fa";

const CreateStudent = ({
  students,
  setStudents,
  setSelectedStudentId,
  setActiveTab,
}) => {
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    studentId: "",
    password: "",
    department: "CSE",
    batch: "65",
    section: "A",
  });

  const handleCreateStudent = () => {
    if (
      !studentFormData.name ||
      !studentFormData.studentId ||
      !studentFormData.password
    ) {
      alert("Fill all fields");
      return;
    }

    const exists = students.some(
      (s) =>
        s.studentId.toLowerCase() === studentFormData.studentId.toLowerCase(),
    );

    if (exists) {
      alert("Student ID already exists!");
      return;
    }

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    let semesterName;

    if (month >= 1 && month <= 4) semesterName = `Spring ${year}`;
    else if (month >= 5 && month <= 8) semesterName = `Summer ${year}`;
    else semesterName = `Fall ${year}`;

    const newStudent = {
      ...studentFormData,
      createdAt: new Date().toLocaleString(),
      semester: semesterName,
    };

    const updated = [...students, newStudent];
    localStorage.setItem("students", JSON.stringify(updated));
    setStudents(updated);
    setSelectedStudentId(studentFormData.studentId);
    setActiveTab("infoStudent");

    setStudentFormData({
      name: "",
      studentId: "",
      password: "",
      department: "CSE",
      batch: "65",
      section: "A",
    });

    alert(`Student Created! Semester: ${semesterName}`);
  };

  return (
    <div className="container py-3">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-3">
        <FaUserGraduate className="text-primary fs-3 me-2" />
        <h4 className="mb-0 fw-bold">Create Student</h4>
      </div>

      {/* FORM CARD */}
      <div className="card border-0 shadow-sm p-4 form-card">
        <div className="row g-3">
          {/* NAME */}
          <div className="col-12">
            <label className="form-label fw-semibold">Student Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUserGraduate />
              </span>
              <input
                className="form-control"
                placeholder="Enter student name"
                value={studentFormData.name}
                onChange={(e) =>
                  setStudentFormData({
                    ...studentFormData,
                    name: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* ID */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Student ID</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaIdCard />
              </span>
              <input
                className="form-control"
                placeholder="Enter ID"
                value={studentFormData.studentId}
                onChange={(e) =>
                  setStudentFormData({
                    ...studentFormData,
                    studentId: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={studentFormData.password}
                onChange={(e) =>
                  setStudentFormData({
                    ...studentFormData,
                    password: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* DEPARTMENT */}
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Department</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUniversity />
              </span>
              <select
                className="form-select"
                value={studentFormData.department}
                onChange={(e) =>
                  setStudentFormData({
                    ...studentFormData,
                    department: e.target.value,
                  })
                }
              >
                <option>CSE</option>
                <option>EEE</option>
                <option>Business</option>
                <option>Law</option>
              </select>
            </div>
          </div>

          {/* BATCH */}
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Batch</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLayerGroup />
              </span>
              <input
                className="form-control"
                placeholder="Batch"
                value={studentFormData.batch}
                onChange={(e) =>
                  setStudentFormData({
                    ...studentFormData,
                    batch: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* SECTION */}
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Section</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUsers />
              </span>
              <input
                className="form-control"
                placeholder="Section"
                value={studentFormData.section}
                onChange={(e) =>
                  setStudentFormData({
                    ...studentFormData,
                    section: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="mt-4">
          <button
            className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            onClick={handleCreateStudent}
          >
            <FaPlusCircle /> Create Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;
