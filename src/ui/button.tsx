import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <button
      className={`px-6 py-2 border border-primary-black rounded-[14px] text-primary-black font-semibold text-sm hover:bg-primary-black hover:text-primary-light transition-all duration-150 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
