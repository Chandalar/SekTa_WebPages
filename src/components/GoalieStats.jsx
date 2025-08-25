// src/components/GoalieStats.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Award, Target, Shield, TrendingUp, Calendar, Filter } from "lucide-react";
import { AnimatedBarChart, StatsCard, PlayerRadarChart } from "./Charts";
import { getComprehensiveGoalieStats } from "../utils/csvDataLoader";
import Reveal from "./Reveal";

// Player image mapping for goalies
const goalieImageMap = {
  'Mika Ahven': 'Ahven.jpg',
  'Matias Virta': 'Masto.jpg', 
  'Lassi Liukkonen': 'Opa.jpg',
  'Vesa Kurppa': 'Veikka.jpg'
};

const getGoalieImage = (playerName) => {
  return goalieImageMap[playerName] || `${playerName.split(' ')[0]}.jpg`;
};

function GoalieCard({ goalie, onStatsClick, selectedSeason }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get stats for selected season
  const seasonStats = goalie.seasons.find(s => s.season === selectedSeason) || goalie.seasons[0];
  
  if (!seasonStats) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/10 hover:-translate-y-1 transition cursor-pointer group"
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Goalie Photo */}
      <div className="relative mx-auto mb-4 overflow-hidden rounded-lg w-32 h-40">
        <img
          src={`/${getGoalieImage(goalie.name)}`}
          alt={goalie.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "/SekTa_LOGO_ilman_tausta.png"; }}
        />
        
        {/* Stats overlay */}
        <div className="absolute top-2 right-2 bg-black/70 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs text-white space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-green-400">🏆</span>
              <span>{seasonStats.wins || 0}V</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-400">🚫</span>
              <span>{seasonStats.shutouts || 0}NP</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">🥅</span>
              <span>{seasonStats.savePercentage ? `${seasonStats.savePercentage.toFixed(1)}%` : '0%'}</span>
            </div>
          </div>
        </div>
        
        {/* Click indicator */}
        <div className="absolute bottom-2 right-2 bg-orange-500/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Target size={16} className="text-white" />
        </div>
      </div>

      {/* Name and Number */}
      <div className="flex items-baseline justify-center gap-2 mb-3">
        <strong className="text-white text-lg">{goalie.name}</strong>
        {goalie.number ? <span className="text-white/60 font-mono">#{goalie.number}</span> : null}
      </div>
      
      {/* Position */}
      <div className="text-orange-400 font-semibold mb-4">Maalivahti</div>
      
      {/* Season Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-green-500/20 px-3 py-2 rounded text-sm">
          <div className="text-green-400 font-bold">{seasonStats.games || 0}</div>
          <div className="text-white/70 text-xs">Ottelut</div>
        </div>
        <div className="bg-yellow-500/20 px-3 py-2 rounded text-sm">
          <div className="text-yellow-400 font-bold">{seasonStats.savePercentage ? `${seasonStats.savePercentage.toFixed(1)}%` : '0%'}</div>
          <div className="text-white/70 text-xs">Torjunta%</div>
        </div>
        <div className="bg-blue-500/20 px-3 py-2 rounded text-sm">
          <div className="text-blue-400 font-bold">{seasonStats.wins || 0}</div>
          <div className="text-white/70 text-xs">Voitot</div>
        </div>
        <div className="bg-purple-500/20 px-3 py-2 rounded text-sm">
          <div className="text-purple-400 font-bold">{seasonStats.shutouts || 0}</div>
          <div className="text-white/70 text-xs">Nollapelit</div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/20"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">PMO:</span>
                  <span className="text-red-400 font-semibold">
                    {seasonStats.goalsAgainstAverage ? seasonStats.goalsAgainstAverage.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Torjunnat:</span>
                  <span className="text-cyan-400 font-semibold">{seasonStats.saves || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Päästetyt:</span>
                  <span className="text-red-400 font-semibold">{seasonStats.goalsAgainst || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Voitto%:</span>
                  <span className="text-green-400 font-semibold">
                    {seasonStats.games > 0 ? Math.round((seasonStats.wins / seasonStats.games) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatsClick(goalie);
                }}
                className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <Award size={16} />
                Näytä kaikkien kausien tilastot
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function GoalieStats() {
  const [goalies, setGoalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoalie, setSelectedGoalie] = useState(null);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [sortBy, setSortBy] = useState('savePercentage');

  useEffect(() => {
    console.log('🥅 Goalie stats component mounted, loading comprehensive data...');
    loadGoalieStats();
  }, []);

  const loadGoalieStats = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading comprehensive goalie statistics...');
      
      const goalieData = await getComprehensiveGoalieStats();
      
      if (goalieData.goalies.length > 0) {
        setGoalies(goalieData.goalies);
        setAvailableSeasons(goalieData.seasons);
        setSelectedSeason(goalieData.seasons[0] || '');
        
        console.log(`✅ Loaded ${goalieData.goalies.length} goalies with ${goalieData.seasons.length} seasons`);
        
        // Log detailed goalie data
        goalieData.goalies.forEach(goalie => {
          console.log(`🥅 ${goalie.name}: ${goalie.seasons.length} seasons, career: ${goalie.careerStats?.totalGames} games`);
        });
      } else {
        console.log('⚠️ No goalie data found');
      }
    } catch (error) {
      console.error('❌ Error loading goalie statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalieClick = (goalie) => {
    setSelectedGoalie(goalie);
  };

  // Filter goalies who played in selected season
  const seasonGoalies = goalies.filter(goalie => 
    goalie.seasons.some(season => season.season === selectedSeason)
  );

  // Sort goalies
  const sortedGoalies = seasonGoalies.sort((a, b) => {
    const aSeason = a.seasons.find(s => s.season === selectedSeason);
    const bSeason = b.seasons.find(s => s.season === selectedSeason);
    
    if (!aSeason) return 1;
    if (!bSeason) return -1;
    
    return (bSeason[sortBy] || 0) - (aSeason[sortBy] || 0);
  });

  // Calculate team totals for selected season
  const teamTotals = seasonGoalies.reduce((totals, goalie) => {
    const seasonStats = goalie.seasons.find(s => s.season === selectedSeason);
    if (seasonStats) {
      totals.totalGames += seasonStats.games || 0;
      totals.totalSaves += seasonStats.saves || 0;
      totals.totalGoalsAgainst += seasonStats.goalsAgainst || 0;
      totals.totalWins += seasonStats.wins || 0;
      totals.totalShutouts += seasonStats.shutouts || 0;
    }
    return totals;
  }, { totalGames: 0, totalSaves: 0, totalGoalsAgainst: 0, totalWins: 0, totalShutouts: 0 });

  const teamSavePercentage = teamTotals.totalSaves + teamTotals.totalGoalsAgainst > 0 
    ? (teamTotals.totalSaves / (teamTotals.totalSaves + teamTotals.totalGoalsAgainst)) * 100 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Ladataan maalivahdin tilastoja...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Shield className="text-orange-400" size={32} />
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Maalivahdit Tilastot
              </h1>
            </div>
            
            <p className="text-xl text-white/70 mb-8">
              Kattavat maalivahdin tilastot kaikista kausista
            </p>
            
            {/* Season Selector */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Calendar className="text-white/70" size={20} />
              <span className="text-white/70">Kausi:</span>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                {availableSeasons.map(season => (
                  <option key={season} value={season} className="bg-gray-800">
                    {season}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Reload Button */}
            <button 
              onClick={loadGoalieStats}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
            >
              🔄 Päivitä tilastot
            </button>
          </div>
        </Reveal>

        {/* Team Totals */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            <StatsCard
              title="Yhteensä otteluja"
              value={teamTotals.totalGames}
              icon="🥅"
              color="#10b981"
            />
            <StatsCard
              title="Yhteensä torjuntoja"
              value={teamTotals.totalSaves}
              icon="🛡️"
              color="#06b6d4"
            />
            <StatsCard
              title="Joukkueen torjunta%"
              value={`${teamSavePercentage.toFixed(1)}%`}
              icon="📊"
              color="#8b5cf6"
            />
            <StatsCard
              title="Yhteensä voittoja"
              value={teamTotals.totalWins}
              icon="🏆"
              color="#f59e0b"
            />
            <StatsCard
              title="Yhteensä nollapelejä"
              value={teamTotals.totalShutouts}
              icon="🚫"
              color="#ef4444"
            />
          </div>
        </Reveal>

        {/* Sorting */}
        <Reveal delay={0.2}>
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-white/70" size={20} />
                <span className="text-white/70">Järjestä:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="savePercentage">Torjuntaprosentti</option>
                  <option value="games">Ottelut</option>
                  <option value="wins">Voitot</option>
                  <option value="shutouts">Nollapelit</option>
                  <option value="saves">Torjunnat</option>
                </select>
              </div>
            </div>
            
            <div className="text-white/60 text-sm">
              {sortedGoalies.length} maalivahti(a) kaudella {selectedSeason}
            </div>
          </div>
        </Reveal>

        {/* Save Percentage Chart */}
        {sortedGoalies.length > 0 && (
          <Reveal delay={0.3}>
            <div className="mb-12">
              <AnimatedBarChart
                data={sortedGoalies.map(goalie => {
                  const seasonStats = goalie.seasons.find(s => s.season === selectedSeason);
                  return {
                    name: goalie.name.split(' ')[0],
                    torjuntaprosentti: seasonStats?.savePercentage || 0,
                    ottelut: seasonStats?.games || 0,
                    voitot: seasonStats?.wins || 0
                  };
                })}
                title={`Maalivahdin suoritukset - ${selectedSeason}`}
                height={400}
              />
            </div>
          </Reveal>
        )}

        {/* Goalies Grid */}
        <Reveal delay={0.4}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedGoalies.map((goalie, i) => (
              <GoalieCard 
                key={goalie.name} 
                goalie={goalie} 
                onStatsClick={handleGoalieClick}
                selectedSeason={selectedSeason}
              />
            ))}
          </div>
        </Reveal>

        {/* No Data Message */}
        {sortedGoalies.length === 0 && !loading && (
          <Reveal delay={0.5}>
            <div className="text-center py-12">
              <div className="text-white/60 text-lg mb-4">
                Ei maalivahdin tilastoja valitulle kaudelle
              </div>
              <button
                onClick={loadGoalieStats}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Lataa tilastot uudelleen
              </button>
            </div>
          </Reveal>
        )}

        {/* Goalie Detail Modal */}
        <AnimatePresence>
          {selectedGoalie && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedGoalie(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900/95 rounded-xl p-6 max-w-4xl w-full border border-white/20 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedGoalie.name}
                      <span className="ml-2 text-sm bg-orange-500 px-2 py-1 rounded-full">
                        Maalivahti #{selectedGoalie.number}
                      </span>
                    </h3>
                    <div className="text-white/70 text-sm mt-1">
                      {selectedGoalie.seasons.length} kautta uralla
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedGoalie(null)}
                    className="text-white/60 hover:text-white transition text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Career Stats */}
                {selectedGoalie.careerStats && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4">Uratilastot</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatsCard
                        title="Ottelut yhteensä"
                        value={selectedGoalie.careerStats.totalGames}
                        icon="🥅"
                        color="#10b981"
                      />
                      <StatsCard
                        title="Voitot yhteensä"
                        value={selectedGoalie.careerStats.totalWins}
                        icon="🏆"
                        color="#f59e0b"
                      />
                      <StatsCard
                        title="Keskimääräinen torjunta%"
                        value={`${selectedGoalie.careerStats.avgSavePercentage.toFixed(1)}%`}
                        icon="🛡️"
                        color="#8b5cf6"
                      />
                      <StatsCard
                        title="Nollapelit yhteensä"
                        value={selectedGoalie.careerStats.totalShutouts}
                        icon="🚫"
                        color="#06b6d4"
                      />
                    </div>
                  </div>
                )}

                {/* Season History */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Kausihistoria</h4>
                  <div className="space-y-3">
                    {selectedGoalie.seasons.map((season, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <span className="text-white font-semibold">{season.season}</span>
                        </div>
                        <div className="grid grid-cols-6 gap-6 text-sm">
                          <div className="text-center">
                            <div className="text-green-400 font-bold">{season.games}</div>
                            <div className="text-white/60 text-xs">Ottelut</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 font-bold">{season.savePercentage?.toFixed(1)}%</div>
                            <div className="text-white/60 text-xs">Torjunta%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 font-bold">{season.wins}</div>
                            <div className="text-white/60 text-xs">Voitot</div>
                          </div>
                          <div className="text-center">
                            <div className="text-purple-400 font-bold">{season.shutouts}</div>
                            <div className="text-white/60 text-xs">Nollapelit</div>
                          </div>
                          <div className="text-center">
                            <div className="text-cyan-400 font-bold">{season.saves}</div>
                            <div className="text-white/60 text-xs">Torjunnat</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-400 font-bold">{season.goalsAgainst}</div>
                            <div className="text-white/60 text-xs">Päästetyt</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Chart */}
                <div>
                  <PlayerRadarChart
                    data={[
                      { subject: 'Ottelut', A: selectedGoalie.careerStats?.totalGames || 0 },
                      { subject: 'Torjunta%', A: selectedGoalie.careerStats?.avgSavePercentage || 0 },
                      { subject: 'Voitot', A: selectedGoalie.careerStats?.totalWins || 0 },
                      { subject: 'Nollapelit', A: (selectedGoalie.careerStats?.totalShutouts || 0) * 5 }, // Scale up for visibility
                      { subject: 'Torjunnat', A: Math.min((selectedGoalie.careerStats?.totalSaves || 0) / 20, 100) }, // Scale down
                      { subject: 'Voitto%', A: selectedGoalie.careerStats?.totalGames > 0 
                        ? ((selectedGoalie.careerStats?.totalWins || 0) / selectedGoalie.careerStats?.totalGames) * 100 
                        : 0 }
                    ]}
                    title={`${selectedGoalie.name} - Uran suoritusprofiili`}
                    height={350}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}