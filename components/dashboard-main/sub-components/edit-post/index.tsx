import useUserStore from '@/store/useUserStore';
import { blogSchemaInterface } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createPostScehema, createPostScehemaInterface } from '../create-post';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BtnBold,
  BtnItalic,
  EditorProvider,
  Toolbar,
  Editor,
  BtnLink,
  BtnStrikeThrough
} from 'react-simple-wysiwyg';
import InputErrorWrapper from '@/components/hocs/InputErrorWrapper';
import Input from '@/components/Input';
import blogService from '@/adapters/blog';
import { processError } from '@/utils/error';
import toast from 'react-hot-toast';

interface IEditPost {
  post: blogSchemaInterface;
}

const EditPost = ({ post }: IEditPost) => {
  const { id } = useUserStore((store) => store);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<createPostScehemaInterface>({
    resolver: zodResolver(createPostScehema),
    mode: 'all',
    defaultValues: {
      body: post?.body,
      title: post?.title
    }
  });

  const { mutate, isLoading } = useMutation<blogSchemaInterface, any, createPostScehemaInterface>({
    mutationFn: (data) =>
      blogService.editBlog({
        id: post?.id,
        body: data?.body,
        title: data?.title,
        userId: id
      }),
    onSuccess: (res, data) => {
      queryClient.cancelQueries(['get-posts']).then(() => {
        const prev = queryClient.getQueryData<InfiniteData<blogSchemaInterface[]>>(['get-posts']);
        if (prev) {
          queryClient.setQueryData<InfiniteData<blogSchemaInterface[]>>(['get-posts'], (curr) => {
            if (!curr) return curr;
            const newPages = curr.pages.map((page) => {
              if (!page) return page;
              return page.map((post) => {
                if (post && post.id === res?.id) {
                  return { ...post, ...res };
                } else {
                  return post;
                }
              });
            });

            return { ...curr, pages: newPages };
          });
        }
      });
      toast.success(`Post Updated`);
    },
    onError: (err) => {
      processError(err);
    }
  });

  const onSubmit: SubmitHandler<createPostScehemaInterface> = (data) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <InputErrorWrapper error={errors?.title?.message}>
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          <Input {...register('title')} id="title" />
        </div>
      </InputErrorWrapper>

      <div className="flex flex-col gap-2">
        <label htmlFor="title">Title</label>
        <EditorProvider>
          <Editor
            value={watch('body')}
            onChange={(e) => {
              setValue('body', e?.target?.value);
              trigger();
            }}
            className="w-full min-h-[20rem] max-w-full"
          >
            <Toolbar>
              <BtnBold />
              <BtnItalic />
              <BtnLink />
              <BtnStrikeThrough />
            </Toolbar>
          </Editor>
        </EditorProvider>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full text-[12px] md:text-[14px] bg-blog-fancy-1 rounded-md px-4 py-2 hover:opacity-90 transition-opacity ease-in-out duration-300"
      >
        {isLoading ? `Editing...` : `Edit`}
      </button>
    </form>
  );
};

export default EditPost;
