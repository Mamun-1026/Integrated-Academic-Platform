import { useEffect, useState } from "react";
import {
  FaDownload,
  FaFileAlt,
  FaComment,
  FaFolderOpen,
  FaArrowLeft,
  FaEdit,
  FaPaperPlane,
  FaEye,
  FaTimes,
} from "react-icons/fa";

const StudentMaterials = ({ studentId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [materials, setMaterials] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [previewFile, setPreviewFile] = useState(null);

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    const enrolled =
      JSON.parse(localStorage.getItem("studentCourses_" + studentId)) || [];
    setCourses(enrolled);
  }, [studentId]);

  /* ================= LOAD MATERIALS ================= */
  useEffect(() => {
    if (!selectedCourse) return;

    const all = JSON.parse(localStorage.getItem("allMaterials") || "[]");

    const filtered = all.filter(
      (m) => String(m.courseId) === String(selectedCourse.courseId),
    );

    setMaterials(filtered);
  }, [selectedCourse]);

  /* ================= COMMENT ================= */
  const addComment = (materialId) => {
    const text = commentText[materialId];
    if (!text) return;

    const old =
      JSON.parse(localStorage.getItem("comments_" + materialId)) || [];

    const newComment = {
      id: Date.now(),
      text,
      user: "Student",
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem(
      "comments_" + materialId,
      JSON.stringify([newComment, ...old]),
    );

    setCommentText({ ...commentText, [materialId]: "" });
  };

  /* ================= EDIT COMMENT ================= */
  const saveEdit = (materialId, commentId) => {
    const data =
      JSON.parse(localStorage.getItem("comments_" + materialId)) || [];

    const updated = data.map((c) =>
      c.id === commentId ? { ...c, text: editText } : c,
    );

    localStorage.setItem("comments_" + materialId, JSON.stringify(updated));

    setEditId(null);
    setEditText("");
  };

  /* ================= PDF CHECK ================= */
  const isPDF = (m) =>
    m.fileName?.toLowerCase().endsWith(".pdf") ||
    m.fileUrl?.toLowerCase().includes(".pdf");

  /* ================= COURSE LIST ================= */
  if (!selectedCourse) {
    return (
      <div className="container mt-4">
        <h4 className="fw-bold text-danger mb-3">
          <FaFolderOpen className="me-2" />
          Your Courses
        </h4>

        <div className="row g-3">
          {courses.length === 0 ? (
            <div className="alert alert-warning">No enrolled courses found</div>
          ) : (
            courses.map((c) => (
              <div key={c.courseId} className="col-md-4">
                <div
                  className="card shadow-sm border-0 p-3 h-100"
                  style={{ cursor: "pointer", borderRadius: "12px" }}
                  onClick={() => setSelectedCourse(c)}
                >
                  <FaFileAlt className="text-primary mb-2" size={22} />
                  <h6 className="fw-bold">{c.courseName}</h6>
                  <small className="text-muted">{c.courseId}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  /* ================= MATERIAL VIEW ================= */
  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white shadow-sm rounded">
        <div>
          <h5 className="fw-bold text-danger mb-0">
            {selectedCourse.courseName}
          </h5>
          <small className="text-muted">{selectedCourse.courseId}</small>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setSelectedCourse(null)}
        >
          <FaArrowLeft className="me-1" />
          Back
        </button>
      </div>

      {/* MATERIALS */}
      {materials.length === 0 ? (
        <div className="alert alert-warning">
          No materials found for this course
        </div>
      ) : (
        materials.map((m) => {
          const comments =
            JSON.parse(localStorage.getItem("comments_" + m.id)) || [];

          return (
            <div key={m.id} className="card shadow-sm mb-3 border-0">
              <div className="card-body">
                <h5>{m.fileName}</h5>
                <p className="text-muted">{m.message}</p>

                {/* ACTIONS */}
                <div className="d-flex gap-2">
                  <a
                    href={m.fileUrl}
                    download
                    className="btn btn-sm btn-primary"
                  >
                    <FaDownload className="me-1" />
                    Download
                  </a>

                  {isPDF(m) && (
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => setPreviewFile(m.fileUrl)}
                    >
                      <FaEye className="me-1" />
                      View
                    </button>
                  )}
                </div>
              </div>

              {/* COMMENTS */}
              <div className="card-footer bg-light">
                <h6>
                  <FaComment className="me-1" />
                  Comments ({comments.length})
                </h6>

                {/* INPUT */}
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
                    className="btn btn-success btn-sm"
                    onClick={() => addComment(m.id)}
                  >
                    <FaPaperPlane />
                  </button>
                </div>

                {/* COMMENTS LIST */}
                {comments.map((c) => (
                  <div key={c.id} className="border rounded p-2 mb-2 bg-white">
                    {editId === c.id ? (
                      <div className="d-flex gap-2">
                        <input
                          className="form-control form-control-sm"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => saveEdit(m.id, c.id)}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>{c.text}</div>
                        <small className="text-muted">
                          {c.createdAt} • {c.user}
                        </small>

                        <button
                          className="btn btn-sm btn-outline-secondary mt-2"
                          onClick={() => {
                            setEditId(c.id);
                            setEditText(c.text);
                          }}
                        >
                          <FaEdit /> Edit
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* ================= PDF PREVIEW MODAL ================= */}
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
              style={{ border: "none", borderRadius: "8px" }}
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMaterials;
