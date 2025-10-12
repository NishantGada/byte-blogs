import {
  Flex, Heading
} from '@chakra-ui/react';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <Flex p={8} borderWidth="1px" alignItems="center" justify="space-between">
      <Heading size="md">ByteBlogs</Heading>

      <Link to="/blogs">
        <Flex alignItems="center" gap="2">
          about <FaLongArrowAltRight />
        </Flex>
      </Link>
      {/* </Flex> */}
    </Flex>
  )
}