import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaBullhorn,
  FaArrowLeft,
  FaBook,
  FaUserTie,
  FaClock,
  FaChalkboardTeacher,
} from "react-icons/fa";

const TeacherNotice = ({
  teacherId,
  assignedCourses = [],
  teacherName,
  teacherDesignation,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [notices, setNotices] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // LOAD COURSE NOTICE
  useEffect(() => {
    if (!selectedCourse || !teacherId) return;

    const key = `teacherCourseNotices_${teacherId}_${selectedCourse.courseId}`;
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    setNotices(stored);
  }, [selectedCourse, teacherId]);

  // GET TEACHER NAME
  // const getTeacherName = () => {
  //   return (
  //     localStorage.getItem("teacherName_" + teacherId) ||
  //     localStorage.getItem("teacher_name_" + teacherId) ||
  //     "Teacher"
  //   );
  // };

  // // GET DESIGNATION (DYNAMIC 🔥)
  // const getTeacherDesignation = () => {
  //   return teacherDesignation || "Lecturer";
  // };

  // SAVE
  const saveNotices = (updated) => {
    if (!selectedCourse) return;

    const key = `teacherCourseNotices_${teacherId}_${selectedCourse.courseId}`;
    setNotices(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // ADD NOTICE
  const handleAddNotice = () => {
    if (!message.trim() || !selectedCourse) return;

    const newNotice = {
      id: Date.now(),
      title: "Course Notice",
      message,
      createdAt: new Date().toISOString(),

      senderType: "teacher", // MUST
      senderName: teacherName || "Teacher",
      teacherName: teacherName || "Teacher",
      designation: teacherDesignation || "Lecturer",

      teacherId,
      courseId: String(selectedCourse.courseId).trim(),
      courseName: selectedCourse.courseName,
    };

    // Local (course ভিত্তিক)
    const updated = [newNotice, ...notices];
    saveNotices(updated);

    // Global (Admin + Student এর জন্য)
    const existing = localStorage.getItem("notices");

    let global = [];

    try {
      global = existing ? JSON.parse(existing) : [];
    } catch {
      global = [];
    }

    const updatedGlobal = [newNotice, ...global];

    localStorage.setItem("notices", JSON.stringify(updatedGlobal));

    setMessage("");
    setShowForm(false);
  };

  // DELETE
  const handleDelete = (id) => {
    const updated = notices.filter((n) => n.id !== id);
    saveNotices(updated);

    const global = JSON.parse(localStorage.getItem("notices") || "[]");
    localStorage.setItem(
      "notices",
      JSON.stringify(global.filter((n) => n.id !== id)),
    );
  };

  return (
    <div className="container mt-4">
      {/* TITLE */}
      <div className="text-center mb-4">
        <h3 className="fw-bold text-danger">
          <FaBullhorn className="me-2" />
          Teacher Notice Panel
        </h3>
      </div>

      {/* COURSE LIST */}
      {!selectedCourse ? (
        <div className="row g-3">
          {assignedCourses.length === 0 ? (
            <div className="alert alert-warning text-center">
              No assigned courses
            </div>
          ) : (
            assignedCourses.map((c) => (
              <div key={c.courseId} className="col-md-4">
                <div
                  className="card shadow border-0 text-center p-3 h-100"
                  style={{ cursor: "pointer", borderRadius: "15px" }}
                  onClick={() => setSelectedCourse(c)}
                >
                  <FaBook size={20} className="text-primary mb-2" />
                  <h5>{c.courseName}</h5>
                  <small className="text-muted">{c.courseId}</small>

                  <div className="mt-2">
                    <span className="badge bg-primary">Open Notices</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* BACK */}
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => {
              setSelectedCourse(null);
              setMessage("");
              setShowForm(false);
            }}
          >
            <FaArrowLeft /> Back
          </button>

          {/* HEADER */}
          <div className="card shadow-sm p-3 mb-3">
            <h5 className="fw-bold text-primary">
              <FaChalkboardTeacher className="me-2" />
              {selectedCourse.courseName}
            </h5>
            <small className="text-muted">{selectedCourse.courseId}</small>
          </div>

          {/* ADD BUTTON */}
          <button
            className="btn btn-success mb-3"
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus className="me-2" />
            Add Notice
          </button>

          {/* FORM */}
          {showForm && (
            <div className="card p-3 mb-3 shadow-sm">
              <textarea
                className="form-control mb-2"
                placeholder="Write your notice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                className="btn btn-primary w-100"
                onClick={handleAddNotice}
              >
                Publish Notice
              </button>
            </div>
          )}

          {/* LIST */}
          {notices.length === 0 ? (
            <div className="alert alert-warning text-center">
              No notices yet
            </div>
          ) : (
            <div className="row g-3">
              {notices.map((n) => (
                <div key={n.id} className="col-md-6">
                  <div className="card shadow border-0 h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <FaBullhorn className="me-2 text-danger" />
                        <h6 className="fw-bold m-0">{n.message}</h6>
                      </div>

                      <p className="mb-1">
                        <FaBook className="me-1 text-primary" />
                        {n.courseName}
                      </p>

                      <p className="mb-1">
                        <FaUserTie className="me-1 text-success" />
                        {n.senderName}
                      </p>

                      <p className="mb-1 text-muted small">{n.designation}</p>

                      <p className="text-muted small">
                        <FaClock className="me-1" />
                        {n.createdAt}
                      </p>

                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => handleDelete(n.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherNotice;
