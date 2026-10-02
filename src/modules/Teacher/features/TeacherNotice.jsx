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

  // LOAD COURSE NOTICE FROM DB API & LOCALSTORAGE
  useEffect(() => {
    if (!selectedCourse || !teacherId) return;

    const loadNotices = async () => {
      let stored = [];
      try {
        const res = await fetch(
          `http://localhost:5000/api/notices/${selectedCourse.courseId}`,
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          stored = data;
        }
      } catch (err) {
        console.error("Error loading teacher notices from DB:", err);
      }

      if (stored.length === 0) {
        const key = `teacherCourseNotices_${teacherId}_${selectedCourse.courseId}`;
        stored = JSON.parse(localStorage.getItem(key) || "[]");
      }

      setNotices(stored);
    };

    loadNotices();
  }, [selectedCourse, teacherId]);

  // SAVE
  const saveNotices = (updated) => {
    if (!selectedCourse) return;

    const key = `teacherCourseNotices_${teacherId}_${selectedCourse.courseId}`;
    setNotices(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // ADD NOTICE
  const handleAddNotice = async () => {
    if (!message.trim() || !selectedCourse) return;

    const newNotice = {
      id: Date.now(),
      title: "Course Notice",
      message,
      createdAt: new Date().toISOString(),

      senderType: "teacher",
      senderName: teacherName || "Teacher",
      teacherName: teacherName || "Teacher",
      designation: teacherDesignation || "Lecturer",

      teacherId,
      courseId: String(selectedCourse.courseId).trim(),
      courseName: selectedCourse.courseName,
    };

    // Local
    const updated = [newNotice, ...notices];
    saveNotices(updated);

    // Global
    const existing = localStorage.getItem("notices");
    let global = [];

    try {
      global = existing ? JSON.parse(existing) : [];
    } catch {
      global = [];
    }

    const updatedGlobal = [newNotice, ...global];
    localStorage.setItem("notices", JSON.stringify(updatedGlobal));

    try {
      await fetch("http://localhost:5000/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotice),
      });
    } catch (err) {
      console.error("Database notice publish sync error:", err);
    }

    setMessage("");
    setShowForm(false);
  };

  // DELETE
  const handleDelete = async (id) => {
    const updated = notices.filter((n) => n.id !== id);
    saveNotices(updated);

    const global = JSON.parse(localStorage.getItem("notices") || "[]");
    localStorage.setItem(
      "notices",
      JSON.stringify(global.filter((n) => n.id !== id)),
    );

    try {
      await fetch(`http://localhost:5000/api/notices/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Database notice delete sync error:", err);
    }
  };

  return (
    <div className="container mt-4">
      {/* TITLE */}
      <div className="text-center mb-4">
        <h3 className="fw-bold text-primary">
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
                        <FaBullhorn className="me-2 text-primary" />
                        <h6 className="fw-bold m-0">{n.message}</h6>
                      </div>

                      <p className="mb-1">
                        <FaBook className="me-1 text-primary" />
                        {n.courseName}
                      </p>

                      <p className="mb-1">
                        <FaUserTie className="me-1 text-success" />
                        {n.senderName || n.teacherName}
                      </p>

                      <p className="mb-1 text-muted small">{n.designation}</p>

                      <p className="text-muted small">
                        <FaClock className="me-1" />
                        {n.createdAt || n.date}
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
