// EditBlog.tsx
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Switch,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SendRequest from "../../api/SendRequest";
import { AuthContext } from "../../context/AuthContext";
import BlogEditor from "../../components/BlogEditor/BlogEditor";
import BlogContent from "../../components/BlogContent/BlogContent";
import { useBlogDraft } from "../../hooks/useBlogDraft";

const EditBlog = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { clearDraft } = useBlogDraft({
    key: `bytes-blog-draft-${id ?? "unknown"}`,
    values: { title, category, coverImage, content },
    enabled: !loading && !!id,
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

  useEffect(() => {
    if (id) {
      SendRequest(`/api/blogs/${id}`, {}, "GET", {
        Authorization: `Bearer ${token}`,
      })
        .then((res) => {
          const blog = res.data.Item;
          setTitle(blog.title);
          setCategory(blog.category);
          setCoverImage(blog.coverImage);
          setContent(blog.content);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Failed to load blog",
            description: err.response?.data?.message || "Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
        });
    }
  }, [id, token, toast]);

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      toast({
        title: "Missing required fields",
        description: "Title, category, and content are all required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await SendRequest(`/api/blogs/${id}`, { title, category, coverImage, content }, "PUT", {
          Authorization: `Bearer ${token}`,
        });
        clearDraft();
        toast({
          title: "Blog updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to update blog",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box
      maxW={
        showPreview
          ? { base: "100%", lg: "1200px" }
          : { base: "100%", md: "600px", lg: "70%" }
      }
      mx="auto"
    >
      <Heading as="h2" size="lg" textAlign="center" mb={8}>
        Edit Blog
      </Heading>
      <VStack spacing={5} align="stretch">
        <FormControl>
          <FormLabel color="text.muted" fontSize="sm">
            Title
          </FormLabel>
          <Input
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel color="text.muted" fontSize="sm">
            Category
          </FormLabel>
          <Input
            placeholder="Enter blog category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel color="text.muted" fontSize="sm">
            Cover Image URL
          </FormLabel>
          <Input
            placeholder="Enter cover image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Flex justify="space-between" align="center" mb={2}>
            <FormLabel mb={0} color="text.muted" fontSize="sm">
              Content
            </FormLabel>
            <Flex align="center" gap={2}>
              <Text fontSize="sm" color="text.muted">
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
              <BlogEditor key={id} value={content} onChange={setContent} />
              <Box
                borderWidth="1px"
                borderColor="border.default"
                borderRadius="md"
                p={5}
                bg="bg.surface"
                overflowY="auto"
                maxH="600px"
              >
                <BlogContent html={content} />
              </Box>
            </SimpleGrid>
          ) : (
            <BlogEditor key={id} value={content} onChange={setContent} />
          )}
        </FormControl>
        <HStack spacing={3} justify="flex-end">
          <Button
            variant="outline"
            colorScheme="gray"
            onClick={() => navigate("/admin")}
            isDisabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={saving} px={8}>
            Update Blog
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default EditBlog;
