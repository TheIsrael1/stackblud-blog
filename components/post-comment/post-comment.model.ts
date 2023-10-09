import z from 'zod';

export const addCommentSchema = z.object({
  comment: z.string()
});

export type addCommentSchemaInterface = z.infer<typeof addCommentSchema>;
