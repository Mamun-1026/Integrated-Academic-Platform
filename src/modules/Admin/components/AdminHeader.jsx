import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate(); // ✅ define navigate here

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/"); // now it will go to the login page
  };

  return (
    <header
      style={{
        background: "#ff4d4d",
        padding: "12px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h4 style={{ margin: "auto 0" }}>Admin Panel</h4>
      <button className="btn btn-light" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
