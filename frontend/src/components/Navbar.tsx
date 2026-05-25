import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { FiArrowRight, FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const showLogout = isAuthenticated && location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderColor="border.default"
      bg="bg.surface"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={{ base: 5, md: 8 }}
        py={4}
        alignItems="center"
        justify="space-between"
      >
        <RouterLink to="/blogs">
          <Heading size="md" letterSpacing="-0.01em">
            ByteBlogs
          </Heading>
        </RouterLink>

        <HStack spacing={2}>
          {location.pathname !== "/about" && (
            <Button
              as={RouterLink}
              to="/about"
              variant="outline"
              colorScheme="gray"
              size="sm"
              rightIcon={<FiArrowRight />}
              fontWeight={500}
            >
              about
            </Button>
          )}
          {showLogout && (
            <Button
              variant="outline"
              colorScheme="gray"
              size="sm"
              leftIcon={<FiLogOut />}
              onClick={handleLogout}
              fontWeight={500}
            >
              logout
            </Button>
          )}
          <IconButton
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            icon={isDark ? <FiSun /> : <FiMoon />}
            onClick={toggleColorMode}
            variant="outline"
            colorScheme="gray"
            size="sm"
          />
        </HStack>
      </Flex>
    </Box>
  );
}
