"use client";

import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

interface WhatsAppButtonProps {
    phone?: string;
    message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
    phone = "919937376969",
    message = "Hello! I want to know more about your services.",
}) => {
    return (
        <motion.a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center cursor-pointer
                       shadow-green-400/60"
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
                boxShadow: [
                    "0 0 10px rgba(72, 187, 120, 0.5)",
                    "0 0 20px rgba(72, 187, 120, 0.8)",
                    "0 0 10px rgba(72, 187, 120, 0.5)",
                ],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            whileHover={{
                scale: 1.4,
                rotate: [0, 10, -10, 0],
                boxShadow: "0 0 25px rgba(72, 187, 120, 1)",
                transition: { duration: 0.4 },
            }}
            whileTap={{ scale: 0.9 }}
        >
            <FaWhatsapp size={28} />
        </motion.a>
    );
};

export default WhatsAppButton;
