import {
  Box,
  Button,
  Flex,
  Heading,
  Container,
  useColorModeValue,
  HStack,
  Icon,
  Text
} from "@chakra-ui/react";
import { useContext } from "react";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiEdit, FiEye, FiLogOut } from "react-icons/fi";
import CreateBlog from "../CreateBlog/CreateBlog";
import EditBlog from "../EditBlog/EditBlog";
import ViewBlogs from "../ViewBlogs/ViewBlogs";

const AdminDashboardPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const bgGradient = useColorModeValue(
    "linear(to-br, purple.50, pink.50, blue.50)",
    "linear(to-br, gray.900, purple.900, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          mb={8}
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          boxShadow="xl"
        >
          <Box>
            <Heading
              size="xl"
              bgGradient="linear(to-r, purple.600, pink.600)"
              bgClip="text"
              fontWeight="extrabold"
              mb={1}
            >
              Welcome back, Nishant! 👋
            </Heading>
            <Text color={textColor} fontSize="sm">
              Manage your content from your dashboard
            </Text>
          </Box>
          <Button
            onClick={handleLogout}
            leftIcon={<Icon as={FiLogOut} />}
            size="lg"
            colorScheme="red"
            variant="ghost"
            fontWeight="semibold"
            borderRadius="xl"
            _hover={{
              bg: "red.50",
              transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
          >
            Logout
          </Button>
        </Flex>

        {/* Nav Buttons */}
        <HStack spacing={4} mb={8}>
          <Button
            as={Link}
            to="/admin/create"
            leftIcon={<Icon as={FiEdit} />}
            size="lg"
            colorScheme="purple"
            variant={isActive("create") ? "solid" : "outline"}
            borderRadius="xl"
            fontWeight="bold"
            px={8}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
          >
            Create Blog
          </Button>
          <Button
            as={Link}
            to="/admin/view"
            leftIcon={<Icon as={FiEye} />}
            size="lg"
            colorScheme="pink"
            variant={isActive("view") ? "solid" : "outline"}
            borderRadius="xl"
            fontWeight="bold"
            px={8}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
          >
            View Blogs
          </Button>
        </HStack>

        {/* Content Area */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          p={8}
          boxShadow="xl"
          minH="500px"
        >
          <Routes>
            <Route path="create" element={<CreateBlog />} />
            <Route path="view" element={<ViewBlogs />} />
            <Route path="edit/:id" element={<EditBlog />} />
          </Routes>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboardPage;