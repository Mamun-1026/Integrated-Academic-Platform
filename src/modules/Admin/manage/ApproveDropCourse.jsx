import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

const ApproveDropCourse = () => {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("dropRequests_admin") || "[]",
    );
    setRequests(stored);

    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(allStudents);
  }, []);

  const getStudentInfo = (studentId) => {
    return students.find((s) => String(s.studentId) === String(studentId));
  };

  const saveRequests = (data) => {
    setRequests(data);
    localStorage.setItem("dropRequests_admin", JSON.stringify(data));
  };

  const handleApprove = (reqIndex) => {
    const req = requests[reqIndex];

    const key = `studentCourses_${req.studentId}`;
    const courses = JSON.parse(localStorage.getItem(key) || "[]");

    const updatedCourses = courses.filter(
      (c) => c.courseId !== req.course.courseId,
    );

    localStorage.setItem(key, JSON.stringify(updatedCourses));

    const updated = [...requests];
    updated[reqIndex].status = "approved";
    saveRequests(updated);
  };

  const handleReject = (reqIndex) => {
    const req = requests[reqIndex];

    const key = `studentCourses_${req.studentId}`;
    const courses = JSON.parse(localStorage.getItem(key) || "[]");

    const exists = courses.find((c) => c.courseId === req.course.courseId);

    if (!exists) courses.push(req.course);

    localStorage.setItem(key, JSON.stringify(courses));

    const updated = [...requests];
    updated[reqIndex].status = "rejected";
    saveRequests(updated);
  };

  const handleDelete = (reqIndex) => {
    const updated = requests.filter((_, i) => i !== reqIndex);
    saveRequests(updated);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#28a745";
      case "rejected":
        return "#dc3545";
      default:
        return "#ffc107";
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="container py-4">
      {/*  HEADER */}
      <div className="glass-header mb-4">
        <h3 className="fw-bold mb-1">Drop Course Approval</h3>
        <small>Review, approve or reject student requests</small>
      </div>

      {/* 📊 STATS */}
      <div className="row g-3 mb-4">
        <StatCard title="Total" value={stats.total} icon={<FaBook />} />
        <StatCard title="Pending" value={stats.pending} icon={<FaClock />} />
        <StatCard title="Approved" value={stats.approved} icon={<FaCheck />} />
        <StatCard title="Rejected" value={stats.rejected} icon={<FaTimes />} />
      </div>

      {requests.length === 0 ? (
        <div className="alert alert-warning text-center shadow-sm">
          No drop requests found
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((r, i) => {
            const s = getStudentInfo(r.studentId);

            return (
              <div key={i} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-sm h-100 modern-card"
                  style={{
                    borderLeft: `5px solid ${getStatusColor(r.status)}`,
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    {/* 👤 TOP */}
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <h6 className="fw-bold mb-1">
                          <FaUser className="me-2 text-primary" />
                          {s?.name || s?.fullName || "Unknown"}
                        </h6>
                        <small className="text-muted">ID: {r.studentId}</small>
                      </div>

                      <span className="badge soft-badge">{r.status}</span>
                    </div>

                    <div className="text-muted small mb-2">
                      {s?.department || "-"} • {s?.batch || "-"} •{" "}
                      {s?.section || "-"}
                    </div>

                    <hr />

                    {/* COURSE */}
                    <div className="mb-2">
                      <FaBook className="me-2 text-success" />
                      <strong>{r.course.courseName}</strong>
                      <div className="text-muted small">
                        {r.course.courseId}
                      </div>
                    </div>

                    {/* 📅 DATE */}
                    <div className="mb-3 text-muted">
                      <FaCalendarAlt className="me-2" />
                      {r.date}
                    </div>

                    {/*  ACTION */}
                    <div className="mt-auto d-flex flex-column gap-2">
                      {r.status === "pending" && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success w-100 btn-sm"
                            onClick={() => handleApprove(i)}
                          >
                            <FaCheck /> Approve
                          </button>

                          <button
                            className="btn btn-outline-warning w-100 btn-sm"
                            onClick={() => handleReject(i)}
                          >
                            <FaTimes /> Reject
                          </button>
                        </div>
                      )}

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(i)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/*  STYLES */}
      <style>{`
        .glass-header {
          padding: 20px;
          border-radius: 16px;
          background: rgba(255, 77, 79, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .modern-card {
          transition: all 0.3s ease;
          border-radius: 16px;
        }

        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }

        .soft-badge {
          background: rgba(0,0,0,0.05);
          color: #333;
          text-transform: capitalize;
        }

        .btn {
          transition: all 0.2s ease;
        }

        .btn:hover {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
};

/* STAT CARD */
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="col-md-3">
      <div className="card border-0 shadow-sm stat-card">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">{title}</small>
            <h4 className="fw-bold mb-0">{value}</h4>
          </div>
          <div className="text-muted" style={{ fontSize: "1.5rem" }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveDropCourse;
