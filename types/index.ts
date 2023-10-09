import z from 'zod';

export const userSchema = z.object({
  userName: z.string(),
  id: z.number()
});

export type userSchemaInterface = z.infer<typeof userSchema>;

export const blogSchema = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  userId: z.number().optional()
});

export const commentSchema = z.object({
  name: z.string(),
  email: z.string(),
  body: z.string(),
  id: z.string(),
  postId: z.string()
});

export type blogSchemaInterface = z.infer<typeof blogSchema>;
export type commentSchemaInterface = z.infer<typeof commentSchema>;
