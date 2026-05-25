import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Switch,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import SendRequest from "../../api/SendRequest";
import { AuthContext } from "../../context/AuthContext";
import BlogEditor from "../../components/BlogEditor/BlogEditor";
import BlogContent from "../../components/BlogContent/BlogContent";
import { useBlogDraft } from "../../hooks/useBlogDraft";

const DRAFT_KEY = "bytes-blog-draft-new";

const CreateBlog: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const { clearDraft } = useBlogDraft({
    key: DRAFT_KEY,
    values: { title, category, coverImage, content },
    onRestore: (draft) => {
      setTitle(draft.title);
      setCategory(draft.category);
      setCoverImage(draft.coverImage);
      setContent(draft.content);
      toast({
        title: "Restored unsaved draft",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = async () => {
    if (!title || !category || !content) {
      toast({
        title: "Missing required fields",
        description: "Title, category, and content are all required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await SendRequest(
        "/api/blogs",
        { title, category, coverImage, content },
        "POST",
        { Authorization: `Bearer ${token}` }
      );
      clearDraft();
      toast({
        title: "Blog created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to create blog",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      border="none"
      maxW={
        showPreview
          ? { base: "95%", md: "95%", lg: "1200px" }
          : { base: "90%", md: "600px", lg: "70%" }
      }
      mx="auto"
      mb={8}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
    >
      <Heading size="lg" textAlign="center" mb={6}>
        Create New Blog
      </Heading>

      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Category</FormLabel>
          <Input
            placeholder="Enter blog category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Cover Image URL</FormLabel>
          <Input
            placeholder="Enter cover image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <Flex justify="space-between" align="center" mb={2}>
            <FormLabel mb={0}>Content</FormLabel>
            <Flex align="center" gap={2}>
              <Text fontSize="sm" color="gray.600">
                Preview
              </Text>
              <Switch
                isChecked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
              />
            </Flex>
          </Flex>
          {showPreview ? (
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
              <BlogEditor value={content} onChange={setContent} />
              <Box
                borderWidth="1px"
                borderRadius="md"
                p={5}
                bg="white"
                overflowY="auto"
                maxH="600px"
              >
                <BlogContent html={content} />
              </Box>
            </SimpleGrid>
          ) : (
            <BlogEditor value={content} onChange={setContent} />
          )}
        </FormControl>

        <Button colorScheme="gray" onClick={handleSubmit}>
          Create Blog
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateBlog;
