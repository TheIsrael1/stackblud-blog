import Input from '@/components/Input';
import InputErrorWrapper from '@/components/hocs/InputErrorWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  BtnBold,
  BtnItalic,
  EditorProvider,
  Toolbar,
  Editor,
  BtnLink,
  BtnStrikeThrough
} from 'react-simple-wysiwyg';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogSchemaInterface } from '@/types';
import blogService from '@/adapters/blog';
import useUserStore from '@/store/useUserStore';
import { processError } from '@/utils/error';
import toast from 'react-hot-toast';

interface ICreatePost {
  close?: () => void;
}

export const createPostScehema = z.object({
  title: z.string().min(1, { message: 'Please enter a title' }),
  body: z.any()
});

export type createPostScehemaInterface = z.infer<typeof createPostScehema>;

const CreatePost = ({ close }: ICreatePost) => {
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
    mode: 'all'
  });

  const { mutate, isLoading } = useMutation<blogSchemaInterface, any, createPostScehemaInterface>({
    mutationFn: ({ body, title }) =>
      blogService.createBlog({
        body: body,
        title: title,
        userId: id
      }),
    onSuccess: (res, data) => {
      // since the fake api does not persit the request, i'm doing optimistic updates to mimick
      // a server update response, the the data was savedon the server another option would be to just refetch the ge posts
      // query
      queryClient.cancelQueries(['get-posts']).then(() => {
        const prev = queryClient.getQueryData<InfiniteData<blogSchemaInterface[]>>(['get-posts']);
        if (prev) {
          queryClient.setQueryData<InfiniteData<blogSchemaInterface[]>>(['get-posts'], (curr) => {
            let currPages = curr;
            let firstPage = curr?.pages[0];
            let newFirstPage: blogSchemaInterface[] = [
              {
                body: data?.body,
                id: (res?.id ?? 1) + Math.floor(Math.random() * 2000),
                title: data?.title,
                userId: id
              },
              ...firstPage!
            ];
            if (currPages) {
              currPages.pages[0] = newFirstPage;
            }
            return currPages;
          });
        }
      });
      toast.success(`New Post Created`);
      close?.();
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
        {isLoading ? `Creating...` : `Create`}
      </button>
    </form>
  );
};

export default CreatePost;
