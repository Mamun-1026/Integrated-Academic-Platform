import { useState } from "react";
import * as XLSX from "xlsx";
import {
  FaFileExcel,
  FaUpload,
  FaTable,
  FaCloudUploadAlt,
} from "react-icons/fa";

const CreateRoutine = ({ routines, setRoutines }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  // CLEAN FUNCTION (VERY IMPORTANT)
  const clean = (v) =>
    String(v || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

  // HUMAN DAY FORMAT
  const formatDay = (v) => {
    const d = clean(v);
    if (d === "sunday") return "Sunday";
    if (d === "monday") return "Monday";
    if (d === "tuesday") return "Tuesday";
    if (d === "wednesday") return "Wednesday";
    if (d === "thursday") return "Thursday";
    if (d === "friday") return "Friday";
    if (d === "saturday") return "Saturday";
    return v;
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet);

      setPreview(jsonData);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleUpload = async () => {
    if (!preview.length) {
      alert("No data found in file");
      return;
    }

    const newRoutines = preview.map((item) => ({
      department: clean(item.department),
      batch: clean(item.batch),
      section: clean(item.section),
      day: formatDay(item.day),
      time: String(item.time).trim(),
      room: String(item.room || "").trim(),
      courseName: String(item.courseName || "").trim(),
      courseId: clean(
        item.courseId ||
          item.courseID ||
          item.courseid ||
          item["Course ID"] ||
          item["course id"] ||
          item["CourseId"],
      ),
    }));

    try {
      // Send each routine item to the backend database API
      let successCount = 0;
      for (const r of newRoutines) {
        const res = await fetch("http://localhost:5000/api/routines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(r),
        });
        const data = await res.json();
        if (data.success) {
          successCount++;
        }
      }

      const merged = [...routines, ...newRoutines];
      const unique = Array.from(
        new Map(
          merged.map((r) => [
            `${clean(r.department)}-${clean(r.batch)}-${clean(r.section)}-${clean(r.day)}-${clean(r.time)}-${clean(r.courseId)}`,
            r,
          ]),
        ).values(),
      );

      setRoutines(unique);
      localStorage.setItem("routines", JSON.stringify(unique));

      alert(
        `${successCount} routines successfully uploaded and saved to Database!`,
      );

      setFile(null);
      setPreview([]);
    } catch (err) {
      console.error(err);
      alert("Database sync error! Check if server is running.");
    }
  };

  return (
    <div className="container py-3">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-3">
        <FaFileExcel className="text-success fs-4 me-2" />
        <h4 className="mb-0 fw-bold">Routine Upload System</h4>
      </div>

      {/* UPLOAD */}
      <div className="card border-0 shadow-sm p-3 p-md-4 mb-4">
        <div className="d-flex align-items-center mb-2">
          <FaCloudUploadAlt className="text-primary me-2" />
          <h6 className="mb-0">Upload Excel / CSV File</h6>
        </div>

        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          className="form-control"
          onChange={handleFileUpload}
        />

        {file && (
          <div className="mt-2 text-muted small">
            Selected File: <b>{file.name}</b>
          </div>
        )}
      </div>

      {/* PREVIEW */}
      {preview.length > 0 && (
        <div className="card border-0 shadow-sm p-3 p-md-4 mb-4">
          <div className="d-flex align-items-center mb-3">
            <FaTable className="text-primary me-2" />
            <h6 className="mb-0">Preview Data</h6>
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Dept</th>
                  <th>Batch</th>
                  <th>Section</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Course</th>
                </tr>
              </thead>

              <tbody>
                {preview.map((row, i) => (
                  <tr key={i}>
                    <td>{row.department}</td>
                    <td>{row.batch}</td>
                    <td>{row.section}</td>
                    <td>{row.day}</td>
                    <td>{row.time}</td>
                    <td>{row.room}</td>
                    <td>
                      <b>{row.courseName}</b>{" "}
                      <span className="text-muted">({row.courseId})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UPLOAD BUTTON */}
      <div className="d-grid">
        <button
          className="btn btn-success btn-lg d-flex align-items-center justify-content-center gap-2"
          onClick={handleUpload}
          disabled={!preview.length}
        >
          <FaUpload />
          Upload Routine ({preview.length})
        </button>
      </div>

      {/* EMPTY */}
      {!preview.length && (
        <div className="text-center text-muted mt-4">
          Upload an Excel file to preview routine data
        </div>
      )}
    </div>
  );
};

export default CreateRoutine;
