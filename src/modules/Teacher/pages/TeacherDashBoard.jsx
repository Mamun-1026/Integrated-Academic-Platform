import { useState, useEffect } from "react";
import Home from "./Home";
import TeacherProfile from "./TeacherProfile";
import TeacherCourse from "../features/TeacherCourse";
import TeacherChangePassword from "../settings/TeacherChangePassword";
import TeacherAssignment from "../features/TeacherAssignment";
import TeacherResult from "../features/TeacherResult";
import TeacherNotice from "../features/TeacherNotice";
import TeacherLeave from "../features/TeacherLeave";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import TeacherRoutine from "../features/TeacherRoutine";

const TeacherDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(
    localStorage.getItem("teacherSelectedTab") || "Home",
  );
  // ✅ DARK MODE (default = LIGHT)
  const [darkMode, setDarkMode] = useState(false);

  const teacher =
    JSON.parse(localStorage.getItem("teacher")) ||
    JSON.parse(localStorage.getItem("teacherInfo")) ||
    {};

  const teacherId = teacher.teacherId || localStorage.getItem("teacherId");

  const teacherName = teacher.teacherName || teacher.name || "Teacher";
  const [assignedCourses, setAssignedCourses] = useState([]);

  const teacherDesignation = teacher.designation || teacher.role || "Lecturer";

  useEffect(() => {
    const courses =
      JSON.parse(localStorage.getItem("teacherCourses_" + teacherId)) || [];
    setAssignedCourses(courses);
  }, [teacherId]);

  //theme load
  useEffect(() => {
    if (!teacherId) return;

    const saved = localStorage.getItem("teacherDarkMode_" + teacherId);
    if (saved === "true") setDarkMode(true);
  }, [teacherId]);
  //Reload ar por same tab
  useEffect(() => {
    localStorage.setItem("teacherSelectedTab", selectedTab);
  }, [selectedTab]);

  //store or add
  useEffect(() => {
    if (!teacherId) return;

    const modeClass = darkMode ? "teacher-dark" : "teacher-light";

    document.body.classList.remove(
      "teacher-dark",
      "teacher-light",
      "student-dark",
      "student-light",
    );
    document.body.classList.add(modeClass);

    localStorage.setItem("teacherDarkMode_" + teacherId, darkMode);
  }, [darkMode, teacherId]);

  const renderPage = () => {
    switch (selectedTab) {
      case "Home":
        return (
          <Home
            setSelectedTab={setSelectedTab}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );

      case "Profile":
        return <TeacherProfile teacherId={teacherId} darkMode={darkMode} />;

      case "My Courses":
        return (
          <TeacherCourse
            teacherId={teacherId}
            assignedCourses={assignedCourses}
            darkMode={darkMode}
          />
        );
      case "Password Change":
        return (
          <TeacherChangePassword teacherId={teacherId} darkMode={darkMode} />
        );
      case "Assignment/Materials":
        return (
          <TeacherAssignment
            teacherId={teacherId}
            assignedCourses={assignedCourses}
          />
        );
      case "Result/Marks":
        return (
          <TeacherResult
            teacherId={teacherId}
            assignedCourses={assignedCourses}
            darkMode={darkMode}
          />
        );

      case "Notice/Announcement":
        return (
          <TeacherNotice
            teacherId={teacherId}
            teacherName={teacherName}
            teacherDesignation={teacherDesignation}
            assignedCourses={assignedCourses}
            darkMode={darkMode}
          />
        );

      case "Class Routine":
        return <TeacherRoutine teacherId={teacherId} />;

      case "Leave/Request":
        return <TeacherLeave teacherId={teacherId} darkMode={darkMode} />;

      default:
        return (
          <Home
            setSelectedTab={setSelectedTab}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <Header
        setSelectedTab={setSelectedTab}
        userRole="Teacher"
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* SIDEBAR */}
        <Sidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          userRole="Teacher"
          darkMode={darkMode}
        />

        {/* MAIN CONTENT */}
        <main style={{ padding: "30px", flex: 1 }}>{renderPage()}</main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
