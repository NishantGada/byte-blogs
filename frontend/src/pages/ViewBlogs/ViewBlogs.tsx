import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SendRequest from "../../api/SendRequest";
import { formatDate } from "../../utils/FormatDate";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

interface Blog {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
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
  const [search, setSearch] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);

  const visibleBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? blogs.filter((b) => b.title.toLowerCase().includes(query))
      : blogs;
    return [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [blogs, search]);

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
      <Flex
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={6}
      >
        <Heading size="lg">Your Blogs</Heading>
        <InputGroup maxW={{ base: "100%", md: "320px" }}>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="#A0AEC0" />
          </InputLeftElement>
          <Input
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Flex>

      {blogs.length === 0 ? (
        <Text textAlign="center">No blogs available.</Text>
      ) : visibleBlogs.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No blogs match "{search}".
        </Text>
      ) : (
        <TableContainer>
          <Table variant="simple" colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Updated</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {visibleBlogs.map((blog) => (
                <Tr key={blog.id}>
                  <Td>{blog.title}</Td>
                  <Td>{blog.category}</Td>
                  <Td>{formatDate(blog.updatedAt)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        as="a"
                        href={`/blogs/${blog.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        colorScheme="gray"
                        variant="outline"
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="gray"
                        onClick={() => handleEdit(blog.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => setPendingDeleteId(blog.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
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
