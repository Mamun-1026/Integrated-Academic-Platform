import { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaArrowLeft,
  FaStar,
  FaUserGraduate,
  FaIdBadge,
  FaUniversity,
  FaLayerGroup,
  FaCommentDots,
  FaChartBar,
  FaTrophy,
} from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";

const TeacherCourse = ({ assignedCourses, teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  const [avgRating, setAvgRating] = useState(0);

  // LOAD COURSES
  useEffect(() => {
    setCourses(assignedCourses || []);
  }, [assignedCourses]);

  // LOAD STUDENTS FROM DB API & LOCALSTORAGE
  useEffect(() => {
    const loadStudents = async () => {
      let allStudents = [];
      try {
        const res = await fetch("http://localhost:5000/api/students");
        const data = await res.json();
        if (Array.isArray(data)) {
          allStudents = data;
        }
      } catch (err) {
        console.error("Error loading students from DB:", err);
      }

      if (allStudents.length === 0) {
        allStudents = JSON.parse(localStorage.getItem("students") || "[]");
      }
      setStudents(allStudents);
    };

    loadStudents();
  }, []);

  // GET STUDENT INFO
  const getStudentInfo = (studentId) => {
    const s = students.find(
      (st) => String(st.studentId || st.userId) === String(studentId),
    );

    if (!s) return {};

    return {
      name:
        `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
        s.name ||
        s.fullName ||
        "N/A",
      department: s.department || "N/A",
      batch: s.batch || "N/A",
      section: s.section || "N/A",
    };
  };

  // LOAD FEEDBACK FROM DB API & LOCALSTORAGE
  const loadFeedback = async (course) => {
    let allFeedback = [];
    try {
      const res = await fetch(
        `http://localhost:5000/api/course-evaluations/${teacherId}`,
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        allFeedback = data;
      }
    } catch (err) {
      console.error("Error loading feedback from DB:", err);
    }

    if (allFeedback.length === 0) {
      allFeedback = JSON.parse(
        localStorage.getItem("teacherFeedback_" + teacherId) || "[]",
      );
    }

    const filtered = allFeedback.filter(
      (f) => String(f.courseId) === String(course.courseId),
    );

    // AVG RATING
    const ratings = filtered
      .map((f) => Number(f.rating))
      .filter((r) => !isNaN(r));

    const avg =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
        : 0;

    setAvgRating(avg);
    setSelectedCourse(course);
    setFeedbacks(filtered);
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setFeedbacks([]);
  };

  // BEST TEACHER (GLOBAL SIMPLE RANK)
  const getBestTeacher = () => {
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");

    let best = null;
    let bestAvg = 0;

    teachers.forEach((t) => {
      const fb = JSON.parse(
        localStorage.getItem("teacherFeedback_" + t.teacherId) || "[]",
      );

      const ratings = fb.map((f) => Number(f.rating)).filter((r) => !isNaN(r));

      if (ratings.length === 0) return;

      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;

      if (avg > bestAvg) {
        bestAvg = avg;
        best = t.fullName || t.name;
      }
    });

    return best || "N/A";
  };

  return (
    <div className="container mt-4">
      {/* ================= COURSE LIST ================= */}
      {!selectedCourse ? (
        <>
          <h3 className="text-center fw-bold text-primary mb-4">
            <FaBookOpen className="me-2" />
            My Courses
          </h3>

          {/* BEST TEACHER */}
          <div className="alert alert-warning text-center fw-bold">
            <FaTrophy className="me-2" />
            Best Teacher: {getBestTeacher()}
          </div>

          {courses.length === 0 ? (
            <div className="alert alert-warning text-center">
              No course assigned
            </div>
          ) : (
            <div className="row g-4">
              {courses.map((c) => (
                <div key={c.courseId} className="col-md-6 col-lg-4">
                  <div
                    className="card border-0 shadow-lg h-100 text-center p-3"
                    style={{ cursor: "pointer", borderRadius: "15px" }}
                    onClick={() => loadFeedback(c)}
                  >
                    <FaBookOpen size={30} className="text-primary mb-2" />
                    <h5 className="fw-bold">{c.courseName}</h5>
                    <p className="text-muted">{c.courseId}</p>

                    <span className="badge bg-success px-3 py-2">
                      View Feedback <GrFormNextLink />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* ================= FEEDBACK VIEW ================= */}

          <button
            className="btn btn-outline-secondary mb-3"
            onClick={handleBack}
          >
            <FaArrowLeft /> Back
          </button>

          <h3 className="align-items-center text-primary fw-bold mb-3">
            <FaChartBar /> {selectedCourse.courseName}
          </h3>

          {/* AVG RATING */}
          <div className="alert alert-info">
            <FaStar /> Average Rating: <b>{avgRating}</b>
          </div>

          {/* SIMPLE BAR GRAPH */}
          <div className="mb-4">
            <h6>
              <FaChartBar className="me-2" />
              Rating Distribution
            </h6>

            {[5, 4, 3, 2, 1].map((star) => {
              const count = feedbacks.filter(
                (f) => Number(f.rating) === star,
              ).length;

              return (
                <div key={star} className="mb-2">
                  <span>
                    {star} <FaStar />
                  </span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${count * 20}px`,
                      }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABLE */}
          {feedbacks.length === 0 ? (
            <div className="alert alert-info text-center">
              No feedback submitted yet
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Dept</th>
                    <th>Batch</th>
                    <th>Sec</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {feedbacks.map((f, i) => {
                    const info = getStudentInfo(f.studentId);

                    return (
                      <tr key={i}>
                        <td>{f.anonymous ? "Anonymous" : info.name}</td>
                        <td>{f.anonymous ? "-" : f.studentId}</td>
                        <td>{info.department}</td>
                        <td>{info.batch}</td>
                        <td>{info.section}</td>

                        <td className="text-warning fw-bold">
                          {f.rating} <FaStar />
                        </td>

                        <td>{f.comment || "-"}</td>
                        <td className="small">{f.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherCourse;
