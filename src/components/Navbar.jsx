import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { to: "/", label: "Etusivu" },
  { to: "/history", label: "Historia" },
  { to: "/team", label: "Joukkue" },
  { to: "/statistics", label: "Tilastot" },
  { to: "/tactics", label: "Taktiikka" },
  { to: "/contact", label: "Yhteys" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed w-full top-0 left-0 z-50 transition-all ${scrolled ? "bg-gradient-to-br from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-md shadow-lg" : "bg-gradient-to-br from-gray-900/60 via-blue-900/60 to-purple-900/60 backdrop-blur-sm"}`}
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
        </div>
      </div>
    </motion.nav>
  );
}