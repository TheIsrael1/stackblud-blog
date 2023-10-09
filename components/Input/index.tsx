import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          (className =
            'w-full h-[2.5rem] rounded-md border border-slate-300 active:border-slate-300 focus:border-slate-300 focus-visible:border-slate-300 px-4 ring-0 outline-0 focus-within:border-slate-300'),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export default Input;
