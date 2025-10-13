import {
  Flex, Heading, Box, useColorModeValue
} from '@chakra-ui/react';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function Navbar() {
  const bgColor = useColorModeValue('whiteAlpha.900', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const accentColor = useColorModeValue('purple.600', 'purple.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      bg={bgColor}
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={{ base: 6, md: 8 }}
        py={4}
        alignItems="center"
        justify="space-between"
      >
        <Link to="/blogs">
          <Flex alignItems="center" gap={2}>
            <Box
              w="10"
              h="10"
              bgGradient="linear(135deg, purple.500, pink.500)"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              fontSize="xl"
              color="white"
              boxShadow="lg"
              transition="all 0.3s ease"
              _hover={{
                transform: "rotate(5deg) scale(1.05)",
                boxShadow: "xl",
              }}
            >
              B
            </Box>
            <Heading
              size="lg"
              bgGradient="linear(to-r, purple.600, pink.500)"
              bgClip="text"
              fontWeight="extrabold"
              letterSpacing="tight"
              display={{ base: "none", sm: "block" }}
            >
              ByteBlogs
            </Heading>
          </Flex>
        </Link>

        <Link to="/about">
          <Flex
            alignItems="center"
            gap={2}
            px={4}
            py={2}
            borderRadius="full"
            color={textColor}
            fontWeight="semibold"
            fontSize="sm"
            textTransform="uppercase"
            letterSpacing="wide"
            transition="all 0.3s ease"
            position="relative"
            _hover={{
              color: accentColor,
              transform: "translateX(4px)",
            }}
            _before={{
              content: '""',
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "0%",
              height: "2px",
              bgGradient: "linear(to-r, purple.500, pink.500)",
              transition: "width 0.3s ease",
            }}
            sx={{
              '&:hover::before': {
                width: "80%",
              },
              '&:hover svg': {
                transform: "translateX(4px)",
              }
            }}
          >
            About
            <Box
              as={FaLongArrowAltRight}
              transition="transform 0.3s ease"
            />
          </Flex>
        </Link>
      </Flex>
    </Box>
  );
}