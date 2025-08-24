// src/Team.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BarChart3, TrendingUp, Target, Award, Users, Filter, Calendar } from "lucide-react";
import { AnimatedBarChart, AnimatedPieChart, PlayerRadarChart, StatsCard } from "../components/Charts";
import { getAllStats, debugExcelStructure, createCSVFromExcel, getPlayerStatsFromCSV, createTestCSV, getPlayerStatsForSeason } from "../utils/excelAnalyzer";
import Reveal from "../components/Reveal";

const PLAYERS = [
  { name: "Mika Aaltonen", role: "Hyökkääjä", img: "/mika.jpg", video: "/mika.mp4", number: 19 },
  { name: "Petri Vikman", role: "Hyökkääjä", img: "/Petri.jpg", video: "/Petri.mp4", number: 22 },
  { name: "Miika Oja-Nisula", role: "Hyökkääjä", img: "/Miika.jpg", video: "/Miika.mp4", number: 66 },
  { name: "Akseli Nykänen", role: "Hyökkääjä", img: "/Akseli.jpg", video: "/Akseli.mp4", number: 15 },
  { name: "Jukka-Pekka Laine, aka Juki", role: "Hyökkääjä", img: "/Juki.jpg", video: "/Juki.mp4", number: 11 },
  { name: "Aleksi Tuokko, aka Alex", role: "Hyökkääjä", img: "/Aleksi.jpg", video: "/Aleksi.mp4", number: 97 },
  { name: "Joni Vainio", role: "Hyökkääjä", img: "/Joni.jpg", video: "/Joni.mp4", number: 13 },
  { name: "Jimi Laaksonen, aka Jimbo", role: "Hyökkääjä", img: "/Jimi.jpg", video: "/Jimi.mp4", number: 20 },
  { name: "Vesa Halme", role: "Puolustaja", img: "/Vesku.jpg", video: "/Vesku.mp4", number: 55 },
  { name: "Juha Kiilunen aka Masto", role: "Puolustaja", img: "/Masto.jpg", video: "/Masto.mp4", number: 71 },
  { name: "Ville Mäenranta", role: "Puolustaja", img: "/Ville.jpg", video: "/Ville.mp4", number: 28 },
  { name: "Henri Kananen aka Kana", role: "Puolustaja", img: "/Kananen.jpg", video: "/Kananen.mp4", number: 42 },
  { name: "Pelaaja #3", role: "Hyökkääjä", img: "/SekTa_LOGO_ilman_tausta.png", number: 27 },
];

