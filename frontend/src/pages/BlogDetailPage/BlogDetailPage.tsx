// src/pages/Public/BlogDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Image, Heading, Text, Button, Container } from "@chakra-ui/react";
import SendRequest from "../../api/SendRequest";

interface Blog {
  id: string;
  title: string;
  category: string;
  coverImage?: string;
  content: string;
}

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        const res = await SendRequest(`/api/blogs/${id}`, {}, "GET");
        setBlog(res.data.Item || res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch blog details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <Text textAlign="center" mt="4">Loading blog...</Text>;
  if (!blog) return <Text textAlign="center" mt="4">Blog not found.</Text>;

  return (
    <Container maxW="container.md" p={{ base: 4, md: 8 }}>
      {blog.coverImage && (
        <Image src={blog.coverImage} alt={blog.title} mb={6} borderRadius="md" />
      )}
      <Heading as="h2" size="xl" mb={2}>
        {blog.title}
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>
        Category: {blog.category}
      </Text>
      <Box
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
        mb={6}
      />
      <Button onClick={() => navigate("/blogs")}>Back to All Blogs</Button>
    </Container>
  );
};

export default BlogDetailPage;
