import { useState, useEffect } from "react";

import {
  FaUserPlus,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaBullhorn,
  FaCalendarAlt,
  FaIdCard,
  FaHistory,
  FaMoneyCheckAlt,
  FaTachometerAlt,
  FaTasks,
  FaTrashAlt,
  FaClipboardList,
} from "react-icons/fa";

import AdminHeader from "../components/AdminHeader";
import CreateCourse from "../manage/CreateCourse";
import CreateStudent from "../manage/CreateStudent";
import CreateTeacher from "../manage/CreateTeacher";
import StudentInformationForm from "../forms/StudentInformationForm";
import TeacherInformationForm from "../forms/TracherInformationForm";
import AdminNotice from "../manage/AdminNotice";
import AdminLeaveManagement from "../manage/AdminLeaveManagement";
import CreateRoutine from "../manage/CreateRoutine";
import AdminAdmitCardManager from "../manage/AdminAdmitCardManager";
import AssignCourse from "../manage/AssignCourse";
import ApproveDropCourse from "../manage/ApproveDropCourse";
import AboutModal from "../components/AboutModal";
import UpdateModal from "../components/UpdateModal";
import Dashboard from "./Dashboard";
import History from "./History";
import PendingPayments from "../manage/PendingPayments";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const [pendingPayments, setPendingPayments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  const [showDeptStudents, setShowDeptStudents] = useState(false);
  // Add this state at the top of AdminPanel

  const [selectedDept, setSelectedDept] = useState("All");

  const [approvedPayments, setApprovedPayments] = useState([]);

  const [selectedAssignTeacher, setSelectedAssignTeacher] = useState(null);
  const [assignSearch, setAssignSearch] = useState("");
  const [assignedCourses, setAssignedCourses] = useState([]);

  const [routines, setRoutines] = useState([]);

  const [notices, setNotices] = useState([]);

  const [courseFormData, setCourseFormData] = useState({
    courseId: "",
    courseName: "",
    department: "CSE",
    batch: "65",
    section: "A",
    credit: 3,
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Dashboard-specific states reset when tab changes
    if (activeTab !== "dashboard") {
      setShowDeptStudents(false);
      setSelectedDept("All");
    }
  }, [activeTab]);

  useEffect(() => {
    // Load data from localStorage
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");

    const normalizedStudents = storedStudents.map((s) => ({
      ...s,
      department: s.department || "CSE",
      batch: s.batch || "65",
      section: s.section || "A",
    }));

    setStudents(normalizedStudents);

    const storedTeachers = JSON.parse(localStorage.getItem("teachers") || "[]");
    setTeachers(storedTeachers);

    const storedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    setCourses(storedCourses);

    const storedNotices = JSON.parse(localStorage.getItem("notices") || "[]");
    setNotices(storedNotices);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest(".btn-outline-secondary")
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");

    let pending = [];
    let income = 0;
    let approved = [];

    allStudents.forEach((s) => {
      const bills = JSON.parse(
        localStorage.getItem("billHistory_" + s.studentId) || "[]",
      );

      bills.forEach((bill, billIndex) => {
        if (bill.paymentHistory) {
          bill.paymentHistory.forEach((p, index) => {
            if (p.status === "Pending") {
              pending.push({
                studentId: s.studentId, // ✅ fix
                studentName: s.name,
                billName: p.billName,
                method: p.method,
                transactionId: p.trxId,
                amountPaid: p.amount,
                due: bill.due,
                billIndex: billIndex,
                paymentIndex: index,
              });
            }

            if (p.status === "Approved") {
              income += p.amount;

              approved.push({
                studentId: s.studentId,
                studentName: s.name,
                billName: p.billName,
                method: p.method,
                transactionId: p.trxId,
                amountPaid: p.amount,
                date: p.date || "",
              });
            }
          });
        }
      });
    });

    setPendingPayments(pending);
    setTotalIncome(income);
    setApprovedPayments(approved);
  }, [students]);

  useEffect(() => {
    if (selectedAssignTeacher) {
      const key = "teacherCourses_" + selectedAssignTeacher.teacherId;
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      setAssignedCourses(data);
    }
  }, [selectedAssignTeacher]);

  const handleAssignCourse = (teacherId, course) => {
    const key = "teacherCourses_" + teacherId;

    const assigned = JSON.parse(localStorage.getItem(key) || "[]");

    const exists = assigned.some((c) => c.courseId === course.courseId);

    if (exists) {
      alert("Course already assigned!");
      return;
    }

    const updated = [...assigned, course];

    localStorage.setItem(key, JSON.stringify(updated));

    setAssignedCourses(updated); // ⭐ UI update

    alert("Course Assigned!");
  };

  const handleRemoveAssignedCourse = (teacherId, courseId) => {
    const key = "teacherCourses_" + teacherId;

    const assigned = JSON.parse(localStorage.getItem(key) || "[]");

    const updated = assigned.filter((c) => c.courseId !== courseId);

    localStorage.setItem(key, JSON.stringify(updated));

    setAssignedCourses(updated); // ⭐ UI update

    alert("Course Removed!");
  };

  // --- Remove functions ---
  const handleRemoveStudent = (studentId) => {
    if (!window.confirm("Are you sure?")) return;
    const updated = students.filter((s) => s.studentId !== studentId);
    localStorage.setItem("students", JSON.stringify(updated));
    setStudents(updated);

    localStorage.removeItem("studentInfo_" + studentId);
    localStorage.removeItem("profileImage_" + studentId);
    localStorage.removeItem("assignedCourses_" + studentId); // remove assigned courses
    alert("Removed!");
  };

  const handleRemoveTeacher = (teacherId) => {
    if (!window.confirm("Are you sure?")) return;
    const updated = teachers.filter((t) => t.teacherId !== teacherId);
    localStorage.setItem("teachers", JSON.stringify(updated));
    setTeachers(updated);
    localStorage.removeItem("teacherInfo_" + teacherId);
    alert("Removed!");
  };

  const handleRemoveCourse = (courseId) => {
    if (!window.confirm("Are you sure?")) return;
    const updated = courses.filter((c) => c.courseId !== courseId);
    localStorage.setItem("courses", JSON.stringify(updated));
    setCourses(updated);
    alert("Course Removed!");
  };

  // --- Search / Filter ---

  const filteredCourses = courses.filter(
    (c) =>
      c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- Highlight Helper ---
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          style={{
            backgroundColor: "#d9d9d9",
            fontWeight: "600",
            padding: "0 2px",
            borderRadius: "2px",
          }}
        >
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  };

  const openAbout = (type, user) => {
    setSelectedUser(user);
    setSelectedType(type);
    setShowAboutModal(true);
  };

  const openUpdate = (type, user) => {
    setSelectedUser(user);
    setSelectedType(type);
    setShowUpdateModal(true);
  };

  const handleApprovePayment = (studentId, billIndex, paymentIndex) => {
    const bills = JSON.parse(
      localStorage.getItem("billHistory_" + studentId) || "[]",
    );
    let updatedBills = [...bills];

    const bill = updatedBills[billIndex];
    const payment = bill.paymentHistory[paymentIndex];

    if (payment.status === "Pending") {
      payment.status = "Approved";

      const updatedStudents = students.map((s) => {
        if (s.studentId === studentId) {
          return { ...s, isPaymentClear: true };
        }
        return s;
      });
      setStudents(updatedStudents);
      localStorage.setItem("students", JSON.stringify(updatedStudents));

      bill.paid = (bill.paid || 0) + payment.amount;
      bill.due = (bill.due || 0) - payment.amount;
    }

    localStorage.setItem(
      "billHistory_" + studentId,
      JSON.stringify(updatedBills),
    );

    alert("Payment Approved");

    setPendingPayments((prev) =>
      prev.filter(
        (p) =>
          !(
            p.studentId === studentId &&
            p.billIndex === billIndex &&
            p.paymentIndex === paymentIndex
          ),
      ),
    );
  };
  const handleRejectPayment = (studentId, billIndex, paymentIndex) => {
    const bills = JSON.parse(
      localStorage.getItem("billHistory_" + studentId) || "[]",
    );

    let updatedBills = [...bills];

    const bill = updatedBills[billIndex];
    const payment = bill.paymentHistory[paymentIndex];

    if (payment.status === "Pending") {
      payment.status = "Rejected";
    }

    localStorage.setItem(
      "billHistory_" + studentId,
      JSON.stringify(updatedBills),
    );

    alert("Payment Rejected");

    setPendingPayments((prev) =>
      prev.filter(
        (p) =>
          !(
            p.studentId === studentId &&
            p.billIndex === billIndex &&
            p.paymentIndex === paymentIndex
          ),
      ),
    );
  };

  useEffect(() => {
    const loadRoutines = () => {
      const data = JSON.parse(localStorage.getItem("routines") || "[]");
      setRoutines(data);
    };

    loadRoutines();

    window.addEventListener("storage", loadRoutines);
    return () => window.removeEventListener("storage", loadRoutines);
  }, []);

  return (
    <div>
      <AdminHeader />
      <div className="container mt-4">
        {/* Tabs */}
        <div className="card shadow-sm border-0 p-3 mb-4">
          <div className="d-flex flex-wrap gap-2">
            {/* DASHBOARD FIRST (MAIN VIEW) */}
            <button
              className="btn btn-info d-flex align-items-center gap-2"
              onClick={() => setActiveTab("dashboard")}
            >
              <FaTachometerAlt /> Dashboard
            </button>

            {/* STUDENT SECTION */}
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={() => setActiveTab("createStudent")}
            >
              <FaUserPlus /> Create Student
            </button>

            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => {
                setActiveTab("infoStudent");
                setSelectedStudentId(null);
              }}
            >
              <FaUserGraduate /> Student Info
            </button>

            {/* TEACHER SECTION */}
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={() => setActiveTab("createTeacher")}
            >
              <FaChalkboardTeacher /> Create Teacher
            </button>

            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => {
                setActiveTab("infoTeacher");
                setSelectedTeacherId(null);
              }}
            >
              <FaUserGraduate /> Teacher Info
            </button>

            {/* COURSE MANAGEMENT */}
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={() => setActiveTab("createCourse")}
            >
              <FaBook /> Create Course
            </button>

            <button
              className="btn btn-dark d-flex align-items-center gap-2"
              onClick={() => setActiveTab("assignCourse")}
            >
              <FaTasks /> Assign Course
            </button>

            {/* ACADEMIC TOOLS */}
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => setActiveTab("createRoutine")}
            >
              <FaCalendarAlt /> Create Routine
            </button>

            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={() => setActiveTab("admitCard")}
            >
              <FaIdCard /> Admit Card
            </button>

            {/* NOTICE / COMMUNICATION */}
            <button
              className="btn btn-danger d-flex align-items-center gap-2"
              onClick={() => setActiveTab("createNotice")}
            >
              <FaBullhorn /> Notice
            </button>

            {/* FINANCE */}
            <button
              className="btn btn-warning d-flex align-items-center gap-2"
              onClick={() => setActiveTab("pendingPayments")}
            >
              <FaMoneyCheckAlt /> Pending Payments
            </button>

            {/* SYSTEM */}
            <button
              className="btn btn-secondary d-flex align-items-center gap-2"
              onClick={() => setActiveTab("history")}
            >
              <FaHistory /> History
            </button>

            <button
              className="btn btn-danger d-flex align-items-center gap-2"
              onClick={() => setActiveTab("approveDrop")}
            >
              <FaTrashAlt /> Drop Approvals
            </button>

            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => setActiveTab("leaveManagement")}
            >
              <FaClipboardList /> Leave Requests
            </button>
          </div>
        </div>

        {/* CREATE COURSE */}
        {activeTab === "createCourse" && (
          <CreateCourse
            courses={courses}
            setCourses={setCourses}
            students={students}
          />
        )}

        {activeTab === "createStudent" && (
          <CreateStudent
            students={students}
            setStudents={setStudents}
            setSelectedStudentId={setSelectedStudentId}
            setActiveTab={setActiveTab}
          />
        )}

        {/* CREATE TEACHER FORM */}
        {activeTab === "createTeacher" && (
          <CreateTeacher
            teachers={teachers}
            setTeachers={setTeachers}
            setSelectedTeacherId={setSelectedTeacherId}
            setActiveTab={setActiveTab}
          />
        )}
        {/* STUDENT INFO */}
        {activeTab === "infoStudent" && (
          <div className="card p-4 mb-4">
            <StudentInformationForm studentId={selectedStudentId} />
          </div>
        )}

        {/* TEACHER INFO */}
        {activeTab === "infoTeacher" && (
          <div className="card p-4 mb-4">
            <TeacherInformationForm
              teacherId={selectedTeacherId}
              readOnly={false}
              onSave={(updatedTeacher) => {
                setTeachers((prev) =>
                  prev.map((t) =>
                    t.teacherId === updatedTeacher.teacherId
                      ? updatedTeacher
                      : t,
                  ),
                );
              }}
            />
          </div>
        )}
        {activeTab === "createNotice" && <AdminNotice />}
        {activeTab === "leaveManagement" && <AdminLeaveManagement />}

        {activeTab === "createRoutine" && (
          <CreateRoutine
            courses={courses}
            routines={routines}
            setRoutines={setRoutines}
          />
        )}
        {activeTab === "admitCard" && (
          <AdminAdmitCardManager students={students} />
        )}
        {activeTab === "history" && (
          <History
            students={students}
            teachers={teachers}
            searchTerm={searchTerm}
            highlightText={highlightText}
            openAbout={openAbout}
            openUpdate={openUpdate}
            handleRemoveStudent={handleRemoveStudent}
            handleRemoveTeacher={handleRemoveTeacher}
            setOpenMenu={setOpenMenu}
            openMenu={openMenu}
          />
        )}

        {activeTab === "pendingPayments" && (
          <PendingPayments
            pendingPayments={pendingPayments}
            handleApprovePayment={handleApprovePayment}
            handleRejectPayment={handleRejectPayment}
          />
        )}
      </div>

      {activeTab === "dashboard" && (
        <Dashboard
          students={students}
          teachers={teachers}
          totalIncome={totalIncome}
          approvedPayments={approvedPayments}
        />
      )}

      {activeTab === "assignCourse" && (
        <AssignCourse
          teachers={teachers}
          courses={courses}
          selectedAssignTeacher={selectedAssignTeacher}
          setSelectedAssignTeacher={setSelectedAssignTeacher}
          assignedCourses={assignedCourses}
          setAssignedCourses={setAssignedCourses}
          handleAssignCourse={handleAssignCourse}
          handleRemoveAssignedCourse={handleRemoveAssignedCourse}
        />
      )}
      {activeTab === "approveDrop" && <ApproveDropCourse students={students} />}
      {/* ABOUT MODAL */}
      {showAboutModal && (
        <AboutModal
          selectedType={selectedType}
          selectedUser={selectedUser}
          setShowAboutModal={setShowAboutModal}
          setStudents={setStudents}
        />
      )}
      {showUpdateModal && (
        <UpdateModal
          selectedType={selectedType}
          selectedUser={selectedUser}
          setShowUpdateModal={setShowUpdateModal}
          setStudents={setStudents}
          setTeachers={setTeachers}
        />
      )}
    </div>
  );
};
export default AdminPanel;
