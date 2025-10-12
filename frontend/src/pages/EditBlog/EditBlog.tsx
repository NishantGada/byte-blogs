// EditBlog.tsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import { TextInput, Button, Container, Title, Stack } from "@mantine/core";
import SendRequest from "../../api/SendRequest";
import { AuthContext } from "../../context/AuthContext";

const EditBlog: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch blog data
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

    const blogData = { title, content, category, coverImage };

    try {
      if (id) {
        await SendRequest(`/api/blogs/${id}`, blogData, "PUT", {
          Authorization: `Bearer ${token}`,
        });
        alert("Blog updated successfully!");
      }
      navigate("/admin/view");
    } catch (err) {
      console.error(err);
      alert("Failed to update blog.");
    }
  };

  if (loading) {
    return <Container size="sm" mt="xl"><p>Loading blog...</p></Container>;
  }

  return (
    <Container size="sm" mt="xl">
      <Title order={2} ta="center" mb="lg">
        Edit Blog
      </Title>

      <Stack>
        <TextInput
          label="Title"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <TextInput
          label="Category"
          placeholder="Enter blog category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <TextInput
          label="Cover Image URL"
          placeholder="Enter cover image URL"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />

        <RichTextEditor
          key={id} // forces remount when id changes
          value={content}
          onChange={setContent}
          style={{ minHeight: 200 }}
          controls={[
            ["bold", "italic", "underline"],
            ["h1", "h2", "h3"],
            ["unorderedList", "orderedList"],
            ["link", "image"],
            ["alignLeft", "alignCenter", "alignRight"],
          ]}
        />

        <Button onClick={handleSubmit}>Update Blog</Button>
      </Stack>
    </Container>
  );
};

export default EditBlog;
