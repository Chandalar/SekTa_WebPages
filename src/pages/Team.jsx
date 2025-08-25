// src/Team.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BarChart3, TrendingUp, Target, Award, Users, Filter, Calendar, Shield } from "lucide-react";
import { AnimatedBarChart, AnimatedPieChart, PlayerRadarChart, StatsCard } from "../components/Charts";
import { getPlayerStatsFromCSV, generateProperCSV, parseComprehensiveCSVData, getComprehensiveGoalieStats, parseGoaliesFromDedicatedCSV, getComprehensivePlayerAndGoalieLists } from "../utils/csvDataLoader";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

// Player image mapping - maps player names to their actual image filenames
const playerImageMap = {
  'Mika Aaltonen': 'mika.jpg',
  'Mika Ahven': 'Ahven.jpg', 
  'Jesse Höykinpuro': 'Jesse.jpg',
  'Henri Kananen': 'Kananen.jpg',
  'Juha Kiilunen': 'Jimi.jpg',
  'Jimi Laaksonen': 'Jimi.jpg',
  'Akseli Nykänen': 'Akseli.jpg',
  'Niko Nynäs': 'Niko.jpg',
  'Miika Oja-Nisula': 'Miika.jpg',
  'Joonas Leppänen': 'Joonas.jpg',
  'Joni Vainio': 'Joni.jpg', 
  'Petri Vikman': 'Petri.jpg',
  'Ville Mäenranta': 'Ville.jpg',
  'Vesa Halme': 'Veikka.jpg',
  'Matias Virta': 'Masto.jpg',
  'Lassi Liukkonen': 'Opa.jpg'
};

// Function to get player image
const getPlayerImage = (playerName) => {
  return playerImageMap[playerName] || `${playerName.split(' ')[0]}.jpg`;
};

const PLAYERS = [
  { name: "Mika Aaltonen", role: "Hyökkääjä", img: "/mika.jpg", video: "/mika.mp4", number: 19 },
  { name: "Petri Vikman", role: "Hyökkääjä", img: "/Petri.jpg", video: "/Petri.mp4", number: 22 },
  { name: "Miika Oja-Nisula", role: "Hyökkääjä", img: "/Miika.jpg", video: "/Miika.mp4", number: 66 },
  { name: "Akseli Nykänen", role: "Hyökkääjä", img: "/Akseli.jpg", video: "/Akseli.mp4", number: 15 },
  { name: "Joni Vainio", role: "Hyökkääjä", img: "/Joni.jpg", video: "/Joni.mp4", number: 13 },
  { name: "Vesa Halme", role: "Puolustaja", img: "/Veikka.jpg", video: "/Veikka.mp4", number: 55 },
  { name: "Ville Mäenranta", role: "Puolustaja", img: "/Ville.jpg", video: "/Ville.mp4", number: 28 },
  { name: "Mika Ahven", role: "Maalivahti", img: "/Ahven.jpg", number: 1 },
  { name: "Henri Kananen", role: "Hyökkääjä", img: "/Kananen.jpg", number: 27 },
  { name: "Jesse Höykinpuro", role: "Hyökkääjä", img: "/Jesse.jpg", number: 8 },
  { name: "Jimi Laaksonen", role: "Hyökkääjä", img: "/Jimi.jpg", number: 11 },
  { name: "Niko Nynäs", role: "Puolustaja", img: "/Niko.jpg", number: 33 },
  { name: "Joonas Leppänen", role: "Puolustaja", img: "/Joonas.jpg", number: 44 },
  { name: "Matias Virta", role: "Maalivahti", img: "/Masto.jpg", number: 30 },
  { name: "Lassi Liukkonen", role: "Maalivahti", img: "/Opa.jpg", number: 35 },
];

