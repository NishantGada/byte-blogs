import React, { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CreateBlog from "../CreateBlog/CreateBlog";
import EditBlog from "../EditBlog/EditBlog";
import ViewBlogs from "../ViewBlogs/ViewBlogs";

const AdminDashboardPage: React.FC = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/admin/create" style={{ marginRight: "1rem" }}>
          Create Blog
        </Link>
        <Link to="/admin/view">View Blogs</Link>
        <button
          style={{ marginLeft: "2rem" }}
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </nav>

      <Routes>
        <Route path="create" element={<CreateBlog />} />
        <Route path="view" element={<ViewBlogs />} />
        <Route path="edit/:id" element={<EditBlog />} />
      </Routes>
    </div>
  );
};

export default AdminDashboardPage;
