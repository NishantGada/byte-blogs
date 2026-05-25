import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spacer,
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
    <Container maxW="1200px" py={{ base: 6, md: 8 }} px={{ base: 4, md: 8 }}>
      <Flex
        align={{ base: "stretch", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={3}
        mb={8}
      >
        <Heading size="lg">Welcome, Nishant!</Heading>
        <Spacer />
        <Flex gap={3} wrap="wrap">
          {location.pathname !== "/admin/create" && (
            <Button as={Link} to="/admin/create" variant="outline" colorScheme="gray">
              Write a Blog
            </Button>
          )}
          {location.pathname !== "/admin" && (
            <Button as={Link} to="/admin" variant="outline" colorScheme="gray">
              View Blogs
            </Button>
          )}
          <Button onClick={handleLogout} variant="ghost" colorScheme="gray">
            Logout
          </Button>
        </Flex>
      </Flex>

      <Box
        bg="bg.surface"
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="lg"
        p={{ base: 4, md: 6 }}
      >
        <Routes>
          <Route path="create" element={<CreateBlog />} />
          <Route path="/" element={<ViewBlogs />} />
          <Route path="edit/:id" element={<EditBlog />} />
        </Routes>
      </Box>
    </Container>
  );
};

export default AdminDashboardPage;
