import { Fragment } from 'react';

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <Fragment>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-200" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg relative animate-scale-in">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
          {children}
        </div>
      </div>
    </Fragment>
  );
}
