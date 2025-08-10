export const FIXTURES = [
  { date: "2025-10-04", time: "14:00", home: "SekTa", away: "TBS", venue: "Kupittaa, Turku" },
  { date: "2025-10-18", time: "16:30", home: "SBS Wirmo 2", away: "SekTa", venue: "Mynämäki" },
];

export default function Matches() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-brand text-center mb-4">Ottelut 2025–26</h2>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3">Päivä</th>
              <th className="p-3">Aika</th>
              <th className="p-3">Koti</th>
              <th className="p-3">Vieras</th>
              <th className="p-3">Areena</th>
            </tr>
          </thead>
          <tbody>
            {FIXTURES.map((m, i) => (
              <tr key={i} className="border-t border-white/10 hover:bg-white/5 transition">
                <td className="p-3">{new Date(m.date).toLocaleDateString("fi-FI")}</td>
                <td className="p-3">{m.time}</td>
                <td className="p-3">{m.home}</td>
                <td className="p-3">{m.away}</td>
                <td className="p-3">{m.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}