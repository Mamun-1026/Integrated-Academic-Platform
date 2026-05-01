import { useState, useEffect } from "react";
import Home from "./Home";
import ResultHistory from "../features/ReasultHistory";
import BillHistory from "../features/BillHistory";
import CourseEvaluation from "../features/CourseEvaluation";
import StudentCourse from "../features/StudentCourse";
import Profile from "./Profile";
import Routine from "../features/Routine";
import StudentMaterials from "../features/StudentMaterials";
import CourseDrop from "../features/CourseDrop";
import AdmitCard from "../features/AdmitCard";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import PasswordChange from "../settings/PasswordChange";

function StudentDashBoard() {
  const [selectedTab, setSelectedTab] = useState(
    localStorage.getItem("teacherSelectedTab") || "Home",
  );
  const [studentData, setStudentData] = useState({
    username: "",
    userId: "",
    semester: "",
  });

  // ✅ GLOBAL THEME STATE
  const [darkMode, setDarkMode] = useState(false);

  // Load student data
  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedUserId = localStorage.getItem("userId") || "";
    const studentInfo = JSON.parse(
      localStorage.getItem("studentInfo_" + storedUserId) || "{}",
    );
    const semester = studentInfo.semester || "Spring";

    setStudentData({
      username: storedUsername,
      userId: storedUserId,
      semester,
    });
  }, []);

  // Load theme
  useEffect(() => {
    if (!studentData.userId) return;

    const saved = localStorage.getItem("studentDarkMode_" + studentData.userId);

    setDarkMode(saved === "true");
  }, [studentData.userId]);

  //Reload ar por same tab
  useEffect(() => {
    localStorage.setItem("teacherSelectedTab", selectedTab);
  }, [selectedTab]);

  const renderPage = () => {
    switch (selectedTab) {
      case "Home":
        return (
          <Home
            studentData={studentData}
            setSelectedTab={setSelectedTab}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );

      case "Result History":
        return <ResultHistory studentData={studentData} darkMode={darkMode} />;

      case "Bill History":
        return <BillHistory studentData={studentData} darkMode={darkMode} />;

      case "Course Evaluation":
        return (
          <CourseEvaluation studentData={studentData} darkMode={darkMode} />
        );

      case "Course":
        return <StudentCourse studentData={studentData} darkMode={darkMode} />;

      case "Profile":
        return <Profile studentData={studentData} darkMode={darkMode} />;

      case "Class Routine":
        return <Routine studentData={studentData} darkMode={darkMode} />;
      case "Materials":
        return <StudentMaterials studentId={studentData.userId} />;
      case "Password Change":
        return <PasswordChange studentData={studentData} darkMode={darkMode} />;

      case "Course Drop":
        return <CourseDrop studentData={studentData} darkMode={darkMode} />;

      case "Student Admit Card":
        return <AdmitCard studentData={studentData} darkMode={darkMode} />;

      default:
        return (
          <Home
            studentData={studentData}
            setSelectedTab={setSelectedTab}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const saved = localStorage.getItem("studentDarkMode_" + userId);
    const isDark = saved === "true";

    document.body.classList.remove("student-dark", "student-light");
    document.body.classList.add(isDark ? "student-dark" : "student-light");

    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (!studentData.userId) return;

    document.body.classList.remove("student-dark", "student-light");
    document.body.classList.add(darkMode ? "student-dark" : "student-light");

    localStorage.setItem("studentDarkMode_" + studentData.userId, darkMode);
  }, [darkMode, studentData.userId]);

  return (
    <div>
      <Header
        studentData={studentData}
        setSelectedTab={setSelectedTab}
        userRole="Student"
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          userRole="Student"
          darkMode={darkMode}
        />

        <main style={{ padding: "30px", flex: 1 }}>{renderPage()}</main>
      </div>
    </div>
  );
}

export default StudentDashBoard;
