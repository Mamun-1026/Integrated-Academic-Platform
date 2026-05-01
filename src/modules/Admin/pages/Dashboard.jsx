import React, { useState } from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaUniversity,
  FaFilter,
  FaLayerGroup,
  FaUsers,
} from "react-icons/fa";

const Dashboard = ({ students, teachers, totalIncome, approvedPayments }) => {
  const [showDeptStudents, setShowDeptStudents] = useState(false);
  const [showDeptTeachers, setShowDeptTeachers] = useState(false);
  const [showIncomeHistory, setShowIncomeHistory] = useState(false);

  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");

  const [selectedTeacherDept, setSelectedTeacherDept] = useState("All");
  const [selectedDesignation, setSelectedDesignation] = useState("All");

  const StatCard = ({ icon, title, value, onClick }) => (
    <div className="col-md-4 mb-3">
      <div
        className="card border-0 shadow-sm p-3 text-center h-100 stat-card"
        style={{ cursor: "pointer", borderRadius: "12px" }}
        onClick={onClick}
      >
        <div className="fs-3 text-primary mb-2">{icon}</div>
        <h6 className="mb-1">{title}</h6>
        <h5 className="fw-bold">{value}</h5>
      </div>
    </div>
  );

  const FilterCard = ({ label, sub, icon, onClick }) => (
    <div className="col-6 col-md-3 col-lg-2">
      <div
        className="card border-0 shadow-sm p-2 text-center"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        {icon && <div className="fs-5 text-primary">{icon}</div>}
        <div className="fw-bold small">{label}</div>
        {sub && <div className="text-muted small">{sub}</div>}
      </div>
    </div>
  );

  return (
    <div className="container py-3">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-3">
        <FaUniversity className="text-primary fs-3 me-2" />
        <h4 className="mb-0 fw-bold">University Dashboard</h4>
      </div>

      {/* STATS */}
      <div className="row">
        <StatCard
          icon={<FaUserGraduate />}
          title="Total Students"
          value={students.length}
          onClick={() => {
            setShowDeptStudents(true);
            setShowDeptTeachers(false);
            setShowIncomeHistory(false);
          }}
        />

        <StatCard
          icon={<FaChalkboardTeacher />}
          title="Total Teachers"
          value={teachers.length}
          onClick={() => {
            setShowDeptStudents(false);
            setShowDeptTeachers(true);
            setShowIncomeHistory(false);
          }}
        />

        <StatCard
          icon={<FaMoneyBillWave />}
          title="Total Income"
          value={`${totalIncome} BDT`}
          onClick={() => {
            setShowDeptStudents(false);
            setShowDeptTeachers(false);
            setShowIncomeHistory(true);
          }}
        />
      </div>

      {/* ================= STUDENTS ================= */}
      {showDeptStudents && (
        <div className="mt-4">
          {/* HEADER */}
          <div className="d-flex align-items-center mb-2">
            <FaFilter className="me-2 text-secondary" />
            <h6 className="mb-0">Student Filters</h6>
          </div>

          {/* DEPARTMENT */}
          <div className="row g-2 mb-3">
            {["All", "CSE", "EEE", "LAW", "TEXTILE", "ENGLISH", "BUSINESS"].map(
              (dept) => {
                const count =
                  dept === "All"
                    ? students.length
                    : students.filter((s) => s.department === dept).length;

                return (
                  <FilterCard
                    key={dept}
                    label={dept}
                    sub={`${count} Students`}
                    onClick={() => {
                      setSelectedDept(dept);
                      setSelectedBatch("All");
                      setSelectedSection("All");
                    }}
                  />
                );
              },
            )}
          </div>

          {/* BATCH */}
          <div className="row g-2 mb-3">
            {[
              "All",
              ...new Set(
                students
                  .filter((s) =>
                    selectedDept === "All"
                      ? true
                      : s.department === selectedDept,
                  )
                  .map(
                    (s) =>
                      `${s.department || "Unknown"}-${s.batch || "Unknown"}`,
                  ),
              ),
            ].map((b) => (
              <FilterCard
                key={b}
                label={b}
                icon={<FaLayerGroup />}
                onClick={() => {
                  setSelectedBatch(b);
                  setSelectedSection("All");
                }}
              />
            ))}
          </div>

          {/* SECTION */}
          <div className="row g-2 mb-3">
            {[
              "All",
              ...new Set(
                students
                  .filter((s) => {
                    if (selectedDept !== "All" && s.department !== selectedDept)
                      return false;

                    if (selectedBatch !== "All") {
                      const [dept, batch] = (selectedBatch || "").split("-");

                      if (s.department !== dept || s.batch !== batch)
                        return false;
                    }

                    return true;
                  })
                  .map((s) => s.section || "Unknown"),
              ),
            ].map((sec) => (
              <FilterCard
                key={sec}
                label={`Section ${sec}`}
                icon={<FaUsers />}
                onClick={() => setSelectedSection(sec)}
              />
            ))}
          </div>

          {/* STUDENT LIST */}
          <div className="row g-3">
            {students
              .filter((s) => {
                if (selectedDept !== "All" && s.department !== selectedDept)
                  return false;

                if (selectedBatch !== "All") {
                  const parts = selectedBatch.split("-");
                  const dept = parts[0];
                  const batch = parts[1];

                  if (s.department !== dept || s.batch !== batch) return false;
                }

                return true;
              })
              .map((s) => (
                <div key={s.studentId} className="col-12 col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center student-card">
                    <img
                      src={
                        localStorage.getItem("profileImage_" + s.studentId) ||
                        localStorage.getItem("studentProfile_" + s.studentId) ||
                        "https://via.placeholder.com/60"
                      }
                      className="rounded-circle me-3"
                      style={{ width: 55, height: 55, objectFit: "cover" }}
                      alt=""
                    />
                    <div>
                      <div className="fw-bold">
                        {s.name ||
                          `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
                          "Unknown"}
                      </div>
                      <span className="badge bg-primary me-1">
                        {s.department}
                      </span>
                      <span className="badge bg-secondary">
                        ID: {s.studentId}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= TEACHERS ================= */}
      {showDeptTeachers && (
        <div className="mt-4">
          <div className="row g-2 mb-3">
            {[
              "All",
              ...new Set(teachers.map((t) => t.department || "Unknown")),
            ].map((dept) => {
              const count =
                dept === "All"
                  ? teachers.length
                  : teachers.filter((t) => t.department === dept).length;

              return (
                <FilterCard
                  key={dept}
                  label={dept}
                  sub={`${count} Teachers`}
                  onClick={() => {
                    setSelectedTeacherDept(dept);
                    setSelectedDesignation("All");
                  }}
                />
              );
            })}
          </div>

          <div className="row g-3">
            {teachers
              .filter((t) => {
                if (
                  selectedTeacherDept !== "All" &&
                  t.department !== selectedTeacherDept
                )
                  return false;

                if (
                  selectedDesignation !== "All" &&
                  t.designation !== selectedDesignation
                )
                  return false;

                return true;
              })
              .map((t) => {
                let teacherInfo = {};

                try {
                  const raw = localStorage.getItem(
                    "teacherInfo_" + t.teacherId,
                  );
                  teacherInfo = raw ? JSON.parse(raw) : {};
                } catch {
                  teacherInfo = {};
                }

                const profile =
                  teacherInfo?.profilePhoto || "https://via.placeholder.com/60";

                return (
                  <div key={t.teacherId} className="col-12 col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center teacher-card">
                      <img
                        src={profile}
                        className="rounded-circle me-3"
                        style={{ width: 55, height: 55, objectFit: "cover" }}
                        alt=""
                      />
                      <div>
                        <div className="fw-bold">{t.fullName}</div>
                        <span className="badge bg-primary me-1">
                          {t.department}
                        </span>
                        <span className="badge bg-success">
                          {t.designation || "Teacher"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ================= INCOME ================= */}
      {showIncomeHistory && (
        <div className="mt-4">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="mb-3">Payment History</h6>

            {approvedPayments.length === 0 ? (
              <p className="mb-0">No payment history available</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>ID</th>
                      <th>Bill</th>
                      <th>Method</th>
                      <th>TXN</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedPayments.map((p, i) => (
                      <tr key={i}>
                        <td>{p.studentName}</td>
                        <td>{p.studentId}</td>
                        <td>{p.billName}</td>
                        <td>{p.method}</td>
                        <td>{p.transactionId || "N/A"}</td>
                        <td className="fw-bold">{p.amountPaid} BDT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
