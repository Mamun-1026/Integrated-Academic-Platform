import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBookOpen,
  FaUsers,
  FaArrowLeft,
  FaUserGraduate,
  FaPlusCircle,
  FaEdit,
  FaCheckCircle,
  FaTrophy,
} from "react-icons/fa";

const TeacherResult = ({ teacherId, assignedCourses }) => {
  const [courses, setCourses] = useState(assignedCourses || []);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [results, setResults] = useState({});
  const [publishedCourses, setPublishedCourses] = useState({});

  // LOAD DATA
  useEffect(() => {
    setCourses(assignedCourses || []);

    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(allStudents);

    const initialResults = {};
    const initialPublished = {};

    assignedCourses?.forEach((c) => {
      const courseResults = JSON.parse(
        localStorage.getItem(`teacherResults_${teacherId}_${c.courseId}`) ||
          "{}",
      );

      if (Object.keys(courseResults).length > 0) {
        initialResults[c.courseId] = courseResults;
        initialPublished[c.courseId] = {};
        Object.keys(courseResults).forEach((sid) => {
          initialPublished[c.courseId][sid] = true;
        });
      }
    });

    setResults(initialResults);
    setPublishedCourses(initialPublished);
  }, [assignedCourses, teacherId]);

  // STUDENTS FILTER
  const getStudentsForCourse = (courseId) => {
    return students.filter((s) => {
      const studentCourses = JSON.parse(
        localStorage.getItem(`studentCourses_${s.studentId}`) || "[]",
      );
      return studentCourses.some((c) => c.courseId === courseId);
    });
  };

  // 🏅 TOP 3 RANKING
  const getTop3 = (courseId) => {
    const courseResults = results[courseId] || [];

    const ranking = Object.entries(courseResults)
      .map(([sid, r]) => {
        const student = students.find(
          (s) => String(s.studentId) === String(sid),
        );

        return {
          studentId: sid,
          name: student?.fullName || student?.name || "Unknown",
          total: r.total || 0,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    return ranking;
  };

  // ADD/EDIT RESULT
  const handleAddOrEditResult = (courseId, studentId) => {
    const quiz = prompt(
      "Quiz Marks:",
      results[courseId]?.[studentId]?.quiz || "",
    );
    const midterm = prompt(
      "Midterm Marks:",
      results[courseId]?.[studentId]?.midterm || "",
    );
    const final = prompt(
      "Final Marks:",
      results[courseId]?.[studentId]?.final || "",
    );

    if (!quiz || !midterm || !final) return;

    const updatedCourseResults = { ...(results[courseId] || {}) };

    updatedCourseResults[studentId] = {
      quiz: Number(quiz),
      midterm: Number(midterm),
      final: Number(final),
      total: Number(quiz) + Number(midterm) + Number(final),
    };

    setResults((prev) => ({
      ...prev,
      [courseId]: updatedCourseResults,
    }));
  };

  // PUBLISH
  const handlePublish = (courseId) => {
    const courseResults = results[courseId];
    if (!courseResults || Object.keys(courseResults).length === 0) {
      alert("No results to publish!");
      return;
    }

    const alreadyPublished = publishedCourses[courseId] || {};

    Object.entries(courseResults).forEach(([studentId, r]) => {
      if (alreadyPublished[studentId]) return;

      const studentHistoryKey = `studentResults_${studentId}`;
      const history = JSON.parse(
        localStorage.getItem(studentHistoryKey) || "{}",
      );

      history[courseId] = {
        courseName:
          courses.find((c) => c.courseId === courseId)?.courseName || "",
        quiz: r.quiz,
        midterm: r.midterm,
        final: r.final,
        total: r.total,
      };

      localStorage.setItem(studentHistoryKey, JSON.stringify(history));
    });

    localStorage.setItem(
      `teacherResults_${teacherId}_${courseId}`,
      JSON.stringify(courseResults),
    );

    const newPublished = { ...publishedCourses };
    if (!newPublished[courseId]) newPublished[courseId] = {};

    Object.keys(courseResults).forEach((sid) => {
      newPublished[courseId][sid] = true;
    });

    setPublishedCourses(newPublished);

    alert("Results published!");
  };

  // ================= UI =================
  return (
    <div className="container mt-4">
      {!selectedCourse ? (
        <>
          <h3 className="text-center fw-bold text-danger mb-4">
            <FaBookOpen className="me-2" />
            My Courses Result Panel
          </h3>

          <div className="row g-4">
            {courses.map((c) => (
              <div key={c.courseId} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-lg h-100 text-center"
                  style={{ cursor: "pointer", borderRadius: "15px" }}
                  onClick={() => setSelectedCourse(c)}
                >
                  <div className="card-body">
                    <FaUsers size={28} className="text-primary mb-2" />
                    <h5 className="fw-bold">{c.courseName}</h5>
                    <p className="text-muted">Course ID: {c.courseId}</p>
                    <span className="badge bg-success">View Students →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* BACK */}
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => setSelectedCourse(null)}
          >
            <FaArrowLeft className="me-1" />
            Back
          </button>

          <h4 className="text-primary fw-bold mb-3">
            <FaUserGraduate className="me-2" />
            {selectedCourse.courseName} Results
          </h4>

          {/* 🏅 TOP 3 PODIUM */}
          <div className="row text-center mb-4">
            {getTop3(selectedCourse.courseId).map((s, i) => {
              const colors = ["warning", "secondary", "dark"];
              const medals = ["🥇", "🥈", "🥉"];

              return (
                <div key={s.studentId} className="col-md-4">
                  <div className={`card shadow border-${colors[i]}`}>
                    <div className="card-body">
                      <h2>{medals[i]}</h2>
                      <h5>{s.name}</h5>
                      <span className="badge bg-primary">{s.total} Marks</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Quiz</th>
                  <th>Mid</th>
                  <th>Final</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {getStudentsForCourse(selectedCourse.courseId).map((s) => {
                  const res =
                    results[selectedCourse.courseId]?.[s.studentId] || {};
                  const isPublished =
                    publishedCourses[selectedCourse.courseId]?.[s.studentId];

                  return (
                    <tr key={s.studentId}>
                      <td>{s.studentId}</td>
                      <td>{s.fullName || s.name}</td>
                      <td>{res.quiz || "-"}</td>
                      <td>{res.midterm || "-"}</td>
                      <td>{res.final || "-"}</td>
                      <td className="fw-bold text-success">
                        {res.total || "-"}
                      </td>

                      <td>
                        {!isPublished ? (
                          <button
                            className={`btn btn-sm ${
                              res.quiz ? "btn-warning" : "btn-success"
                            }`}
                            onClick={() =>
                              handleAddOrEditResult(
                                selectedCourse.courseId,
                                s.studentId,
                              )
                            }
                          >
                            {res.quiz ? <FaEdit /> : <FaPlusCircle />}
                          </button>
                        ) : (
                          <span className="badge bg-success">
                            <FaCheckCircle /> Published
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            className="btn btn-primary mt-3 w-100"
            onClick={() => handlePublish(selectedCourse.courseId)}
          >
            Publish Results
          </button>
        </>
      )}
    </div>
  );
};

export default TeacherResult;
