import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaTrash,
  FaBook,
  FaExclamationTriangle,
  FaUndo,
  FaHistory,
  FaClock,
} from "react-icons/fa";
import { IoAlertCircleSharp, IoCheckmarkDoneCircle } from "react-icons/io5";

const CourseDrop = ({ studentData }) => {
  const { userId } = studentData || {};

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [history, setHistory] = useState([]);
  const [undoStack, setUndoStack] = useState(null);

  //  LOAD ONLY THIS STUDENT'S ENROLLED COURSES
  useEffect(() => {
    if (!userId) return;

    const stored = JSON.parse(
      localStorage.getItem(`studentCourses_${userId}`) || "[]",
    );

    const dropHistory = JSON.parse(
      localStorage.getItem(`dropHistory_${userId}`) || "[]",
    );

    // SAFETY FILTER (ONLY VALID ENROLLED COURSES)
    const validCourses = stored.filter((c) => c && c.courseId && c.courseName);

    setCourses(validCourses);
    setHistory(dropHistory);
  }, [userId]);

  //  DEADLINE CHECK
  const isDropAllowed = () => {
    const deadline = localStorage.getItem("dropDeadline");
    if (!deadline) return true;
    return new Date() < new Date(deadline);
  };

  //  DROP COURSE (ONLY THIS STUDENT)
  const handleDrop = (course) => {
    if (!isDropAllowed()) {
      alert("<IoAlertCircleSharp /> Drop deadline expired!");
      return;
    }

    // remove ONLY from THIS student's enrolled list
    const updated = courses.filter((c) => c.courseId !== course.courseId);

    setCourses(updated);

    localStorage.setItem(`studentCourses_${userId}`, JSON.stringify(updated));

    //  HISTORY (this student only)
    const newHistory = [
      {
        ...course,
        date: new Date().toLocaleString(),
      },
      ...history,
    ];

    setHistory(newHistory);

    localStorage.setItem(`dropHistory_${userId}`, JSON.stringify(newHistory));

    //  ADMIN REQUEST LOG (optional workflow)
    const adminReq = JSON.parse(
      localStorage.getItem("dropRequests_admin") || "[]",
    );

    adminReq.push({
      studentId: userId,
      course,
      status: "pending",
      date: new Date().toLocaleString(),
    });

    localStorage.setItem("dropRequests_admin", JSON.stringify(adminReq));

    //  undo support
    setUndoStack(course);

    setTimeout(() => {
      setUndoStack(null);
    }, 10000);

    setSelectedCourse(null);
  };

  //  UNDO DROP
  const handleUndo = () => {
    if (!undoStack) return;

    const restored = [...courses, undoStack];

    setCourses(restored);

    localStorage.setItem(`studentCourses_${userId}`, JSON.stringify(restored));

    setUndoStack(null);

    alert("<IoCheckmarkDoneCircle /> Course restored!");
  };

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="text-center mb-4">
        <h3 className="fw-bold text-danger">
          <FaBook className="me-2" />
          Course Drop Panel
        </h3>
        <p className="text-muted">Only your enrolled courses are shown here</p>
      </div>

      {/* UNDO */}
      {undoStack && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>
            <FaUndo className="me-2" />
            Course dropped — undo available (10s)
          </span>

          <button className="btn btn-dark btn-sm" onClick={handleUndo}>
            Undo
          </button>
        </div>
      )}

      {/* COURSES */}
      {courses.length === 0 ? (
        <div className="alert alert-info text-center">
          No enrolled courses found
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((c) => (
            <div key={c.courseId} className="col-md-6 col-lg-4">
              <div className="card shadow border-0 text-center p-3">
                <FaBook size={28} className="text-primary mb-2" />

                <h5>{c.courseName}</h5>
                <p className="text-muted">{c.courseId}</p>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setSelectedCourse(c)}
                >
                  <FaTrash className="me-1" />
                  Drop Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HISTORY */}
      <div className="mt-5">
        <h5>
          <FaHistory className="me-2" />
          Drop History
        </h5>

        {history.length === 0 ? (
          <p className="text-muted">No history yet</p>
        ) : (
          <ul className="list-group">
            {history.map((h, i) => (
              <li key={i} className="list-group-item">
                <strong>{h.courseName}</strong> ({h.courseId}) -{" "}
                <FaClock className="me-1 text-muted" />
                {h.date}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CONFIRM MODAL */}
      {selectedCourse && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}
        >
          <div className="card p-4 text-center" style={{ width: "350px" }}>
            <FaExclamationTriangle size={40} className="text-warning mb-2" />

            <h5>Confirm Drop?</h5>
            <p>
              Drop <b>{selectedCourse.courseName}</b>?
            </p>

            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedCourse(null)}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDrop(selectedCourse)}
              >
                Yes Drop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDrop;
