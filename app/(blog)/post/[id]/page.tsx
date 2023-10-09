import blogService from '@/adapters/blog';
import commentService from '@/adapters/comment';
import PostComment from '@/components/post-comment';
import { blogSchemaInterface, commentSchemaInterface } from '@/types';
import { shimmer, toBase64 } from '@/utils/shimmer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

interface IProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const blogs = (await blogService.getBlogs({
    params: {
      _limit: 10,
      _page: 1
    }
  })) as blogSchemaInterface[];

  return blogs?.map((i) => ({
    id: `${i?.id}`
  }));
}

const SingleBlog = async ({ params }: IProps) => {
  const blog = (await blogService.getSingleBlog({
    id: params?.id
  })) as blogSchemaInterface;

  const comments = (await commentService.getPostsComments({
    id: params?.id
  })) as commentSchemaInterface[];

  if (!blog?.id) {
    notFound();
  }

  return (
    <div className="h-full w-full flex flex-col gap-2 px-container-base lg:px-container-lg">
      <Link href={`/`}>
        <div className="w-8 h-8 rounded-[50px] bg-slate-100 grid place-items-center hover:bg-slate-300 active:bg-slate-100 transition-colors ease-in-out duration-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </div>
      </Link>
      <h2 className="text-[18px] md:text-[22px] font-inter font-bold">{blog?.title}</h2>
      <span>By user {blog?.userId}</span>
      <div className="w-full h-[8rem] md:h-[15rem] bg-slate-200 rounded-md overflow-hidden relative mb-4">
        <Image
          alt=""
          src={`https://images.pexels.com/photos/257699/pexels-photo-257699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
          fill={true}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          className="object-center object-cover"
        />
      </div>
      <p className="font-inter text-[14px] md:text-[16px]">{blog?.body}</p>
      <div className="w-full flex flex-col gap-2 my-4">
        <div className="flex items-center gap-2">
          <h4 className="font-bold font-inter text-[16px] md:text-[18px]">Comments</h4>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        </div>
        <PostComment initialComments={comments} postId={params?.id} />
      </div>
    </div>
  );
};

export default SingleBlog;
