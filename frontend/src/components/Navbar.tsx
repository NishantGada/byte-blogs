import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

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
      </Flex>
    </Box>
  );
}
