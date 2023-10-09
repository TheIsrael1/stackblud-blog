import blogService from '@/adapters/blog';
import DashboardMain from '@/components/dashboard-main';
import BLOG_CONSTANTS from '@/constant';
import { blogSchemaInterface } from '@/types';
import { shimmer, toBase64 } from '@/utils/shimmer';
import Image from 'next/image';
import React from 'react';

// list blog, crud actions, modal experience

const initialBlogsData: Promise<blogSchemaInterface[]> = blogService.getBlogs({
  params: {
    _limit: BLOG_CONSTANTS.PAGINATION_LIMIT,
    _page: 1
  }
});

const Dashboard = async () => {
  const [initialBlogs] = await Promise.all([initialBlogsData]);

  return (
    <div className="w-full h-full px-container-base lg:px-container-lg flex flex-col  justify-between py-8 gap-4">
      <h2 className="text-[18px] md:text-[22px] font-inter uppercase">Admin Dashboard</h2>
      <div className="w-full h-[8rem] md:h-[15rem] bg-slate-200 rounded-md overflow-hidden relative mb-4">
        <Image
          alt=""
          src={`https://images.pexels.com/photos/171198/pexels-photo-171198.jpeg?auto=compress&cs=tinysrgb&w=1400`}
          fill={true}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          className="object-center object-cover"
        />
      </div>
      <DashboardMain initialBlogs={initialBlogs} />
    </div>
  );
};

export default Dashboard;
