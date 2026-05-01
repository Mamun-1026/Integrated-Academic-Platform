import { useEffect, useState } from "react";

const Profile = () => {
  const [info, setInfo] = useState({});
  const [studentId, setStudentId] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setStudentId(userId);

    const data = JSON.parse(
      localStorage.getItem("studentInfo_" + userId) || "{}",
    );
    setInfo(data || {});

    const img = localStorage.getItem("profileImage_" + userId);
    setProfileImage(img || "/defaultFace.webp");
  }, []);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader(); // ✅ FIXED (this was missing)

    reader.onload = (event) => {
      const imageData = event.target.result;

      setProfileImage(imageData);

      const userId = localStorage.getItem("userId");
      if (userId) {
        localStorage.setItem("profileImage_" + userId, imageData);
        window.dispatchEvent(new Event("profileUpdate"));
      }
    };

    reader.readAsDataURL(file);
  };
  const Item = ({ label, value, color }) => (
    <div className="col-md-6 col-lg-4 mb-3">
      <div
        className="p-3 rounded-4 shadow-sm h-100"
        style={{
          background: "linear-gradient(135deg,#ffffff,#f8f9ff)",
          borderLeft: `4px solid ${color}`,
        }}
      >
        <small className="text-muted">{label}</small>
        <div className="fw-semibold mt-1">{value || "-"}</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#f4f6ff", minHeight: "100vh" }}>
      {/* HEADER BANNER */}
      <div
        style={{
          background: "linear-gradient(135deg,#4f46e5,#ef4444)",
          color: "white",
          padding: "40px 20px",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div>
            <h2 className="fw-bold">🎓 Student Profile</h2>
            <p className="mb-0 opacity-75">
              University Academic Information Portal
            </p>
          </div>

          <div className="mt-3 mt-md-0 text-md-end">
            <div className="fw-semibold">ID: {studentId}</div>
            <span className="badge bg-light text-dark mt-1">
              Active Student
            </span>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* PROFILE CARD */}
        <div className="row g-4 align-items-stretch mb-4">
          <div className="col-lg-4">
            <div
              className="p-4 text-center rounded-4 shadow-lg"
              style={{
                background: "white",
                marginTop: "-60px",
              }}
            >
              <img
                src={profileImage}
                alt="profile"
                onClick={() => setShowModal(true)}
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "5px solid #4f46e5",
                  cursor: "pointer",
                }}
              />

              <h4 className="fw-bold mt-3 text-dark">
                {info.firstName
                  ? `${info.firstName} ${info.lastName}`
                  : "Student Name"}
              </h4>

              <p className="text-muted mb-2">
                {info.department || "Department"}
              </p>

              <label className="btn btn-sm btn-outline-primary rounded-pill">
                Change Photo
                <input type="file" hidden onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="col-lg-8">
            <div
              className="p-4 rounded-4 shadow-lg h-100"
              style={{
                background: "linear-gradient(135deg,#ffffff,#eef2ff)",
              }}
            >
              <h5 className="fw-bold mb-3">Quick Overview</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm">
                    <div className="text-muted small">University</div>
                    <div className="fw-bold text-primary">
                      {info.university || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm">
                    <div className="text-muted small">Semester</div>
                    <div className="fw-bold text-danger">
                      {info.semester || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm">
                    <div className="text-muted small">Batch</div>
                    <div className="fw-bold text-success">
                      {info.batch || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm">
                    <div className="text-muted small">Section</div>
                    <div className="fw-bold text-warning">
                      {info.section || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        <Section title="Personal Information" color="#4f46e5">
          <Item label="Date of Birth" value={info.dob} color="#4f46e5" />
          <Item label="Religion" value={info.religion} color="#ef4444" />
          <Item label="Nationality" value={info.nationality} color="#22c55e" />
          <Item label="Blood Group" value={info.bloodGroup} color="#f59e0b" />
          <Item label="Mobile" value={info.mobile} color="#06b6d4" />
          <Item label="Gender" value={info.gender} color="#8b5cf6" />
        </Section>

        <Section title="Parent Information" color="#ef4444">
          <Item label="Father Name" value={info.fatherName} color="#ef4444" />
          <Item label="Mother Name" value={info.motherName} color="#ec4899" />
          <Item label="Father Phone" value={info.fatherPhone} color="#f97316" />
          <Item label="Mother Phone" value={info.motherPhone} color="#14b8a6" />
        </Section>

        <Section title="Address" color="#22c55e">
          <Item
            label="Permanent Address"
            value={`${info.permanentAddress?.division || "-"}, ${
              info.permanentAddress?.thana || "-"
            }, ${info.permanentAddress?.district || "-"}`}
            color="#22c55e"
          />
          <Item
            label="Present Address"
            value={`${info.presentAddress?.division || "-"}, ${
              info.presentAddress?.thana || "-"
            }, ${info.presentAddress?.district || "-"}`}
            color="#0ea5e9"
          />
        </Section>

        {/* MODAL */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowModal(false)}
          >
            <img
              src={profileImage}
              alt="profile"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "20px",
                boxShadow: "0 0 30px rgba(255,255,255,0.2)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* helper section wrapper */
const Section = ({ title, color, children }) => (
  <div className="mb-4">
    <h5 className="fw-bold mb-3" style={{ color }}>
      {title}
    </h5>
    <div className="row">{children}</div>
  </div>
);

export default Profile;
