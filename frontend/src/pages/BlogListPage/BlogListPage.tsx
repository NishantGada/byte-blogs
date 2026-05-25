// src/pages/Public/BlogListPage.tsx
import { Box, Button, Heading, SimpleGrid, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SendRequest from "../../api/SendRequest";
import { formatDate } from "../../utils/FormatDate";

export interface Blog {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  content: string;
}

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await SendRequest("/api/blogs", {}, "GET");
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

  if (loading) return <Text textAlign="center" mt="4">Loading blogs...</Text>;

  if (blogs.length === 0) return <Text textAlign="center" mt="4">No blogs available.</Text>;

  return (
    <Box p={{ base: 4, md: 8 }}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {blogs.map((blog) => (
          <Box
            key={blog.id}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            p={4}
            _hover={{ shadow: "md", cursor: "pointer" }}
            onClick={() => navigate(`/blogs/${blog.id}`)}
          >
            {/* {blog.coverImage && (
              <Image src={blog.coverImage} alt={blog.title} mb={4} borderRadius="md" />
            )} */}
            <Heading as="h3" size="md" mb={2}>
              {blog.title}
            </Heading>
            <Box mb={4}>
              <Text fontSize="sm" color="gray.500">
                Category: {blog.category}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Updated: {formatDate(blog.updatedAt)}
              </Text>
            </Box>
            <Button size="sm" onClick={() => navigate(`/blogs/${blog.id}`)}>
              Read More
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default BlogListPage;
