import { useState, useEffect } from "react";
import { GrFormNextLink } from "react-icons/gr";
import { IoMdArrowBack } from "react-icons/io";
const TeacherInformationForm = ({ teacherId, readOnly }) => {
  const [step, setStep] = useState(1);

  const [info, setInfo] = useState({
    // STEP 1 - PERSONAL
    fullName: "",
    teacherId: "",
    password: "",
    email: "",
    mobile: "",
    gender: "",
    bloodGroup: "",
    dob: "",
    profilePhoto: "",

    // STEP 2 - JOB
    faculty: "",
    department: "",
    designation: "",
    joiningDate: "",
    employmentType: "",

    // STEP 3 - ACADEMIC
    degreeName: "",
    university: "",
    subject: "",
    passingYear: "",
    cgpa: "",
    teachingExperience: " ",
    achievements: "",

    // STEP 4 - DOCUMENTS
    nidCopy: "",
    certificates: "",
    resume: "",
    appointmentLetter: "",
    experienceCert: "",
  });

  // LOAD DATA
  useEffect(() => {
    if (!teacherId) return;

    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");

    const found = teachers.find(
      (t) => String(t.teacherId).trim() === String(teacherId).trim(),
    );

    if (found) setInfo(found);
  }, [teacherId]);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setInfo((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setInfo((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      return;
    }

    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  // NAVIGATION
  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // SAVE
  const handleSave = () => {
    const now = new Date().toLocaleString();

    const finalData = {
      ...info,
      createdAt: info.createdAt || now,
      updatedAt: now,
    };

    const saved = JSON.parse(localStorage.getItem("teachers") || "[]");

    const updated = teacherId
      ? saved.map((t) =>
          String(t.teacherId).trim() === String(teacherId).trim()
            ? finalData
            : t,
        )
      : [...saved, finalData];

    localStorage.setItem("teachers", JSON.stringify(updated));

    alert("Teacher Saved Successfully!");
  };

  return (
    <div className="section-box">
      <h5 className="mb-3">Step {step}</h5>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="row g-3">
          {/* LEFT STEP */}
          <div className="col-md-3">
            <div
              className="card shadow-sm border-0 p-3 sticky-top"
              style={{ top: "20px" }}
            >
              <h6 className="mb-3 text-primary">Step Progress</h6>

              <div className="d-flex flex-column gap-2">
                <div
                  className={`p-2 rounded ${step === 1 ? "bg-primary text-white" : "bg-light"}`}
                >
                  1. Personal Info
                </div>

                <div
                  className={`p-2 rounded ${step === 2 ? "bg-primary text-white" : "bg-light"}`}
                >
                  2. Job Info
                </div>

                <div
                  className={`p-2 rounded ${step === 3 ? "bg-primary text-white" : "bg-light"}`}
                >
                  3. Academic
                </div>

                <div
                  className={`p-2 rounded ${step === 4 ? "bg-primary text-white" : "bg-light"}`}
                >
                  4. Documents
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT FORM */}
          <div className="col-md-9">
            <div className="card shadow border-0">
              <div className="card-header bg-gradient bg-primary text-white">
                <h5 className="mb-0">Personal Information</h5>
              </div>

              <div className="card-body">
                <div className="row g-4">
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      className="form-control"
                      name="fullName"
                      value={info.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                    />
                  </div>
                  {/* Teacher Id */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Teacher Id</label>
                    <input
                      className="form-control"
                      name="teacherId"
                      value={info.teacherId}
                      onChange={handleChange}
                      placeholder="Teacher Id"
                    />
                  </div>
                  {/* password */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                      value={info.password}
                      onChange={handleChange}
                      placeholder="Enter Password"
                    />
                  </div>
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      className="form-control"
                      name="email"
                      value={info.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                    />
                  </div>
                  {/* Mobile */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Mobile Number
                    </label>
                    <input
                      className="form-control"
                      name="mobile"
                      value={info.mobile}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  {/* Gender */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Gender</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={info.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  {/* Blood */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Blood Group
                    </label>
                    <input
                      className="form-control"
                      name="bloodGroup"
                      value={info.bloodGroup}
                      onChange={handleChange}
                      placeholder="A+, B-, O+"
                    />
                  </div>
                  {/* DOB */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="dob"
                      value={info.dob}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Upload */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 - JOB */}
      {step === 2 && (
        <div className="row g-3">
          {/* LEFT STEP */}
          <div className="col-md-3">
            <div
              className="card shadow-sm border-0 p-3 sticky-top"
              style={{ top: "20px" }}
            >
              <h6 className="mb-3 text-primary">Step Progress</h6>

              <div className="d-flex flex-column gap-2">
                <div
                  className={`p-2 rounded ${step === 1 ? "bg-light" : "bg-light"}`}
                >
                  1. Personal Info
                </div>

                <div
                  className={`p-2 rounded ${step === 2 ? "bg-success text-white" : "bg-light"}`}
                >
                  2. Job Info
                </div>

                <div className="p-2 rounded bg-light">3. Academic</div>

                <div className="p-2 rounded bg-light">4. Documents</div>
              </div>
            </div>
          </div>
          {/* RIGHT SIDE FORM */}
          <div className="col-md-9">
            <div className="card">
              <div className="card-header bg-gradient bg-success text-white">
                <h5 className="mb-0">Job Information</h5>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  {/* Faculty Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Faculty Name
                    </label>
                    <input
                      className="form-control"
                      name="faculty"
                      value={info.faculty}
                      onChange={handleChange}
                      placeholder="Faculty Name"
                    />
                  </div>
                  {/* def Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Department Name
                    </label>
                    <input
                      className="form-control"
                      name="department"
                      value={info.department}
                      onChange={handleChange}
                      placeholder="CSE/EEE/GED etc"
                    />
                  </div>
                  {/* designation Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Designation
                    </label>
                    <input
                      className="form-control"
                      name="designation"
                      value={info.designation}
                      onChange={handleChange}
                      placeholder="Lecturer/Cordinator"
                    />
                  </div>
                  {/* designation Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Joining Date
                    </label>
                    <input
                      className="form-control"
                      type="date"
                      name="joiningDate"
                      value={info.joiningDate}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Department */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Employment Type
                    </label>
                    <select
                      className="form-select"
                      name="employmentType"
                      value={info.employmentType}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Half-time">Half-time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="row g-3">
          <div className="col-md-3">
            <div
              className="card shadow-sm border-0 p-3 sticky-top"
              style={{ top: "20px" }}
            >
              <h6 className="mb-3 text-primary">Step Progress</h6>

              <div className="d-flex flex-column gap-2">
                <div className="p-2 rounded bg-light">1. Personal Info</div>
                <div className="p-2 rounded bg-light">2. Job Info</div>

                <div className="p-2 rounded bg-warning text-white">
                  3. Academic
                </div>

                <div className="p-2 rounded bg-light">4. Documents</div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="col-md-9">
            <div className="card shadow border-0">
              <div className="card-header bg-gradient bg-warning text-dark">
                <h5 className="mb-0">Academic Information</h5>
              </div>

              <div className="card-body">
                <div className="row g-4">
                  {/* Qualification */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Degree Name
                    </label>
                    <input
                      className="form-control"
                      name="degreeName"
                      value={info.degreeName}
                      onChange={handleChange}
                      placeholder="eg. BSc in CSE"
                    />
                  </div>
                  {/* Uni */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      University Name
                    </label>
                    <input
                      className="form-control"
                      name="university"
                      value={info.university}
                      onChange={handleChange}
                      placeholder="Enter University Name"
                    />
                  </div>
                  {/* deg */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Subject / Major
                    </label>
                    <input
                      className="form-control"
                      name="subject"
                      value={info.subject}
                      onChange={handleChange}
                      placeholder="eg. Computer Science"
                    />
                  </div>
                  {/* year */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Passing Year
                    </label>
                    <input
                      className="form-control"
                      name="passingYear"
                      value={info.passingYear}
                      onChange={handleChange}
                      placeholder="passing year"
                    />
                  </div>
                  {/*cg */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Obtained CGPA / GPA
                    </label>
                    <input
                      className="form-control"
                      name="cgpa"
                      value={info.cgpa}
                      onChange={handleChange}
                      placeholder="eg. 3.75"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Teaching Experience (in years)
                    </label>
                    <input
                      className="form-control"
                      name="teachingExperience"
                      value={info.teachingExperience}
                      onChange={handleChange}
                      placeholder="eg. 2 years"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Achievements / Honors
                    </label>
                    <input
                      className="form-control"
                      name="achievements"
                      value={info.achievements}
                      onChange={handleChange}
                      placeholder="eg. Best Teacher Award 2020"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="row g-3">
          {/* LEFT STEP PANEL */}
          <div className="col-md-3">
            <div
              className="card shadow-sm border-0 p-3 sticky-top"
              style={{ top: "20px" }}
            >
              <h6 className="mb-3 text-primary">Step Progress</h6>

              <div className="d-flex flex-column gap-2">
                <div className="p-2 rounded bg-light">1. Personal Info</div>
                <div className="p-2 rounded bg-light">2. Job Info</div>
                <div className="p-2 rounded bg-light">3. Academic</div>

                <div className="p-2 rounded bg-dark text-white">
                  4. Documents
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="card shadow border-0">
              <div className="card-header bg-gradient bg-dark text-white">
                <h5 className="mb-0">Documents</h5>
              </div>

              <div className="card-body">
                <div className="row g-4">
                  {/* NID */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">NID Copy</label>
                    <input
                      type="file"
                      name="nidCopy"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                  {/* certificates */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Academic Certificats
                    </label>
                    <input
                      type="file"
                      name="certificates"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                  {/* resume */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Resume Copy
                    </label>
                    <input
                      type="file"
                      name="resume"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                  {/* appointmentLetter */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Appointment Letter
                    </label>
                    <input
                      type="file"
                      name="appointmentLetter"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                  {/* experienceCert */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Experience Certificate
                    </label>
                    <input
                      type="file"
                      name="experienceCert"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <div className="d-flex justify-content-between mt-4">
        {step > 1 ? (
          <button className="btn btn-secondary" onClick={prevStep}>
            <IoMdArrowBack /> Back
          </button>
        ) : (
          <div />
        )}
        {step < 4 ? (
          <button className="btn btn-primary" onClick={nextStep}>
            Next <GrFormNextLink />
          </button>
        ) : (
          <button className="btn btn-success" onClick={handleSave}>
            Save Teacher
          </button>
        )}
      </div>
    </div>
  );
};

export default TeacherInformationForm;
