import React from "react";

function Button({ children, className, ...props }) {
  return (
    <button
      className={`${className} text-extra font-semibold hover:bg-primary transition-colors bg-secondary rounded-lg px-4 p-2 `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
