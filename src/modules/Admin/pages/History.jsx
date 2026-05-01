import { FiMoreVertical } from "react-icons/fi";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";

const History = ({
  students,
  teachers,
  searchTerm,
  setSearchTerm,
  highlightText,
  openAbout,
  openUpdate,
  handleRemoveStudent,
  handleRemoveTeacher,
  setOpenMenu,
  openMenu,
}) => {
  // Filter students & teachers based on searchTerm
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTeachers = teachers.filter(
    (t) =>
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="mb-4">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Student / Teacher by Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* STUDENT HISTORY */}
      <h5 className="mb-3">Student History</h5>
      <div className="row g-3">
        {filteredStudents.map((s) => {
          let studentInfo = {};
          try {
            studentInfo = JSON.parse(
              localStorage.getItem("studentInfo_" + s.studentId) || "{}",
            );
          } catch {
            studentInfo = {};
          }
          const profile = localStorage.getItem("profileImage_" + s.studentId);

          const name =
            studentInfo.firstName && studentInfo.lastName
              ? studentInfo.firstName + " " + studentInfo.lastName
              : studentInfo.name || s.name;
          const department = studentInfo.department || s.department;
          const password = studentInfo.password || s.password;
          const createdAt = s.createdAt;
          const updatedAt = studentInfo.updatedAt;

          return (
            <div key={s.studentId} className="col-md-6 col-lg-4">
              <div className="card shadow-sm p-3 d-flex flex-row align-items-center hover-shadow">
                <img
                  src={profile || "https://via.placeholder.com/60"}
                  alt="profile"
                  className="rounded-circle me-3"
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />

                <div className="flex-grow-1">
                  <div className="fw-bold">
                    {highlightText(`${name} (${department})`, searchTerm)}
                  </div>

                  <span className="badge bg-primary me-2">
                    ID: {highlightText(s.studentId, searchTerm)}
                  </span>

                  <span className="badge bg-secondary">{password}</span>

                  {createdAt && (
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      Created: {createdAt}
                    </div>
                  )}

                  {updatedAt && (
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      Edited: {updatedAt}
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                <div className="ms-auto position-relative">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      setOpenMenu(openMenu === s.studentId ? null : s.studentId)
                    }
                  >
                    <FiMoreVertical />
                  </button>

                  {openMenu === s.studentId && (
                    <div
                      className="dropdown-menu show"
                      style={{ position: "absolute", right: 0, top: "40px" }}
                    >
                      <button
                        className="dropdown-item"
                        onClick={() => openAbout("student", s)}
                      >
                        <FaUser className="me-2" /> About More
                      </button>

                      <button
                        className="dropdown-item"
                        onClick={() => openUpdate("student", s)}
                      >
                        <FaEdit className="me-2" /> Update
                      </button>

                      <button
                        className="dropdown-item text-danger"
                        onClick={() => handleRemoveStudent(s.studentId)}
                      >
                        <FaTrash className="me-2" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <hr className="my-4" />

      {/* TEACHER HISTORY */}
      <h5 className="mb-3">Teacher History</h5>
      <div className="row g-3">
        {filteredTeachers.map((t) => {
          let teacherInfo = {};
          try {
            teacherInfo = JSON.parse(
              localStorage.getItem("teacherInfo_" + t.teacherId) || "{}",
            );
          } catch {
            teacherInfo = {};
          }
          const profile =
            localStorage.getItem("profileImage_" + t.teacherId) ||
            teacherInfo?.profilePhoto;

          return (
            <div key={t.teacherId} className="col-md-6 col-lg-4">
              <div className="card shadow-sm p-3 d-flex flex-row align-items-center hover-shadow">
                <img
                  src={profile || "https://via.placeholder.com/60"}
                  alt="profile"
                  className="rounded-circle me-3"
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />

                <div className="flex-grow-1">
                  <div className="fw-bold">
                    {highlightText(t.fullName, searchTerm)}
                  </div>

                  <span className="badge bg-primary me-2">
                    ID: {highlightText(t.teacherId, searchTerm)}
                  </span>

                  <span className="badge bg-secondary">{t.password}</span>

                  {t.createdAt && (
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      Created: {t.createdAt}
                    </div>
                  )}

                  {teacherInfo.updatedAt && (
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      Edited: {teacherInfo.updatedAt}
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                <div className="ms-auto position-relative">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      setOpenMenu(openMenu === t.teacherId ? null : t.teacherId)
                    }
                  >
                    <FiMoreVertical />
                  </button>

                  {openMenu === t.teacherId && (
                    <div
                      className="dropdown-menu show"
                      style={{ position: "absolute", right: 0, top: "40px" }}
                    >
                      <button
                        className="dropdown-item"
                        onClick={() => openAbout("teacher", t)}
                      >
                        <FaUser className="me-2" /> About More
                      </button>

                      <button
                        className="dropdown-item"
                        onClick={() => openUpdate("teacher", t)}
                      >
                        <FaEdit className="me-2" /> Update
                      </button>

                      <button
                        className="dropdown-item text-danger"
                        onClick={() => handleRemoveTeacher(t.teacherId)}
                      >
                        <FaTrash className="me-2" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
