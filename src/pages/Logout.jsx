import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken"); // Remove token on logout
    navigate("/login");
    window.location.reload(); // Reload to update navbar
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
