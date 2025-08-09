import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function PlayerCard({ player, index }) {
  const { name, role, img = "/SekTa_LOGO_ilman_tausta.png", video, number } = player;
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.load(); // esilataa posteriksi
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
      {/* media-alue – ei turhaa sisädiviä */}
      <div className="relative mx-auto mb-3 overflow-hidden rounded-lg w-[12rem] h-[24rem] md:w-[15.75rem] md:h-[30.375rem]">
        {video && (
          <video
            ref={videoRef}
            src={video}
            muted
            preload="auto"
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
          />
        )}
        <img
          src={img}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}
          onError={(e) => { e.currentTarget.src = "/SekTa_LOGO_ilman_tausta.png"; }}
        />
      </div>

      <div className="flex items-baseline justify-center gap-2">
        <strong className="text-white">{name}</strong>
        {number ? <span className="text-white/60 font-mono">#{number}</span> : null}
      </div>
      <div className="text-orange-400">{role}</div>
    </motion.article>
  );
}
