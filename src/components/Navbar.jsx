import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { to: "/", label: "Etusivu" },
  { to: "/historia", label: "Historia" },
  { to: "/joukkue", label: "Joukkue" },
  { to: "/ottelut", label: "Ottelut" },
  { to: "/yhteys", label: "Yhteys" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [punch, setPunch] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width * 0.15;
    const y = rect.top + rect.height * 0.1;
    const key = Date.now();
    setPunch({ x, y, key });
    setTimeout(() => setPunch(null), 650);
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed w-full z-50 transition-all ${scrolled ? "bg-black/70 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
      ref={navRef}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/SekTa_LOGO_ilman_tausta.png" alt="SekTa" className="h-9 w-auto drop-shadow" />
          <span className="text-xl font-extrabold tracking-wide text-white">SekTa</span>
        </Link>
        <div className="relative flex gap-2">
          {LINKS.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={handleClick}
              className={({ isActive }) =>
                [
                  "group relative px-3 py-2 font-bold transition select-none",
                  isActive ? "text-orange-400" : "text-white hover:text-orange-300",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    className="absolute left-2 right-2 -bottom-1 h-0.5 bg-gradient-to-r from-[#6b5bd7] to-[#f2a24a] rounded-full"
                    layoutId="nav-underline"
                    initial={false}
                    style={{ opacity: isActive || hovered === i ? 1 : 0 }}
                  />
                  {link.label}
                </>
              )}
            </NavLink>
          ))}

          <AnimatePresence>
            {punch && (
              <motion.div
                key={punch.key}
                className="pointer-events-none fixed z-[60]"
                initial={{ x: punch.x - 120, y: punch.y - 40, rotate: -25, scale: 0.6, opacity: 0 }}
                animate={{ x: punch.x, y: punch.y, rotate: 0, scale: 1.05, opacity: 1 }}
                exit={{ x: punch.x + 40, y: punch.y - 10, rotate: 10, scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18, mass: 0.7 }}
              >
                <img src="/SekTa_LOGO_ilman_tausta.png" alt="Punch" className="w-14 h-14 object-contain drop-shadow-lg" />
                <motion.div
                  className="absolute left-10 top-4 font-black text-orange-400"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  ✶
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
