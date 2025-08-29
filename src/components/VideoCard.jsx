export default function VideoCard({ title, src, poster = "/SekTa_LOGO_ilman_tausta.png" }) {
  return (
    <article className="bg-card border border-white/10 rounded-xl overflow-hidden max-w-xl mx-auto">
      <div className="p-0">
        <video controls playsInline poster={poster} className="w-full block rounded-none">
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <strong className="text-lg">{title}</strong>
          <div className="text-muted text-sm">Viikon pelaaja</div>
        </div>
        <img src="/gorilla_puku.jpeg" alt="SekTa" className="h-10 drop-shadow" />
      </div>
    </article>
  );
}
