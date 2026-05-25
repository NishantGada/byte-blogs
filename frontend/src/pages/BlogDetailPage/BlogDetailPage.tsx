// src/pages/Public/BlogDetailPage.tsx
import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import SendRequest from "../../api/SendRequest";
import { formatDate } from "../../utils/FormatDate";
import { estimateReadingTime, extractHeadings } from "../../utils/blogHeadings";
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

  const headings = useMemo(
    () => (blog ? extractHeadings(blog.content) : []),
    [blog],
  );
  const readingMinutes = useMemo(
    () => (blog ? estimateReadingTime(blog.content) : 0),
    [blog],
  );

  if (loading) return <Text textAlign="center" mt="4">Loading blog...</Text>;
  if (!blog) return <Text textAlign="center" mt="4">Blog not found.</Text>;

  return (
    <Container maxW={{ base: "container.md", lg: "container.xl" }} p={{ base: 4, md: 8 }}>
      <Box my={4}>
        <Link to="/blogs">
          <Flex alignItems="center" gap="2">
            <FaLongArrowAltLeft />
            <Text color="blue">back</Text>
          </Flex>
        </Link>
      </Box>

      <Flex gap={8} align="flex-start">
        <Box flex="1" maxW={{ base: "100%", lg: "768px" }}>
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
            {readingMinutes > 0 && (
              <Text fontSize="sm" color="gray.500">
                {readingMinutes} min read
              </Text>
            )}
          </Box>
          <BlogContent html={blog.content} mb={6} />
        </Box>

        {headings.length > 0 && (
          <Box
            display={{ base: "none", lg: "block" }}
            width="240px"
            flexShrink={0}
          >
            <Box position="sticky" top="20px">
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                On this page
              </Text>
              <VStack as="nav" align="stretch" spacing={2}>
                {headings.map((h) => (
                  <ChakraLink
                    key={h.id}
                    href={`#${h.id}`}
                    fontSize="sm"
                    color="gray.700"
                    pl={h.level === 3 ? 3 : 0}
                    _hover={{ color: "blue.600", textDecoration: "none" }}
                  >
                    {h.text}
                  </ChakraLink>
                ))}
              </VStack>
            </Box>
          </Box>
        )}
      </Flex>
    </Container>
  );
};

export default BlogDetailPage;
