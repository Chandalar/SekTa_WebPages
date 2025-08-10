// src/components/Parallax.jsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";

export default function Parallax({
  children,
  speed = -0.25,        // neg = tausta liikkuu hitaammin kuin sivu
  className = "",
  height = "80vh",      // pidä riittävä korkeus, jotta scrollia syntyy
  backgroundImage = "", // esim. "/hero.jpg" public-kansiosta
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // kun osio tulee näkyviin -> kun poistuu
  });

  // muutetaan scroll-progressiosta y-muutos
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 400]);

  return (
    <section
      ref={ref}
      className={clsx("relative w-full overflow-hidden", className)}
      style={{ minHeight: height }}
    >
      {/* Taustakerros */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 will-change-transform"
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          }}
        />
      </motion.div>

      {/* Sisältökerros */}
      <div className="relative z-10 flex items-center justify-center h-full p-8">
        {children}
      </div>

      {/* Varmuuden vuoksi tumma overlay luettavuutta varten */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </section>
  );
}
