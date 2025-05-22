import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
    containerRef: React.RefObject<HTMLElement>;
    className?: string;
}
export const ScrollIndicator = ({ containerRef, className }: ScrollIndicatorProps) => {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const checkScrollable = () => {
            const hasScroll = element.scrollHeight > element.clientHeight;
            setIsScrollable(hasScroll);
        };

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = element;
            const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
            setIsAtBottom(isBottom);
        };

        checkScrollable();
        element.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', checkScrollable);

        return () => {
            element.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkScrollable);
        };
    }, [containerRef]);

    if (!isScrollable) return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: 1,
                    rotate: isAtBottom ? 180 : 0 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-2 rounded-full shadow-md transition-all duration-300 ${className}`}
            >
                <ChevronDown className="h-4 w-4 text-[#6F4E37]" />
            </motion.button>
        </AnimatePresence>
    );
};