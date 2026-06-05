import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaTrash,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaClipboardList,
} from "react-icons/fa";

const TeacherLeave = ({ teacherId }) => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    reason: "",
    from: "",
    to: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // LOAD LEAVES
  useEffect(() => {
    if (!teacherId) return;

    const data =
      JSON.parse(localStorage.getItem("teacherLeaves_" + teacherId)) || [];
    setLeaves(data);
  }, [teacherId]);

  // 🔥 SINGLE SOURCE OF TRUTH (FIX)
  const allTeachers = JSON.parse(localStorage.getItem("teachers") || "[]");

  const teacher =
    allTeachers.find((t) => String(t.teacherId) === String(teacherId)) || {};

  // FORM CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // DAYS CALCULATION
  const getDays = (from, to) => {
    const diff = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  };

  // OVERLAP CHECK
  const isOverlapping = (from, to) => {
    const start = new Date(from).getTime();
    const end = new Date(to).getTime();

    return leaves.some((l) => {
      const lStart = new Date(l.from).getTime();
      const lEnd = new Date(l.to).getTime();
      return start <= lEnd && end >= lStart;
    });
  };

  // APPLY LEAVE
  const handleApplyLeave = () => {
    const { reason, from, to } = form;

    if (!reason || !from || !to) {
      return setError("All fields are required!");
    }

    if (new Date(from) > new Date(to)) {
      return setError("Invalid date range!");
    }

    if (isOverlapping(from, to)) {
      return setError("You already applied for overlapping dates!");
    }

    const newLeave = {
      id: Date.now(),
      teacherId: String(teacherId),

      //  SNAPSHOT (IMPORTANT)
      teacherName: teacher.teacherName || teacher.name || "Unknown Teacher",
      department: teacher.department || "N/A",
      designation: teacher.designation || "Lecturer",

      reason,
      from,
      to,
      days: getDays(from, to),
      status: "Pending",
      createdAt: new Date().toLocaleString(),
    };

    const updated = [newLeave, ...leaves];
    setLeaves(updated);

    localStorage.setItem("teacherLeaves_" + teacherId, JSON.stringify(updated));

    setForm({ reason: "", from: "", to: "" });
    setSuccess("Leave request submitted successfully!");
  };

  // DELETE (only pending)
  const handleDelete = (id, status) => {
    if (status !== "Pending") return;

    const updated = leaves.filter((l) => l.id !== id);
    setLeaves(updated);

    localStorage.setItem("teacherLeaves_" + teacherId, JSON.stringify(updated));
  };

  // FILTER
  const filteredLeaves =
    filter === "All" ? leaves : leaves.filter((l) => l.status === filter);

  // STATS
  const total = leaves.length;
  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const rejected = leaves.filter((l) => l.status === "Rejected").length;

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-center fw-bold text-primary">
          <FaCalendarAlt className="me-2" />
          Leave Management
        </h2>
        <p className="text-center text-muted">
          Apply and track your leave requests easily
        </p>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <FaClipboardList className="text-primary mb-1" />
            <h6>Total</h6>
            <h4>{total}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <FaHourglassHalf className="text-warning mb-1" />
            <h6>Pending</h6>
            <h4>{pending}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <FaCheckCircle className="text-success mb-1" />
            <h6>Approved</h6>
            <h4>{approved}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <FaTimesCircle className="text-danger mb-1" />
            <h6>Rejected</h6>
            <h4>{rejected}</h4>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* FORM */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Apply Leave</h5>

            <input
              type="text"
              name="reason"
              className="form-control mb-2"
              placeholder="Reason"
              value={form.reason}
              onChange={handleChange}
            />

            <input
              type="date"
              name="from"
              className="form-control mb-2"
              value={form.from}
              onChange={handleChange}
            />

            <input
              type="date"
              name="to"
              className="form-control mb-2"
              value={form.to}
              onChange={handleChange}
            />

            {form.from && form.to && (
              <small className="text-muted">
                Duration: {getDays(form.from, form.to)} days
              </small>
            )}

            {error && <div className="text-danger small mt-2">{error}</div>}
            {success && (
              <div className="text-success small mt-2">{success}</div>
            )}

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleApplyLeave}
              disabled={!form.reason || !form.from || !form.to}
            >
              <FaPaperPlane className="me-2" />
              Submit Request
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="col-md-8">
          <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between mb-2">
              <h6>Leave History</h6>

              <select
                className="form-select w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            {filteredLeaves.length === 0 ? (
              <div className="text-center text-muted py-4">
                No leave requests found
              </div>
            ) : (
              <table className="table table-hover text-center align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Reason</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeaves.map((l) => (
                    <tr key={l.id}>
                      <td>{l.reason}</td>

                      <td>
                        {l.from} → {l.to}
                        <br />
                        <small>{l.days} days</small>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            l.status === "Approved"
                              ? "bg-success"
                              : l.status === "Rejected"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>

                      <td>
                        {l.status === "Pending" && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(l.id, l.status)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLeave;
