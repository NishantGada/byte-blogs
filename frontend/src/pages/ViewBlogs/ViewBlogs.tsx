// ViewBlogs.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Title, Stack } from '@mantine/core';
import SendRequest from '../../api/SendRequest';
import { AuthContext } from '../../context/AuthContext';

interface Blog {
  id: string;
  title: string;
  category: string;
  coverImage?: string;
  content: string;
}

const ViewBlogs: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await SendRequest('/api/blogs', {}, 'GET', {
        Authorization: `Bearer ${token}`,
      });
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete blog
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmed) return;

    try {
      await SendRequest(`/api/blogs/${id}`, {}, 'DELETE', {
        Authorization: `Bearer ${token}`,
      });
      alert('Blog deleted successfully!');
      // Refresh list
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog.');
    }
  };

  // Edit blog
  const handleEdit = (id: string) => {
    navigate(`/admin/edit/${id}`);
  };

  if (loading) return <div>Loading blogs...</div>;

  return (
    <Container size="sm" mt="xl">
      <Title order={2} ta="center" mb="lg">
        View Blogs
      </Title>

      {blogs.length === 0 ? (
        <div>No blogs available.</div>
      ) : (
        <Stack spacing="md">
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                  <td>{blog.category}</td>
                  <td>
                    <Button size="xs" color="blue" onClick={() => handleEdit(blog.id)} mr={5}>
                      Edit
                    </Button>
                    <Button size="xs" color="red" onClick={() => handleDelete(blog.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>
      )}
    </Container>
  );
};

export default ViewBlogs;
