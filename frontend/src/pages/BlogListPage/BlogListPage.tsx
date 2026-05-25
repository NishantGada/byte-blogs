// src/pages/Public/BlogListPage.tsx
import {
  AspectRatio,
  Badge,
  Box,
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
      <Box p={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <Box key={i} borderWidth="1px" borderRadius="lg" overflow="hidden">
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
      </Box>
    );
  }

  if (blogs.length === 0) {
    return (
      <Text textAlign="center" mt="4">
        No blogs available.
      </Text>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {blogs.map((blog) => (
          <Box
            key={blog.id}
            as={RouterLink}
            to={`/blogs/${blog.id}`}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            textDecoration="none"
            transition="transform 0.15s, box-shadow 0.15s"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "md",
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
                colorScheme="gray"
                textTransform="none"
              >
                {blog.category}
              </Badge>
              <Heading as="h3" size="md" noOfLines={2}>
                {blog.title}
              </Heading>
              <Text color="gray.600" fontSize="sm" noOfLines={3}>
                {makeExcerpt(blog.content)}
              </Text>
              <Text fontSize="xs" color="gray.500" pt={1}>
                Updated {formatDate(blog.updatedAt)}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default BlogListPage;
