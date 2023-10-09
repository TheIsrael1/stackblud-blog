'use client';

import blogService from '@/adapters/blog';
import BLOG_CONSTANTS from '@/constant';
import { blogSchemaInterface } from '@/types';
import { processError } from '@/utils/error';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';
import BlogCard from '../BlogCard';
import Skeleton from 'react-loading-skeleton';
import { twMerge } from 'tailwind-merge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../Modal';
import CreatePost from './sub-components/create-post';
import EditPost from './sub-components/edit-post';
import DeletePost from './sub-components/delete-post';

interface IDashboardMain {
  initialBlogs: blogSchemaInterface[];
}

const DashboardMain = ({ initialBlogs }: IDashboardMain) => {
  const [currPage, setCurrPage] = useState(0);
  const totalPosts = 100;
  const [createOpen, setCreateOpen] = useState(false);

  const {
    data: posts,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery<any, any, blogSchemaInterface[]>({
    queryKey: ['get-posts'],
    queryFn: ({ pageParam = 1 }) =>
      blogService.getBlogs({
        params: {
          _limit: BLOG_CONSTANTS.PAGINATION_LIMIT,
          _page: pageParam
        }
      }),
    onSuccess: () => {
      setCurrPage((prev) => prev + 1);
    },
    getNextPageParam: () => {
      const nextPage = currPage + 1;
      return nextPage > totalPosts / BLOG_CONSTANTS.PAGINATION_LIMIT ? undefined : nextPage;
    },
    getPreviousPageParam: () => {
      return 1;
    },
    onError: (err) => {
      processError(err);
    },
    initialData: {
      pages: [initialBlogs],
      pageParams: [null]
    },
    cacheTime: 0
  });

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center relative">
        <h4 className="text-[14px] md:text-[18px] font-inter  uppercase">Recent Blogs</h4>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger className="text-[12px] md:text-[14px] bg-blog-fancy-1 rounded-md px-4 py-2 hover:opacity-90 transition-opacity ease-in-out duration-300">
            <span>Create</span>
          </DialogTrigger>
          <DialogContent className="w-full min-h-full md:!w-[400px] md:max-w-full md:min-h-[50vh] bg-white">
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
              <DialogDescription>Create New Post</DialogDescription>
            </DialogHeader>
            <CreatePost close={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts?.pages?.map((page, idx) => (
          <React.Fragment key={`page-${idx + 1}`}>
            {page?.map((i, id) => (
              <BlogCard key={id} className="group">
                <BlogCard.Banner id={id}>
                  <div className="absolute top-0 right-0 flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger className="">
                        <BlogCard.Actions className="relative w-8 h-8 rounded-[50px] grid place-items-center hover:bg-black/30 opacity-100 md:opacity-0 transition-all">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </BlogCard.Actions>
                      </DialogTrigger>
                      <DialogContent className="w-full min-h-full md:!w-[400px] md:max-w-full md:min-h-[50vh] bg-white">
                        <DialogHeader>
                          <DialogTitle>Edit Post</DialogTitle>
                          <DialogDescription>Edit selected post</DialogDescription>
                        </DialogHeader>
                        <EditPost post={i} />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger className="">
                        <BlogCard.Actions className="relative w-8 h-8 rounded-[50px] grid place-items-center hover:bg-black/30 opacity-100 md:opacity-0 transition-all">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </BlogCard.Actions>
                      </DialogTrigger>
                      <DialogContent className="w-full min-h-full md:!w-[400px] md:max-w-full md:min-h-[30vh] bg-white">
                        <DialogHeader>
                          <DialogTitle>Delete Post</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete the selected Post
                          </DialogDescription>
                        </DialogHeader>
                        <DeletePost post={i} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <BlogCard.Caption caption={`Blog ${i?.id}`} />
                </BlogCard.Banner>
                <BlogCard.Title title={i?.title!} />
              </BlogCard>
            ))}
          </React.Fragment>
        ))}
        {isFetchingNextPage ? (
          [...Array(BLOG_CONSTANTS.PAGINATION_LIMIT)]?.map((_, idx) => (
            <div key={idx} className="h-[8rem] rounded-md w-full">
              <Skeleton className="w-full h-full" />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      <div className="w-full flex justify-center">
        <button
          onClick={() => fetchNextPage()}
          className={twMerge(
            `w-full max-w-[8rem] h-[3rem] rounded-md shadow-lg items-center justify-center border border-slate-300 hover:bg-slate-50 transition-colors ease-in-out duration-300`,
            !hasNextPage ? `hidden` : `flex`
          )}
        >
          <span className="text-[12px] md:text-[14px] font-[500] font-inter">View More</span>
        </button>
      </div>
    </section>
  );
};

export default DashboardMain;
