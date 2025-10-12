// src/pages/Public/BlogListPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, VStack, Image, Heading, Text, Button, SimpleGrid } from "@chakra-ui/react";
import SendRequest from "../../api/SendRequest";

interface Blog {
  id: string;
  title: string;
  category: string;
  coverImage?: string;
  content: string;
}

const BlogListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await SendRequest("/api/blogs", {}, "GET");
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
            <Text fontSize="sm" color="gray.500" mb={4}>
              Category: {blog.category}
            </Text>
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
