import { useEffect, useState } from "react";
import {
  FaUserTie,
  FaBook,
  FaClipboardList,
  FaBell,
  FaTasks,
  FaLayerGroup,
  FaClock,
  FaUniversity,
  FaMoon,
  FaSun,
  FaTimes,
  FaUserShield,
  FaChalkboardTeacher,
  FaBookOpen,
} from "react-icons/fa";

const Home = ({ setSelectedTab, darkMode, setDarkMode }) => {
  const safeParse = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };

  const [teacherData, setTeacherData] = useState({
    username: "",
    designation: "Lecturer",
  });

  const [notices, setNotices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  // Load data
  useEffect(() => {
    setTeacherData({
      username: localStorage.getItem("username") || "",
      designation: localStorage.getItem("designation") || "Lecturer",
    });

    const allNotices = safeParse("notices");
    const teacherCourses = safeParse("teacherCourses");

    const teacherCourseIds = teacherCourses.map((c) => c.courseId || c.code);

    const filteredNotices = allNotices.filter((n) => {
      if (n.senderType === "admin") return true;
      if (n.courseId) return teacherCourseIds.includes(n.courseId);
      return false;
    });

    const sorted = filteredNotices.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );

    setNotices(sorted);
    setCourses(teacherCourses);
    setAssignments(safeParse("teacherAssignments"));
    setStudents(safeParse("students"));
  }, []);

  const totalCourses = courses.length;
  const totalStudents = students.length;
  const totalAssignments = assignments.length;
  const pendingTasks = assignments.filter((a) => !a.submitted).length;
  const unreadCount = notices.length;

  const statCards = [
    { label: "Courses", value: totalCourses, icon: <FaBook /> },
    { label: "Students", value: totalStudents, icon: <FaLayerGroup /> },
    {
      label: "Assignments",
      value: totalAssignments,
      icon: <FaClipboardList />,
    },
    { label: "Pending", value: pendingTasks, icon: <FaClock /> },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#eff6ff",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <div className="container py-3">
        {/* HEADER */}
        <div
          className="p-3 rounded shadow text-white"
          style={{
            background: "linear-gradient(135deg,#1e3c72,#2a5298,#4f46e5)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold d-flex align-items-center gap-2">
                <FaUniversity /> Teacher Dashboard
              </h5>
              <small>Welcome, {teacherData.username}</small>
              <div>
                <span className="badge bg-light text-dark mt-1">
                  {teacherData.designation}
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* DARK MODE TOGGLE */}
              <button
                className="btn btn-sm btn-light"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>

              <div className="position-relative">
                {/* BELL ICON */}
                <button
                  className="btn btn-light btn-sm position-relative p-1"
                  onClick={() => setShowNotif(!showNotif)}
                >
                  <FaBell className="fs-5" />

                  {unreadCount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* DROPDOWN NOTIFICATION */}
                {showNotif && (
                  <div
                    className="card position-absolute end-0 mt-2 shadow"
                    style={{ width: "300px", zIndex: 1000 }}
                  >
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Notifications</strong>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setNotices([]);
                            setShowNotif(false);
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>

                      {notices.length === 0 ? (
                        <small>No notices</small>
                      ) : (
                        notices.slice(0, 5).map((n, i) => (
                          <div key={i} className="border-bottom py-2 small">
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
                              <span className="d-flex align-items-center gap-1">
                                <FaBookOpen /> {n.courseName}
                              </span>
                            </small>

                            <small className="text-muted">
                              <span className="d-flex align-items-center gap-1">
                                <FaClock /> {n.createdAt || "No date"}
                              </span>
                            </small>

                            {n.courseId && (
                              <div className="badge bg-primary mt-1">
                                {n.courseId}
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
        <div className="row mt-3">
          {statCards.map((card, i) => (
            <div className="col-md-3 col-6 mb-3" key={i}>
              <div
                className={
                  darkMode
                    ? "card bg-secondary text-light shadow-sm border-0 text-center h-100"
                    : "card shadow-sm border-0 text-center h-100"
                }
              >
                <div className="card-body">
                  <div className="text-primary fs-4 mb-2">{card.icon}</div>
                  <h6>{card.label}</h6>
                  <h4 className="fw-bold">{card.value}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div
          className={
            darkMode
              ? "card bg-secondary text-light border-0 shadow-sm mt-2"
              : "card border-0 shadow-sm mt-2"
          }
        >
          <div className="card-body">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaTasks /> Quick Actions
            </h6>

            <div className="row g-2">
              {[
                ["Profile", "Profile"],
                ["Courses", "My Courses"],
                ["Assignments", "Assignment/Materials"],
                ["Results", "Result/Marks"],
                ["Notices", "Notice/Announcement"],
                ["Messages", "Messaging/Communication"],
                ["Leave", "Leave/Request"],
              ].map(([label, tab], i) => (
                <div className="col-6 col-md-2 col-lg-custom" key={i}>
                  <button
                    className="btn btn-outline-primary w-100 py-2 fw-semibold quick-btn"
                    onClick={() => setSelectedTab(tab)}
                  >
                    {label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NOTICES */}
        <div
          className={
            darkMode
              ? "card bg-secondary text-light border-0 shadow-sm mt-3 mb-3"
              : "card border-0 shadow-sm mt-3 mb-3"
          }
        >
          <div className="card-body">
            <h6 className="fw-bold d-flex align-items-center gap-2 mb-3">
              <FaBell /> Recent Notices
            </h6>

            {notices.length === 0 ? (
              <small>No notices available</small>
            ) : (
              notices.slice(0, 5).map((n) => (
                <div key={n.id} className="border-bottom py-2">
                  <div className="fw-bold small text-danger">{n.title}</div>
                  <small>{n.message}</small>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RECENT COURSES */}
        <div
          className={
            darkMode
              ? "card bg-secondary text-light border-0 shadow-sm mb-3"
              : "card border-0 shadow-sm mb-3"
          }
        >
          <div className="card-body">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaBook /> Recent Courses
            </h6>

            {courses.length === 0 ? (
              <small>No courses assigned</small>
            ) : (
              <ul className="list-group list-group-flush">
                {courses.slice(0, 4).map((c, i) => (
                  <li
                    key={i}
                    className={
                      darkMode
                        ? "list-group-item bg-secondary text-light d-flex justify-content-between"
                        : "list-group-item d-flex justify-content-between"
                    }
                  >
                    <span>{c.name || "Unnamed Course"}</span>
                    <span className="badge bg-danger">{c.code || "N/A"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
