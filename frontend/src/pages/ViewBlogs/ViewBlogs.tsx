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
  VStack,
  Text,
  Badge,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

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

  const textColor = useColorModeValue("gray.700", "gray.200");
  const tableBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technology: "blue",
      lifestyle: "pink",
      business: "green",
      travel: "orange",
      food: "red",
      fashion: "purple",
      health: "teal",
      education: "cyan",
    };
    return colors[category.toLowerCase()] || "gray";
  };

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

  const handleEdit = (id: string) => {
    navigate(`/admin/edit/${id}`);
  };

  if (loading) {
    return (
      <Box textAlign="center" py={16}>
        <VStack spacing={4}>
          <Box
            w="16"
            h="16"
            border="4px solid"
            borderColor="purple.500"
            borderTopColor="transparent"
            borderRadius="full"
            animation="spin 1s linear infinite"
            sx={{
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
          <Text fontSize="lg" fontWeight="medium" color={textColor}>
            Loading your blogs...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading
          size="xl"
          bgGradient="linear(to-r, purple.600, pink.600)"
          bgClip="text"
          fontWeight="extrabold"
        >
          Your Blogs
        </Heading>
        <Badge
          colorScheme="purple"
          fontSize="md"
          px={4}
          py={2}
          borderRadius="full"
        >
          {blogs.length} {blogs.length === 1 ? "Blog" : "Blogs"}
        </Badge>
      </Flex>

      {blogs.length === 0 ? (
        <VStack spacing={4} py={16} textAlign="center">
          <Text fontSize="6xl">📝</Text>
          <Heading size="lg" color={textColor}>
            No blogs yet
          </Heading>
          <Text color="gray.500">Create your first blog to get started!</Text>
        </VStack>
      ) : (
        <TableContainer
          bg={tableBg}
          borderRadius="xl"
          boxShadow="md"
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Table variant="simple">
            <Thead bg={useColorModeValue("gray.50", "gray.900")}>
              <Tr>
                <Th fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                  Title
                </Th>
                <Th fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                  Category
                </Th>
                <Th fontSize="sm" textTransform="uppercase" letterSpacing="wide" textAlign="right">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {blogs.map((blog, index) => (
                <Tr
                  key={blog.id}
                  _hover={{ bg: hoverBg }}
                  transition="background 0.2s"
                  opacity={0}
                  animation={`fadeIn 0.4s ease forwards ${index * 0.1}s`}
                  sx={{
                    "@keyframes fadeIn": {
                      to: { opacity: 1 },
                    },
                  }}
                >
                  <Td fontWeight="semibold" color={textColor}>
                    {blog.title}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={getCategoryColor(blog.category)}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      textTransform="uppercase"
                      fontWeight="bold"
                    >
                      {blog.category}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack justify="flex-end" spacing={2}>
                      <Button
                        size="sm"
                        leftIcon={<Icon as={FiEdit2} />}
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEdit(blog.id)}
                        borderRadius="lg"
                        fontWeight="semibold"
                        _hover={{
                          bg: "blue.50",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<Icon as={FiTrash2} />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(blog.id)}
                        borderRadius="lg"
                        fontWeight="semibold"
                        _hover={{
                          bg: "red.50",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s"
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
    </Box>
  );
};

export default ViewBlogs;