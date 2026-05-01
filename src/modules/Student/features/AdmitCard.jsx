import { useEffect, useState } from "react";
import {
  FaPrint,
  FaLock,
  FaUser,
  FaBook,
  FaGraduationCap,
  FaIdCard,
} from "react-icons/fa";

const AdmitCard = ({ studentData }) => {
  const [myCard, setMyCard] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!studentData?.userId) return;

    const studentId = String(studentData.userId).trim();

    const loadData = () => {
      const cards = JSON.parse(localStorage.getItem("admitCards") || "[]");
      const students = JSON.parse(localStorage.getItem("students") || "[]");

      const card = cards.find((c) => String(c.studentId).trim() === studentId);

      const profile = students.find(
        (s) => String(s.studentId).trim() === studentId,
      );

      const enrolledCourses = JSON.parse(
        localStorage.getItem("studentCourses_" + studentId) || "[]",
      );

      if (!card || !profile) {
        setMyCard(null);
        setCourses([]);
        return;
      }

      const fullName =
        `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
        profile.name ||
        profile.fullName ||
        profile.username ||
        "N/A";

      setMyCard({
        ...card,
        name: fullName,
        studentId,
        department: profile.department || "N/A",
        batch: profile.batch || "N/A",
        section: profile.section || "N/A",
      });

      setCourses(enrolledCourses);
    };

    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("admitCardsUpdated", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("admitCardsUpdated", loadData);
    };
  }, [studentData]);

  const handlePrint = () => window.print();

  if (!myCard) {
    return (
      <div className="text-center mt-5">
        <FaLock size={60} className="text-secondary mb-3" />
        <h4 className="text-danger">Admit Card Locked</h4>
        <p className="text-muted">Not generated or not eligible yet</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div
        className="card shadow-lg border-0 admit-card"
        style={{ width: "560px", borderRadius: "18px", overflow: "hidden" }}
      >
        {/* HEADER */}
        <div
          className="text-white text-center p-4"
          style={{
            background: "linear-gradient(135deg,#0d6efd,#4f46e5)",
          }}
        >
          <FaGraduationCap size={34} />
          <h3 className="mt-2 mb-0 fw-bold">University Admit Card</h3>
          <small>Examination 2026</small>
        </div>

        <div className="p-4">
          {/* STUDENT INFO */}
          <div className="d-flex align-items-center mb-3">
            <FaUser className="text-primary me-2" />
            <h5 className="mb-0 fw-bold">Student Information</h5>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <div className="info-box">
                <small>Full Name</small>
                <h6>{myCard.name}</h6>
              </div>
            </div>

            <div className="col-6">
              <div className="info-box">
                <small>Student ID</small>
                <h6>{myCard.studentId}</h6>
              </div>
            </div>

            <div className="col-6">
              <div className="info-box">
                <small>Department</small>
                <h6>{myCard.department}</h6>
              </div>
            </div>

            <div className="col-6">
              <div className="info-box">
                <small>Batch</small>
                <h6>{myCard.batch}</h6>
              </div>
            </div>

            <div className="col-6">
              <div className="info-box">
                <small>Section</small>
                <h6>{myCard.section}</h6>
              </div>
            </div>

            <div className="col-6">
              <div className="info-box">
                <small>Roll</small>
                <h6>{myCard.roll}</h6>
              </div>
            </div>
          </div>

          {/* COURSES */}
          <div className="d-flex align-items-center mb-2">
            <FaBook className="text-success me-2" />
            <h5 className="mb-0 fw-bold">Enrolled Courses</h5>
          </div>

          <div className="course-box mb-3">
            {courses.length === 0 ? (
              <p className="text-danger mb-0">No courses enrolled</p>
            ) : (
              courses.map((c, i) => (
                <div key={i} className="course-item">
                  <span className="fw-semibold">{c.courseName}</span>
                  <span className="text-muted small">
                    {c.courseId} • {c.credit} Cr
                  </span>
                </div>
              ))
            )}
          </div>

          {/* PRINT BUTTON */}
          <button onClick={handlePrint} className="btn btn-success w-100 py-2">
            <FaPrint className="me-2" />
            Print / Download Admit Card
          </button>
        </div>
      </div>

      {/* INLINE STYLES */}
      <style>{`
        .info-box{
          background:#f8f9fa;
          padding:10px;
          border-radius:10px;
          border:1px solid #eee;
        }
        .info-box small{
          color:#6c757d;
        }
        .info-box h6{
          margin:0;
          font-weight:600;
        }

        .course-box{
          background:#f8f9fa;
          border-radius:12px;
          padding:10px;
          border:1px solid #eee;
        }

        .course-item{
          display:flex;
          justify-content:space-between;
          padding:6px 0;
          border-bottom:1px solid #e9ecef;
        }

        .course-item:last-child{
          border-bottom:none;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .admit-card, .admit-card * {
            visibility: visible;
          }
          .admit-card {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdmitCard;
