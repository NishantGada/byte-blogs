// src/pages/CreateBlog/CreateBlog.tsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import { TextInput, Button, Container, Title, Stack } from "@mantine/core";
import SendRequest from "../../api/SendRequest";
import { AuthContext } from "../../context/AuthContext";

const CreateBlog: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title || !category || !content) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await SendRequest(
        "/api/blogs",
        { title, category, coverImage, content },
        "POST",
        { Authorization: `Bearer ${token}` }
      );
      alert("Blog created successfully!");
      navigate("/admin/view");
    } catch (err) {
      console.error(err);
      alert("Failed to create blog.");
    }
  };

  return (
    <Container size="sm" mt="xl">
      <Title order={2} ta="center" mb="lg">
        Create New Blog
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
          value={content}
          onChange={setContent}
          style={{ minHeight: 200 }}
        />
        <Button onClick={handleSubmit}>Create Blog</Button>
      </Stack>
    </Container>
  );
};

export default CreateBlog;
