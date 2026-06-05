import { useState, useEffect } from "react";
import {
  FaUpload,
  FaTrash,
  FaReply,
  FaComments,
  FaFileAlt,
  FaArrowLeft,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";

const TeacherAssignment = ({ teacherId, assignedCourses = [] }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});
  const [refresh, setRefresh] = useState(false);

  // 👇 PDF PREVIEW STATE
  const [previewFile, setPreviewFile] = useState(null);

  /* ================= LOAD MATERIALS ================= */
  useEffect(() => {
    if (!selectedCourse) return;

    const key = `materials_${teacherId}_${selectedCourse.courseId}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");

    setMaterials(data);
  }, [selectedCourse, teacherId, refresh]);

  const getComments = (id) =>
    JSON.parse(localStorage.getItem("comments_" + id) || "[]");

  const saveComments = (id, data) =>
    localStorage.setItem("comments_" + id, JSON.stringify(data));

  /* ================= UPLOAD ================= */
  const handleUpload = () => {
    if (!file || !selectedCourse) return;

    const newItem = {
      id: Date.now(),
      courseId: selectedCourse.courseId,
      courseName: selectedCourse.courseName,
      message,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      createdAt: new Date().toLocaleString(),
    };

    const key = `materials_${teacherId}_${selectedCourse.courseId}`;
    const updated = [newItem, ...materials];

    setMaterials(updated);
    localStorage.setItem(key, JSON.stringify(updated));

    const global = JSON.parse(localStorage.getItem("allMaterials") || "[]");
    localStorage.setItem("allMaterials", JSON.stringify([newItem, ...global]));

    setFile(null);
    setMessage("");
    setRefresh(!refresh);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    const updated = materials.filter((m) => m.id !== id);
    setMaterials(updated);

    const key = `materials_${teacherId}_${selectedCourse.courseId}`;
    localStorage.setItem(key, JSON.stringify(updated));

    setRefresh(!refresh);
  };

  /* ================= COMMENT ================= */
  const addComment = (materialId) => {
    const text = commentText[materialId];
    if (!text) return;

    const old = getComments(materialId);

    const newComment = {
      id: Date.now(),
      text,
      role: "Teacher",
      time: new Date().toLocaleString(),
      reply: null,
    };

    saveComments(materialId, [newComment, ...old]);

    setCommentText((prev) => ({
      ...prev,
      [materialId]: "",
    }));

    setRefresh(!refresh);
  };

  /* ================= REPLY ================= */
  const addReply = (materialId, commentId) => {
    const text = replyText[commentId];
    if (!text) return;

    const comments = getComments(materialId);

    const updated = comments.map((c) =>
      c.id === commentId
        ? {
            ...c,
            reply: {
              text,
              time: new Date().toLocaleString(),
              by: "Teacher",
            },
          }
        : c,
    );

    saveComments(materialId, updated);

    setReplyText((prev) => ({
      ...prev,
      [commentId]: "",
    }));

    setRefresh(!refresh);
  };

  /* ================= PDF CHECK ================= */
  const isPDF = (m) =>
    m.fileName?.toLowerCase().endsWith(".pdf") ||
    m.fileUrl?.toLowerCase().includes(".pdf");

  /* ================= COURSE SELECT ================= */
  if (!selectedCourse) {
    return (
      <div className="container mt-4">
        <h4 className="text-center fw-bold text-primary mb-4">
          <GiBookshelf /> Select Course
        </h4>

        <div className="row g-3">
          {assignedCourses.map((c) => (
            <div key={c.courseId} className="col-md-4">
              <div
                onClick={() => setSelectedCourse(c)}
                className="p-3 rounded-4 shadow-sm border-0 bg-white"
                style={{ cursor: "pointer" }}
              >
                <FaFileAlt className="text-primary mb-2" size={20} />
                <h6 className="fw-bold mb-1">{c.courseName}</h6>
                <small className="text-muted">{c.courseId}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm rounded-4 mb-3">
        <div>
          <h5 className="fw-bold text-primary mb-0">
            {selectedCourse.courseName}
          </h5>
          <small className="text-muted">{selectedCourse.courseId}</small>
        </div>

        <button
          className="btn btn-light border rounded-3"
          onClick={() => setSelectedCourse(null)}
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* UPLOAD */}
      <div className="p-3 bg-white shadow-sm rounded-4 mb-4">
        <textarea
          className="form-control mb-2"
          placeholder="Write instructions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          className="btn btn-success w-100 rounded-3"
          onClick={handleUpload}
        >
          <FaUpload className="me-2" />
          Upload Material
        </button>
      </div>

      {/* MATERIALS */}
      {materials.length === 0 ? (
        <div className="text-center p-4 bg-light rounded-4">
          No materials uploaded yet....
        </div>
      ) : (
        materials.map((m) => {
          const comments = getComments(m.id);

          return (
            <div key={m.id} className="card border-0 shadow-sm mb-3 rounded-4">
              <div className="card-body">
                <h6 className="fw-bold">{m.fileName}</h6>
                <small className="text-muted">{m.createdAt}</small>
                <p className="text-muted mt-2">{m.message}</p>

                <div className="d-flex gap-2">
                  <a
                    href={m.fileUrl}
                    download
                    className="btn btn-primary btn-sm"
                  >
                    Download
                  </a>

                  {isPDF(m) && (
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => setPreviewFile(m.fileUrl)}
                    >
                      <FaEye className="me-1" />
                      View
                    </button>
                  )}

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(m.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* COMMENTS */}
              <div className="card-footer bg-light">
                <h6>
                  <FaComments className="me-1" />
                  Discussion ({comments.length})
                </h6>

                <div className="d-flex gap-2 mb-2">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Write comment..."
                    value={commentText[m.id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [m.id]: e.target.value,
                      })
                    }
                  />

                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => addComment(m.id)}
                  >
                    Post
                  </button>
                </div>

                {comments.map((c) => (
                  <div key={c.id} className="bg-white border rounded p-2 mb-2">
                    <b className="text-primary">{c.role}</b>
                    <div>{c.text}</div>

                    {c.reply && (
                      <div className="mt-2 p-2 bg-light rounded">
                        <b>Reply:</b> {c.reply.text}
                      </div>
                    )}

                    <div className="d-flex gap-2 mt-2">
                      <input
                        className="form-control form-control-sm"
                        placeholder="Reply..."
                        value={replyText[c.id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [c.id]: e.target.value,
                          })
                        }
                      />

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addReply(m.id, c.id)}
                      >
                        <FaReply />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* ================= PDF MODAL ================= */}
      {previewFile && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999 }}
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-white rounded shadow p-3 w-75 h-75"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between mb-2">
              <h6>PDF Preview</h6>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setPreviewFile(null)}
              >
                <FaTimes />
              </button>
            </div>

            <iframe
              src={previewFile}
              width="100%"
              height="90%"
              style={{ border: "none" }}
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignment;
