import {
  Box,
  Button,
  Container,
  Flex,
} from "@chakra-ui/react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import CreateBlog from "../CreateBlog/CreateBlog";
import EditBlog from "../EditBlog/EditBlog";
import ViewBlogs from "../ViewBlogs/ViewBlogs";

const AdminDashboardPage = () => {
  const location = useLocation();

  return (
    <Container maxW="1200px" py={{ base: 6, md: 8 }} px={{ base: 4, md: 8 }}>
      <Flex justify="flex-end" gap={3} wrap="wrap" mb={6}>
        {location.pathname !== "/admin/create" && (
          <Button as={Link} to="/admin/create" variant="outline" colorScheme="gray" size="sm">
            Write a Blog
          </Button>
        )}
        {location.pathname !== "/admin" && (
          <Button as={Link} to="/admin" variant="outline" colorScheme="gray" size="sm">
            View Blogs
          </Button>
        )}
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
