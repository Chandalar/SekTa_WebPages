import { useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <section className="max-w-6xl mx-auto px-4 py-12 text-white">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Tapahtumakalenteri</h1>

      {/* Tapahtumalista iFrame */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white shadow-md">
        <div style={{ width: 320, margin: "0 auto" }} className="p-2 md:p-4">
          <div style={{ textAlign: "left" }}>
            <a href="https://sekta.nimenhuuto.com/" style={{ fontSize: 16, textDecoration: "none", color: "#444" }}>
              SekTa tapahtumalista
            </a>
            <div>
              »{" "}
              <a style={{ color: "#444", fontSize: 12 }} href="https://sekta.nimenhuuto.com/calendar/monthly">
                Kalenteri
              </a>{" "}
              ·{" "}
              <a style={{ color: "#444", fontSize: 12 }} href="https://sekta.nimenhuuto.com/player">
                Ilmoittautumiset
              </a>
            </div>
          </div>

          <iframe
            title="Nimenhuuto – tapahtumalista"
            style={{ width: 320, height: 420, border: "none", padding: 0, margin: "10px 0 10px 0" }}
            frameBorder="0"
            src="https://sekta.nimenhuuto.com/calendar/widget_iframe_events?css=&height=420&width=320"
            scrolling="auto"
          />

          <div style={{ textAlign: "right", fontWeight: "normal" }}>
            <a
              target="_parent"
              rel="noreferrer"
              href="https://nimenhuuto.com/"
              style={{
                color: "#ff8114",
                fontWeight: "bold",
                fontSize: 20,
                fontFamily: "'Myriad Pro', Helvetica, Arial",
                fontStyle: "italic",
              }}
            >
              Nimenhuuto.com
            </a>
          </div>
        </div>
      </div>

      {/* Kuukausikalenterin toggle */}
      <div className="mt-8 grid gap-3">
        <button
          onClick={() => setShowMonthly((v) => !v)}
          className="justify-self-center px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold"
        >
          {showMonthly ? "Piilota kuukausikalenteri" : "Näytä kuukausikalenteri"}
        </button>

        {showMonthly && (
          <div className="rounded-xl overflow-hidden border border-white/10 bg-white">
            {/* NIMENHUUTO.COM KUUKAUSIKALENTERI – käyttäjän antama upotus */}
            <div style={{ textAlign: "center", backgroundColor: "#fff", border: 0, padding: 0, margin: 0, color: "#000" }}>
              <span style={{ float: "right" }}>
                <a
                  target="_parent"
                  href="https://nimenhuuto.com/"
                  style={{
                    color: "#ff8114",
                    fontWeight: "bold",
                    fontSize: 20,
                    fontFamily: "'Myriad Pro', Helvetica, Arial",
                    fontStyle: "italic",
                  }}
                  rel="noreferrer"
                >
                  Nimenhuuto.com
                </a>
              </span>
              <div style={{ textAlign: "left", padding: "10px" }}>
                <a href="https://sekta.nimenhuuto.com/" style={{ fontSize: 16, textDecoration: "none", color: "#444" }}>
                  SekTa kuukausikalenteri
                </a>
                <div>
                  »{" "}
                  <a style={{ color: "#444", fontSize: 12 }} href="https://sekta.nimenhuuto.com/calendar/monthly">
                    Kalenteri
                  </a>{" "}
                  ·{" "}
                  <a style={{ color: "#444", fontSize: 12 }} href="https://sekta.nimenhuuto.com/player">
                    Ilmoittautumiset
                  </a>
                </div>
              </div>

              <iframe
                style={{ width: "100%", height: 550, border: "none", padding: 0, margin: "10px 0 10px 0" }}
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