function PlayerCard({ p, index, stats, onStatsClick, hasSeasonData }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, []);

  const playerStats = stats?.find(s => 
    s.name && p.name && 
    (s.name.toLowerCase().includes(p.name.split(' ')[0].toLowerCase()) ||
     p.name.toLowerCase().includes(s.name.split(' ')[0]?.toLowerCase()))
  );

  // If player has no data for this season, show a dimmed/placeholder card
  if (!hasSeasonData) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 0.45, delay: index * 0.06 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-md rounded-xl p-4 text-center border border-white/5 relative"
      >
        <div className="relative mx-auto mb-3 overflow-hidden rounded-lg w-[12rem] h-[24rem] md:w-[15.75rem] md:h-[30.375rem] bg-gray-700/30">
          <img
            src={p.img}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
            onError={(e) => { e.currentTarget.src = "/SekTa_LOGO_ilman_tausta.png"; }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-white/60 text-sm text-center">
              <div>Ei pelannul</div>
              <div>tällä kaudella</div>
            </div>
          </div>
        </div>
        <div className="flex items-baseline justify-center gap-2 opacity-50">
          <strong className="text-white/60">{p.name}</strong>
          {p.number ? <span className="text-white/40 font-mono">#{p.number}</span> : null}
        </div>
        <div className="text-orange-400/50">{p.role}</div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/10 hover:-translate-y-1 transition cursor-pointer group"
      onMouseEnter={() => { setHovered(true); videoRef.current?.play(); }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      }}
      onClick={() => setShowStats(!showStats)}
    >
      {/* Kortin media-alue: ei turhaa sisädiviä */}
      <div className="relative mx-auto mb-3 overflow-hidden rounded-lg w-[12rem] h-[24rem] md:w-[15.75rem] md:h-[30.375rem]">
        {p.video && (
          <video
            ref={videoRef}
            src={p.video}
            muted
            preload="auto"
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
          />
        )}
        <img
          src={p.img}
          alt={p.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}
          onError={(e) => { e.currentTarget.src = "/SekTa_LOGO_ilman_tausta.png"; }}
        />
        
        {/* Stats overlay */}
        {playerStats && (
          <div className="absolute top-2 right-2 bg-black/70 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-xs text-white space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-orange-400">⚽</span>
                <span>{playerStats.goals || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">🎯</span>
                <span>{playerStats.assists || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-purple-400">🏆</span>
                <span>{playerStats.points || 0}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Click indicator */}
        <div className="absolute bottom-2 right-2 bg-orange-500/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <BarChart3 size={16} className="text-white" />
        </div>
        
        {/* Special red dot for Mika Aaltonen */}
        {p.name.includes('Mika Aaltonen') && (
          <div 
            className="absolute bottom-3 right-12 bg-red-500 rounded-full w-3 h-3 cursor-pointer animate-pulse hover:bg-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Show Mika's detailed stats
              onStatsClick({
                name: 'Mika Aaltonen',
                specialStats: true,
                detailedView: true
              });
            }}
            title="Näytä Mikan yksityiskohtaiset tilastot"
          />
        )}
      </div>

      <div className="flex items-baseline justify-center gap-2">
        <strong className="text-white">{p.name}</strong>
        {p.number ? <span className="text-white/60 font-mono">#{p.number}</span> : null}
      </div>
      <div className="text-orange-400">{p.role}</div>
      
      {/* Performance indicators */}
      {playerStats && (
        <div className="mt-3 flex justify-center gap-2">
          <div className="bg-orange-500/20 px-2 py-1 rounded text-xs text-orange-400">
            {playerStats.goals || 0}M
          </div>
          <div className="bg-cyan-500/20 px-2 py-1 rounded text-xs text-cyan-400">
            {playerStats.assists || 0}S
          </div>
          <div className="bg-purple-500/20 px-2 py-1 rounded text-xs text-purple-400">
            {playerStats.points || 0}P
          </div>
        </div>
      )}

      {/* Expanded stats view */}
      <AnimatePresence>
        {showStats && playerStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/20"
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Maalitehokkuus:</span>
                <span className="text-orange-400 font-semibold">
                  {playerStats.points > 0 ? Math.round((playerStats.goals / playerStats.points) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Syöttötehokkuus:</span>
                <span className="text-cyan-400 font-semibold">
                  {playerStats.points > 0 ? Math.round((playerStats.assists / playerStats.points) * 100) : 0}%
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatsClick(playerStats);
                }}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <BarChart3 size={16} />
                Näytä yksityiskohdat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Team() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('points');
  const [selectedSeason, setSelectedSeason] = useState('2024-25');
  const [availableSeasons, setAvailableSeasons] = useState(['2024-25']);
  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0);
  const [dynamicPlayers, setDynamicPlayers] = useState([]);

  useEffect(() => {
    console.log('🚀 Team page mounted, loading player stats...');
    loadPlayerStats();
  }, []);
  
  useEffect(() => {
    // Reload stats when season changes (from external sources like dropdowns)
    if (selectedSeason && availableSeasons.includes(selectedSeason)) {
      const seasonIndex = availableSeasons.indexOf(selectedSeason);
      if (seasonIndex !== currentSeasonIndex) {
        console.log(`🔄 External season change detected: ${selectedSeason}`);
        handleSeasonChange(seasonIndex);
      }
    }
  }, [selectedSeason, availableSeasons]);
  
  useEffect(() => {
    // Also try to debug Excel immediately
    const debugImmediately = async () => {
      try {
        console.log('🔍 Starting immediate Excel debug...');
        const debugResult = await debugExcelStructure();
        console.log('📊 Debug result:', debugResult);
      } catch (error) {
        console.error('💥 Debug failed:', error);
      }
    };
    
    debugImmediately();
  }, []);

  const loadPlayerStats = async () => {
    try {
      setLoading(true);
      console.log('📄 Loading player stats from CSV...');
      
      // Use CSV data instead of Excel
      const data = await getPlayerStatsFromCSV();
      if (data) {
        // Use the actual seasons from CSV data
        setAvailableSeasons(data.seasons || ['2024-2025']);
        
        const latestSeason = data.seasons?.[0] || '2024-2025';
        setSelectedSeason(latestSeason);
        setCurrentSeasonIndex(0);
        
        // Filter players for the current season initially
        const seasonPlayers = await getPlayersForSeason(latestSeason, data.players);
        setStats(seasonPlayers);
        
        console.log(`✅ Loaded ${seasonPlayers.length} players for season ${latestSeason}`);
        
        // Debug: Log Mika's data specifically
        const mika = seasonPlayers.find(p => 
          p.name.toLowerCase().includes('mika')
        );
        if (mika) {
          console.log('🎯 Found Mika Aaltonen stats for current season:', mika);
        }
      } else {
        console.log('⚠️ No CSV data available, creating from Excel...');
        // Try to create CSV from Excel if no data
        const csvResult = await createCSVFromExcel();
        if (csvResult.success) {
          // Retry loading from CSV
          await loadPlayerStats();
        }
      }
    } catch (error) {
      console.error('❌ Error loading CSV player stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateDynamicPlayers = (seasonPlayers) => {
    console.log('🎭 Generating dynamic player cards for', seasonPlayers.length, 'players');
    
    // Get all unique player names from CSV data across all seasons
    const allPlayerNames = new Set();
    
    // Add players from current season
    seasonPlayers.forEach(player => {
      if (player.name && player.name.trim().length > 2) {
        allPlayerNames.add(player.name.trim());
      }
    });
    
    // Add known static players to ensure they're always shown
    PLAYERS.forEach(player => {
      allPlayerNames.add(player.name);
    });
    
    const dynamicPlayerCards = Array.from(allPlayerNames).map((playerName, index) => {
      // Find static player info if available
      const staticPlayer = PLAYERS.find(p => 
        p.name.toLowerCase().includes(playerName.toLowerCase()) ||
        playerName.toLowerCase().includes(p.name.toLowerCase())
      );
      
      // Find CSV data for this player in current season
      const csvPlayer = seasonPlayers.find(p => 
        p.name.toLowerCase() === playerName.toLowerCase()
      );
      
      // Create player card with available information
      const playerCard = {
        name: playerName,
        role: staticPlayer?.role || 'Pelaaja',
        img: staticPlayer?.img || '/SekTa_LOGO_ilman_tausta.png',
        video: staticPlayer?.video || null,
        number: staticPlayer?.number || null,
        hasSeasonData: !!csvPlayer,
        csvData: csvPlayer
      };
      
      return playerCard;
    });
    
    console.log('✅ Generated', dynamicPlayerCards.length, 'dynamic player cards');
    console.log('📊 Players with season data:', dynamicPlayerCards.filter(p => p.hasSeasonData).length);
    console.log('🚫 Players without season data:', dynamicPlayerCards.filter(p => !p.hasSeasonData).length);
    
    return dynamicPlayerCards;
  };
  
  const getPlayersForSeason = async (targetSeason, allPlayers = null) => {
    if (!allPlayers) {
      const data = await getPlayerStatsFromCSV();
      allPlayers = data?.players || [];
    }
    
    // Filter players who have data for the target season
    const seasonPlayers = allPlayers.map(player => {
      const seasonData = player.seasons?.find(s => s.season === targetSeason);
      if (seasonData) {
        return {
          ...player,
          games: seasonData.games,
          goals: seasonData.goals,
          assists: seasonData.assists,
          points: seasonData.points,
          penalties: seasonData.penalties,
          season: targetSeason
        };
      }
      return null;
    }).filter(Boolean);
    
    // Generate dynamic player cards
    const playerCards = generateDynamicPlayers(seasonPlayers);
    setDynamicPlayers(playerCards);
    
    return seasonPlayers;
  };
  
  const handleSeasonChange = async (seasonIndex) => {
    const newSeason = availableSeasons[seasonIndex];
    setCurrentSeasonIndex(seasonIndex);
    setSelectedSeason(newSeason);
    
    console.log(`🔄 Changing to season: ${newSeason}`);
    
    // Load players for the selected season
    const seasonPlayers = await getPlayersForSeason(newSeason);
    setStats(seasonPlayers);
    
    console.log(`✅ Loaded ${seasonPlayers.length} players for season ${newSeason}`);
  };
  
  // ... existing code ...
  
  const handlePlayerClick = async (playerData) => {
    if (playerData.specialStats && playerData.name === 'Mika Aaltonen') {
      // Load detailed stats for Mika from Excel
      try {
        const playerHistory = await getPlayerHistory('Mika Aaltonen');
        const allStats = await getAllStats();
        
        console.log('Mika player history:', playerHistory);
        console.log('All stats:', allStats);
        
        // Find Mika in the stats
        const mikaStats = allStats?.players?.find(p => 
          p.name.toLowerCase().includes('mika')
        );
        
        if (mikaStats) {
          setSelectedPlayer({
            ...mikaStats,
            name: 'Mika Aaltonen',
            detailedView: true,
            careerStats: playerHistory?.careerStats || {
              totalGoals: mikaStats.goals || 0,
              totalAssists: mikaStats.assists || 0,
              totalPoints: mikaStats.points || 0,
              totalGames: mikaStats.games || 0,
              seasonsPlayed: mikaStats.seasons?.length || 1
            },
            seasonHistory: mikaStats.seasons || []
          });
        } else {
          // Fallback with enhanced test data for demonstration
          console.log('Using test data for Mika Aaltonen');
          setSelectedPlayer({
            name: 'Mika Aaltonen',
            goals: 12,
            assists: 8,
            points: 20,
            games: 15,
            detailedView: true,
            careerStats: {
              totalGoals: 45,
              totalAssists: 32,
              totalPoints: 77,
              totalGames: 48,
              seasonsPlayed: 2
            },
            seasonHistory: [
              {
                season: '2024-25',
                sheet: 'Kausi 2024-25',
                goals: 12,
                assists: 8,
                points: 20,
                games: 15
              },
              {
                season: '2023-24',
                sheet: 'Kausi 2023-24',
                goals: 33,
                assists: 24,
                points: 57,
                games: 33
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error loading Mika stats:', error);
        setSelectedPlayer(playerData);
      }
    } else {
      setSelectedPlayer(playerData);
    }
  };

  const filteredPlayers = dynamicPlayers.filter(p => {
    if (filter === 'all') return true;
    return p.role.toLowerCase().includes(filter);
  });

  const sortedPlayers = filteredPlayers.sort((a, b) => {
    // Always sort players with season data first
    if (a.hasSeasonData && !b.hasSeasonData) return -1;
    if (!a.hasSeasonData && b.hasSeasonData) return 1;
    
    // For players with data, sort by stats
    if (a.hasSeasonData && b.hasSeasonData) {
      const aStats = stats.find(s => s.name && a.name && 
        (s.name.toLowerCase().includes(a.name.split(' ')[0].toLowerCase()) ||
         a.name.toLowerCase().includes(s.name.split(' ')[0]?.toLowerCase())))
      const bStats = stats.find(s => s.name && b.name && 
        (s.name.toLowerCase().includes(b.name.split(' ')[0].toLowerCase()) ||
         b.name.toLowerCase().includes(s.name.split(' ')[0]?.toLowerCase())))
      
      if (!aStats) return 1;
      if (!bStats) return -1;
      
      return (bStats[sortBy] || 0) - (aStats[sortBy] || 0);
    }
    
    // For players without data, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  const teamTotals = {
    goals: stats.reduce((sum, p) => sum + p.goals, 0),
    assists: stats.reduce((sum, p) => sum + p.assists, 0),
    points: stats.reduce((sum, p) => sum + p.points, 0),
    players: dynamicPlayers.filter(p => p.hasSeasonData).length, // Only count players with season data
    totalCards: dynamicPlayers.length // Total cards shown (including inactive)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-12">
            {/* Season Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Calendar className="text-orange-400" size={24} />
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                  SekTa Joukkue
                </h1>
              </div>
              
              {/* Current Season Display */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-orange-400">
                  {selectedSeason}
                </div>
                <div className="text-sm text-white/60">
                  {currentSeasonIndex + 1} / {availableSeasons.length} kautta
                </div>
              </div>
              
              {/* Season Slider */}
              <div className="flex items-center justify-center gap-6 max-w-2xl mx-auto">
                <button 
                  onClick={() => handleSeasonChange(0)}
                  className="text-white/70 hover:text-white font-semibold transition-colors"
                  disabled={currentSeasonIndex === 0}
                >
                  Uusin
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={0}
                    max={availableSeasons.length - 1}
                    value={currentSeasonIndex}
                    onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${(currentSeasonIndex / Math.max(1, availableSeasons.length - 1)) * 100}%, #ffffff33 ${(currentSeasonIndex / Math.max(1, availableSeasons.length - 1)) * 100}%, #ffffff33 100%)`
                    }}
                  />
                  <style jsx>{`
                    .slider::-webkit-slider-thumb {
                      appearance: none;
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: #f97316;
                      cursor: pointer;
                      border: 3px solid white;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    }
                    .slider::-moz-range-thumb {
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: #f97316;
                      cursor: pointer;
                      border: 3px solid white;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    }
                  `}</style>
                  
                  {/* Season markers - show every few seasons to avoid crowding */}
                  <div className="absolute -bottom-8 left-0 right-0">
                    <div className="flex justify-between text-xs text-white/50 px-3">
                      {availableSeasons.filter((_, index) => 
                        index === 0 || 
                        index === availableSeasons.length - 1 || 
                        index % Math.max(1, Math.floor(availableSeasons.length / 4)) === 0
                      ).map((season, displayIndex) => {
                        const actualIndex = availableSeasons.indexOf(season);
                        return (
                          <div 
                            key={season} 
                            className={`transition-colors text-center ${
                              actualIndex === currentSeasonIndex ? 'text-orange-400 font-bold' : ''
                            }`}
                            style={{ 
                              position: 'absolute',
                              left: `${(actualIndex / Math.max(1, availableSeasons.length - 1)) * 100}%`,
                              transform: 'translateX(-50%)'
                            }}
                          >
                            <div className="whitespace-nowrap">
                              {season.split('(')[0].trim()}
                            </div>
                            {season.includes('(') && (
                              <div className="text-xs text-white/40 whitespace-nowrap">
                                {season.split('(')[1]?.replace(')', '')}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleSeasonChange(availableSeasons.length - 1)}
                  className="text-white/70 hover:text-white font-semibold transition-colors"
                  disabled={currentSeasonIndex === availableSeasons.length - 1}
                >
                  Vanhin
                </button>
              </div>
            </div>
            
            <p className="text-xl text-white/70 mb-8 mt-12">
              Tutustu pelaajiin ja heidän suorituksiinsa - {teamTotals.players} aktiivista pelaajaa
            </p>
            <div className="mb-8 flex justify-center gap-4 flex-wrap">
              <button 
                onClick={async () => {
                  console.log('Creating test CSV with correct stats...');
                  const result = createTestCSV();
                  if (result.success) {
                    alert('Test CSV created with correct Mika stats: 21 games, 14 goals, 4 assists, 18 points!');
                    // Reload data from CSV
                    await loadPlayerStats();
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                🧪 Create Test CSV (Correct Stats)
              </button>
              <button 
                onClick={async () => {
                  console.log('📄 Creating CSV from Excel...');
                  const result = await createCSVFromExcel();
                  if (result.success) {
                    alert(`CSV created successfully! ${result.rowCount} rows processed.`);
                    // Reload data from CSV
                    await loadPlayerStats();
                  } else {
                    alert('Error creating CSV: ' + result.error);
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                📄 Create CSV from Excel
              </button>
              <button 
                onClick={async () => {
                  console.log('🔍 Loading from CSV...');
                  const data = await getPlayerStatsFromCSV();
                  console.log('CSV data:', data);
                  if (data && data.players) {
                    const mika = data.players.find(p => 
                      p.name.toLowerCase().includes('mika')
                    );
                    console.log('Found Mika in CSV:', mika);
                  }
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                🔍 Debug CSV Data
              </button>
              <button 
                onClick={async () => {
                  console.log('🔍 Manual Excel debug triggered...');
                  const result = await debugExcelStructure();
                  console.log('📊 Manual debug result:', result);
                  const allStats = await getAllStats();
                  console.log('📊 getAllStats result:', allStats);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                🐛 Debug Excel Data
              </button>
              <button 
                onClick={loadPlayerStats}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                🔄 Refresh Data
              </button>
            </div>
            <div className="text-center mb-4">
              <span className="text-white/60 text-sm">
                Players loaded: {stats.length} | Season: {selectedSeason}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Team Statistics Overview */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatsCard
              title="Aktiivisia pelaajia"
              value={teamTotals.players}
              subtitle={`/ ${teamTotals.totalCards} yhteensä`}
              icon="👥"
              color="#10b981"
            />
            <StatsCard
              title="Yhteensä maaleja"
              value={teamTotals.goals}
              icon="⚽"
              color="#f97316"
            />
            <StatsCard
              title="Yhteensä syöttöjä"
              value={teamTotals.assists}
              icon="🎯"
              color="#06b6d4"
            />
            <StatsCard
              title="Yhteensä pisteitä"
              value={teamTotals.points}
              icon="🏆"
              color="#8b5cf6"
            />
          </div>
        </Reveal>

        {/* Filters and Sorting */}
        <Reveal delay={0.2}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="text-white/70" size={20} />
                <span className="text-white/70">Suodata:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="all">Kaikki</option>
                  <option value="hyökkääjä">Hyökkääjät</option>
                  <option value="puolustaja">Puolustajat</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="text-white/70" size={20} />
                <span className="text-white/70">Järjestä:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="points">Pisteet</option>
                  <option value="goals">Maalit</option>
                  <option value="assists">Syötöt</option>
                </select>
              </div>
            </div>
            
            <div className="text-white/60 text-sm">
              {loading ? 'Ladataan tilastoja...' : 
                `${teamTotals.players} aktiivista pelaajaa (${sortedPlayers.length} korttia näkyy)`
              }
            </div>
          </div>
        </Reveal>

        {/* Top Performers Chart */}
        {stats.length > 0 && (
          <Reveal delay={0.3}>
            <div className="mb-12">
              <AnimatedPieChart
                data={stats
                  .sort((a, b) => b.points - a.points)
                  .slice(0, 8)
                  .map(p => ({ 
                    name: p.name.split(' ')[0], 
                    pisteet: p.points
                  }))
                }
                title={`Pistepörssi (Top 8) - ${selectedSeason}`}
                nameKey="name"
                valueKey="pisteet"
                height={400}
              />
            </div>
          </Reveal>
        )}

        {/* Players Grid */}
        <Reveal delay={0.4}>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedPlayers.map((p, i) => (
              <PlayerCard 
                key={p.name} 
                p={p} 
                index={i} 
                stats={stats}
                hasSeasonData={p.hasSeasonData}
                onStatsClick={handlePlayerClick}
              />
            ))}
          </div>
        </Reveal>

        {/* Player Detail Modal */}
        <AnimatePresence>
          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedPlayer(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900/95 rounded-xl p-6 max-w-2xl w-full border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedPlayer.name}
                      {selectedPlayer.detailedView && (
                        <span className="ml-2 text-sm bg-red-500 px-2 py-1 rounded-full">
                          Yksityiskohtaiset tilastot
                        </span>
                      )}
                    </h3>
                    {/* Season Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-white/70 text-sm">Kausi:</span>
                      <select
                        value={selectedSeason}
                        onChange={async (e) => {
                          const newSeason = e.target.value;
                          console.log(`🔄 Changing season from ${selectedSeason} to ${newSeason}`);
                          setSelectedSeason(newSeason);
                          
                          // Reload stats for the new season
                          await loadSeasonStats(newSeason);
                          
                          // Update the selected player with new season data
                          if (selectedPlayer) {
                            const updatedStats = await getPlayerStatsForSeason(newSeason);
                            const updatedPlayer = updatedStats.players?.find(p => 
                              p.name.toLowerCase() === selectedPlayer.name.toLowerCase()
                            );
                            if (updatedPlayer) {
                              setSelectedPlayer({
                                ...selectedPlayer,
                                ...updatedPlayer,
                                season: newSeason
                              });
                            }
                          }
                        }}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                      >
                        {availableSeasons.map(season => (
                          <option key={season} value={season} className="bg-gray-800">
                            {season}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="text-white/60 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>
                
                {selectedPlayer.detailedView ? (
                  // Enhanced view for detailed stats
                  <div className="space-y-6">
                    {/* Current Season Stats */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Nykyinen kausi ({selectedSeason})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatsCard
                          title="Maalit"
                          value={selectedPlayer.goals || 0}
                          icon="⚽"
                          color="#f97316"
                        />
                        <StatsCard
                          title="Syötöt"
                          value={selectedPlayer.assists || 0}
                          icon="🎯"
                          color="#06b6d4"
                        />
                        <StatsCard
                          title="Pisteet"
                          value={selectedPlayer.points || 0}
                          icon="🏆"
                          color="#8b5cf6"
                        />
                        <StatsCard
                          title="Rangaistukset"
                          value={selectedPlayer.penalties || 0}
                          icon="🟨"
                          color="#ef4444"
                        />
                      </div>
                    </div>
                    
                    {/* Career Stats */}
                    {selectedPlayer.careerStats && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Uratilastot</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-orange-400">{selectedPlayer.careerStats.totalGoals}</div>
                            <div className="text-white/70 text-sm">Maalit yhteensä</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-cyan-400">{selectedPlayer.careerStats.totalAssists}</div>
                            <div className="text-white/70 text-sm">Syötöt yhteensä</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-400">{selectedPlayer.careerStats.totalPoints}</div>
                            <div className="text-white/70 text-sm">Pisteet yhteensä</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-red-400">{selectedPlayer.careerStats.totalPenalties || 0}</div>
                            <div className="text-white/70 text-sm">Rangaistukset yhteensä</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">{selectedPlayer.careerStats.seasonsPlayed}</div>
                            <div className="text-white/70 text-sm">Kaudet</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Season History */}
                    {selectedPlayer.seasonHistory && selectedPlayer.seasonHistory.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Kausihistoria</h4>
                        <div className="space-y-2">
                          {selectedPlayer.seasonHistory.map((season, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                              <span className="text-white font-semibold">{season.season}</span>
                              <div className="flex gap-4 text-sm">
                                <span className="text-orange-400">{season.goals}M</span>
                                <span className="text-cyan-400">{season.assists}S</span>
                                <span className="text-purple-400">{season.points}P</span>
                                <span className="text-red-400">{season.penalties || 0}J</span>
                                <span className="text-white/60">{season.games}GP</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Performance Chart */}
                    <div>
                      <PlayerRadarChart
                        data={[
                          { subject: 'Maalit', A: selectedPlayer.goals || 0 },
                          { subject: 'Syötöt', A: selectedPlayer.assists || 0 },
                          { subject: 'Pisteet', A: selectedPlayer.points || 0 },
                          { subject: 'Pelit', A: selectedPlayer.games || 0 },
                          { subject: 'Rangaistukset', A: selectedPlayer.penalties || 0 },
                          { subject: 'Pistetehok.', A: selectedPlayer.games > 0 ? (selectedPlayer.points / selectedPlayer.games) * 10 : 0 }
                        ]}
                        title={`${selectedPlayer.name} - Suoritusprofiili`}
                        height={350}
                      />
                    </div>
                  </div>
                ) : (
                  // Standard view
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-orange-400">{selectedPlayer.goals}</div>
                        <div className="text-white/70 text-xs">Maalit</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-cyan-400">{selectedPlayer.assists}</div>
                        <div className="text-white/70 text-xs">Syötöt</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-purple-400">{selectedPlayer.points}</div>
                        <div className="text-white/70 text-xs">Pisteet</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-red-400">{selectedPlayer.penalties || 0}</div>
                        <div className="text-white/70 text-xs">Rangaistukset</div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <PlayerRadarChart
                        data={[
                          { subject: 'Maalit', A: stats.length > 0 ? (selectedPlayer.goals / Math.max(...stats.map(s => s.goals))) * 100 : 0 },
                          { subject: 'Syötöt', A: stats.length > 0 ? (selectedPlayer.assists / Math.max(...stats.map(s => s.assists))) * 100 : 0 },
                          { subject: 'Pisteet', A: stats.length > 0 ? (selectedPlayer.points / Math.max(...stats.map(s => s.points))) * 100 : 0 },
                          { subject: 'Rangaistukset', A: stats.length > 0 ? (selectedPlayer.penalties / Math.max(...stats.map(s => s.penalties || 1))) * 100 : 0 },
                          { subject: 'Maalitehokkuus', A: selectedPlayer.points > 0 ? ((selectedPlayer.goals / selectedPlayer.points) * 100) : 0 },
                          { subject: 'Syöttötehokkuus', A: selectedPlayer.points > 0 ? ((selectedPlayer.assists / selectedPlayer.points) * 100) : 0 }
                        ]}
                        title={`${selectedPlayer.name} - Suoritusprofiili`}
                        height={300}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