function PlayerCard({ p, index, stats, onStatsClick }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, []);

  const playerStats = stats?.find(s => {
    if (!s.name || !p.name) return false;
    
    // First try exact name match (most reliable)
    if (s.name.toLowerCase() === p.name.toLowerCase()) {
      console.log(`✅ Exact match: ${p.name} <-> ${s.name}`, s);
      return true;
    }
    
    // Then try exact first name + last name match
    const sNameParts = s.name.toLowerCase().split(' ');
    const pNameParts = p.name.toLowerCase().split(' ');
    
    if (sNameParts.length >= 2 && pNameParts.length >= 2) {
      const match = sNameParts[0] === pNameParts[0] && sNameParts[1] === pNameParts[1];
      if (match) {
        console.log(`✅ Name parts match: ${p.name} <-> ${s.name}`, s);
        return true;
      }
    }
    
    return false; // No longer fall back to partial matching
  });
  
  // Special debug for Mika Ahven
  if (p.name.includes('Mika Ahven')) {
    console.log(`🎯 Mika Ahven card - found stats:`, playerStats);
    console.log(`🎯 Available stats in array:`, stats?.filter(s => s.name.toLowerCase().includes('mika')));
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
              {playerStats.position === 'Maalivahti' ? (
                // Goalie hover stats
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-green-400">🏆</span>
                    <span>{playerStats.wins || 0}V</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-400">🚫</span>
                    <span>{playerStats.shutouts || 0}NP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">🥅</span>
                    <span>{playerStats.savePercentage ? `${playerStats.savePercentage.toFixed(1)}%` : '0%'}</span>
                  </div>
                </>
              ) : (
                // Regular player hover stats
                <>
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
                  <div className="flex items-center gap-1">
                    <span className="text-red-400">🟨</span>
                    <span>{(playerStats.penalties || 0) * 2}min</span>
                  </div>
                </>
              )}
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
          {playerStats.position === 'Maalivahti' ? (
            // Goalie stats
            <>
              <div className="bg-green-500/20 px-2 py-1 rounded text-xs text-green-400">
                {playerStats.wins || 0}V
              </div>
              <div className="bg-blue-500/20 px-2 py-1 rounded text-xs text-blue-400">
                {playerStats.shutouts || 0}NP
              </div>
              <div className="bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400">
                {playerStats.savePercentage ? `${playerStats.savePercentage.toFixed(1)}%` : '0%'}
              </div>
            </>
          ) : (
            // Regular player stats
            <>
              <div className="bg-orange-500/20 px-2 py-1 rounded text-xs text-orange-400">
                {playerStats.goals || 0}M
              </div>
              <div className="bg-cyan-500/20 px-2 py-1 rounded text-xs text-cyan-400">
                {playerStats.assists || 0}S
              </div>
              <div className="bg-purple-500/20 px-2 py-1 rounded text-xs text-purple-400">
                {playerStats.points || 0}P
              </div>
              <div className="bg-red-500/20 px-2 py-1 rounded text-xs text-red-400">
                {(playerStats.penalties || 0) * 2}min
              </div>
            </>
          )}
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
              {playerStats.position === 'Maalivahti' ? (
                // Goalie detailed stats
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Torjuntaprosentti:</span>
                    <span className="text-yellow-400 font-semibold">
                      {playerStats.savePercentage ? `${playerStats.savePercentage.toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Voittoprosentti:</span>
                    <span className="text-green-400 font-semibold">
                      {playerStats.games > 0 ? Math.round((playerStats.wins / playerStats.games) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">PMO:</span>
                    <span className="text-red-400 font-semibold">
                      {playerStats.goalsAgainstAverage ? playerStats.goalsAgainstAverage.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </>
              ) : (
                // Regular player detailed stats
                <>
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
                </>
              )}
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
  const [allPlayersAndGoalies, setAllPlayersAndGoalies] = useState([]); // Store combined player data

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
  


  const loadPlayerStats = async () => {
    try {
      setLoading(true);
      console.log('📄 Loading comprehensive player and goalie data from CSV...');
      
      // Use comprehensive data loader that combines both players and goalies
      const data = await getComprehensivePlayerAndGoalieLists();
      
      if (data && (data.players.length > 0 || data.goalies.length > 0)) {
        // For goalies, we want to use data from maalivahdit.csv (in data.goalies)
        // For regular players, we want to use data from pelaajat.csv (in data.players)
        // We need to avoid duplicates by filtering out goalies from the players array
        
        // Get the list of goalie names
        const goalieNames = data.goalies.map(goalie => goalie.name.toLowerCase());
        
        // Filter out goalies from the players array to avoid duplicates
        const filteredPlayers = data.players.filter(player => 
          !goalieNames.includes(player.name.toLowerCase())
        );
        
        // Combine filtered players and goalies into one array
        // Goalies should come from the dedicated maalivahdit.csv data
        const combinedPlayersAndGoalies = [...filteredPlayers, ...data.goalies];
        
        // Store the combined data for reuse
        setAllPlayersAndGoalies(combinedPlayersAndGoalies);
        
        // Use the actual seasons from CSV data
        setAvailableSeasons(data.seasons || ['2024-2025']);
        
        const latestSeason = data.seasons?.[0] || '2024-2025';
        setSelectedSeason(latestSeason);
        setCurrentSeasonIndex(0);
        
        // Filter players for the current season initially
        const seasonPlayers = await getPlayersForSeason(latestSeason, combinedPlayersAndGoalies);
        setStats(seasonPlayers);
        
        console.log(`✅ Loaded ${seasonPlayers.length} players/goalies for season ${latestSeason}`);
        console.log(`📊 Total in database: ${filteredPlayers.length} players, ${data.goalies.length} goalies`);
        
        // Debug: Log goalie data specifically
        const goalies = seasonPlayers.filter(p => p.position === 'Maalivahti');
        console.log(`🥅 Found ${goalies.length} goalies in current season:`, goalies.map(g => g.name));
        
        // Debug: Log regular players
        const regularPlayers = seasonPlayers.filter(p => p.position !== 'Maalivahti');
        console.log(`🏃 Found ${regularPlayers.length} regular players in current season:`, regularPlayers.map(p => p.name));
      } else {
        console.log('⚠️ No comprehensive data available, falling back to simple CSV...');
        // Fallback to simple CSV if comprehensive data fails
        const fallbackData = await getPlayerStatsFromCSV();
        if (fallbackData) {
          setAvailableSeasons(fallbackData.seasons || ['2024-2025']);
          const latestSeason = fallbackData.seasons?.[0] || '2024-2025';
          setSelectedSeason(latestSeason);
          setCurrentSeasonIndex(0);
          const seasonPlayers = await getPlayersForSeason(latestSeason, fallbackData.players);
          setStats(seasonPlayers);
        }
      }
    } catch (error) {
      console.error('❌ Error loading comprehensive player stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateDynamicPlayers = (seasonPlayers) => {
    console.log('🎥 Generating dynamic player cards for', seasonPlayers.length, 'players');
    
    // Only show players who have data for the current season
    const dynamicPlayerCards = seasonPlayers.map((csvPlayer, index) => {
      // Find static player info if available
      const staticPlayer = PLAYERS.find(p => 
        p.name.toLowerCase() === csvPlayer.name.toLowerCase()
      );
      
      // Create player card with available information
      const playerCard = {
        name: csvPlayer.name,
        role: csvPlayer.position || staticPlayer?.role || 'Pelaaja',
        img: staticPlayer?.img || `/${getPlayerImage(csvPlayer.name)}`,
        video: staticPlayer?.video || null,
        number: csvPlayer.number || staticPlayer?.number || null,
        hasSeasonData: true, // Since we're only including players with season data
        csvData: csvPlayer
      };
      
      return playerCard;
    });
    
    console.log('✅ Generated', dynamicPlayerCards.length, 'dynamic player cards (only players with season data)');
    
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
        const seasonPlayer = {
          ...player,
          games: seasonData.games,
          goals: seasonData.goals,
          assists: seasonData.assists,
          points: seasonData.points,
          penalties: seasonData.penalties,
          season: targetSeason,
          position: seasonData.position || player.position
        };
        
        // Add goalie-specific stats if applicable
        if (seasonData.position?.toLowerCase() === 'maalivahti' || player.position?.toLowerCase() === 'maalivahti') {
          seasonPlayer.position = 'Maalivahti';
          
          // Use existing goalie stats if available, otherwise defaults
          seasonPlayer.savePercentage = seasonData.savePercentage || player.savePercentage || 0;
          seasonPlayer.goalsAgainstAverage = seasonData.goalsAgainstAverage || player.goalsAgainstAverage || 0;
          seasonPlayer.saves = seasonData.saves || player.saves || 0;
          seasonPlayer.goalsAgainst = seasonData.goalsAgainst || player.goalsAgainst || 0;
          seasonPlayer.wins = seasonData.wins || player.wins || 0;
          seasonPlayer.shutouts = seasonData.shutouts || player.shutouts || 0;
          
          // Goalies always have 0 goals and assists as per requirements
          seasonPlayer.goals = 0;
          seasonPlayer.assists = 0;
          seasonPlayer.points = 0;
          
          console.log(`🥅 Processed goalie data for: ${seasonPlayer.name}`, seasonPlayer);
        }
        
        return seasonPlayer;
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
    
    // Load players for the selected season using the stored combined data
    const seasonPlayers = await getPlayersForSeason(newSeason, allPlayersAndGoalies);
    setStats(seasonPlayers);
    
    console.log(`✅ Loaded ${seasonPlayers.length} players for season ${newSeason}`);
  };
  
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
    // Since we now only show players with season data, we can simplify the sorting
    const aStats = stats.find(s => s.name && a.name && 
      (s.name.toLowerCase().includes(a.name.split(' ')[0].toLowerCase()) ||
       a.name.toLowerCase().includes(s.name.split(' ')[0]?.toLowerCase())))
    const bStats = stats.find(s => s.name && b.name && 
      (s.name.toLowerCase().includes(b.name.split(' ')[0].toLowerCase()) ||
       b.name.toLowerCase().includes(s.name.split(' ')[0]?.toLowerCase())))
    
    if (!aStats) return 1;
    if (!bStats) return -1;
    
    return (bStats[sortBy] || 0) - (aStats[sortBy] || 0);
  });

  const teamTotals = {
    goals: stats.reduce((sum, p) => sum + p.goals, 0),
    assists: stats.reduce((sum, p) => sum + p.assists, 0),
    points: stats.reduce((sum, p) => sum + p.points, 0),
    players: dynamicPlayers.length, // All displayed players have season data now
    totalCards: dynamicPlayers.length // Total cards shown (all have data now)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Calendar className="text-orange-400" size={32} />
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                SekTa Joukkue
              </h1>
            </div>
            
            {/* Season Selector */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Calendar className="text-white/70" size={20} />
              <span className="text-white/70">Kausi:</span>
              <select
                value={selectedSeason}
                onChange={(e) => {
                  const newSeason = e.target.value;
                  const seasonIndex = availableSeasons.indexOf(newSeason);
                  handleSeasonChange(seasonIndex);
                }}
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
              onClick={loadPlayerStats}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition mb-8"
            >
              🔄 Päivitä tilastot
            </button>
            
            <p className="text-xl text-white/70 mb-8 mt-12">
              Tutustu pelaajiin ja heidän suorituksiinsa - {teamTotals.players} aktiivista pelaajaa
            </p>
            
            {/* Link to Goalie Statistics */}
            <div className="mb-6">
              <Link 
                to="/maalivahdit"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <Shield size={20} />
                Katso kattavat maalivahdin tilastot
              </Link>
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
                  <option value="maalivahti">Maalivahdit</option>
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
                        {selectedPlayer.position === 'Maalivahti' ? (
                          // Goalie stats cards
                          <>
                            <StatsCard
                              title="Ottelut"
                              value={selectedPlayer.games || 0}
                              icon="🥅"
                              color="#10b981"
                            />
                            <StatsCard
                              title="Voitot"
                              value={selectedPlayer.wins || 0}
                              icon="🏆"
                              color="#f59e0b"
                            />
                            <StatsCard
                              title="Torjunta%"
                              value={selectedPlayer.savePercentage ? `${selectedPlayer.savePercentage.toFixed(1)}%` : '0%'}
                              icon="🛡️"
                              color="#8b5cf6"
                            />
                            <StatsCard
                              title="Nollapelit"
                              value={selectedPlayer.shutouts || 0}
                              icon="🚫"
                              color="#06b6d4"
                            />
                          </>
                        ) : (
                          // Regular player stats cards
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Career Stats */}
                    {selectedPlayer.careerStats && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Uratilastot</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {selectedPlayer.position === 'Maalivahti' ? (
                            // Goalie career stats
                            <>
                              <div className="bg-white/10 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-400">{selectedPlayer.careerStats.totalWins || 0}</div>
                                <div className="text-white/70 text-sm">Voitot yhteensä</div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-400">{selectedPlayer.careerStats.totalShutouts || 0}</div>
                                <div className="text-white/70 text-sm">Nollapelit yhteensä</div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-400">{selectedPlayer.careerStats.totalSaves || 0}</div>
                                <div className="text-white/70 text-sm">Torjunnat yhteensä</div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-red-400">{selectedPlayer.careerStats.totalGoalsAgainst || 0}</div>
                                <div className="text-white/70 text-sm">Päästetyt yhteensä</div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-400">{selectedPlayer.careerStats.seasonsPlayed}</div>
                                <div className="text-white/70 text-sm">Kaudet</div>
                              </div>
                            </>
                          ) : (
                            // Regular player career stats
                            <>
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
                            </>
                          )}
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
                        data={selectedPlayer.position === 'Maalivahti' ? [
                          { subject: 'Ottelut', A: selectedPlayer.games || 0 },
                          { subject: 'Voitot', A: selectedPlayer.wins || 0 },
                          { subject: 'Torjunta%', A: selectedPlayer.savePercentage || 0 },
                          { subject: 'Torjunnat', A: Math.min((selectedPlayer.saves || 0) / 10, 100) }, // Scale down saves
                          { subject: 'Nollapelit', A: (selectedPlayer.shutouts || 0) * 10 }, // Scale up shutouts
                          { subject: 'Voitto%', A: selectedPlayer.games > 0 ? ((selectedPlayer.wins || 0) / selectedPlayer.games) * 100 : 0 }
                        ] : [
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
                      {selectedPlayer.position === 'Maalivahti' ? (
                        // Goalie standard stats
                        <>
                          <div className="bg-white/10 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-green-400">{selectedPlayer.games || 0}</div>
                            <div className="text-white/70 text-xs">Ottelut</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-orange-400">{selectedPlayer.wins || 0}</div>
                            <div className="text-white/70 text-xs">Voitot</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-purple-400">{selectedPlayer.savePercentage ? `${selectedPlayer.savePercentage.toFixed(1)}%` : '0%'}</div>
                            <div className="text-white/70 text-xs">Torjunta%</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-blue-400">{selectedPlayer.shutouts || 0}</div>
                            <div className="text-white/70 text-xs">Nollapelit</div>
                          </div>
                        </>
                      ) : (
                        // Regular player standard stats
                        <>
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
                        </>
                      )}
                    </div>
                    
                    <div className="col-span-2">
                      <PlayerRadarChart
                        data={selectedPlayer.position === 'Maalivahti' ? [
                          { subject: 'Ottelut', A: stats.length > 0 ? ((selectedPlayer.games || 0) / Math.max(...stats.map(s => s.games || 1))) * 100 : 0 },
                          { subject: 'Voitot', A: stats.length > 0 ? ((selectedPlayer.wins || 0) / Math.max(...stats.map(s => s.wins || 1))) * 100 : 0 },
                          { subject: 'Torjunta%', A: selectedPlayer.savePercentage || 0 },
                          { subject: 'Nollapelit', A: stats.length > 0 ? ((selectedPlayer.shutouts || 0) / Math.max(...stats.map(s => s.shutouts || 1))) * 100 : 0 },
                          { subject: 'Voittosuhde', A: selectedPlayer.games > 0 ? ((selectedPlayer.wins || 0) / selectedPlayer.games) * 100 : 0 },
                          { subject: 'Torjunnat', A: stats.length > 0 ? ((selectedPlayer.saves || 0) / Math.max(...stats.map(s => s.saves || 1))) * 100 : 0 }
                        ] : [
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
