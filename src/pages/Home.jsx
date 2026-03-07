import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BarChart3, Users, Target, Calendar, Trophy, ChevronDown } from "lucide-react";
import StandingsTable from "../components/StandingsTable";
import Reveal from "../components/Reveal";

export default function Home() {
  const [showMonthly, setShowMonthly] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-x-hidden pt-16">
      {/* HERO SECTION with centered logo */}
      <div className="relative z-10 min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center">
        <div className="flex flex-col items-center">
          <motion.img
            src="/SekTa_LOGO_ilman_tausta.png"
            alt="SekTa Logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-40 sm:w-48 lg:w-56 mb-8 drop-shadow-2xl"
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-5xl font-extrabold drop-shadow-xl mb-20"
          >
            Tervetuloa SekTa Salibandyn kotisivuille
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col items-center gap-6 mt-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/team"
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2"
              >
                <Users size={20} />
                Joukkue
              </Link>
              <Link
                to="/statistics"
                className="px-8 py-4 bg-purple-500 hover:bg-purple-600 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2"
              >
                <BarChart3 size={20} />
                Tilastot
              </Link>
              <button
                onClick={() => document.getElementById('sarjataulukko').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2 text-white"
              >
                <Trophy size={20} />
                Sarjataulukko
              </button>
              <Link
                to="/tactics"
                className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2"
              >
                <Target size={20} />
                Kokoonpanot
              </Link>
            </div>

            <div className="flex flex-col items-center gap-2 text-white/40 animate-bounce mt-8">
              <span className="text-xs uppercase tracking-widest font-bold">Selaa alas</span>
              <ChevronDown size={20} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* SARJATAULUKKO SECTION */}
      <section id="sarjataulukko" className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Sarjataulukko</h2>
              <p className="text-white/60">Seuraa SekTan etenemistä 3. divisioonassa</p>
            </div>
            <StandingsTable />
          </Reveal>
        </div>
      </section>

      {/* CALENDAR SECTION */}
      <section className="py-24 px-4 relative bg-black/20">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Tapahtumakalenteri</h2>
              <p className="text-white/60">Tulevat pelit ja harjoitukset Nimenhuudossa</p>
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowMonthly((v) => !v)}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold shadow-lg transition flex items-center gap-2 backdrop-blur-md border border-white/10"
              >
                <Calendar size={18} className="text-blue-400" />
                {showMonthly ? "Piilota kalenteri" : "Näytä kalenteri"}
              </button>
            </div>

            {showMonthly && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl overflow-hidden border border-white/10 bg-white shadow-2xl"
              >
                {/* NIMENHUUTO.COM KUUKAUSIKALENTERI */}
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
                    style={{ width: "100%", height: 400, border: "none", padding: 0, margin: "10px 0 10px 0" }}
                    frameBorder="0"
                    src="https://sekta.nimenhuuto.com/calendar/widget_iframe_monthly_calendar?css=&height=400"
                    scrolling="auto"
                    title="Nimenhuuto – kuukausikalenteri"
                  />
                </div>
                {/* /NIMENHUUTO.COM KUUKAUSIKALENTERI */}
              </motion.div>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}