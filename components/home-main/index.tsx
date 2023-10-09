'use client';

import blogService from '@/adapters/blog';
import BLOG_CONSTANTS from '@/constant';
import { blogSchemaInterface } from '@/types';
import { capitalizeText } from '@/utils';
import { processError } from '@/utils/error';
import { useInfiniteQuery } from '@tanstack/react-query';
import { VariantProps, cva, cx } from 'class-variance-authority';
import React, { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../Input';
import { useDebounce } from 'usehooks-ts';
import BlogCard from '../BlogCard';

interface IHomeMain {
  initialPosts: blogSchemaInterface[];
}

const searchSchema = z.object({
  search: z.string()
});

type searchSchemaInterface = z.infer<typeof searchSchema>;

const HomeMain = ({ initialPosts }: IHomeMain) => {
  //curr page and totalPosts should conventionally come back from the backend, but
  //since this is a fake api i'm improvising
  const [currPage, setCurrPage] = useState(0);
  const totalPosts = 100;

  const { handleSubmit, register, watch } = useForm<searchSchemaInterface>({
    resolver: zodResolver(searchSchema),
    mode: 'all'
  });

  // debouncing search to reduce frequncy by which search functionality is triggered
  // on search
  const debouncedSearchValue = useDebounce<string>(watch('search'), 500);

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
      pages: [initialPosts],
      pageParams: [null]
    },
    cacheTime: 0
  });

  // conventionally, search should be done on the server so user can search through paginated data,
  // the fake api isnt that robust so i'll be implementing search of the current items that have been retrieved
  const filteredPostsBySearch = useMemo(() => {
    const res = [] as blogSchemaInterface[];
    if (debouncedSearchValue?.length) {
      posts?.pages.forEach((page) => {
        page.forEach((post) => {
          const title = post?.title?.trim().toLowerCase();
          const search = debouncedSearchValue?.trim().toLowerCase();
          if (title?.includes(search) || (title && search.includes(title))) {
            res.push(post);
          }
        });
      });
    }
    return res;
  }, [posts, debouncedSearchValue]);

  const onSubmit: SubmitHandler<searchSchemaInterface> = (data) => {};

  return (
    <section className="w-full flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex gap-2">
        <div className="flex-grow">
          <Input {...register('search')} placeholder="Search Posts By Title" />
        </div>
      </form>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {!debouncedSearchValue?.length
          ? posts?.pages?.map((page, idx) => (
              <React.Fragment key={`page-${idx + 1}`}>
                {page?.map((i, id) => (
                  <Link key={idx} href={`/post/${i?.id}`}>
                    <BlogCard className="group">
                      <BlogCard.Banner id={id}>
                        <BlogCard.Actions>
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
                              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                            />
                          </svg>
                        </BlogCard.Actions>
                        <BlogCard.Caption caption={`Blog ${i?.id}`} />
                      </BlogCard.Banner>
                      <BlogCard.Title title={i?.title!} />
                    </BlogCard>
                  </Link>
                ))}
              </React.Fragment>
            ))
          : filteredPostsBySearch?.map((i, idx) => (
              <Link key={idx} href={`/post/${i?.id}`}>
                <BlogCard className="group">
                  <BlogCard.Banner id={idx}>
                    <BlogCard.Actions>
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
                          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                        />
                      </svg>
                    </BlogCard.Actions>
                    <BlogCard.Caption caption={`Blog ${i?.id}`} />
                  </BlogCard.Banner>
                  <BlogCard.Title title={i?.title!} />
                </BlogCard>
              </Link>
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
            !hasNextPage || filteredPostsBySearch?.length ? `hidden` : `flex`
          )}
        >
          <span className="text-[12px] md:text-[14px] font-[500] font-inter">View More</span>
        </button>
      </div>
    </section>
  );
};

export default HomeMain;

interface IBlogCard {
  post: blogSchemaInterface;
  id: number;
}
