import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AvatarPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({ isOpen, onClose, imageUrl, alt }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative"
            >
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 p-2 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="w-[1000px] h-[1000px] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-primary/20">
                <img
                  src={imageUrl}
                  alt={alt || '头像预览'}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
