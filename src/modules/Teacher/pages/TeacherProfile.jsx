import { useEffect, useState } from "react";

const TeacherProfile = ({ teacherId }) => {
  const [info, setInfo] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // NEW: document preview modal
  const [docPreview, setDocPreview] = useState(null);

  useEffect(() => {
    const id = teacherId || localStorage.getItem("teacherId");
    if (!id) return;

    // const data = JSON.parse(localStorage.getItem("teacherInfo_" + id) || "{}");
    let data = {};
    try {
      data = JSON.parse(localStorage.getItem("teacherInfo_" + id)) || {};
    } catch {
      data = {};
    }
    setInfo(data);

    // const img =
    //   data.profilePhoto || localStorage.getItem("teacherProfile_" + id);
    const img =
      data.profilePhoto || localStorage.getItem("profileImage_" + id) || "";

    setProfileImage(img || "/defaultFace.webp");
  }, [teacherId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setProfileImage(imageData);

      const id = teacherId || localStorage.getItem("teacherId");
      if (!id) return;

      // const updated = { ...info, profilePhoto: imageData };
      // setInfo(updated);

      // localStorage.setItem("teacherInfo_" + id, JSON.stringify(updated));
      // localStorage.setItem("teacherProfile_" + id, imageData);
      const updated = {
        ...info,
        profilePhoto: imageData,
        updatedAt: new Date().toLocaleString(),
      };

      setInfo(updated);

      localStorage.setItem("teacherInfo_" + id, JSON.stringify(updated));
      localStorage.setItem("profileImage_" + id, imageData);

      window.dispatchEvent(new Event("profileUpdate"));
    };
    reader.readAsDataURL(file);
  };

  const Item = ({ label, value, color }) => (
    <div className="col-md-6 col-lg-4 mb-3">
      <div
        className="p-3 rounded-4 shadow-sm h-100"
        style={{
          background: "linear-gradient(135deg,#ffffff,#f8f9ff)",
          borderLeft: `5px solid ${color}`,
        }}
      >
        <small className="text-muted">{label}</small>
        <div className="fw-semibold mt-1">{value || "-"}</div>
      </div>
    </div>
  );

  const Section = ({ title, color, children }) => (
    <div className="mb-5">
      <h5 className="fw-bold mb-3" style={{ color }}>
        {title}
      </h5>
      <div className="row">{children}</div>
    </div>
  );

  return (
    <div style={{ background: "#f3f6ff", minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg,#1e3c72,#2a5298,#4f46e5)",
          color: "white",
          padding: "45px 20px",
          borderBottomLeftRadius: "35px",
          borderBottomRightRadius: "35px",
        }}
      >
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold">👨‍🏫 Teacher Profile</h2>
            <p className="mb-0 opacity-75">
              University Faculty Management System
            </p>
          </div>

          <div className="mt-3 mt-md-0 text-md-end">
            <div className="fw-semibold">ID: {info.teacherId || "-"}</div>
            <span className="badge bg-light text-dark mt-1 px-3 py-2 rounded-pill">
              Faculty Member
            </span>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* PROFILE + QUICK INFO */}
        <div className="row g-4 mb-4">
          {/* PROFILE */}
          <div className="col-lg-4">
            <div
              className="p-4 text-center rounded-4 shadow-lg"
              style={{
                background: "white",
                marginTop: "-70px",
                borderTop: "4px solid #1e3c72",
              }}
            >
              <img
                src={profileImage || "/defaultFace.webp"}
                alt="profile"
                onClick={() => setShowModal(true)}
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "5px solid #1e3c72",
                  cursor: "pointer",
                }}
              />

              <h4 className="fw-bold mt-3">
                {info.fullName || "Teacher Name"}
              </h4>

              <p className="text-muted mb-2">
                {info.designation || "Designation"}
              </p>

              <label className="btn btn-sm btn-outline-primary rounded-pill">
                Change Photo
                <input type="file" hidden onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* QUICK OVERVIEW */}
          <div className="col-lg-8">
            <div
              className="p-4 rounded-4 shadow-lg h-100"
              style={{
                background: "linear-gradient(135deg,#ffffff,#eef2ff)",
              }}
            >
              <h5 className="fw-bold mb-3">📊 Quick Overview</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm">
                    <div className="text-muted small">Department</div>
                    <div className="fw-bold text-primary">
                      {info.department || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm">
                    <div className="text-muted small">Faculty</div>
                    <div className="fw-bold text-danger">
                      {info.faculty || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm">
                    <div className="text-muted small">Joining Date</div>
                    <div className="fw-bold text-success">
                      {info.joiningDate || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm">
                    <div className="text-muted small">Employment Type</div>
                    <div className="fw-bold text-warning">
                      {info.employmentType || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        <Section title="Personal Information" color="#1e3c72">
          <Item label="Full Name" value={info.fullName} color="#1e3c72" />
          <Item label="Teacher ID" value={info.teacherId} color="#ef4444" />
          <Item label="Email" value={info.email} color="#22c55e" />
          <Item label="Mobile" value={info.mobile} color="#06b6d4" />
          <Item label="Gender" value={info.gender} color="#8b5cf6" />
          <Item label="Date of Birth" value={info.dob} color="#f59e0b" />
        </Section>

        <Section title="Job Information" color="#ef4444">
          <Item label="Designation" value={info.designation} color="#ef4444" />
          <Item label="Department" value={info.department} color="#ec4899" />
          <Item label="Faculty" value={info.faculty} color="#f97316" />
          <Item label="Joining Date" value={info.joiningDate} color="#14b8a6" />
          <Item
            label="Employment Type"
            value={info.employmentType}
            color="#0ea5e9"
          />
        </Section>

        <Section title="Academic Information" color="#22c55e">
          <Item
            label="Qualification"
            value={info.qualification}
            color="#22c55e"
          />
          <Item label="University" value={info.university} color="#4f46e5" />
          <Item label="Degree" value={info.degree} color="#f59e0b" />
          <Item label="Passing Year" value={info.passingYear} color="#ef4444" />
          <Item label="CGPA" value={info.cgpa} color="#06b6d4" />
        </Section>

        {/* DOCUMENTS (CLICKABLE) */}
        <Section title="Documents (Click to View)" color="#8b5cf6">
          {[
            { label: "NID Copy", file: info.nidCopy },
            { label: "Certificates", file: info.certificates },
            { label: "Resume", file: info.resume },
            { label: "Appointment Letter", file: info.appointmentLetter },
            { label: "Experience Certificate", file: info.experienceCert },
          ].map((doc, i) => (
            <div key={i} className="col-md-6 col-lg-4 mb-3">
              <div
                onClick={() => doc.file && setDocPreview(doc.file)}
                className="p-3 rounded-4 shadow-sm h-100"
                style={{
                  background: "linear-gradient(135deg,#fff,#f8f9ff)",
                  borderLeft: "5px solid #8b5cf6",
                  cursor: doc.file ? "pointer" : "not-allowed",
                  opacity: doc.file ? 1 : 0.5,
                }}
              >
                <small className="text-muted">{doc.label}</small>
                <div className="fw-semibold mt-1">
                  {doc.file ? "Click to View" : "Not Uploaded"}
                </div>
              </div>
            </div>
          ))}
        </Section>

        {/* MODAL PROFILE */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowModal(false)}
          >
            <img
              src={profileImage || "/defaultFace.webp"}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "20px",
              }}
            />
          </div>
        )}

        {/* MODAL DOCUMENT */}
        {docPreview && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.9)" }}
            onClick={() => setDocPreview(null)}
          >
            {docPreview?.includes("data:application/pdf") ? (
              <iframe
                src={docPreview}
                style={{ width: "80%", height: "90%", border: "none" }}
              />
            ) : (
              <img
                src={docPreview}
                style={{ maxWidth: "90%", maxHeight: "90%" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
