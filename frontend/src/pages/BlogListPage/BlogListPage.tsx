import { Box, Button, Container, Heading, SimpleGrid, Text, Flex, Badge, VStack, useColorModeValue } from "@chakra-ui/react";
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

  const bgGradient = useColorModeValue(
    "linear(to-br, purple.50, pink.50, orange.50)",
    "linear(to-br, gray.900, purple.900, pink.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.750");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const accentColor = useColorModeValue("purple.600", "purple.300");

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

  if (loading) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} display="flex" alignItems="center" justifyContent="center">
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
            Loading amazing content...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (blogs.length === 0) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4} textAlign="center" p={8}>
          <Text fontSize="6xl">📝</Text>
          <Heading size="lg" color={textColor}>
            No Blogs Yet
          </Heading>
          <Text color="gray.500">Check back soon for amazing content!</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={{ base: 8, md: 16 }}>
      <Container maxW="container.xl">
        <VStack spacing={8} mb={12} textAlign="center">
          <Heading
            as="h1"
            size={{ base: "2xl", md: "3xl" }}
            bgGradient="linear(to-r, purple.600, pink.600, orange.500)"
            bgClip="text"
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            Discover Stories
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color={textColor} maxW="2xl">
            Explore our curated collection of insights, ideas, and inspiration
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
          {blogs.map((blog, index) => (
            <Box
              key={blog.id}
              bg={cardBg}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="xl"
              transition="all 0.3s ease"
              opacity={0}
              transform="translateY(20px)"
              animation={`fadeInUp 0.6s ease forwards ${index * 0.1}s`}
              _hover={{
                transform: "translateY(-8px)",
                boxShadow: "2xl",
                bg: cardHoverBg,
              }}
              cursor="pointer"
              onClick={() => navigate(`/blogs/${blog.id}`)}
              sx={{
                "@keyframes fadeInUp": {
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Box
                h="200px"
                bgGradient={`linear(135deg, ${getCategoryColor(blog.category)}.400, ${getCategoryColor(blog.category)}.600)`}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-50%"
                  right="-50%"
                  w="200%"
                  h="200%"
                  bgGradient="radial(circle, whiteAlpha.200, transparent)"
                  animation="pulse 4s ease-in-out infinite"
                  sx={{
                    "@keyframes pulse": {
                      "0%, 100%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.1)" },
                    },
                  }}
                />
                <Badge
                  position="absolute"
                  top="4"
                  right="4"
                  colorScheme={getCategoryColor(blog.category)}
                  px="3"
                  py="1"
                  borderRadius="full"
                  fontSize="xs"
                  textTransform="uppercase"
                  fontWeight="bold"
                  boxShadow="md"
                >
                  {blog.category}
                </Badge>
              </Box>

              <VStack align="stretch" p={6} spacing={4}>
                <Heading
                  as="h3"
                  size="md"
                  color={accentColor}
                  noOfLines={2}
                  lineHeight="1.3"
                  fontWeight="bold"
                >
                  {blog.title}
                </Heading>

                <Text
                  fontSize="sm"
                  color="gray.500"
                  noOfLines={3}
                  dangerouslySetInnerHTML={{
                    __html: blog.content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
                  }}
                />

                <Flex justify="space-between" align="center" pt={2}>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.400" fontWeight="medium">
                      Updated
                    </Text>
                    <Text fontSize="xs" color={textColor} fontWeight="semibold">
                      {formatDate(blog.updatedAt)}
                    </Text>
                  </VStack>

                  <Button
                    size="sm"
                    colorScheme={getCategoryColor(blog.category)}
                    borderRadius="full"
                    px={6}
                    fontWeight="bold"
                    _hover={{
                      transform: "scale(1.05)",
                    }}
                    transition="all 0.2s"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blogs/${blog.id}`);
                    }}
                  >
                    Read →
                  </Button>
                </Flex>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default BlogListPage;