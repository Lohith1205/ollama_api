import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBook, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Student Exam Dashboard</h1>
      <div className="flex space-x-4">
        {!isAuthenticated ? (
          <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded">Login</Link>
        ) : (
          <>
            <Link to="/" className="flex items-center space-x-1">
              <FaHome /> <span>Home</span>
            </Link>
            <Link to="/exams" className="flex items-center space-x-1">
              <FaBook /> <span>Exams</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded">
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
