import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header
      style={{
        background: "#ff4d4d",
        padding: "12px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
