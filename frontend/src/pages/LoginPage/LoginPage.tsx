// LoginPage.tsx
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
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
    <Flex
      minHeight="calc(100vh - 73px)"
      align="center"
      justify="center"
      px={4}
      py={8}
    >
      <Box
        width="100%"
        maxW="400px"
        bg="bg.surface"
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="lg"
        p={{ base: 6, md: 8 }}
        boxShadow="sm"
      >
        <Heading mb={2} textAlign="center" size="lg">
          Admin Login
        </Heading>
        <Text mb={6} textAlign="center" color="text.muted" fontSize="sm">
          Sign in to manage your posts.
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel color="text.muted" fontSize="sm">
                Username
              </FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel color="text.muted" fontSize="sm">
                Password
              </FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>

            <Button type="submit" width="full" isLoading={loading}>
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
