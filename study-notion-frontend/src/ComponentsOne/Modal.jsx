import React from "react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm px-2 py-1">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
