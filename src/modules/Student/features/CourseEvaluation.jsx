import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaStar,
  FaRegStar,
  FaUserTie,
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";

const CourseEvaluation = ({ studentData }) => {
  const { userId } = studentData || {};

  const [courses, setCourses] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [sentCourses, setSentCourses] = useState({});
  const [anonymous, setAnonymous] = useState({}); // 🔥 NEW

  // 🔥 LOAD DATA
  useEffect(() => {
    if (!userId) return;

    setCourses(
      JSON.parse(localStorage.getItem(`studentCourses_${userId}`) || "[]"),
    );

    setRatings(
      JSON.parse(localStorage.getItem(`courseRatings_${userId}`) || "{}"),
    );

    setComments(
      JSON.parse(localStorage.getItem(`courseComments_${userId}`) || "{}"),
    );

    setSentCourses(
      JSON.parse(localStorage.getItem(`courseFeedbackSent_${userId}`) || "{}"),
    );

    setAnonymous(
      JSON.parse(localStorage.getItem(`courseAnonymous_${userId}`) || "{}"),
    );
  }, [userId]);

  // 👨‍🏫 GET TEACHER
  const getTeacherName = (courseId) => {
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");

    for (let t of teachers) {
      const assigned = JSON.parse(
        localStorage.getItem("teacherCourses_" + t.teacherId) || "[]",
      );

      if (assigned.find((c) => c.courseId === courseId)) {
        return t.fullName || "Unknown";
      }
    }
    return "Not Assigned";
  };

  // ⭐ STAR
  const handleStarClick = (courseId, value) => {
    const updated = { ...ratings, [courseId]: value };
    setRatings(updated);
    localStorage.setItem(`courseRatings_${userId}`, JSON.stringify(updated));
  };

  // 💬 COMMENT
  const handleComment = (courseId, value) => {
    const updated = { ...comments, [courseId]: value };
    setComments(updated);
    localStorage.setItem(`courseComments_${userId}`, JSON.stringify(updated));
  };

  // 🔒 ANONYMOUS TOGGLE
  const handleAnonymous = (courseId, value) => {
    const updated = { ...anonymous, [courseId]: value };
    setAnonymous(updated);
    localStorage.setItem(`courseAnonymous_${userId}`, JSON.stringify(updated));
  };

  // 🚀 SEND / UPDATE
  const sendFeedback = (course) => {
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");

    for (let t of teachers) {
      const assigned = JSON.parse(
        localStorage.getItem("teacherCourses_" + t.teacherId) || "[]",
      );

      if (assigned.find((c) => c.courseId === course.courseId)) {
        const key = "teacherFeedback_" + t.teacherId;
        let old = JSON.parse(localStorage.getItem(key) || "[]");

        const index = old.findIndex(
          (f) => f.studentId === userId && f.courseId === course.courseId,
        );

        const newEntry = {
          studentId: userId,
          courseId: course.courseId,
          courseName: course.courseName,
          teacherName: t.fullName,
          rating: ratings[course.courseId] || "N/A",
          comment: comments[course.courseId] || "",
          anonymous: anonymous[course.courseId] || false, // 🔥 IMPORTANT
          date: new Date().toLocaleString(),
        };

        if (index !== -1) {
          old[index] = newEntry;
        } else {
          old.push(newEntry);
        }

        localStorage.setItem(key, JSON.stringify(old));

        const updatedSent = {
          ...sentCourses,
          [course.courseId]: true,
        };

        setSentCourses(updatedSent);
        localStorage.setItem(
          `courseFeedbackSent_${userId}`,
          JSON.stringify(updatedSent),
        );

        alert("✅ Feedback saved!");
        return;
      }
    }

    alert("❌ No teacher assigned");
  };

  // ✏️ EDIT
  const handleEdit = (courseId) => {
    const updated = { ...sentCourses, [courseId]: false };
    setSentCourses(updated);
    localStorage.setItem(
      `courseFeedbackSent_${userId}`,
      JSON.stringify(updated),
    );
  };

  // 🗑️ DELETE
  const handleDelete = (course) => {
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");

    for (let t of teachers) {
      const key = "teacherFeedback_" + t.teacherId;
      let old = JSON.parse(localStorage.getItem(key) || "[]");

      const updated = old.filter(
        (f) => !(f.studentId === userId && f.courseId === course.courseId),
      );

      localStorage.setItem(key, JSON.stringify(updated));
    }

    const updatedSent = { ...sentCourses };
    delete updatedSent[course.courseId];

    setSentCourses(updatedSent);
    localStorage.setItem(
      `courseFeedbackSent_${userId}`,
      JSON.stringify(updatedSent),
    );

    alert("🗑️ Feedback deleted!");
  };

  // ⭐ STAR UI
  const renderStars = (courseId) => {
    const current = ratings[courseId] || 0;

    return [...Array(5)].map((_, i) => {
      const value = i + 1;
      return (
        <span
          key={i}
          style={{ cursor: "pointer", fontSize: "18px" }}
          onClick={() => handleStarClick(courseId, value)}
        >
          {value <= current ? (
            <FaStar className="text-warning" />
          ) : (
            <FaRegStar className="text-secondary" />
          )}
        </span>
      );
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">📚 Course Evaluation</h5>
        </div>

        <div className="card-body">
          {courses.length === 0 ? (
            <div className="text-center text-muted py-4">
              No courses enrolled yet
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Course</th>
                    <th>Teacher</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Anonymous</th> {/* 🔥 NEW */}
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((c) => {
                    const isSent = sentCourses[c.courseId];

                    return (
                      <tr key={c.courseId}>
                        <td className="fw-bold">{c.courseName}</td>

                        <td>
                          <span className="badge bg-info text-dark">
                            <FaUserTie className="me-1" />
                            {getTeacherName(c.courseId)}
                          </span>
                        </td>

                        <td>{renderStars(c.courseId)}</td>

                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            disabled={isSent}
                            value={comments[c.courseId] || ""}
                            onChange={(e) =>
                              handleComment(c.courseId, e.target.value)
                            }
                          />
                        </td>

                        {/* 🔥 ANONYMOUS CHECKBOX */}
                        <td>
                          <input
                            type="checkbox"
                            disabled={isSent}
                            checked={anonymous[c.courseId] || false}
                            onChange={(e) =>
                              handleAnonymous(c.courseId, e.target.checked)
                            }
                          />
                        </td>

                        <td>
                          {!isSent ? (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => sendFeedback(c)}
                            >
                              <FaPaperPlane /> Send
                            </button>
                          ) : (
                            <>
                              <span className="badge bg-success me-2">
                                <FaCheckCircle /> Done
                              </span>

                              <button
                                className="btn btn-warning btn-sm me-1"
                                onClick={() => handleEdit(c.courseId)}
                              >
                                <FaEdit />
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(c)}
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEvaluation;
