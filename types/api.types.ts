import z from 'zod';
import { blogSchema, blogSchemaInterface } from '.';

export const apiQueryParamsSchema = z.object({
  _page: z.number(),
  _limit: z.number()
});

export type apiQueryParamsSchemaInterface = z.infer<typeof apiQueryParamsSchema>;

export const getBlogsSchema = z.object({
  params: apiQueryParamsSchema
});

export type getBlogsSchemaInterface = z.infer<typeof getBlogsSchema>;

export const getSingleBlogSchema = z.object({
  id: z.string()
});

export type getSingleBlogSchemaInterface = z.infer<typeof getSingleBlogSchema>;

export type createBlogApiInterface = Pick<blogSchemaInterface, 'body' | 'title' | 'userId'>;
