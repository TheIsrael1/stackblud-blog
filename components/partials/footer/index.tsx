import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full px-container-base lg:px-container-lg py-4 flex items-center justify-center gap-2">
      <span className="text-[20px] font-caveat font-[600]">For Stackblud By Dero</span>
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
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    </footer>
  );
};

export default Footer;
