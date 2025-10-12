import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SendRequest from "../../api/SendRequest";
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  VStack,
  Text,
} from "@chakra-ui/react";

interface Blog {
  id: string;
  title: string;
  category: string;
  coverImage?: string;
  content: string;
}

const ViewBlogs: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await SendRequest("/api/blogs", {}, "GET", {
        Authorization: `Bearer ${token}`,
      });
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete blog
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    try {
      await SendRequest(`/api/blogs/${id}`, {}, "DELETE", {
        Authorization: `Bearer ${token}`,
      });
      alert("Blog deleted successfully!");
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog.");
    }
  };

  // Edit blog
  const handleEdit = (id: string) => {
    navigate(`/admin/edit/${id}`);
  };

  if (loading)
    return (
      <Box textAlign="center" mt={8}>
        <Spinner size="xl" />
      </Box>
    );

  return (
    <Box p={6} bg="white" borderRadius="md" minH="60vh">
      <Heading size="lg" textAlign="center" mb={6}>
        View Blogs
      </Heading>

      {blogs.length === 0 ? (
        <Text textAlign="center">No blogs available.</Text>
      ) : (
        <TableContainer>
          <Table variant="simple" colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {blogs.map((blog) => (
                <Tr key={blog.id}>
                  <Td>{blog.title}</Td>
                  <Td>{blog.category}</Td>
                  <Td>
                    <VStack align="stretch" spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="gray"
                        onClick={() => handleEdit(blog.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="gray"
                        onClick={() => handleDelete(blog.id)}
                      >
                        Delete
                      </Button>
                    </VStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ViewBlogs;
