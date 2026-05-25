// src/pages/Public/BlogDetailPage.tsx
import { Box, Container, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/atom-one-dark.css";
import SendRequest from "../../api/SendRequest";
import { formatDate } from "../../utils/FormatDate";
import type { Blog } from "../BlogListPage/BlogListPage";
import "./BlogDetailPage.css";

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const sanitizedContent = useMemo(
    () => (blog ? DOMPurify.sanitize(blog.content) : ""),
    [blog],
  );

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current
      .querySelectorAll<HTMLElement>("pre code")
      .forEach((block) => {
        hljs.highlightElement(block);
      });
  }, [sanitizedContent]);

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
      <Box
        ref={contentRef}
        className="blog-prose"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        mb={6}
      />
    </Container>
  );
};

export default BlogDetailPage;
