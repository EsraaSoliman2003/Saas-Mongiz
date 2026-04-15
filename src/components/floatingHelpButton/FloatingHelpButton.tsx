"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FloatingHelpButton() {
    const t = useTranslations();

    return (
        <motion.a
            href="/contact"
            initial={{ scale: 0 }}
            animate={{
                scale: 1,
                y: [0, -5, 0]
            }}
            transition={{
                type: "spring",
                delay: 1,
                y: { repeat: Infinity, repeatType: "loop", duration: 2 }
            }}
            whileTap={{ scale: 0.95, y: 0 }}
            className="fixed bottom-6 right-6 bg-main text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors z-50"
        >
            <MessageCircle className="w-6 h-6" />
        </motion.a>
    );
}