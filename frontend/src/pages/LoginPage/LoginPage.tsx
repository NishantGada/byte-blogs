// LoginPage.tsx
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  VStack,
  useToast
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendRequest from '../../api/SendRequest';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await SendRequest('/api/auth/login', { username, password }, 'POST');
      login(response.data.token);
      navigate('/admin');
    } catch (err: any) {
      toast({
        title: 'Login failed',
        description: err.response?.data?.message || 'Invalid username or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center" bg="white">
      <Box
        width="100%"
        maxW="400px"
        border="1px solid black"
        borderRadius="md"
        p={8}
        boxShadow="lg"
      >
        <Heading mb={6} textAlign="center" fontWeight="bold" color="black">
          Admin Login
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel color="black">Username</FormLabel>
              <Input
                borderColor="black"
                _hover={{ borderColor: 'gray.600' }}
                _focus={{ borderColor: 'black', boxShadow: 'none' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel color="black">Password</FormLabel>
              <Input
                type="password"
                borderColor="black"
                _hover={{ borderColor: 'gray.600' }}
                _focus={{ borderColor: 'black', boxShadow: 'none' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>

            <Button
              type="submit"
              bg="black"
              color="white"
              _hover={{ bg: 'gray.800' }}
              width="full"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Login'}
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
