import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const variantsList = [
    {
        name: "Slide Up",
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -50 }
    },
    {
        name: "Fade Scale",
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    },
    {
        name: "Slide Left",
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    },
    {
        name: "Rotate Fade",
        initial: { opacity: 0, rotate: -2, scale: 0.95 },
        animate: { opacity: 1, rotate: 0, scale: 1 },
        exit: { opacity: 0, rotate: 2, scale: 0.95 }
    }
];

const PageWrapper = ({ children }) => {
    // Use useMemo to pick a random variant only once on mount per instance
    const variants = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * variantsList.length);
        return variantsList[randomIndex];
    }, []);

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

export default PageWrapper;
