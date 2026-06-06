import { useEffect, useState } from "react";
import {
  FaBook,
  FaGraduationCap,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaBell,
  FaTasks,
  FaFileAlt,
  FaBookOpen,
  FaMoneyCheckAlt,
  FaUser,
  FaMoon,
  FaSun,
  FaChartLine,
  FaPercentage,
  FaUniversity,
  FaClipboardList,
  FaTimes,
  FaUserShield,
  FaChalkboardTeacher,
  FaClock,
} from "react-icons/fa";

const Home = ({ studentData, setSelectedTab, darkMode, setDarkMode }) => {
  const [courses, setCourses] = useState([]);
  const [bills, setBills] = useState([]);
  const [results, setResults] = useState({});
  const [notices, setNotices] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [studentNotices, setStudentNotices] = useState([]);

  const studentId = studentData?.userId;

  const getData = (key, def = []) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : def;
    } catch {
      return def;
    }
  };

  useEffect(() => {
    if (!studentId) return;

    setCourses(getData("studentCourses_" + studentId));
    setBills(getData("billHistory_" + studentId));
    setResults(getData("studentResults_" + studentId, {}));

    const allNotices = getData("notices", []);
    const studentCourses = getData("studentCourses_" + studentId);

    const studentCourseIds = (studentCourses ?? []).map((c) => c.courseId);

    const filteredNotices = allNotices.filter((n) => {
      // ADMIN notices (global)
      if (n.senderType === "admin") return true;

      // TEACHER course-based notices
      if (n.senderType === "teacher" && n.courseId) {
        return studentCourseIds.includes(n.courseId);
      }

      return false;
    });

    const sorted = [...filteredNotices].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );

    setStudentNotices(sorted);
  }, [studentId]);
  // ===== CALCULATIONS =====
  const resultsArray = Object.values(results || {});
  const totalCourses = courses.length;
  const totalDue = bills.reduce((s, b) => s + (b.due || 0), 0);

  const avgMarks =
    resultsArray.length > 0
      ? (
          resultsArray.reduce(
            (s, r) => s + (r.quiz || 0) + (r.midterm || 0) + (r.final || 0),
            0,
          ) / resultsArray.length
        ).toFixed(2)
      : 0;

  const gpa =
    resultsArray.length > 0
      ? (
          resultsArray.reduce((sum, r) => {
            const m = (r.quiz || 0) + (r.midterm || 0) + (r.final || 0);
            if (m >= 80) return sum + 4.0;
            if (m >= 75) return sum + 3.75;
            if (m >= 70) return sum + 3.5;
            if (m >= 65) return sum + 3.25;
            if (m >= 60) return sum + 3.0;
            if (m >= 55) return sum + 2.75;
            if (m >= 50) return sum + 2.5;
            if (m >= 45) return sum + 2.25;
            if (m >= 40) return sum + 2.0;
            return sum;
          }, 0) / resultsArray.length
        ).toFixed(2)
      : 0;

  const attendance = getData("attendance_" + studentId, 75);

  return (
    <div className="container mt-3">
      {/* HEADER */}
      <div className="p-4 mb-4 rounded shadow bg-danger text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold d-flex align-items-center gap-2">
              <FaUniversity /> {studentData.username}
            </h4>
            <small>ID: {studentData.userId}</small>

            <div className="d-flex gap-3 mt-2 small">
              <span className="d-flex align-items-center gap-1">
                <FaBook /> {totalCourses}
              </span>
              <span className="d-flex align-items-center gap-1">
                <FaChartLine /> GPA: {gpa}
              </span>
              <span className="d-flex align-items-center gap-1">
                <FaMoneyBillWave /> {totalDue} TK
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* THEME TOGGLE */}
            <button
              className="btn btn-light btn-sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* NOTIFICATION */}
            <div className="position-relative">
              <button
                className="btn btn-light btn-sm position-relative"
                onClick={() => setShowNotif(!showNotif)}
              >
                <FaBell />
                {studentNotices.length > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {studentNotices.length > 99 ? "99+" : studentNotices.length}
                  </span>
                )}
              </button>

              {showNotif && (
                <div
                  className="card position-absolute end-0 mt-2 shadow"
                  style={{ width: "280px", zIndex: 10 }}
                >
                  <div className="card-body p-2">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>Notifications</strong>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setStudentNotices([]);
                          setShowNotif(false);
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>

                    {studentNotices.length === 0 ? (
                      <p className="small">No notifications</p>
                    ) : (
                      studentNotices.map((n) => (
                        <div key={n.id} className="border-bottom py-2 small">
                          <div className="fw-bold text-danger">
                            {n.title || "Notice"}
                          </div>

                          <div>{n.message}</div>

                          <small className="text-muted d-block">
                            {n.senderType === "admin" ? (
                              <span className="d-flex align-items-center gap-1">
                                <FaUserShield /> Admin
                              </span>
                            ) : (
                              <span className="d-flex align-items-center gap-1">
                                <FaChalkboardTeacher />
                                {n.senderName || n.teacherName || "Teacher"}
                                {n.designation && ` (${n.designation})`}
                              </span>
                            )}
                          </small>

                          <small className="text-muted d-block">
                            <FaBookOpen className="me-1" /> {n.courseName}
                          </small>

                          <small className="text-muted">
                            <FaClock className="me-1" /> {n.createdAt || n.date}
                          </small>
                          {n.courseId && (
                            <div className="badge bg-primary mt-1">
                              Course: {n.courseId}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        {[
          ["Courses", totalCourses, <FaBook />],
          ["Marks", avgMarks + "%", <FaPercentage />],
          ["GPA", gpa, <FaGraduationCap />],
          ["Attendance", attendance + "%", <FaCalendarCheck />],
        ].map(([title, value, icon], i) => (
          <div className="col-md-3" key={i}>
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <div className="mb-2">{icon}</div>
                <h6>{title}</h6>
                <h4 className="fw-bold">{value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAYMENT */}
      {totalDue > 0 && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span className="d-flex align-items-center gap-2">
            <FaMoneyBillWave /> Due: <strong>{totalDue} TK</strong>
          </span>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setSelectedTab("Bill History")}
          >
            Pay Now
          </button>
        </div>
      )}

      {/* COURSES + NOTICES */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold border-bottom pb-2 d-flex align-items-center gap-2">
                <FaBook /> Courses
              </h5>

              {courses.slice(0, 4).map((c, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between border-bottom py-2"
                >
                  <span>{c.courseName}</span>
                  <span className="badge bg-danger">{c.courseId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold border-bottom pb-2 d-flex align-items-center gap-2">
                <FaBell /> Notices
              </h5>

              {studentNotices.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className="border-bottom py-2 small d-flex justify-content-between align-items-start"
                >
                  {/* LEFT SIDE */}
                  <div style={{ maxWidth: "75%" }}>
                    <div className="fw-bold text-danger">
                      {n.title || "Notice"}
                    </div>

                    <div>{n.message}</div>

                    <small className="text-muted d-block d-flex align-items-center gap-1">
                      {n.senderType === "admin" ? (
                        <>
                          <FaUserShield className="text-primary" />
                          Admin
                        </>
                      ) : (
                        <>
                          <FaChalkboardTeacher className="text-success" />
                          {n.senderName || n.teacherName || "Teacher"}
                          {n.designation && ` (${n.designation})`}
                        </>
                      )}
                    </small>

                    <small className="text-muted d-block d-flex align-items-center gap-1">
                      <FaBookOpen className="text-danger" />
                      {n.courseName}
                    </small>

                    <small className="text-muted d-flex align-items-center gap-1">
                      <FaClock className="text-secondary" />
                      {n.createdAt || n.date}
                    </small>
                  </div>

                  {/* RIGHT SIDE (COURSE BADGE) */}
                  {n.courseId && (
                    <div className="text-end">
                      <div className="badge bg-primary mb-1">{n.courseId}</div>
                      <div className="small text-muted">{n.courseName}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-bold border-bottom pb-2 d-flex align-items-center gap-2">
            <FaTasks /> Activity
          </h5>

          <div className="py-2 small d-flex align-items-center gap-2">
            <FaClipboardList /> Student activity overview
          </div>
        </div>
      </div>

      {/* QUICK ACTION */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <FaUser /> Quick Actions
          </h5>

          <div className="row g-2">
            {[
              ["Result", "Result History", <FaFileAlt />],
              ["Courses", "Course", <FaBookOpen />],
              ["Bills", "Bill History", <FaMoneyCheckAlt />],
              ["Routine", "Class Routine", <FaCalendarCheck />],
              ["Profile", "Profile", <FaUser />],
            ].map(([label, tab, icon], i) => (
              <div className="col-md-2" key={i}>
                <button
                  className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setSelectedTab(tab)}
                >
                  {icon} {label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
