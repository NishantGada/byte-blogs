import {
  Flex, Heading
} from '@chakra-ui/react';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <Flex p={8} borderWidth="1px" alignItems="center" justify="space-between">
      <Link to="/blogs">
        <Heading size="md">ByteBlogs</Heading>
      </Link>

      <Link to="/about">
        <Flex alignItems="center" gap="2">
          about <FaLongArrowAltRight />
        </Flex>
      </Link>
    </Flex>
  )
}