// EditBlog.tsx
import { Box, Button, Heading, Input, Spinner, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SendRequest from "../../api/SendRequest";
import { AuthContext } from "../../context/AuthContext";
import BlogEditor from "../../components/BlogEditor/BlogEditor";

const EditBlog = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          alert("Failed to fetch blog details");
          setLoading(false);
        });
    }
  }, [id, token]);

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await SendRequest(`/api/blogs/${id}`, { title, category, coverImage, content }, "PUT", {
          Authorization: `Bearer ${token}`,
        });
        alert("Blog updated successfully!");
      }
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Failed to update blog.");
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
    <Box maxW={{ base: "90%", md: "600px", lg: "70%" }} mx="auto">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Edit Blog
      </Heading>
      <VStack spacing={4}>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Input
          placeholder="Cover Image URL"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />
        <BlogEditor key={id} value={content} onChange={setContent} />
        <Button
          colorScheme="gray"
          w="full"
          onClick={handleSubmit}
          isLoading={saving}
        >
          Update Blog
        </Button>
        <Button
          colorScheme="gray"
          w="full"
          onClick={() => navigate("/admin/view")}
          isLoading={saving}
        >
          Cancel
        </Button>
      </VStack>
    </Box>
  );
};

export default EditBlog;
