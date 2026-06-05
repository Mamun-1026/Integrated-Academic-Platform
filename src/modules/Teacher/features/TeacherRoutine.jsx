import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaDoorOpen,
  FaLayerGroup,
} from "react-icons/fa";

const TeacherRoutine = ({ teacherId }) => {
  const [routines, setRoutines] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // NORMALIZE
  const normalize = (v) =>
    String(v || "")
      .trim()
      .toLowerCase()
      .replace(/[-\s]/g, "");

  // TIME FORMAT (same as student)
  const formatTime = (time) => {
    if (!time) return "-";

    const convert = (t) => {
      if (!t) return "";

      t = t.trim();

      if (t.toLowerCase().includes("am") || t.toLowerCase().includes("pm")) {
        return t.toUpperCase();
      }

      const [hStr, mStr] = t.split(":");
      let h = parseInt(hStr, 10);
      let m = parseInt(mStr || "0", 10);

      if (isNaN(h)) return t;

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
    const allRoutines = JSON.parse(localStorage.getItem("routines") || "[]");
    setRoutines(allRoutines);

    const assigned = JSON.parse(
      localStorage.getItem("teacherCourses_" + teacherId) || "[]",
    );

    setAssignedCourses(assigned);
  }, [teacherId]);

  // FILTER ROUTINE (🔥 MAIN LOGIC)
  useEffect(() => {
    if (!assignedCourses.length || !routines.length) return;

    // const courseIds = assignedCourses.map((c) => normalize(c.courseId));
    const courseIds = assignedCourses
      .map((c) => normalize(c.courseId || c))
      .filter(Boolean);

    const result = routines.filter((r) =>
      courseIds.includes(normalize(r.courseId)),
    );

    // REMOVE DUPLICATE
    const unique = Array.from(
      new Map(
        result.map((r) => [
          `${normalize(r.day)}-${normalize(r.time)}-${normalize(r.courseId)}`,
          r,
        ]),
      ).values(),
    );

    setFiltered(unique);
  }, [assignedCourses, routines]);

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
          background: "linear-gradient(135deg,#198754,#20c997)",
          color: "white",
        }}
      >
        <h3 className="fw-bold d-flex align-items-center justify-content-center gap-2 mb-2">
          <FaCalendarAlt />
          My Teaching Routine
        </h3>

        <div className="opacity-75">Assigned Courses Based Routine</div>
      </div>

      {/* EMPTY */}
      {filtered.length === 0 ? (
        <div className="alert alert-warning text-center">
          No routine found for your assigned courses
        </div>
      ) : (
        Object.keys(groupedRoutine).map((day) => (
          <div
            key={day}
            className="mb-4 p-3 p-md-4 rounded-4 shadow-sm"
            style={{
              background: "#fff",
              borderLeft: "6px solid #198754",
            }}
          >
            {/* DAY */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-success text-uppercase m-0 d-flex align-items-center gap-2">
                <FaLayerGroup />
                {day}
              </h5>

              <span className="badge bg-success">
                {groupedRoutine[day].length} Classes
              </span>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>
                      <FaClock /> Time
                    </th>
                    <th>
                      <FaBook /> Course
                    </th>
                    <th>
                      <FaDoorOpen /> Room
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {groupedRoutine[day].map((r, i) => (
                    <tr key={i}>
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

export default TeacherRoutine;
