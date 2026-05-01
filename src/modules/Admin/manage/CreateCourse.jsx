import { useState } from "react";
import {
  FaBook,
  FaPlusCircle,
  FaTrash,
  FaUniversity,
  FaLayerGroup,
  FaStar,
} from "react-icons/fa";

const CreateCourse = ({ courses, setCourses, students }) => {
  const [courseFormData, setCourseFormData] = useState({
    courseId: "",
    courseName: "",
    department: "CSE",
    batch: "65",
    section: "A",
    credit: 3,
  });

  const handleCreateCourse = () => {
    if (!courseFormData.courseId || !courseFormData.courseName) {
      alert("Course ID & Name required");
      return;
    }

    const exists = courses.some((c) => c.courseId === courseFormData.courseId);

    if (exists) {
      alert("Course ID already exists!");
      return;
    }

    const newCourse = {
      ...courseFormData,
      createdAt: new Date().toLocaleString(),
    };

    const updatedCourses = [...courses, newCourse];
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses);

    setCourseFormData({
      courseId: "",
      courseName: "",
      department: "CSE",
      batch: "65",
      section: "A",
      credit: 3,
    });

    alert("Course Created & added to students!");
  };

  const handleRemoveCourse = (courseId) => {
    if (!window.confirm("Are you sure?")) return;

    const updated = courses.filter((c) => c.courseId !== courseId);
    localStorage.setItem("courses", JSON.stringify(updated));
    setCourses(updated);

    alert("Course Removed!");
  };

  const handleChange = (e) => {
    setCourseFormData({
      ...courseFormData,
      [e.target.name]:
        e.target.name === "credit" ? Number(e.target.value) : e.target.value,
    });
  };

  return (
    <div className="container py-3">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-3">
        <FaBook className="text-primary fs-4 me-2" />
        <h4 className="fw-bold mb-0">Course Management</h4>
      </div>

      {/* FORM CARD */}
      <div className="card border-0 shadow-sm p-3 p-md-4 mb-4">
        <div className="row g-3">
          {/* Course ID */}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">Course ID</label>
            <input
              className="form-control"
              name="courseId"
              placeholder="e.g. CSE101"
              value={courseFormData.courseId}
              onChange={handleChange}
            />
          </div>

          {/* Course Name */}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">Course Name</label>
            <input
              className="form-control"
              name="courseName"
              placeholder="e.g. Data Structures"
              value={courseFormData.courseName}
              onChange={handleChange}
            />
          </div>

          {/* Department */}
          <div className="col-md-4 col-12">
            <label className="form-label fw-semibold">Department</label>
            <select
              className="form-select"
              name="department"
              value={courseFormData.department}
              onChange={handleChange}
            >
              <option>CSE</option>
              <option>EEE</option>
              <option>Business</option>
              <option>Law</option>
            </select>
          </div>

          {/* Batch */}
          <div className="col-md-4 col-12">
            <label className="form-label fw-semibold">Batch</label>
            <input
              className="form-control"
              name="batch"
              value={courseFormData.batch}
              onChange={handleChange}
            />
          </div>

          {/* Section */}
          <div className="col-md-4 col-12">
            <label className="form-label fw-semibold">Section</label>
            <input
              className="form-control"
              name="section"
              value={courseFormData.section}
              onChange={handleChange}
            />
          </div>

          {/* Credit */}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">Credit</label>
            <input
              type="number"
              className="form-control"
              name="credit"
              value={courseFormData.credit}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-4 d-flex justify-content-end">
          <button
            className="btn btn-success d-flex align-items-center gap-2 px-4"
            onClick={handleCreateCourse}
          >
            <FaPlusCircle /> Create Course
          </button>
        </div>
      </div>

      {/* COURSE LIST */}
      <div className="card border-0 shadow-sm p-3 p-md-4">
        <h5 className="mb-3 d-flex align-items-center gap-2">
          <FaLayerGroup className="text-primary" />
          All Courses ({courses.length})
        </h5>

        <div className="row g-3">
          {courses.map((c) => (
            <div key={c.courseId} className="col-md-6 col-12">
              <div className="card border-0 shadow-sm p-3 h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1 fw-bold">{c.courseName}</h6>
                    <small className="text-muted">ID: {c.courseId}</small>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveCourse(c.courseId)}
                  >
                    <FaTrash />
                  </button>
                </div>

                <hr />

                <div className="small text-muted">
                  <div>
                    <FaUniversity className="me-1" /> Dept: {c.department}
                  </div>
                  <div>
                    Batch: {c.batch} | Section: {c.section}
                  </div>
                  <div className="d-flex align-items-center gap-1 mt-1">
                    <FaStar className="text-warning" />
                    Credit: {c.credit}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
