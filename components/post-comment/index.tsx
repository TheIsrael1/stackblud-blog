'use client';

import { commentSchemaInterface } from '@/types';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCommentSchema, addCommentSchemaInterface } from './post-comment.model';
import { useMutation } from '@tanstack/react-query';
import useUserStore from '@/store/useUserStore';
import Input from '../Input';

interface IPostComment {
  initialComments: commentSchemaInterface[];
  postId: string;
}

const PostComment = ({ initialComments, postId }: IPostComment) => {
  const { userName } = useUserStore((store) => store);
  const [comments, setComments] = useState<commentSchemaInterface[]>(initialComments);

  const { register, handleSubmit, reset } = useForm<addCommentSchemaInterface>({
    resolver: zodResolver(addCommentSchema),
    mode: 'all'
  });

  // fake api doest expose a create comment endpoint, I planned to do an optimistic update implementation
  // with rollback on error
  const { mutate } = useMutation<any, any, addCommentSchemaInterface>({});

  const onSubmit: SubmitHandler<addCommentSchemaInterface> = (data) => {
    mutate(data);
    // imporovisation, conventionally, we'll do optimistic updates in the query fucntion and keep the updates
    // if we are certain the comment was persisted in the backed, else we'll rollback and notify the user there was an error
    setComments((prev) => {
      return [
        ...prev,
        {
          body: data.comment,
          email: userName,
          id: `${Math.random() * 20000 + prev.length}`,
          name: `Anon`,
          postId: postId
        }
      ];
    });
    reset();
  };

  return (
    <section className="w-full flex flex-col gap-2">
      {comments?.map((i, idx) => (
        <div
          key={idx}
          className="w-full h-max px-4 md:px-8 py-4 bg-slate-100 rounded-md flex flex-col gap-1"
        >
          <p className="text-[12px] md:text-[14px]">{i?.body}</p>
          <span className="text-[14px] md:text-[16px] font-caveat">Posted By {i?.email}</span>
        </div>
      ))}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex gap-2">
        <div className="flex-grow">
          <Input {...register('comment')} />
        </div>
        <button
          type="submit"
          className="text-[12px] md:text-[14px] bg-blog-fancy-1 rounded-md px-2 hover:opacity-90 transition-opacity ease-in-out duration-300"
        >
          comment
        </button>
      </form>
    </section>
  );
};

export default PostComment;
