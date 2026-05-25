// src/pages/Public/BlogDetailPage.tsx
import { Box, Container, Flex, Heading, Image, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import SendRequest from "../../api/SendRequest";
import { formatDate } from "../../utils/FormatDate";
import BlogContent from "../../components/BlogContent/BlogContent";
import type { Blog } from "../BlogListPage/BlogListPage";

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        const res = await SendRequest(`/api/blogs/${id}`, {}, "GET");
        setBlog(res.data.Item || res.data);
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Failed to load blog",
          description: err.response?.data?.message || "Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, toast]);

  if (loading) return <Text textAlign="center" mt="4">Loading blog...</Text>;
  if (!blog) return <Text textAlign="center" mt="4">Blog not found.</Text>;

  return (
    <Container maxW="container.md" p={{ base: 4, md: 8 }}>
      <Box my={4}>
        <Link to="/blogs">
          <Flex alignItems="center" gap="2">
            <FaLongArrowAltLeft />
            <Text color="blue">back</Text>
          </Flex>
        </Link>
      </Box>

      {blog.coverImage && (
        <Image src={blog.coverImage} alt={blog.title} mb={6} borderRadius="md" />
      )}
      <Heading as="h2" size="xl" mb={2}>
        {blog.title}
      </Heading>
      <Box mb={4}>
        <Text fontSize="sm" color="gray.500">
          Category: {blog.category}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Created: {formatDate(blog.createdAt)} | Updated: {formatDate(blog.updatedAt)}
        </Text>
      </Box>
      <BlogContent html={blog.content} mb={6} />
    </Container>
  );
};

export default BlogDetailPage;
