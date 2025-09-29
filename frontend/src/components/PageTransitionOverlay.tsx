import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionOverlayProps {
  isNavigating: boolean;
}

export function PageTransitionOverlay({ isNavigating }: PageTransitionOverlayProps) {
  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}
