import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaExclamationTriangle,
  FaClock,
  FaBook,
  FaDoorOpen,
  FaLayerGroup,
} from "react-icons/fa";

const Routine = () => {
  const [routines, setRoutines] = useState([]);
  const [student, setStudent] = useState(null);
  const [filtered, setFiltered] = useState([]);

  // NORMALIZE
  const normalize = (v) =>
    String(v || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

  // ✅ CORRECT TIME FORMATTER (FIXED AM/PM LOGIC)
  const formatTime = (time) => {
    if (!time) return "-";

    const convert = (t) => {
      if (!t) return "";

      t = t.trim();

      // already AM/PM
      if (t.toLowerCase().includes("am") || t.toLowerCase().includes("pm")) {
        return t.toUpperCase();
      }

      const [hStr, mStr] = t.split(":");
      let h = parseInt(hStr, 10);
      let m = parseInt(mStr || "0", 10);

      if (isNaN(h)) return t;

      // ✅ REAL FIX: proper 24h → 12h conversion
      const period = h >= 12 ? "PM" : "AM";

      let hour12 = h % 12;
      if (hour12 === 0) hour12 = 12;

      return `${String(hour12).padStart(2, "0")}:${String(m).padStart(
        2,
        "0",
      )} ${period}`;
    };

    const parts = time.split("-");

    if (parts.length === 2) {
      return `${convert(parts[0])} - ${convert(parts[1])}`;
    }

    return convert(time);
  };

  // LOAD DATA
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const students = JSON.parse(localStorage.getItem("students") || "[]");

    const currentStudent = students.find(
      (s) => String(s.studentId) === String(studentId),
    );

    setStudent(currentStudent || null);

    const allRoutines = JSON.parse(localStorage.getItem("routines") || "[]");
    setRoutines(allRoutines);
  }, []);

  // FILTER ROUTINE
  useEffect(() => {
    if (!student || routines.length === 0) return;

    const studentKey = student.userId || student.studentId;

    const enrolledCoursesData = JSON.parse(
      localStorage.getItem("studentCourses_" + studentKey) || "[]",
    );

    const enrolledCourses = enrolledCoursesData.map((c) =>
      normalize(c.courseId || c),
    );

    const result = routines.filter((r) => {
      const matchBasic =
        normalize(r.department) === normalize(student.department) &&
        normalize(r.batch) === normalize(student.batch) &&
        normalize(r.section) === normalize(student.section);

      const matchCourse = enrolledCourses.includes(normalize(r.courseId));

      return matchBasic && matchCourse;
    });

    const unique = Array.from(
      new Map(
        result.map((item) => [
          `${normalize(item.day)}-${normalize(item.time)}-${normalize(
            item.courseId,
          )}`,
          item,
        ]),
      ).values(),
    );

    setFiltered(unique);
  }, [student, routines]);

  // GROUP BY DAY
  const groupByDay = (data) =>
    data.reduce((acc, item) => {
      const day = normalize(item.day) || "unknown";
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

  const groupedRoutine = groupByDay(filtered);

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div
        className="p-4 rounded-4 shadow-sm mb-4 text-center"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#4e73df)",
          color: "white",
        }}
      >
        <h3 className="fw-bold d-flex align-items-center justify-content-center gap-2 mb-2">
          <FaCalendarAlt />
          My Class Routine
        </h3>

        {student ? (
          <div className="opacity-75">
            {student.department} • Batch {student.batch} • Section{" "}
            {student.section}
          </div>
        ) : (
          <div className="text-warning d-flex align-items-center justify-content-center gap-2">
            <FaExclamationTriangle />
            Student not found
          </div>
        )}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <div className="alert alert-warning text-center">
          No routine found for your enrolled courses
        </div>
      ) : (
        Object.keys(groupedRoutine).map((day) => (
          <div
            key={day}
            className="mb-4 p-3 p-md-4 rounded-4 shadow-sm"
            style={{
              background: "#fff",
              borderLeft: "6px solid #0d6efd",
            }}
          >
            {/* DAY HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-primary text-uppercase m-0 d-flex align-items-center gap-2">
                <FaLayerGroup />
                {day}
              </h5>

              <span className="badge bg-primary">
                {groupedRoutine[day].length} Classes
              </span>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>
                      <FaClock className="me-1" />
                      Time
                    </th>
                    <th>
                      <FaBook className="me-1" />
                      Course
                    </th>
                    <th>
                      <FaDoorOpen className="me-1" />
                      Room
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {groupedRoutine[day].map((r, i) => (
                    <tr key={`${r.day}-${r.time}-${r.courseId}-${i}`}>
                      <td className="fw-semibold">{formatTime(r.time)}</td>

                      <td>
                        <div className="fw-bold">{r.courseName}</div>
                        <small className="text-muted">
                          {(r.courseId || "").toUpperCase()}
                        </small>
                      </td>

                      <td>
                        <span className="badge bg-secondary">
                          {r.room || "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Routine;
