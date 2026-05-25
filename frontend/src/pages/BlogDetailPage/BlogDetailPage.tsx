// src/pages/Public/BlogDetailPage.tsx
import {
  Badge,
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

  if (loading) return <Text textAlign="center" mt={8} color="text.muted">Loading blog...</Text>;
  if (!blog) return <Text textAlign="center" mt={8} color="text.muted">Blog not found.</Text>;

  return (
    <Container maxW="1200px" py={{ base: 6, md: 10 }} px={{ base: 4, md: 8 }}>
      <Box mb={6}>
        <Link to="/blogs">
          <Flex
            alignItems="center"
            gap={2}
            color="text.muted"
            _hover={{ color: "accent.solid" }}
            transition="color 0.15s"
            display="inline-flex"
          >
            <FaLongArrowAltLeft />
            <Text fontSize="sm">back to all posts</Text>
          </Flex>
        </Link>
      </Box>

      <Flex gap={10} align="flex-start">
        <Box flex="1" maxW={{ base: "100%", lg: "760px" }}>
          {blog.coverImage && (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              mb={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border.default"
            />
          )}
          <Heading as="h1" size="2xl" mb={4} lineHeight="1.15">
            {blog.title}
          </Heading>
          <Flex
            mb={8}
            gap={3}
            wrap="wrap"
            align="center"
            color="text.subtle"
            fontSize="sm"
          >
            <Badge bg="accent.subtle" color="accent.hover" textTransform="none">
              {blog.category}
            </Badge>
            <Text>{formatDate(blog.createdAt)}</Text>
            {readingMinutes > 0 && (
              <>
                <Text aria-hidden>·</Text>
                <Text>{readingMinutes} min read</Text>
              </>
            )}
          </Flex>

          {headings.length > 0 && (
            <Box
              as="details"
              display={{ base: "block", lg: "none" }}
              mb={8}
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="md"
              bg="bg.surface"
            >
              <Box
                as="summary"
                cursor="pointer"
                px={4}
                py={3}
                fontSize="sm"
                fontWeight={600}
                color="text.muted"
                _hover={{ color: "text.primary" }}
              >
                On this page
              </Box>
              <VStack
                as="nav"
                align="stretch"
                spacing={2}
                px={4}
                pb={4}
                borderTopWidth="1px"
                borderColor="border.default"
                pt={3}
              >
                {headings.map((h) => (
                  <ChakraLink
                    key={h.id}
                    href={`#${h.id}`}
                    fontSize="sm"
                    color="text.muted"
                    pl={h.level === 3 ? 4 : 0}
                    _hover={{ color: "accent.solid", textDecoration: "none" }}
                  >
                    {h.text}
                  </ChakraLink>
                ))}
              </VStack>
            </Box>
          )}

          <BlogContent html={blog.content} mb={6} />
        </Box>

        {headings.length > 0 && (
          <Box
            display={{ base: "none", lg: "block" }}
            width="240px"
            flexShrink={0}
          >
            <Box position="sticky" top="24px">
              <Text
                fontSize="xs"
                fontWeight={600}
                color="text.subtle"
                textTransform="uppercase"
                letterSpacing="0.08em"
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
                    color="text.muted"
                    pl={h.level === 3 ? 4 : 0}
                    _hover={{ color: "accent.solid", textDecoration: "none" }}
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
