import { blogSchemaInterface } from '@/types';
import { capitalizeText } from '@/utils';
import { VariantProps, cva, cx } from 'class-variance-authority';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface IBlogCard {
  className?: string;
  children: React.ReactNode;
}

const blogCard = cva('bg-white', {
  variants: {
    intent: {
      1: ['bg-blog-fancy-1'],
      2: ['bg-blog-fancy-2'],
      3: ['bg-blog-fancy-3'],
      4: ['bg-blog-fancy-4'],
      5: ['bg-blog-fancy-5']
    }
  }
});

type blogCardType = VariantProps<typeof blogCard>;

const BlogCard = ({ className, children }: IBlogCard) => {
  return <div className={twMerge('w-full flex flex-col gap-2', className)}>{children}</div>;
};

export default BlogCard;

const Banner = ({ id, children }: { children: React.ReactNode; id: number }) => {
  return (
    <div
      className={twMerge(
        'w-full h-[8rem] rounded-md grid place-items-center relative  cursor-pointer',
        cx(blogCard({ intent: ((id % 5) + 1) as blogCardType['intent'] }))
      )}
    >
      {children}
    </div>
  );
};

BlogCard.Banner = Banner;

const Title = ({ title }: { title: string }) => {
  return (
    <h4 className="font-caveat text-[14px] leading-[16px] md:text-[18px] md:leading-[20px] font-[500]">
      {capitalizeText(title, 'allWords')}.
    </h4>
  );
};

BlogCard.Title = Title;

const Actions = ({
  onClick,
  className,
  children
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      onClick={() => onClick?.()}
      className={twMerge(
        'w-max h-max absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ease-out duration-300',
        className
      )}
    >
      {children}
    </div>
  );
};

BlogCard.Actions = Actions;

const Caption = ({ caption, className }: { caption: string; className?: string }) => {
  return (
    <span
      className={twMerge(
        'font-caveat text-[1rem] md:text-[1.25rem] text-white font-bold',
        className
      )}
    >
      {caption}
    </span>
  );
};

BlogCard.Caption = Caption;
