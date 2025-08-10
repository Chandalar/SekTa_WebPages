import React from "react";

/**
 * NimenhuutoWidget (iframe-vapaa)
 * Hakee iCal/ICS:n, parsii VEVENTit ja näyttää ne sivuston tyyleillä.
 *
 * HUOM: Usein CORS estää suoran haun selaimesta. Jos näin käy,
 * lisää proxy (esim. /api/ics?url=...) ja anna sen url propina `proxyUrl`.
 */
export default function NimenhuutoWidget({
  title = "Tapahtumat",
  icsUrl,
  proxyUrl,        // esim. "/api/ics?url="
  limit = 10,
  showFilters = true,
}) {
  const [raw, setRaw] = React.useState("");
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [filter, setFilter] = React.useState("Kaikki"); // Kaikki | Harkka | Matsi | Muu
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  React.useEffect(() => {
    if (!icsUrl) {
      setError("Puuttuva iCal-osoite.");
      setLoading(false);
      return;
    }
    const url = proxyUrl ? `${proxyUrl}${encodeURIComponent(icsUrl)}` : icsUrl;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!isMounted.current) return;
        setRaw(text);
      } catch (e) {
        setError(
          "Kalenterin nouto epäonnistui. Todennäköisesti CORS estää suoran haun. " +
          "Voit kiertää tämän lisäämällä pienen proxy-pään (esim. /api/ics?url=...)."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [icsUrl, proxyUrl]);

  React.useEffect(() => {
    if (!raw) { setEvents([]); return; }
    const parsed = parseICS(raw)
      .filter(ev => ev.start)                 // varmuuden vuoksi
      .sort((a,b) => a.start - b.start)       // aikajärjestys
      .filter(ev => ev.end >= new Date());    // pois menneet

    setEvents(parsed);
  }, [raw]);

  const filtered = events.filter(ev => {
    if (filter === "Kaikki") return true;
    const tag = classify(ev);
    return tag === filter;
  });

  const shown = filtered.slice(0, limit);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 text-left">
      <header className="flex items-end justify-between gap-4 mb-3">
        <h2 className="text-xl font-bold">{title}</h2>

        {showFilters && (
          <div className="flex gap-2 text-sm">
            {["Kaikki","Harkka","Matsi","Muu"].map(k => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-3 py-1 rounded-lg border transition
                 ${filter===k ? "bg-orange-500 text-black border-orange-400" : "border-white/15 hover:border-white/30"}`}
              >
                {k}
              </button>
            ))}
          </div>
        )}
      </header>

      {loading && <p className="text-white/70">Ladataan kalenteria…</p>}
      {!loading && error && (
        <div className="text-red-300 text-sm leading-relaxed">
          {error}
        </div>
      )}

      {!loading && !error && shown.length === 0 && (
        <p className="text-white/70">Ei tulevia tapahtumia.</p>
      )}

      <ul className="grid gap-3">
        {shown.map((ev, i) => (
          <li key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-white/70 whitespace-nowrap">
                {formatDate(ev.start)} • {formatTime(ev.start, ev.end)}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${
                badgeClass(classify(ev))
              }`}>
                {classify(ev)}
              </span>
            </div>
            <div className="mt-1 font-semibold">{ev.summary || "Tapahtuma"}</div>
            {ev.location && (
              <div className="text-sm text-white/70">{ev.location}</div>
            )}
            {(ev.description || ev.url) && (
              <div className="mt-2 text-sm text-white/80 leading-relaxed">
                {ev.description && <p className="whitespace-pre-wrap">{ev.description}</p>}
                {ev.url && (
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-1 text-orange-400 underline underline-offset-2"
                  >
                    Avaa tapahtuma
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <footer className="mt-3 text-right text-xs text-white/50">
        Lähde: Nimenhuuto iCal
      </footer>
    </section>
  );
}

/* ----------------- Utils ----------------- */

function parseICS(text) {
  // Yksinkertainen ICS-parsija (riittää Nimenhuudon feediin)
  const lines = text.replace(/\r/g, "").split("\n");

  // Taita "continued" rivit (rivit jotka alkavat välilyönnillä)
  const folded = [];
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    if (cur.startsWith(" ") && folded.length) {
      folded[folded.length - 1] += cur.slice(1);
    } else {
      folded.push(cur);
    }
  }

  const events = [];
  let cur = null;

  for (const ln of folded) {
    if (ln === "BEGIN:VEVENT") {
      cur = {};
    } else if (ln === "END:VEVENT") {
      if (cur) events.push(cleanEvent(cur));
      cur = null;
    } else if (cur) {
      const [k, ...rest] = ln.split(":");
      const v = rest.join(":");

      if (!k || !v) continue;

      if (k.startsWith("DTSTART")) cur.DTSTART = v;
      else if (k.startsWith("DTEND")) cur.DTEND = v;
      else if (k.startsWith("SUMMARY")) cur.SUMMARY = v;
      else if (k.startsWith("LOCATION")) cur.LOCATION = v;
      else if (k.startsWith("DESCRIPTION")) cur.DESCRIPTION = v;
      else if (k.startsWith("URL")) cur.URL = v;
    }
  }

  return events;
}

function cleanEvent(raw) {
  const parseDate = (s) => {
    // Muodot: 20250811T183000Z tai 20250811T183000
    if (!s) return null;
    // Jos päättyy Z -> UTC
    if (s.endsWith("Z")) return new Date(s);
    // Ilman aikavyöhykettä – tulkitaan paikallisena
    const y = +s.slice(0, 4);
    const m = +s.slice(4, 6) - 1;
    const d = +s.slice(6, 8);
    const H = +s.slice(9, 11) || 0;
    const M = +s.slice(11, 13) || 0;
    const S = +s.slice(13, 15) || 0;
    return new Date(y, m, d, H, M, S);
  };

  return {
    start: parseDate(raw.DTSTART),
    end: parseDate(raw.DTEND) || parseDate(raw.DTSTART),
    summary: decodeICS(raw.SUMMARY),
    location: decodeICS(raw.LOCATION),
    description: decodeICS(raw.DESCRIPTION),
    url: raw.URL || "",
  };
}

function decodeICS(s = "") {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .trim();
}

function formatDate(d) {
  try {
    return new Intl.DateTimeFormat("fi-FI", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

function formatTime(start, end) {
  const fmt = (x) =>
    new Intl.DateTimeFormat("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(x);
  return `${fmt(start)}–${fmt(end)}`;
}

function classify(ev) {
  const s = `${ev.summary || ""} ${ev.description || ""}`.toLowerCase();
  if (/\bmatsi|\bpeli|\bottelu|\bgame/.test(s)) return "Matsi";
  if (/harkka|harjoit|treen/.test(s)) return "Harkka";
  return "Muu";
}

function badgeClass(tag) {
  switch (tag) {
    case "Matsi":   return "border-red-400/40 bg-red-400/10";
    case "Harkka":  return "border-emerald-400/40 bg-emerald-400/10";
    default:        return "border-white/20 bg-white/5";
  }
}
