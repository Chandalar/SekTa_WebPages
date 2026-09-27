import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getPlayerImage } from "../utils/playerMedia";
import { Award, Shield } from "lucide-react";

export default function PlayerCard({ player, index }) {
  const { name, role, img = `/${getPlayerImage(name)}`, video, number } = player;
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, []);

  const isGoalie = role && role.toLowerCase().includes("maali");
  const isDefense = role && role.toLowerCase().includes("puolust");
  const roleCode = isGoalie ? "MV" : isDefense ? "P" : "H";
  const roleBadgeColor = isGoalie
    ? "bg-amber-500/30 text-amber-300 border-amber-400/50"
    : isDefense
      ? "bg-blue-500/30 text-blue-300 border-blue-400/50"
      : "bg-orange-500/30 text-orange-300 border-orange-400/50";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl p-1 bg-gradient-to-b from-white/20 via-white/10 to-transparent hover:from-orange-500/70 hover:via-purple-600/50 hover:to-orange-500/40 border border-white/10 hover:border-orange-500/50 shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => { setHovered(true); videoRef.current?.play(); }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      }}
    >
      {/* Holographic shine sweep on hover */}
      <div className="card-shine" />

      <div className="relative rounded-xl bg-[#141129]/90 backdrop-blur-md p-4 text-center flex flex-col h-full border border-white/5">
        {/* Media Container with badges */}
        <div className="relative mx-auto mb-3 overflow-hidden rounded-xl w-[12rem] h-[22rem] md:w-[15.75rem] md:h-[28rem] bg-black/40 border border-white/10 shadow-inner">
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
            onError={(e) => { e.currentTarget.src = "/gorilla_puku.jpeg"; }}
          />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-lg shadow-lg">
            {number && <span className="text-orange-400 font-mono font-black text-sm">#{number}</span>}
            <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${roleBadgeColor}`}>
              {roleCode}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 z-10 bg-black/75 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg text-[10px] font-black tracking-widest text-white/80 uppercase">
            SEKTA
          </div>
        </div>

        {/* Player Name & Role */}
        <div className="flex items-baseline justify-center gap-2 mb-1">
          <strong className="text-white text-lg font-bold tracking-wide uppercase">{name}</strong>
        </div>
        <div className="text-orange-400 text-xs font-semibold tracking-wider uppercase mb-1">
          {role}
        </div>
      </div>
    </motion.article>
  );
}
