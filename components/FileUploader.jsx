import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PaperClipIcon } from '@heroicons/react/24/outline';

export default function FileUploader({ onUpload }) {
  const inputRef = useRef();
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    if (e.target.files?.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
        dragActive 
          ? 'border-primary bg-primary/10' 
          : 'border-gray-600 hover:border-gray-500'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
      />
      
      <div className="text-center space-y-2">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-block"
        >
          <PaperClipIcon className="mx-auto h-10 w-10 text-primary" />
        </motion.div>
        
        <div className="space-y-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            className="font-medium text-primary hover:text-indigo-400 transition-colors"
            onClick={() => inputRef.current.click()}
          >
            Cliquez pour sélectionner des fichiers
          </motion.button>
          
          <p className="text-sm text-gray-300">
            ou glissez-déposez directement ici
          </p>
        </div>
        
        <p className="text-xs text-gray-400 pt-1">
          Formats supportés : PDF, DOC, XLS, JPG, PNG (max 10 Mo)
        </p>
      </div>
    </div>
  );
}