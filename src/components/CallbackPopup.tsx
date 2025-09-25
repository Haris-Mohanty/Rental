"use client";

import { useState } from "react";
import CallbackRequestForm from "@/components/CallbackRequestForm";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CallbackPopup = () => {
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="
            fixed bottom-4 left-4 z-50
            bg-green-200 md:bg-green-50 border border-green-200 shadow-lg rounded-lg
            p-2 md:p-4 flex items-center space-x-2 md:space-x-3
            w-[72%] sm:w-[60%] md:w-[400px] 
          "
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            <X size={16} className="cursor-pointer" />
          </button>
          <CallbackRequestForm compact />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallbackPopup;
