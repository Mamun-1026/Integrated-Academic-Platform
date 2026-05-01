import { useState, useEffect } from "react";

const MIN_CREDIT = 18;
const MAX_CREDIT = 21;

const StudentCourse = ({ studentData }) => {
  const { userId } = studentData;

  const [studentBatch, setStudentBatch] = useState("");
  const [studentSection, setStudentSection] = useState("");

  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [batchFilter, setBatchFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  useEffect(() => {
    const adminCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    const studentCourses = JSON.parse(
      localStorage.getItem("studentCourses_" + userId) || "[]",
    );
    const studentInfo = JSON.parse(
      localStorage.getItem("studentInfo_" + userId) || "{}",
    );

    setStudentBatch(studentInfo.batch || "");
    setStudentSection(studentInfo.section || "");
    setAllCourses(adminCourses);
    setSelectedCourses(studentCourses);
  }, [userId]);

  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + Number(course.credit),
    0,
  );

  const batches = [...new Set(allCourses.map((c) => c.batch))];
  const sections = [...new Set(allCourses.map((c) => c.section))];

  // FILTER + SEARCH
  const availableCourses = allCourses
    .filter(
      (course) => !selectedCourses.some((c) => c.courseId === course.courseId),
    )
    .filter(
      (course) =>
        course.courseName.toLowerCase().includes(search.toLowerCase()) ||
        course.courseId.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((course) => (batchFilter ? course.batch === batchFilter : true))
    .filter((course) =>
      sectionFilter ? course.section === sectionFilter : true,
    );

  const handleAddCourse = (course) => {
    if (course.batch !== studentBatch || course.section !== studentSection) {
      return alert(
        "You can only enroll in your own batch and section courses!",
      );
    }
    if (totalCredits + Number(course.credit) > MAX_CREDIT)
      return alert("Maximum 21 credits allowed");

    const updated = [...selectedCourses, course];
    setSelectedCourses(updated);
    localStorage.setItem("studentCourses_" + userId, JSON.stringify(updated));
  };

  const handleRemoveCourse = (course) => {
    const updated = selectedCourses.filter(
      (c) => c.courseId !== course.courseId,
    );
    setSelectedCourses(updated);
    localStorage.setItem("studentCourses_" + userId, JSON.stringify(updated));
  };

  const handleConfirm = () => {
    if (totalCredits < MIN_CREDIT) return alert("Minimum 18 credits required");

    // Semester auto detect
    // Semester auto detect (Spring / Summer / Fall)
    const month = new Date().getMonth() + 1; // 0-based, so +1
    const year = new Date().getFullYear();
    let semesterName;

    if (month >= 1 && month <= 4) {
      semesterName = `Spring ${year}`;
    } else if (month >= 5 && month <= 8) {
      semesterName = `Summer ${year}`;
    } else {
      semesterName = `Fall ${year}`;
    }

    // Old bills
    const oldBills = JSON.parse(
      localStorage.getItem(`billHistory_${userId}`) || "[]",
    );

    // Check if any previous due is unpaid
    const hasUnpaid = oldBills.some((bill) => bill.due > 0);
    if (hasUnpaid) {
      return alert(
        "You have unpaid dues! Please clear previous dues before registering.",
      );
    }

    // Check if already registered for this semester
    const alreadyRegistered = oldBills.some(
      (bill) => bill.semester === semesterName,
    );
    if (alreadyRegistered) {
      return alert("You have already registered for this semester!");
    }

    const PER_CREDIT = 1800;
    const REG_FEE = 3000;
    const DEV_FEE = 5000;

    const billCourses = selectedCourses.map((course) => ({
      courseId: course.courseId,
      name: course.courseName,
      credit: course.credit,
      amount: Number(course.credit) * PER_CREDIT,
    }));

    const courseAmount = billCourses.reduce((sum, c) => sum + c.amount, 0);
    const totalAmount = courseAmount + REG_FEE + DEV_FEE;

    const newBill = {
      semester: semesterName,
      date: new Date().toLocaleDateString(),
      courses: billCourses,
      totalCredit: totalCredits,
      courseAmount: courseAmount,
      registrationFee: REG_FEE,
      developmentFee: DEV_FEE,
      totalAmount: totalAmount,
      paid: 0,
      due: totalAmount, // dues reflect here
    };

    const updatedBills = [...oldBills, newBill];
    localStorage.setItem(`billHistory_${userId}`, JSON.stringify(updatedBills));

    alert("Course registration completed & bill generated!");
  };

  const highlightText = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} style={{ background: "#e0e0e0" }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const renderCourseCard = (course, type) => (
    <div
      key={course.courseId}
      className="card mb-3 shadow-sm border-0"
      style={{ borderRadius: "10px" }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="fw-bold mb-1">{highlightText(course.courseName)}</h6>
          <div className="mb-1">
            <span className="badge bg-primary me-2">
              {highlightText(course.courseId)}
            </span>
            <span className="badge bg-success me-2">
              {course.credit} Credit
            </span>
            <span className="badge bg-secondary">{course.department}</span>
          </div>
          <small className="text-muted">
            Batch {course.batch} | Section {course.section}
          </small>
        </div>
        {type === "available" ? (
          <button
            className="btn btn-success btn-sm"
            disabled={
              totalCredits >= MAX_CREDIT ||
              course.batch !== studentBatch ||
              course.section !== studentSection
            }
            onClick={() => handleAddCourse(course)}
            title={
              course.batch !== studentBatch || course.section !== studentSection
                ? "You cannot enroll in this course"
                : ""
            }
          >
            Add
          </button>
        ) : (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleRemoveCourse(course)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container">
      <h4 className="mb-4 fw-bold text-center" style={{ color: "#ff4d4d" }}>
        Course Registration
      </h4>

      {/* Credit Counter */}
      <div className="mb-4">
        <div className="d-flex justify-content-between mb-1">
          <span>Enrolled Credits</span>
          <span>
            {totalCredits} / {MAX_CREDIT}
          </span>
        </div>
        <div className="progress">
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${(totalCredits / MAX_CREDIT) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="row g-4">
        {/* Selected Courses */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white d-flex justify-content-between">
              <span>Selected Courses</span>
              <span className="badge bg-light text-dark">
                Total Credit: {totalCredits}
              </span>
            </div>

            <div
              className="card-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {selectedCourses.length === 0 && (
                <p className="text-muted">No courses selected</p>
              )}
              {selectedCourses.map((course) =>
                renderCourseCard(course, "selected"),
              )}
            </div>

            {/* Confirm Button inside left box */}
            <div className="mt-4 mb-4 text-center">
              <button
                className="btn btn-dark w-100 shadow-sm"
                disabled={totalCredits < MIN_CREDIT}
                onClick={handleConfirm}
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>

        {/* Available Courses */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              Available Courses
            </div>

            <div className="card-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="row mb-3">
                <div className="col">
                  <select
                    className="form-select"
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                  >
                    <option value="">All Batch</option>
                    {batches.map((b, i) => (
                      <option key={i} value={b}>
                        Batch {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                  >
                    <option value="">All Section</option>
                    {sections.map((s, i) => (
                      <option key={i} value={s}>
                        Section {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                {availableCourses.length === 0 && (
                  <p className="text-muted">No courses available</p>
                )}
                {availableCourses.map((course) =>
                  renderCourseCard(course, "available"),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourse;
