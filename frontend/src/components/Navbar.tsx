import {
  Flex, Heading
} from '@chakra-ui/react';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <Flex p={8} borderWidth="1px" alignItems="center" justify="space-between">
      <Link to="/blogs">
        <Heading size="md">ByteBlogs</Heading>
      </Link>

      {
        location.pathname !== "/about" ? <Link to="/about">
          <Flex alignItems="center" gap="2">
            about <FaLongArrowAltRight />
          </Flex>
        </Link> : <></>
      }
    </Flex>
  )
}