import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
  Link as ChakraLink,
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
import { FiSearch } from "react-icons/fi";

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
    <Box minH="60vh">
      <Flex
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={6}
      >
        <Heading size="lg">Your Blogs</Heading>
        <InputGroup maxW={{ base: "100%", md: "320px" }}>
          <InputLeftElement pointerEvents="none" color="text.subtle">
            <FiSearch />
          </InputLeftElement>
          <Input
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Flex>

      {blogs.length === 0 ? (
        <Box textAlign="center" py={{ base: 10, md: 16 }} px={4} color="text.muted">
          <Heading as="h3" size="md" mb={2} color="text.primary">
            No blogs yet
          </Heading>
          <Text mb={6}>Write your first post to get started.</Text>
          <Button onClick={() => navigate("/admin/create")} px={8}>
            Write a Blog
          </Button>
        </Box>
      ) : visibleBlogs.length === 0 ? (
        <Text textAlign="center" color="text.subtle" py={8}>
          No blogs match the search.
        </Text>
      ) : (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th color="text.subtle">Title</Th>
                <Th color="text.subtle">Category</Th>
                <Th color="text.subtle">Updated</Th>
                <Th color="text.subtle">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {visibleBlogs.map((blog) => (
                <Tr key={blog.id} _hover={{ bg: "bg.muted" }}>
                  <Td fontWeight={500}>
                    <ChakraLink
                      as={RouterLink}
                      to={`/admin/edit/${blog.id}`}
                      color="text.primary"
                      _hover={{ color: "accent.solid", textDecoration: "none" }}
                    >
                      {blog.title}
                    </ChakraLink>
                  </Td>
                  <Td color="text.muted">{blog.category}</Td>
                  <Td color="text.muted">{formatDate(blog.updatedAt)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="gray"
                        onClick={() => handleEdit(blog.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
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
            <AlertDialogHeader fontSize="lg" fontWeight={600}>
              Delete blog
            </AlertDialogHeader>
            <AlertDialogBody color="text.muted">
              Are you sure? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                variant="ghost"
                colorScheme="gray"
                onClick={() => setPendingDeleteId(null)}
              >
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
