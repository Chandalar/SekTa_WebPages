import Reveal from "../components/Reveal";

export default function History() {
  const SEASONS = [
    { season: "2024–25", league: "Miehet 3. div", games: 18, goalsFor: 96, goalsAgainst: 82, points: 32 },
    { season: "2023–24", league: "Miehet 4. div", games: 20, goalsFor: 110, goalsAgainst: 70, points: 40 },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white mb-6 text-center">Historia</h1>
      <Reveal>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-white/80">
              <tr>
                <th className="p-3">Kausi</th>
                <th className="p-3">Sarja</th>
                <th className="p-3">Ottelut</th>
                <th className="p-3">TM</th>
                <th className="p-3">PM</th>
                <th className="p-3">Pisteet</th>
              </tr>
            </thead>
            <tbody className="text-white/90">
              {SEASONS.map((s) => (
                <tr key={s.season} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className="p-3">{s.season}</td>
                  <td className="p-3">{s.league}</td>
                  <td className="p-3">{s.games}</td>
                  <td className="p-3">{s.goalsFor}</td>
                  <td className="p-3">{s.goalsAgainst}</td>
                  <td className="p-3">{s.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
      <p className="text-white/60 mt-4 text-sm">Voin hakea nämä luvut suoraan Salibandyliiton tulospalvelusta – sano, jos kytketään live-haku.</p>
    </section>
  );
}