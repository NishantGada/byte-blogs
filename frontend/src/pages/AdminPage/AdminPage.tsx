import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer
} from "@chakra-ui/react";
import { useContext } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CreateBlog from "../CreateBlog/CreateBlog";
import EditBlog from "../EditBlog/EditBlog";
import ViewBlogs from "../ViewBlogs/ViewBlogs";

const AdminDashboardPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box p={8} bg="white" minH="100vh">
      {/* Header */}
      <Flex align="center" mb={6} columnGap={4}>
        <Heading size="lg" color="black">
          Welcome, Nishant!
        </Heading>
        <Spacer />
        {location.pathname !== "/admin/create" && (
          <Button
            as={Link}
            to="/admin/create"
            colorScheme="gray"
            variant="solid"
          >
            Write a Blog
          </Button>
        )}
        {location.pathname !== "/admin" && (
          <Button
            as={Link}
            to="/admin"
            colorScheme="gray"
            variant="solid"
          >
            View Blogs
          </Button>
        )}
        <Button
          onClick={handleLogout}
          variant="outline"
          borderColor="black"
          color="black"
          _hover={{ bg: "black", color: "white" }}
        >
          Logout
        </Button>
      </Flex>

      <Box border="1px solid #e6e6e6" borderRadius="md" p={6}>
        <Routes>
          <Route path="create" element={<CreateBlog />} />
          <Route path="/" element={<ViewBlogs />} />
          <Route path="edit/:id" element={<EditBlog />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
