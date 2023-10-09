import { getBlogsSchemaInterface, getSingleBlogSchemaInterface } from '../../types/api.types';
import API from '..';
import { createBlogApiInterface } from '@/types/api.types';
import { blogSchemaInterface } from '@/types';

const getBlogs = async (params: getBlogsSchemaInterface) => {
  const { data } = await API.get(`/posts`, {
    params: {
      ...params?.params
    }
  });
  return data;
};

const getSingleBlog = async (params: getSingleBlogSchemaInterface) => {
  const { data } = await API.get(`/posts/${params?.id}`);
  return data;
};

const editBlog = async (params: blogSchemaInterface) => {
  let paramsCopy = { ...params };
  delete paramsCopy['id'];
  const { data } = await API.patch(`/posts/${params?.id}`, { ...paramsCopy });
  return data;
};

const deleteBlog = async (params: getSingleBlogSchemaInterface) => {
  const { data } = await API.delete(`/posts/${params?.id}`);
  return data;
};

const createBlog = async (params: createBlogApiInterface) => {
  const { data } = await API.post(
    `/posts`,
    {},
    {
      data: {
        ...params
      }
    }
  );
  return data;
};

const blogService = {
  getBlogs,
  getSingleBlog,
  editBlog,
  deleteBlog,
  createBlog
};

export default blogService;
