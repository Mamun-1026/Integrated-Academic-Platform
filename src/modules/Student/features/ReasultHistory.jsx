import { useEffect, useState } from "react";
import {
  FaUser,
  FaIdCard,
  FaBookOpen,
  FaUniversity,
  FaChartLine,
  FaListAlt,
  FaCreditCard,
  FaGraduationCap,
} from "react-icons/fa";

const ResultHistory = ({ studentData }) => {
  const { userId } = studentData;
  const [studentInfo, setStudentInfo] = useState({});
  const [semesterResults, setSemesterResults] = useState([]);

  useEffect(() => {
    const info = JSON.parse(
      localStorage.getItem("studentInfo_" + userId) || "{}",
    );
    setStudentInfo(info);

    const studentCourses =
      JSON.parse(localStorage.getItem("studentCourses_" + userId) || "[]") ||
      [];
    const studentResults = JSON.parse(
      localStorage.getItem("studentResults_" + userId) || "{}",
    );

    const courses = studentCourses.map((c) => {
      const res = studentResults[c.courseId] || {};
      let gp = 0;

      if (
        res.quiz !== undefined &&
        res.midterm !== undefined &&
        res.final !== undefined
      ) {
        const totalMarks = res.quiz + res.midterm + res.final;
        const percentage = totalMarks / 100;

        if (percentage >= 0.8) gp = 4.0;
        else if (percentage >= 0.75) gp = 3.75;
        else if (percentage >= 0.7) gp = 3.5;
        else if (percentage >= 0.65) gp = 3.25;
        else if (percentage >= 0.6) gp = 3.0;
        else if (percentage >= 0.55) gp = 2.75;
        else if (percentage >= 0.5) gp = 2.5;
        else if (percentage >= 0.45) gp = 2.25;
        else if (percentage >= 0.4) gp = 2.0;
        else gp = 0.0;
      }

      const weightedGP = gp * (c.credit || 3);
      const grade = gp > 0 ? getGrade(gp) : "";

      return {
        courseId: c.courseId,
        courseName: c.courseName,
        status: "Regular",
        credit: c.credit || 3,
        gp,
        weightedGP,
        grade,
      };
    });

    const validCourses = courses.filter((c) => c.gp > 0);

    const totalCredit = validCourses.reduce(
      (sum, c) => sum + (c.credit || 0),
      0,
    );

    const totalWeightedGP = validCourses.reduce(
      (sum, c) => sum + (c.weightedGP || 0),
      0,
    );

    const semesterGPA =
      totalCredit > 0 ? (totalWeightedGP / totalCredit).toFixed(2) : "-";

    setSemesterResults([
      {
        semester: "Semester 1",
        courses,
        totalCredit: courses.reduce((sum, c) => sum + (c.credit || 0), 0),
        semesterGPA,
      },
    ]);
  }, [userId]);

  const getGrade = (gp) => {
    if (gp >= 4.0) return "A+";
    if (gp >= 3.75) return "A";
    if (gp >= 3.5) return "A-";
    if (gp >= 3.25) return "B+";
    if (gp >= 3.0) return "B";
    if (gp >= 2.75) return "B-";
    if (gp >= 2.5) return "C+";
    if (gp >= 2.25) return "C";
    if (gp >= 2.0) return "D";
    return "F";
  };

  const getDisplayName = (info) => {
    if (info.fullName) return info.fullName;
    if (info.firstName || info.lastName)
      return `${info.firstName || ""} ${info.lastName || ""}`.trim();
    return "-";
  };

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">
          <FaGraduationCap className="me-2" />
          Academic Result Portal
        </h2>
        <p className="text-muted">Official Transcript & Performance Record</p>
      </div>

      {semesterResults.length === 0 ? (
        <div className="text-center text-muted fs-5">
          No academic records found.
        </div>
      ) : (
        semesterResults.map((semester, index) => (
          <div key={index} className="mb-5">
            {/* STUDENT INFO CARD */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white d-flex align-items-center">
                <FaUniversity className="me-2" />
                <strong>{semester.semester}</strong>
              </div>

              <div className="card-body bg-light">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="p-3 bg-white rounded shadow-sm">
                      <FaIdCard className="text-primary me-2" />
                      <strong>ID</strong>
                      <div className="text-muted">{userId}</div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="p-3 bg-white rounded shadow-sm">
                      <FaUser className="text-primary me-2" />
                      <strong>Name</strong>
                      <div className="text-muted">
                        {getDisplayName(studentInfo)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="p-3 bg-white rounded shadow-sm">
                      <FaBookOpen className="text-primary me-2" />
                      <strong>Program</strong>
                      <div className="text-muted">
                        B.Sc in {studentInfo.department || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="p-3 bg-white rounded shadow-sm">
                      <FaChartLine className="text-primary me-2" />
                      <strong>CGPA</strong>
                      <div className="text-muted">
                        {studentInfo.cumulativeGPA || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="text-end">
                  <FaCreditCard className="text-primary me-2" />
                  <strong>Total Credits:</strong> {semester.totalCredit}
                </div>
              </div>
            </div>

            {/* TABLE CARD */}
            <div className="card border-0 shadow-lg rounded-4 mt-4 overflow-hidden">
              <div className="card-header bg-dark text-white">
                <FaListAlt className="me-2" />
                Course Performance
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-primary text-center">
                    <tr>
                      <th>Code</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Credit</th>
                      <th>Grade</th>
                      <th>GP</th>
                    </tr>
                  </thead>

                  <tbody>
                    {semester.courses.map((c) => (
                      <tr key={c.courseId} className="text-center">
                        <td className="fw-semibold">{c.courseId}</td>
                        <td className="text-start">{c.courseName}</td>
                        <td>
                          <span className="badge bg-secondary">{c.status}</span>
                        </td>
                        <td>{c.credit}</td>
                        <td>
                          <span className="badge bg-primary">{c.grade}</span>
                        </td>
                        <td className="fw-semibold">{c.gp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GPA FOOTER */}
            <div className="card border-0 shadow-lg rounded-4 mt-4 bg-primary text-white">
              <div className="card-body d-flex justify-content-between flex-wrap">
                <div>
                  <strong>Semester GPA:</strong>{" "}
                  <span className="fs-5">{semester.semesterGPA}</span>
                </div>

                <div>
                  <strong>Total Credits:</strong> {semester.totalCredit}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResultHistory;
