import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Target } from "lucide-react";
import NimenhuutoWidget from "../components/NimenhuutoWidget";
import Reveal from "../components/Reveal";
import { StatsCard, AnimatedBarChart } from "../components/Charts";
import { getCurrentSeasonStats } from "../utils/csvDataLoader";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      console.log('📈 Loading quick stats from CSV...');
      const data = await getCurrentSeasonStats();
      
      if (data && data.players) {
        const quickStats = {
          totalGoals: data.totalGoals || 0,
          totalAssists: data.totalAssists || 0,
          totalPoints: data.totalPoints || 0,
          totalPlayers: data.totalPlayers || 0,
          topScorers: data.players
            .sort((a, b) => (b.goals || 0) - (a.goals || 0))
            .slice(0, 5)
        };
        
        console.log('✅ Quick stats loaded:', quickStats);
        setStats(quickStats);
      } else {
        console.log('⚠️ No data available, using fallback');
        setStats({
          totalGoals: 0,
          totalAssists: 0,
          totalPoints: 0,
          totalPlayers: 0,
          topScorers: []
        });
      }
    } catch (error) {
      console.error('❌ Error loading quick stats:', error);
      // Fallback to empty stats instead of failing
      setStats({
        totalGoals: 0,
        totalAssists: 0,
        totalPoints: 0,
        totalPlayers: 0,
        topScorers: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-x-hidden">
      {/* HERO SECTION with centered logo */}
      <div className="relative z-10 h-[90vh] flex items-center justify-center text-center">
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
            className="text-3xl sm:text-5xl font-extrabold drop-shadow-xl"
          >
            Tervetuloa SekTa Salibandyn kotisivuille
          </motion.h1>

          <Reveal delay={0.35}>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/joukkue"
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2"
              >
                <Users size={20} />
                Tutustu joukkueeseen
              </Link>
              <Link
                to="/tilastot"
                className="px-8 py-4 bg-purple-500 hover:bg-purple-600 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2"
              >
                <BarChart3 size={20} />
                Katso tilastot
              </Link>
              <Link
                to="/taktiikka"
                className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-full text-lg font-semibold shadow-lg transition flex items-center gap-2"
              >
                <Target size={20} />
                Kokoonpanot
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* QUICK STATS SECTION */}
      {stats && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-bold text-center mb-12">Kauden 2024-25 tilastoja</h2>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Reveal delay={0.1}>
              <StatsCard
                title="Pelaajia"
                value={stats.totalPlayers}
                icon="👥"
                color="#10b981"
              />
            </Reveal>
            <Reveal delay={0.2}>
              <StatsCard
                title="Maaleja"
                value={stats.totalGoals}
                icon="⚽"
                color="#f97316"
              />
            </Reveal>
            <Reveal delay={0.3}>
              <StatsCard
                title="Syöttöjä"
                value={stats.totalAssists}
                icon="🎯"
                color="#06b6d4"
              />
            </Reveal>
            <Reveal delay={0.4}>
              <StatsCard
                title="Pisteitä"
                value={stats.totalPoints}
                icon="🏆"
                color="#8b5cf6"
              />
            </Reveal>
          </div>

          {/* Top Scorers Widget */}
          {stats.topScorers.length > 0 && (
            <Reveal delay={0.5}>
              <div className="mb-12">
                <AnimatedBarChart
                  data={stats.topScorers.map(player => ({
                    name: player.name.split(' ')[0],
                    maalit: player.goals,
                    pisteet: player.points
                  }))}
                  title="Top 5 maalintekijää"
                  xKey="name"
                  yKey="maalit"
                  color="#f97316"
                  height={300}
                />
              </div>
            </Reveal>
          )}

          {/* Interactive Team Performance */}
          <Reveal delay={0.6}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/10 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center">Joukkueen suoritus</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <motion.div 
                    className="text-4xl font-bold text-orange-400 mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", duration: 1 }}
                    viewport={{ once: true }}
                  >
                    {stats.totalPlayers > 0 ? (stats.totalGoals / stats.totalPlayers).toFixed(1) : '0.0'}
                  </motion.div>
                  <div className="text-white/70">Maaleja/pelaaja</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-4xl font-bold text-cyan-400 mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    {stats.totalPlayers > 0 ? (stats.totalAssists / stats.totalPlayers).toFixed(1) : '0.0'}
                  </motion.div>
                  <div className="text-white/70">Syöttöjä/pelaaja</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-4xl font-bold text-purple-400 mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", duration: 1, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {stats.totalPlayers > 0 ? (stats.totalPoints / stats.totalPlayers).toFixed(1) : '0.0'}
                  </motion.div>
                  <div className="text-white/70">Pisteitä/pelaaja</div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Link
                  to="/tilastot"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 rounded-full font-semibold transition shadow-lg"
                >
                  <TrendingUp size={20} />
                  Katso yksityiskohtaiset tilastot
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* CONTENT SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-12">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold">Harjoitukset & poissaolot</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <NimenhuutoWidget />
        </Reveal>
      </section>
    </div>
  );
}
