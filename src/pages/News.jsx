export default function News() {
  const NEWS = [
    { title:"Uusi kausi käyntiin", date:"2025-09-15", text:"Harjoituspelit starttaavat – tervetuloa kannustamaan!" },
    { title:"Seuran talkoot", date:"2025-09-28", text:"Jäähallin kunnostustalkoot – kaikki mukaan." },
    { title:"Kapteenisto valittu", date:"2025-10-05", text:"Kapteenisto julkaistaan some-kanavissa." },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-brand text-center mb-4">Uutiset & Some</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {NEWS.map((n) => (
          <article key={n.title} className="bg-card border border-white/10 rounded-xl p-4 hover:-translate-y-1 transition">
            <div className="text-xs text-muted">{new Date(n.date).toLocaleDateString("fi-FI")}</div>
            <h3 className="mt-2 font-bold">{n.title}</h3>
            <p className="text-muted mt-1">{n.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
