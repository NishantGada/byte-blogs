import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { FaLongArrowAltRight, FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

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
        <Link to="/blogs">
          <Heading size="md" letterSpacing="-0.01em">
            ByteBlogs
          </Heading>
        </Link>

        <Flex align="center" gap={4}>
          {location.pathname !== "/about" && (
            <Link to="/about">
              <Flex
                alignItems="center"
                gap={2}
                color="text.muted"
                _hover={{ color: "accent.solid" }}
                transition="color 0.15s"
              >
                <Text fontSize="sm">about</Text>
                <FaLongArrowAltRight />
              </Flex>
            </Link>
          )}
          <IconButton
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            icon={isDark ? <FaSun /> : <FaMoon />}
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="gray"
            size="sm"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
