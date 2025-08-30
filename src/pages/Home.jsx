import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BarChart3, Users, Target, Calendar } from "lucide-react";

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
            className="flex flex-col items-center gap-10 mt-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/team"
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2"
              >
                <Users size={20} />
                Tutustu joukkueeseen
              </Link>
              <Link
                to="/statistics"
                className="px-8 py-4 bg-purple-500 hover:bg-purple-600 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2"
              >
                <BarChart3 size={20} />
                Katso tilastot
              </Link>
              <Link
                to="/tactics"
                className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2"
              >
                <Target size={20} />
                Kokoonpanot
              </Link>
              <button
                onClick={() => setShowMonthly((v) => !v)}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-sm font-semibold shadow-lg transition flex items-center gap-2"
              >
                <Calendar size={16} />
                {showMonthly ? "Piilota kalenteri" : "Näytä kalenteri"}
              </button>
            </div>

            {showMonthly && (
              <div className="w-full max-w-3xl rounded-xl overflow-hidden border border-white/10 bg-white mb-10">
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
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}