import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<Props> = ({ children, className, disabled, ...rest }) => {
  return (
    <button
      className={`
        px-6 py-2 border border-primary-black rounded-[14px] text-primary-black font-semibold text-sm 
        ${
          disabled
            ? "opacity-50 cursor-not-allowed" // Reduced opacity and no hover when disabled
            : "hover:bg-primary-black hover:text-primary-light transition-all duration-150"
        } 
        ${className}
      `}
      disabled={disabled} // Ensure the disabled attribute is passed
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
