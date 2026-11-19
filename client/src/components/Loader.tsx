import { motion, AnimatePresence } from "framer-motion";
import NepalFlag from "./NepalFlag";

/** Animated loading screen. Shown until site data arrives (min. a short beat so it doesn't flash). */
export default function Loader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div key="loader" className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }} role="status" aria-label="Loading">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} style={{ fontSize: 64 }}>
            <NepalFlag />
          </motion.div>
          <div className="loader-bar"><span /></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
