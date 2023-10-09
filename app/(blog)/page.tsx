import blogService from '@/adapters/blog';
import HomeMain from '@/components/home-main';
import BLOG_CONSTANTS from '@/constant';
import { blogSchemaInterface } from '@/types';
import { shimmer, toBase64 } from '@/utils/shimmer';
import Image from 'next/image';

const initialBlogsData: Promise<blogSchemaInterface[]> = blogService.getBlogs({
  params: {
    _limit: BLOG_CONSTANTS.PAGINATION_LIMIT,
    _page: 1
  }
});

const Home = async () => {
  const [initialBlogs] = await Promise.all([initialBlogsData]);

  return (
    <div className="h-full flex px-container-base lg:px-container-lg  flex-col items-center justify-between">
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
      <div className="w-full">
        <HomeMain initialPosts={initialBlogs} />
      </div>
    </div>
  );
};

export default Home;
