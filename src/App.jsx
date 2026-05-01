import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import StudentDashBoard from "./modules/Student/pages/StudentDashBoard";
import AdminPanel from "./modules/Admin/pages/AdminPanel";
import TeacherDashboard from "./modules/Teacher/pages/TeacherDashBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashBoard />} />
        {/* <Route path="/dashboard/*" element={<StudentDashBoard />} /> */}
        <Route path="/admin-dashboard" element={<AdminPanel />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
