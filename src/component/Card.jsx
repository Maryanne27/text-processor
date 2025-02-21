import React from "react";

export function Card({ className, children }) {
  return (
    <div className={`bg-white shadow-md rounded-xl p-6 transition-all hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
  return <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>{children}</div>;
}
