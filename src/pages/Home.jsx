import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import NimenhuutoWidget from "../components/NimenhuutoWidget";
import Parallax from "../components/Parallax";
import Reveal from "../components/Reveal";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <AnimatedBackground />

      {/* HERO PARALLAX with faint background logo */}
      <div className="relative z-0 h-[90vh] flex items-center justify-center text-center">
        <Parallax strength={-15} className="absolute inset-0 opacity-10 -z-10 flex items-center justify-center">
          <img
            src="/SekTa_LOGO_ilman_tausta.png"
            alt="SekTa Background Logo"
            className="w-3/4 max-w-2xl object-contain"
          />
        </Parallax>

        <div className="relative z-10 flex flex-col items-center">
          <motion.img
            src="/SekTa_LOGO_ilman_tausta.png"
            alt="SekTa Logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-40 sm:w-48 mb-6 drop-shadow-lg"
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-5xl font-extrabold drop-shadow-xl"
          >
            Tervetuloa SekTa Salibandyn kotisivuille
          </motion.h1>

          <Reveal delay={0.35}>
            <Link
              to="/joukkue"
              className="mt-8 px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-full text-lg font-semibold shadow-lg transition"
            >
              Tutustu joukkueeseen
            </Link>
          </Reveal>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-12">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold">Harjoitukset & poissaolot</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <NimenhuutoWidget />
        </Reveal>
      </section>
    </div>
  );
}
