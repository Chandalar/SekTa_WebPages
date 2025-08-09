// src/Team.jsx
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const PLAYERS = [
  { name: "Mika Aaltonen", role: "Hyökkääjä", img: "/mika.jpg", video: "/mika.mp4", number: 19 },
  { name: "Petri Vikman", role: "Hyökkääjä", img: "/Petri.jpg", video: "/Petri.mp4", number: 22 },
  { name: "Miika Oja-Nisula", role: "Hyökkääjä", img: "/Miika.jpg", video: "/Miika.mp4", number: 66 },
  { name: "Akseli Nykänen", role: "Hyökkääjä", img: "/Akseli.jpg", video: "/Akseli.mp4", number: 15 },
  { name: "Jukka-Pekka Laine, aka Juki", role: "Hyökkääjä", img: "/Juki.jpg", video: "/Juki.mp4", number: 11 },
  { name: "Aleksi Tuokko, aka Alex", role: "Hyökkääjä", img: "/Aleksi.jpg", video: "/Aleksi.mp4", number: 97 },
  { name: "Joni Vainio", role: "Hyökkääjä", img: "/Joni.jpg", video: "/Joni.mp4", number: 13 },
  { name: "Jimi Laaksonen, aka Jimbo", role: "Hyökkääjä", img: "/Jimi.jpg", video: "/Jimi.mp4", number: 20 },
  { name: "Vesa Halme", role: "Puolustaja", img: "/Vesku.jpg", video: "/Vesku.mp4", number: 55 },
  { name: "Juha Kiilunen aka Masto", role: "Puolustaja", img: "/Masto.jpg", video: "/Masto.mp4", number: 71 },
  { name: "Ville Mäenranta", role: "Puolustaja", img: "/Ville.jpg", video: "/Ville.mp4", number: 28 },
  { name: "Henri Kananen aka Kana", role: "Puolustaja", img: "/Kananen.jpg", video: "/Kananen.mp4", number: 42 },
  { name: "Pelaaja #3", role: "Hyökkääjä", img: "/SekTa_LOGO_ilman_tausta.png", number: 27 },
];

function PlayerCard({ p, index }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/10 hover:-translate-y-1 transition"
      onMouseEnter={() => { setHovered(true); videoRef.current?.play(); }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      }}
    >
      {/* Kortin media-alue: ei turhaa sisädiviä */}
      <div className="relative mx-auto mb-3 overflow-hidden rounded-lg w-[12rem] h-[24rem] md:w-[15.75rem] md:h-[30.375rem]">
        {p.video && (
          <video
            ref={videoRef}
            src={p.video}
            muted
            preload="auto"
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
          />
        )}
        <img
          src={p.img}
          alt={p.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}
          onError={(e) => { e.currentTarget.src = "/SekTa_LOGO_ilman_tausta.png"; }}
        />
      </div>

      <div className="flex items-baseline justify-center gap-2">
        <strong className="text-white">{p.name}</strong>
        {p.number ? <span className="text-white/60 font-mono">#{p.number}</span> : null}
      </div>
      <div className="text-orange-400">{p.role}</div>
    </motion.article>
  );
}

export default function Team() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-extrabold text-white text-center mb-8">Joukkue</h1>
      <p className="text-white/70 text-center mb-8">
        Lisäämme pelaajien oikeat kuvat myöhemmin – nyt placeholderina SekTa-logo.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {PLAYERS.map((p, i) => (
          <PlayerCard key={p.name} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
