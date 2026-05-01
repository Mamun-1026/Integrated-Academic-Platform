import { useState, useEffect } from "react";
const StudentInformationForm = ({ studentId, shouldLoad }) => {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    religion: "Islam",
    nationality: "Bangladeshi",
    gender: "Male",
    bloodGroup: "",
    mobile: "",
    maritalStatus: "Single",
    picture: null,
    university: "",
    department: "CSE",
    batch: "65",
    section: "A",
    enrollmentYear: "",
    semester: "Spring",
    fatherName: "",
    motherName: "",
    fatherPhone: "",
    motherPhone: "",
    fatherIncome: "",
    motherIncome: "",
    fatherProfession: "",
    motherProfession: "",
    permanentAddress: {
      division: "",
      thana: "",
      district: "",
      postOffice: "",
      road: "",
    },
    presentAddress: {
      division: "",
      thana: "",
      district: "",
      postOffice: "",
      road: "",
    },
    createdAt: "", // ← add this
    updatedAt: "", // ← add this
  });
  const compressImage = (file, quality = 0.6) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const MAX_WIDTH = 300;
          const scale = MAX_WIDTH / img.width;

          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        };
      };

      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (!shouldLoad) return;

    const data = JSON.parse(
      localStorage.getItem("studentInfo_" + studentId) || "null",
    );

    if (data) {
      setInfo(data);
    }

    // ✅ ADD THIS PART
    const img = localStorage.getItem("profileImage_" + studentId);
    if (img) {
      setInfo((prev) => ({
        ...prev,
        picture: img,
      }));
    }
  }, [studentId, shouldLoad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setInfo((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setInfo((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressedImage = await compressImage(file, 0.6);

    const now = new Date().toLocaleString();

    setInfo((prev) => {
      const updated = {
        ...prev,
        picture: compressedImage, // optional but useful for UI preview
        updatedAt: now,
      };

      // save only lightweight data
      localStorage.setItem("studentInfo_" + studentId, JSON.stringify(updated));

      // save image separately
      localStorage.setItem("profileImage_" + studentId, compressedImage);

      return updated;
    });

    // optional but safe (UI sync)
    window.dispatchEvent(new Event("storage"));
  };

  const handleNext = () => {
    if (step === 2) {
      if (!info.department) setInfo((prev) => ({ ...prev, department: "CSE" }));
      if (!info.semester) setInfo((prev) => ({ ...prev, semester: "Spring" }));
    }
    if (step === 4) {
      if (!info.permanentAddress) {
        setInfo((prev) => ({
          ...prev,
          permanentAddress: {
            division: "",
            thana: "",
            district: "",
            postOffice: "",
            road: "",
          },
        }));
      }
      if (!info.presentAddress) {
        setInfo((prev) => ({
          ...prev,
          presentAddress: {
            division: "",
            thana: "",
            district: "",
            postOffice: "",
            road: "",
          },
        }));
      }
    }
    setStep((s) => Math.min(s + 1, 4));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  const handleSave = () => {
    const now = new Date().toLocaleString();

    const finalInfo = {
      ...info,
      picture: info.picture || null,
      createdAt: info.createdAt || now,
      updatedAt: now,
    };

    localStorage.setItem("studentInfo_" + studentId, JSON.stringify(finalInfo));

    setInfo(finalInfo);

    alert("Student information saved!");
  };
  return (
    <div className="section-box">
      {" "}
      {info.createdAt && (
        <div className="mb-2 text-muted">
          Created At: {info.createdAt} | Last Updated: {info.updatedAt}
        </div>
      )}
      <h5 className="mb-3">Step {step}</h5> {/* Step 1: Student Info */}{" "}
      {step === 1 && (
        <div className="row g-3">
          {/* LEFT SIDE STEP INFO */}
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
                  2. University Info
                </div>

                <div
                  className={`p-2 rounded ${step === 3 ? "bg-primary text-white" : "bg-light"}`}
                >
                  3. Parent Info
                </div>

                <div
                  className={`p-2 rounded ${step === 4 ? "bg-primary text-white" : "bg-light"}`}
                >
                  4. Address
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="col-md-9">
            <div className="card shadow border-0">
              <div className="card-header bg-gradient bg-primary text-white">
                <h5 className="mb-0">Personal Information</h5>
              </div>

              <div className="card-body">
                <div className="row g-4">
                  {/* First Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      className="form-control"
                      name="firstName"
                      value={info.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      className="form-control"
                      name="lastName"
                      value={info.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
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

                  {/* Religion */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Religion</label>
                    <select
                      className="form-select"
                      name="religion"
                      value={info.religion}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Islam">Islam</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddho">Buddho</option>
                      <option value="Christian">Christian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Nationality */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Nationality
                    </label>
                    <select
                      className="form-select"
                      name="nationality"
                      value={info.nationality}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Bangladeshi">Bangladeshi</option>
                      <option value="Indian">Indian</option>
                      <option value="Other">Other</option>
                    </select>
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

                  {/* Marital */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Marital Status
                    </label>
                    <select
                      className="form-select"
                      name="maritalStatus"
                      value={info.maritalStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Upload */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Step 2: University Info */}{" "}
      {step === 2 && (
        <div className="row g-3">
          {/* LEFT SIDE STEP VIEW (same style as step 1) */}
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
                  2. University Info
                </div>

                <div className="p-2 rounded bg-light">3. Parent Info</div>

                <div className="p-2 rounded bg-light">4. Address</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="col-md-9">
            <div className="card shadow border-0">
              <div className="card-header bg-gradient bg-success text-white">
                <h5 className="mb-0">University Information</h5>
              </div>

              <div className="card-body">
                <div className="row g-4">
                  {/* University Name */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      University Name
                    </label>
                    <input
                      className="form-control"
                      name="university"
                      value={info.university}
                      onChange={handleChange}
                      placeholder="Enter university name"
                    />
                  </div>

                  {/* Department */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Department</label>
                    <select
                      className="form-select"
                      name="department"
                      value={info.department}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      <option value="CSE">CSE</option>
                      <option value="EEE">EEE</option>
                      <option value="Business">Business</option>
                      <option value="Law">Law</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Batch */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Batch</label>
                    <input
                      type="number"
                      className="form-control"
                      name="batch"
                      value={info.batch}
                      onChange={handleChange}
                      placeholder="e.g. 2023"
                    />
                  </div>

                  {/* Section */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Section</label>
                    <select
                      className="form-select"
                      name="section"
                      value={info.section}
                      onChange={handleChange}
                    >
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>

                  {/* Enrollment Year */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Enrollment Year
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="enrollmentYear"
                      value={info.enrollmentYear}
                      onChange={handleChange}
                      placeholder="e.g. 2024"
                    />
                  </div>

                  {/* Semester */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Semester</label>
                    <select
                      className="form-select"
                      name="semester"
                      value={info.semester}
                      onChange={handleChange}
                    >
                      <option value="">Select Semester</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Fall">Fall</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Step 3: Parent Info */}{" "}
      {step === 3 && (
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
                <div className="p-2 rounded bg-light">2. University Info</div>

                <div className="p-2 rounded bg-warning text-white">
                  3. Parent Info
                </div>

                <div className="p-2 rounded bg-light">4. Address</div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="col-md-9">
            <div className="card shadow border-0">
              <div className="card-header bg-gradient bg-warning text-dark">
                <h5 className="mb-0">Parent Information</h5>
              </div>

              <div className="card-body">
                <div className="row g-4">
                  {/* Father Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Father Name
                    </label>
                    <input
                      className="form-control"
                      name="fatherName"
                      value={info.fatherName}
                      onChange={handleChange}
                      placeholder="Enter father's name"
                    />
                  </div>

                  {/* Mother Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Mother Name
                    </label>
                    <input
                      className="form-control"
                      name="motherName"
                      value={info.motherName}
                      onChange={handleChange}
                      placeholder="Enter mother's name"
                    />
                  </div>

                  {/* Father Phone */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Father Phone
                    </label>
                    <input
                      className="form-control"
                      name="fatherPhone"
                      value={info.fatherPhone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>

                  {/* Mother Phone */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Mother Phone
                    </label>
                    <input
                      className="form-control"
                      name="motherPhone"
                      value={info.motherPhone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>

                  {/* Father Income */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Father Yearly Income
                    </label>
                    <input
                      className="form-control"
                      name="fatherIncome"
                      value={info.fatherIncome}
                      onChange={handleChange}
                      placeholder="e.g. 500000"
                    />
                  </div>

                  {/* Mother Income */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Mother Yearly Income
                    </label>
                    <input
                      className="form-control"
                      name="motherIncome"
                      value={info.motherIncome}
                      onChange={handleChange}
                      placeholder="e.g. 300000"
                    />
                  </div>

                  {/* Father Profession */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Father Profession
                    </label>
                    <input
                      className="form-control"
                      name="fatherProfession"
                      value={info.fatherProfession}
                      onChange={handleChange}
                      placeholder="e.g. Teacher / Business"
                    />
                  </div>

                  {/* Mother Profession */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Mother Profession
                    </label>
                    <input
                      className="form-control"
                      name="motherProfession"
                      value={info.motherProfession}
                      onChange={handleChange}
                      placeholder="e.g. Housewife / Doctor"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Step 4: Address */}{" "}
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
                <div className="p-2 rounded bg-light">2. University Info</div>
                <div className="p-2 rounded bg-light">3. Parent Info</div>

                <div className="p-2 rounded bg-dark text-white">4. Address</div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="col-md-9">
            <div className="card shadow border-0">
              <div className="card-header bg-gradient bg-dark text-white">
                <h5 className="mb-0">Address Information</h5>
              </div>

              <div className="card-body">
                {/* PERMANENT ADDRESS */}
                <div className="mb-4">
                  <h6 className="text-primary border-bottom pb-2">
                    Permanent Address
                  </h6>

                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Division</label>
                      <input
                        className="form-control"
                        name="permanentAddress.division"
                        value={info.permanentAddress.division}
                        onChange={handleChange}
                        placeholder="Division"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Thana</label>
                      <input
                        className="form-control"
                        name="permanentAddress.thana"
                        value={info.permanentAddress.thana}
                        onChange={handleChange}
                        placeholder="Thana"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">District</label>
                      <input
                        className="form-control"
                        name="permanentAddress.district"
                        value={info.permanentAddress.district}
                        onChange={handleChange}
                        placeholder="District"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Post Office
                      </label>
                      <input
                        className="form-control"
                        name="permanentAddress.postOffice"
                        value={info.permanentAddress.postOffice}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        Road / Street
                      </label>
                      <input
                        className="form-control"
                        name="permanentAddress.road"
                        value={info.permanentAddress.road}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>

                {/* PRESENT ADDRESS */}
                <div>
                  <h6 className="text-success border-bottom pb-2">
                    Present Address
                  </h6>

                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Division</label>
                      <input
                        className="form-control"
                        name="presentAddress.division"
                        value={info.presentAddress.division}
                        onChange={handleChange}
                        placeholder="Division"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Thana</label>
                      <input
                        className="form-control"
                        name="presentAddress.thana"
                        value={info.presentAddress.thana}
                        onChange={handleChange}
                        placeholder="Thana"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">District</label>
                      <input
                        className="form-control"
                        name="presentAddress.district"
                        value={info.presentAddress.district}
                        onChange={handleChange}
                        placeholder="District"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Post Office
                      </label>
                      <input
                        className="form-control"
                        name="presentAddress.postOffice"
                        value={info.presentAddress.postOffice}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        Road / Street
                      </label>
                      <input
                        className="form-control"
                        name="presentAddress.road"
                        value={info.presentAddress.road}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Navigation Buttons */}{" "}
      <div className="d-flex justify-content-between mt-4 p-2 border-top">
        {step > 1 ? (
          <button
            className="btn btn-outline-secondary px-4"
            onClick={handleBack}
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button className="btn btn-primary px-4" onClick={handleNext}>
            Next →
          </button>
        ) : (
          <button className="btn btn-success px-4" onClick={handleSave}>
            Save Student
          </button>
        )}
      </div>
    </div>
  );
};
export default StudentInformationForm;
