import React from "react";

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="px-4 rounded-lg p-2 bg-secondary font-semibold"
    >
      {children}
    </select>
  );
}

export default Select;
