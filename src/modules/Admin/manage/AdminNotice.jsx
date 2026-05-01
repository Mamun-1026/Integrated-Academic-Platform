import { useState, useEffect } from "react";
import {
  FaBullhorn,
  FaPaperPlane,
  FaClock,
  FaFileAlt,
  FaUserTie,
  FaBook,
} from "react-icons/fa";

const AdminNotice = () => {
  const [notices, setNotices] = useState([]);

  const [noticeForm, setNoticeForm] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notices") || "[]");
    setNotices(stored);
  }, []);

  const handleCreateNotice = () => {
    if (!noticeForm.title || !noticeForm.message) {
      alert("Please fill all fields");
      return;
    }

    const newNotice = {
      id: Date.now(),
      title: noticeForm.title,
      message: noticeForm.message,

      senderType: "admin",
      senderName: "Admin", // ✅ IMPORTANT

      createdAt: new Date().toLocaleString(),
    };

    const updated = [newNotice, ...notices];

    localStorage.setItem("notices", JSON.stringify(updated));
    setNotices(updated);

    setNoticeForm({ title: "", message: "" });
  };

  return (
    <div className="row g-4">
      {/* LEFT: FORM */}
      <div className="col-md-5">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-danger">
              <FaBullhorn /> Create Notice
            </h5>

            <div className="mb-3">
              <label className="fw-semibold">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter notice title..."
                value={noticeForm.title}
                onChange={(e) =>
                  setNoticeForm({ ...noticeForm, title: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="fw-semibold">Message</label>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Write your message..."
                value={noticeForm.message}
                onChange={(e) =>
                  setNoticeForm({ ...noticeForm, message: e.target.value })
                }
              />
            </div>

            <button
              className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleCreateNotice}
            >
              <FaPaperPlane /> Publish Notice
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: NOTICE LIST */}
      <div className="col-md-7">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaFileAlt /> Recent Notices
            </h5>

            {notices.length === 0 ? (
              <p className="text-muted small">No notices yet</p>
            ) : (
              notices.slice(0, 8).map((n) => (
                <div key={n.id} className="border rounded p-3 mb-3 shadow-sm">
                  {/* TITLE */}
                  <div className="fw-bold text-danger mb-1">
                    {n.title || "Notice"}
                  </div>

                  {/* MESSAGE */}
                  <div className="small mb-2">{n.message}</div>

                  {/* EXTRA INFO (Teacher হলে show করবে) */}
                  {n.senderType === "teacher" && (
                    <>
                      <div className="small text-primary">
                        <FaBook className="me-1" />
                        {n.courseName}
                      </div>

                      <div className="small text-success">
                        <FaUserTie className="me-1" />
                        {n.senderName} ({n.designation})
                      </div>
                    </>
                  )}

                  {/* FOOTER */}
                  <div className="d-flex justify-content-between align-items-center small text-muted mt-2">
                    <span className="d-flex align-items-center gap-1">
                      <FaClock /> {n.createdAt}
                    </span>

                    <span
                      className={`badge ${
                        n.senderType === "admin" ? "bg-danger" : "bg-primary"
                      }`}
                    >
                      {n.senderType === "admin" ? "Admin" : "Teacher"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotice;
