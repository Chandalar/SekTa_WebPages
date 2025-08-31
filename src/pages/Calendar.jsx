import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Näyttää vain:
 * 1) Nimenhuudon tapahtumalistan (iFrame)
 * 2) Napin, jolla voi avata/piilottaa kuukausikalenterin (iFrame)
 *
 * Ei yritä hakea CSV/ICS-dataa selaimessa (CORS).
 */
export default function Calendar() {
  const [showMonthly, setShowMonthly] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <section className="max-w-6xl mx-auto px-4 py-12 text-white">
      <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-[#6b5bd7] to-[#f2a24a] bg-clip-text text-transparent">Tapahtumakalenteri</h1>

      {/* Tapahtumalista iFrame */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-md shadow-lg transform hover:shadow-xl transition duration-300">
        <div style={{ width: 320, margin: "0 auto" }} className="p-2 md:p-4">
          <div style={{ textAlign: "left" }}>
            <a href="https://sekta.nimenhuuto.com/" style={{ fontSize: 16, textDecoration: "none", color: "#ecebff", fontWeight: "bold" }}>
              SekTa tapahtumalista
            </a>
            <div>
              »{" "}
              <a style={{ color: "#b7b3d9", fontSize: 12 }} href="https://sekta.nimenhuuto.com/calendar/monthly" className="hover:text-white transition-colors">
                Kalenteri
              </a>{" "}
              ·{" "}
              <a style={{ color: "#b7b3d9", fontSize: 12 }} href="https://sekta.nimenhuuto.com/player" className="hover:text-white transition-colors">
                Ilmoittautumiset
              </a>
            </div>
          </div>

          <iframe
            title="Nimenhuuto – tapahtumalista"
            style={{ 
              width: 320, 
              height: 420, 
              border: "none", 
              padding: 0, 
              margin: "10px 0 10px 0",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
            }}
            frameBorder="0"
            src="https://sekta.nimenhuuto.com/calendar/widget_iframe_events?css=&height=420&width=320"
            scrolling="auto"
          />

          <div style={{ textAlign: "right", fontWeight: "normal", marginTop: "4px" }}>
            <a
              target="_parent"
              rel="noreferrer"
              href="https://nimenhuuto.com/"
              style={{
                color: "#f2a24a",
                fontWeight: "bold",
                fontSize: 20,
                fontFamily: "'Myriad Pro', Helvetica, Arial",
                fontStyle: "italic",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)"
              }}
            >
              Nimenhuuto.com
            </a>
          </div>
        </div>
      </div>

      {/* Kuukausikalenterin toggle */}
      <div className="flex flex-col items-center gap-6 mt-8">
        <button
          onClick={() => setShowMonthly((v) => !v)}
          className="px-5 py-2 bg-gradient-to-r from-[#6b5bd7] to-[#f2a24a] hover:shadow-lg rounded-full text-sm font-bold shadow-lg transition flex items-center gap-2 transform hover:scale-105"
        >
          <CalendarIcon size={18} className="text-white" />
          {showMonthly ? "Piilota kalenteri" : "Näytä kalenteri"}
          {showMonthly ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showMonthly && (
          <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-md shadow-lg w-full max-w-4xl transform transition-all duration-300">
            {/* NIMENHUUTO.COM KUUKAUSIKALENTERI – käyttäjän antama upotus */}
            <div style={{ textAlign: "center", backgroundColor: "rgba(20, 17, 41, 0.7)", border: 0, padding: 0, margin: 0, color: "#ecebff", borderRadius: "8px" }}>
              <span style={{ float: "right" }}>
                <a
                  target="_parent"
                  href="https://nimenhuuto.com/"
                  style={{
                    color: "#f2a24a",
                    fontWeight: "bold",
                    fontSize: 20,
                    fontFamily: "'Myriad Pro', Helvetica, Arial",
                    fontStyle: "italic",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                  }}
                  rel="noreferrer"
                >
                  Nimenhuuto.com
                </a>
              </span>
              <div style={{ textAlign: "left", padding: "10px" }}>
                <a href="https://sekta.nimenhuuto.com/" style={{ fontSize: 16, textDecoration: "none", color: "#ecebff", fontWeight: "bold" }}>
                  SekTa kuukausikalenteri
                </a>
                <div>
                  »{" "}
                  <a style={{ color: "#b7b3d9", fontSize: 12 }} href="https://sekta.nimenhuuto.com/calendar/monthly" className="hover:text-white transition-colors">
                    Kalenteri
                  </a>{" "}
                  ·{" "}
                  <a style={{ color: "#b7b3d9", fontSize: 12 }} href="https://sekta.nimenhuuto.com/player" className="hover:text-white transition-colors">
                    Ilmoittautumiset
                  </a>
                </div>
              </div>

              <iframe
                style={{ 
                  width: "100%", 
                  height: 550, 
                  border: "none", 
                  padding: 0, 
                  margin: "10px 0 10px 0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                }}
                frameBorder="0"
                src="https://sekta.nimenhuuto.com/calendar/widget_iframe_monthly_calendar?css=&height=550"
                scrolling="auto"
                title="Nimenhuuto – kuukausikalenteri"
              />
            </div>
            {/* /NIMENHUUTO.COM KUUKAUSIKALENTERI */}
          </div>
        )}
      </div>
      </section>
    </div>
  );
}
