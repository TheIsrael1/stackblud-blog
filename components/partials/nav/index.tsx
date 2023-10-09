import Link from 'next/link';
import React from 'react';

const Nav = () => {
  return (
    <nav className="w-full sticky top-0 right-0 left-0 bg-white/70 z-10 backdrop-blur-md">
      <div className="flex items-center justify-center px-container-base lg:px-container-lg py-4 ">
        <div className="flex flex-col items-center gap">
          <Link href={`/`}>
            <h4 className="font-caveat text-[32px] font-bold cursor-pointer">Stackblud Blog</h4>
          </Link>
          <div className="h-[2px] w-8 rounded-2xl bg-black" />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
