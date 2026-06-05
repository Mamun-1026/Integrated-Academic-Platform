import React from "react";
import {
  FaHome,
  FaUser,
  FaLock,
  FaBook,
  FaClipboardList,
  FaFileAlt,
  FaMoneyBill,
  FaCalendarAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaGraduationCap,
  FaBell,
} from "react-icons/fa";

const Sidebar = ({ selectedTab, setSelectedTab, userRole, darkMode }) => {
  const menuItems =
    userRole === "Teacher"
      ? [
          "Home",
          "Profile",
          "My Courses",
          "Assignment/Materials",
          "Result/Marks",
          "Leave/Request",
          "Class Routine",
          "Notice/Announcement",
          "Password Change",
        ]
      : [
          "Home",
          "Profile",
          "Course",
          "Class Routine",
          "Result History",
          "Course Evaluation",
          "Bill History",
          "Materials",
          "Student Admit Card",
          "Course Drop",
          "Password Change",
        ];

  const iconMap = {
    Home: FaHome,
    Profile: FaUser,
    "Password Change": FaLock,

    "My Courses": FaBook,
    Course: FaBook,

    "Assignment/Materials": FaFileAlt,
    Materials: FaFileAlt,

    "Result/Marks": FaClipboardList,
    "Result History": FaClipboardList,

    "Bill History": FaMoneyBill,
    "Course Evaluation": FaGraduationCap,

    "Class Routine": FaCalendarAlt,

    "Notice/Announcement": FaBell,

    "Leave/Request": FaSignOutAlt,
    "Course Drop": FaSignOutAlt,
    "Student Admit Card": FaFileAlt,
  };

  const sidebarClass =
    userRole === "Teacher" ? "teacher-sidebar" : "student-sidebar";

  return (
    <aside className={`${sidebarClass} ${darkMode ? "dark" : ""}`}>
      <h5 className="mb-3 fw-bold">{userRole} Panel</h5>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => {
          const Icon = iconMap[item];

          return (
            <li
              key={item}
              className={`sidebar-item d-flex align-items-center gap-2 ${
                selectedTab === item ? "active" : ""
              }`}
              onClick={() => setSelectedTab(item)}
              style={{
                cursor: "pointer",
                padding: "10px 12px",
                borderRadius: "8px",
                transition: "0.2s",
              }}
            >
              <span style={{ fontSize: "16px" }}>
                {Icon ? <Icon /> : <FaHome />}
              </span>

              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
