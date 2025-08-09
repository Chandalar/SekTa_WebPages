import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center text-white">
      <AnimatedBackground />
      <motion.img
        src="/SekTa_LOGO_ilman_tausta.png"
        alt="SekTa Logo"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="w-48 mb-6 z-10"
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-5xl font-extrabold drop-shadow-lg"
      >
        Tervetuloa SekTa Salibandyn kotisivuille
      </motion.h1>
      <Link
        to="/joukkue"
        className="mt-8 px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-full text-lg font-semibold shadow-lg transition z-10"
      >
        Tutustu joukkueeseen
      </Link>
    </div>
  );
}
