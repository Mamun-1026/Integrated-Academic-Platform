import { useEffect, useState } from "react";

const AdminAdmitCardManager = () => {
  const [students, setStudents] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);

  const [filters, setFilters] = useState({
    department: "All",
    batch: "All",
    section: "All",
  });

  // LOAD DATA
  useEffect(() => {
    const loadData = () => {
      const s = JSON.parse(localStorage.getItem("students") || "[]");
      const c = JSON.parse(localStorage.getItem("admitCards") || "[]");

      setStudents(s);
      setAdmitCards(c);
    };

    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("admitCardsUpdated", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("admitCardsUpdated", loadData);
    };
  }, []);

  // CHECK ELIGIBILITY
  const isEligible = (student) => {
    const bills = JSON.parse(
      localStorage.getItem("billHistory_" + student.studentId) || "[]",
    );

    // ❗ must have bill history
    if (!Array.isArray(bills) || bills.length === 0) {
      return false;
    }

    let totalDue = 0;
    bills.forEach((b) => {
      totalDue += b.due || 0;
    });

    return totalDue === 0;
  };

  // FILTER STUDENTS
  const getFilteredStudents = () => {
    return students.filter((s) => {
      return (
        isEligible(s) &&
        (filters.department === "All" || s.department === filters.department) &&
        (filters.batch === "All" || s.batch === filters.batch) &&
        (filters.section === "All" || s.section === filters.section)
      );
    });
  };

  // GENERATE ADMIT CARDS
  const generateAdmitCards = () => {
    const existing = JSON.parse(localStorage.getItem("admitCards") || "[]");

    const eligible = getFilteredStudents();

    const existingIds = new Set(
      existing.map((c) => String(c.studentId).trim()),
    );

    const newCards = eligible
      .filter((s) => !existingIds.has(String(s.studentId).trim()))
      .map((s, i) => ({
        studentId: String(s.studentId).trim(),
        name: s.name,
        department: s.department,
        batch: s.batch,
        section: s.section,
        exam: "Mid Term 2026",
        roll: 1000 + existing.length + i + 1,
      }));

    const updated = [...existing, ...newCards];

    setAdmitCards(updated);
    localStorage.setItem("admitCards", JSON.stringify(updated));

    // notify student panels
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("admitCardsUpdated"));

    alert(`Admit Cards Generated for ${newCards.length} students`);
  };

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-0">🎓 Admit Card Manager</h3>
            <small className="text-muted">
              Manage student eligibility & generate admit cards
            </small>
          </div>

          <button className="btn btn-success px-4" onClick={generateAdmitCards}>
            Generate Admit Cards
          </button>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h6 className="mb-3 text-primary">Filter Students</h6>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Department</label>
              <select
                className="form-select"
                value={filters.department}
                onChange={(e) =>
                  setFilters({ ...filters, department: e.target.value })
                }
              >
                <option value="All">All</option>
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="BBA">BBA</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Batch</label>
              <select
                className="form-select"
                value={filters.batch}
                onChange={(e) =>
                  setFilters({ ...filters, batch: e.target.value })
                }
              >
                <option value="All">All</option>
                <option value="65">65</option>
                <option value="66">66</option>
                <option value="67">67</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Section</label>
              <select
                className="form-select"
                value={filters.section}
                onChange={(e) =>
                  setFilters({ ...filters, section: e.target.value })
                }
              >
                <option value="All">All</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="card shadow border-0">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Generated Admit Cards</h5>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Dept</th>
                  <th>Batch</th>
                  <th>Section</th>
                  <th>Roll</th>
                </tr>
              </thead>

              <tbody>
                {admitCards.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No Admit Cards Generated Yet
                    </td>
                  </tr>
                ) : (
                  admitCards.map((c, i) => (
                    <tr key={i}>
                      <td className="fw-semibold">{c.name}</td>
                      <td>{c.studentId}</td>
                      <td>
                        <span className="badge bg-primary">{c.department}</span>
                      </td>
                      <td>{c.batch}</td>
                      <td>{c.section}</td>
                      <td>
                        <span className="badge bg-dark">{c.roll}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAdmitCardManager;
