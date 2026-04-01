import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-lg p-6 z-[201]"
          >
            <div className="matte-glass rounded-[32px] p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tight text-white uppercase">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
