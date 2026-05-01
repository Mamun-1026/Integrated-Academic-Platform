import { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaBook,
  FaSearch,
  FaArrowLeft,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const AssignCourse = ({
  teachers,
  courses,
  selectedAssignTeacher,
  setSelectedAssignTeacher,
  assignedCourses,
  setAssignedCourses,
  handleAssignCourse,
  handleRemoveAssignedCourse,
}) => {
  const [assignSearch, setAssignSearch] = useState("");
  const [, setRefresh] = useState(0);
  useEffect(() => {
    const refresh = () => setRefresh((p) => p + 1);

    window.addEventListener("profileUpdate", refresh);
    return () => window.removeEventListener("profileUpdate", refresh);
  }, []);

  useEffect(() => {
    if (selectedAssignTeacher) {
      const key = "teacherCourses_" + selectedAssignTeacher.teacherId;
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      setAssignedCourses(data);
    }
  }, [selectedAssignTeacher, setAssignedCourses]);

  return (
    <div className="container py-3">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-3">
        <FaChalkboardTeacher className="me-2 text-primary fs-4" />
        <h4 className="mb-0 fw-bold">Assign Courses</h4>
      </div>

      {/* ================= SELECT TEACHER ================= */}
      {!selectedAssignTeacher ? (
        <>
          <div className="mb-3 text-muted">
            Select a teacher to assign courses
          </div>

          <div className="row g-3">
            {teachers.map((t) => {
              const profile =
                localStorage.getItem("profileImage_" + t.teacherId) ||
                JSON.parse(
                  localStorage.getItem("teacherInfo_" + t.teacherId) || "{}",
                )?.profilePhoto ||
                "https://via.placeholder.com/60";

              return (
                <div key={t.teacherId} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center teacher-card"
                    style={{
                      cursor: "pointer",
                      borderRadius: "12px",
                    }}
                    onClick={() => setSelectedAssignTeacher(t)}
                  >
                    <img
                      src={profile}
                      alt="profile"
                      className="rounded-circle me-3"
                      style={{
                        width: 55,
                        height: 55,
                        objectFit: "cover",
                      }}
                    />

                    <div className="flex-grow-1">
                      <div className="fw-bold">{t.fullName}</div>

                      <div className="d-flex flex-wrap gap-2 mt-1">
                        <span className="badge bg-primary">
                          ID: {t.teacherId}
                        </span>
                        <span className="badge bg-success">
                          {t.designation || "Teacher"}
                        </span>
                      </div>
                    </div>

                    <FaArrowLeft className="text-muted" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* ================= TOP BAR ================= */}
          <div className="card border-0 shadow-sm p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h6 className="mb-0 fw-bold">
                  Assigning to: {selectedAssignTeacher.fullName}
                </h6>
                <small className="text-muted">
                  ID: {selectedAssignTeacher.teacherId}
                </small>
              </div>

              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                onClick={() => setSelectedAssignTeacher(null)}
              >
                <FaArrowLeft /> Back
              </button>
            </div>
          </div>

          {/* ================= SEARCH ================= */}
          <div className="input-group mb-3 shadow-sm">
            <span className="input-group-text bg-white">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search course by name or ID..."
              value={assignSearch}
              onChange={(e) => setAssignSearch(e.target.value)}
            />
          </div>

          {/* ================= COURSES ================= */}
          <div className="row g-3">
            {courses
              .filter(
                (c) =>
                  c.courseName
                    .toLowerCase()
                    .includes(assignSearch.toLowerCase()) ||
                  c.courseId.toLowerCase().includes(assignSearch.toLowerCase()),
              )
              .map((c) => {
                const isAssigned = assignedCourses.some(
                  (a) => a.courseId === c.courseId,
                );

                return (
                  <div key={c.courseId} className="col-12 col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm p-3 course-card h-100">
                      <div className="d-flex align-items-center mb-2">
                        <FaBook className="text-primary me-2" />
                        <h6 className="mb-0">{c.courseName}</h6>
                      </div>

                      <small className="text-muted mb-3 d-block">
                        Course ID: {c.courseId}
                      </small>

                      {!isAssigned ? (
                        <button
                          className="btn btn-success btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                          onClick={() =>
                            handleAssignCourse(
                              selectedAssignTeacher.teacherId,
                              c,
                            )
                          }
                        >
                          <FaPlus /> Assign
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                          onClick={() =>
                            handleRemoveAssignedCourse(
                              selectedAssignTeacher.teacherId,
                              c.courseId,
                            )
                          }
                        >
                          <FaTrash /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default AssignCourse;
