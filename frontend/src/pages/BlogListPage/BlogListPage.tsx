// src/pages/Public/BlogListPage.tsx
import {
  AspectRatio,
  Badge,
  Box,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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

const SKELETON_COUNT = 4;
const EXCERPT_CHARS = 200;

const makeExcerpt = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = (div.textContent || "").trim();
  if (text.length <= EXCERPT_CHARS) return text;
  return text.slice(0, EXCERPT_CHARS).trimEnd() + "…";
};

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <Container maxW="1200px" py={{ base: 6, md: 10 }} px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <Box
              key={i}
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="lg"
              overflow="hidden"
              bg="bg.surface"
            >
              <AspectRatio ratio={16 / 9}>
                <Skeleton w="full" h="full" />
              </AspectRatio>
              <Box p={5}>
                <Skeleton height="16px" mb={3} width="30%" />
                <Skeleton height="24px" mb={3} width="80%" />
                <SkeletonText noOfLines={3} spacing={2} />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    );
  }

  if (blogs.length === 0) {
    return (
      <Container maxW="600px" textAlign="center" mt={{ base: 12, md: 20 }} px={4}>
        <Heading as="h2" size="md" mb={2} color="text.primary">
          No posts yet
        </Heading>
        <Text color="text.muted">
          Check back soon — there is nothing here right now.
        </Text>
      </Container>
    );
  }

  return (
    <Container maxW="1200px" py={{ base: 6, md: 10 }} px={{ base: 4, md: 8 }}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {blogs.map((blog) => (
          <Box
            key={blog.id}
            as={RouterLink}
            to={`/blogs/${blog.id}`}
            borderWidth="1px"
            borderColor="border.default"
            borderRadius="lg"
            overflow="hidden"
            bg="bg.surface"
            textDecoration="none"
            transition="transform 0.15s, box-shadow 0.15s, border-color 0.15s"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "md",
              borderColor: "accent.muted",
              textDecoration: "none",
            }}
          >
            {blog.coverImage && (
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  objectFit="cover"
                />
              </AspectRatio>
            )}
            <VStack p={5} align="stretch" spacing={3}>
              <Badge
                alignSelf="flex-start"
                bg="accent.subtle"
                color="accent.hover"
                textTransform="none"
              >
                {blog.category}
              </Badge>
              <Heading as="h3" size="md" noOfLines={2}>
                {blog.title}
              </Heading>
              <Text color="text.muted" fontSize="sm" noOfLines={3}>
                {makeExcerpt(blog.content)}
              </Text>
              <Text fontSize="xs" color="text.subtle" pt={1}>
                Updated {formatDate(blog.updatedAt)}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default BlogListPage;
