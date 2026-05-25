import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SendRequest from "../../api/SendRequest";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  useToast,
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
  const toast = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await SendRequest("/api/blogs", {}, "GET", {
        Authorization: `Bearer ${token}`,
      });
      setBlogs(res.data);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to load blogs",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await SendRequest(`/api/blogs/${pendingDeleteId}`, {}, "DELETE", {
        Authorization: `Bearer ${token}`,
      });
      toast({
        title: "Blog deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setBlogs(blogs.filter((b) => b.id !== pendingDeleteId));
      setPendingDeleteId(null);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to delete blog",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

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
      <Heading size="lg" textAlign="left" mb={8}>
        Your Blogs
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
                        onClick={() => setPendingDeleteId(blog.id)}
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

      <AlertDialog
        isOpen={pendingDeleteId !== null}
        leastDestructiveRef={cancelRef as React.RefObject<HTMLButtonElement>}
        onClose={() => setPendingDeleteId(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete blog
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setPendingDeleteId(null)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                isLoading={deleting}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ViewBlogs;
