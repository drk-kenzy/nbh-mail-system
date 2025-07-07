import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <section className={`bg-surface text-gray-100 p-6 rounded-2xl shadow-card mb-6 transition-all duration-300 ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4 tracking-tight text-primary/90">{title}</h2>}
      {children}
    </section>
  );
}
