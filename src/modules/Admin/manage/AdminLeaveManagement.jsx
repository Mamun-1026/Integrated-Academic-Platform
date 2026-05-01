import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

const AdminLeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter] = useState("All");

  // ---------------- SAFE LOAD ----------------
  useEffect(() => {
    let teacherData = [];

    try {
      teacherData = JSON.parse(localStorage.getItem("teachers")) || [];
    } catch {
      teacherData = [];
    }

    setTeachers(teacherData);

    let allLeaves = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("teacherLeaves_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key)) || [];
          allLeaves = [...allLeaves, ...data];
        } catch {
          // ignore bad data
        }
      }
    });

    setLeaves(allLeaves);
  }, []);

  // ---------------- TEACHER INFO ----------------
  const getTeacherInfo = (leave) => {
    const tid = String(leave.teacherId || "").trim();

    const match = teachers.find((t) => {
      const tId = String(t.teacherId || t.id || "").trim();
      return tId === tid;
    });

    return {
      teacherName:
        leave.teacherName ||
        match?.fullName ||
        match?.name ||
        "Unknown Teacher",

      department: leave.department || match?.department || "N/A",

      designation:
        leave.designation || match?.designation || match?.role || "Lecturer",
    };
  };

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = (id, status) => {
    const updated = leaves.map((l) => (l.id === id ? { ...l, status } : l));

    setLeaves(updated);

    // regroup safely
    const grouped = {};

    updated.forEach((l) => {
      const key = "teacherLeaves_" + l.teacherId;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(l);
    });

    Object.entries(grouped).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  };

  // ---------------- FILTER ----------------
  const filtered =
    filter === "All" ? leaves : leaves.filter((l) => l.status === filter);

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-3">Teacher Leave Requests</h3>

      {/* FILTER */}
      <div className="mb-3">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm p-3">
        {filtered.length === 0 ? (
          <div className="text-center text-muted p-4">
            No leave requests found
          </div>
        ) : (
          <table className="table table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Teacher</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Reason</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((l) => {
                const t = getTeacherInfo(l);

                return (
                  <tr key={l.id}>
                    <td>
                      <strong>{t.teacherName}</strong>
                      <br />
                      <small>ID: {l.teacherId}</small>
                    </td>

                    <td>{t.department}</td>

                    <td>{t.designation}</td>

                    <td style={{ maxWidth: "220px", wordBreak: "break-word" }}>
                      {l.reason}
                    </td>

                    <td>
                      {l.from} → {l.to}
                      <br />
                      <small>{l.days} days</small>
                    </td>

                    <td>
                      {l.status === "Pending" && (
                        <span className="text-warning">
                          <FaHourglassHalf /> Pending
                        </span>
                      )}

                      {l.status === "Approved" && (
                        <span className="text-success">
                          <FaCheckCircle /> Approved
                        </span>
                      )}

                      {l.status === "Rejected" && (
                        <span className="text-danger">
                          <FaTimesCircle /> Rejected
                        </span>
                      )}
                    </td>

                    <td>
                      {l.status === "Pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => updateStatus(l.id, "Approved")}
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => updateStatus(l.id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminLeaveManagement;
