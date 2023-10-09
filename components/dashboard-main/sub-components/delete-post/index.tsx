import blogService from '@/adapters/blog';
import { blogSchemaInterface } from '@/types';
import { processError } from '@/utils/error';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import toast from 'react-hot-toast';

interface IDeletePost {
  post: blogSchemaInterface;
}

const DeletePost = ({ post: item }: IDeletePost) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, reset } = useMutation({
    mutationFn: () =>
      blogService?.deleteBlog({
        id: `${item?.id}`
      }),
    onSuccess: () => {
      queryClient.cancelQueries(['get-posts']).then(() => {
        const prev = queryClient.getQueryData<InfiniteData<blogSchemaInterface[]>>(['get-posts']);
        if (prev) {
          queryClient.setQueryData<InfiniteData<blogSchemaInterface[]>>(['get-posts'], (curr) => {
            if (!curr) return curr;
            const newPages = curr.pages.map((page) => {
              if (!page) return page;
              return page.filter((post) => {
                return !(post && post.id === item?.id);
              });
            });

            return { ...curr, pages: newPages };
          });
        }
      });
      toast.success(`Post Deleted`);
    },
    onError: (err) => {
      processError(err);
    }
  });

  return (
    <div className="w-full  py-4 grid grid-cols-2 gap-2 ">
      <button
        onClick={() => reset()}
        type="submit"
        className="w-full text-[12px] md:text-[14px] bg-blog-fancy-1 rounded-md px-4 py-2 hover:opacity-90 transition-opacity ease-in-out duration-300 h-[2.5rem]"
      >
        Cancel
      </button>
      <button
        disabled={isLoading}
        type="button"
        onClick={() => mutate()}
        className="w-full text-[12px] md:text-[14px] bg-blog-fancy-1 rounded-md px-4 py-2 hover:opacity-90 transition-opacity ease-in-out duration-300 h-[2.5rem]"
      >
        {isLoading ? `Deleting...` : `Delete`}
      </button>
    </div>
  );
};

export default DeletePost;
