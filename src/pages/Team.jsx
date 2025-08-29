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
  { name: "Mika Aaltonen", role: "Hyökkääjä", img: "/Mika.jpg", video: "/Mika.mp4", number: 19 },
  { name: "Petri Vikman", role: "Hyökkääjä", img: "/Petri.jpg", video: "/Petri.mp4", number: 22 },
  { name: "Miika Oja-Nisula", role: "Hyökkääjä", img: "/Miika.jpg", video: "/Miika.mp4", number: 66 },
  { name: "Akseli Nykänen", role: "Hyökkääjä", img: "/Akseli.jpg", video: "/Akseli.mp4", number: 15 },
  { name: "Joni Vainio", role: "Hyökkääjä", img: "/Joni.jpg", video: "/Joni.mp4", number: 13 },
  { name: "Vesa Halme", role: "Puolustaja", img: "/Veikka.jpg", video: "/Veikka.mp4", number: 55 },
  { name: "Ville Mäenranta", role: "Puolustaja", img: "/Ville.jpg", video: "/Ville.mp4", number: 28 },
  { name: "Mika Ahven", role: "Maalivahti", img: "/Ahven.jpg", video: "/Ahven.mp4", number: 1 },
  { name: "Henri Kananen", role: "Hyökkääjä", img: "/Kananen.jpg", number: 27 },
  { name: "Jesse Höykinpuro", role: "Hyökkääjä", img: "/Jesse.jpg", number: 8 },
  { name: "Jimi Laaksonen", role: "Hyökkääjä", img: "/Jimi.jpg", number: 11 },
  { name: "Niko Nynäs", role: "Puolustaja", img: "/Niko.jpg", number: 33 },
  { name: "Joonas Leppänen", role: "Puolustaja", img: "/Joonas.jpg", number: 44 },
  { name: "Matias Virta", role: "Maalivahti", img: "/Masto.jpg", number: 30 },
];

function PlayerCard({ p, index, stats, onStatsClick }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 pt-4 pb-3 text-center border border-white/10 hover:-translate-y-1 transition cursor-pointer group h-full flex flex-col"
      onMouseEnter={() => { setHovered(true); videoRef.current?.play(); }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      }}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Player Photo/Video */}
      <div className="relative mx-auto mb-2 overflow-hidden rounded-lg w-48 h-80 md:w-56 md:h-96 flex-grow flex-shrink-0">
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
          onError={(e) => { e.currentTarget.src = "/gorilla_puku.jpeg"; }}
        />
        
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

      {/* Name and Number */}
      <div className="flex items-baseline justify-center gap-2 mb-1 mt-auto">
        <strong className="text-white text-lg">{p.name}</strong>
        {p.number ? <span className="text-white/60 font-mono">#{p.number}</span> : null}
      </div>
      
      {/* Season Stats - Inline compact format without icons */}
      {playerStats && (
        <div className="grid grid-cols-4 gap-1 mb-1 text-xs">
          {playerStats.position === 'Maalivahti' ? (
            // Goalie stats in compact format
            <>
              <div className="bg-white/10 rounded p-1">
                <div className="text-green-400 font-bold">{playerStats.games || 0}</div>
                <div className="text-white/60">O</div>
              </div>
              <div className="bg-white/10 rounded p-1">
                <div className="text-yellow-400 font-bold">{playerStats.savePercentage ? `${playerStats.savePercentage.toFixed(1)}%` : '0%'}</div>
                <div className="text-white/60">T%</div>
              </div>
              <div className="bg-white/10 rounded p-1">
                <div className="text-blue-400 font-bold">{playerStats.wins || 0}</div>
                <div className="text-white/60">V</div>
              </div>
              <div className="bg-white/10 rounded p-1">
                <div className="text-purple-400 font-bold">{playerStats.shutouts || 0}</div>
                <div className="text-white/60">NP</div>
              </div>
            </>
          ) : (
            // Regular player stats in compact format
            <>
              <div className="bg-white/10 rounded p-1">
                <div className="text-green-400 font-bold">{playerStats.games || 0}</div>
                <div className="text-white/60">O</div>
              </div>
              <div className="bg-white/10 rounded p-1">
                <div className="text-orange-400 font-bold">{playerStats.goals || 0}</div>
                <div className="text-white/60">M</div>
              </div>
              <div className="bg-white/10 rounded p-1">
                <div className="text-cyan-400 font-bold">{playerStats.assists || 0}</div>
                <div className="text-white/60">S</div>
              </div>
              <div className="bg-white/10 rounded p-1">
                <div className="text-purple-400 font-bold">{playerStats.points || 0}</div>
                <div className="text-white/60">P</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Expanded details */}
      <AnimatePresence>
        {showDetails && playerStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 pt-2 border-t border-white/20"
          >
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1 text-xs">
                {playerStats.position === 'Maalivahti' ? (
                  // Goalie detailed stats in compact format
                  <>
                    <div className="flex justify-between bg-white/5 p-1 rounded">
                      <span className="text-white/70">PMO:</span>
                      <span className="text-red-400 font-semibold">
                        {playerStats.goalsAgainstAverage ? playerStats.goalsAgainstAverage.toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between bg-white/5 p-1 rounded">
                      <span className="text-white/70">Torj.:</span>
                      <span className="text-cyan-400 font-semibold">{playerStats.saves || 0}</span>
                    </div>
                    <div className="flex justify-between bg-white/5 p-1 rounded">
                      <span className="text-white/70">Pääst.:</span>
                      <span className="text-red-400 font-semibold">{playerStats.goalsAgainst || 0}</span>
                    </div>
                    <div className="flex justify-between bg-white/5 p-1 rounded">
                      <span className="text-white/70">Voitto%:</span>
                      <span className="text-green-400 font-semibold">
                        {playerStats.games > 0 ? Math.round((playerStats.wins / playerStats.games) * 100) : 0}%
                      </span>
                    </div>
                  </>
                ) : (
                  // Regular player detailed stats in compact format
                  <>
                    <div className="flex justify-between bg-white/5 p-1 rounded">
                      <span className="text-white/70">P/O:</span>
                      <span className="text-purple-400 font-semibold">
                        {playerStats.games > 0 ? (playerStats.points / playerStats.games).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between bg-white/5 p-1 rounded">
                      <span className="text-white/70">M%:</span>
                      <span className="text-orange-400 font-semibold">
                        {playerStats.points > 0 ? Math.round((playerStats.goals / playerStats.points) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between bg-white/5 p-1 rounded">
                      <span className="text-white/70">S%:</span>
                      <span className="text-cyan-400 font-semibold">
                        {playerStats.points > 0 ? Math.round((playerStats.assists / playerStats.points) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between bg-white/5 p-1 rounded">
                      <span className="text-white/70">Rang.:</span>
                      <span className="text-red-400 font-semibold">
                        {(playerStats.penalties || 0) * 2}min
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatsClick(playerStats);
                }}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded text-xs font-semibold transition"
              >
                Näytä kaikkien kausien tilastot
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
  const [showPointsChart, setShowPointsChart] = useState(false); // Added state for chart visibility

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
      // For other players, ensure we have all season data
      const allPlayerData = allPlayersAndGoalies.find(p => 
        p.name.toLowerCase() === playerData.name.toLowerCase()
      );
      
      if (allPlayerData && allPlayerData.seasons) {
        setSelectedPlayer({
          ...playerData,
          seasonHistory: allPlayerData.seasons
        });
      } else {
        setSelectedPlayer(playerData);
      }
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
    penalties: stats.reduce((sum, p) => sum + (p.penalties || 0), 0),
    players: dynamicPlayers.length, // All displayed players have season data now
    totalCards: dynamicPlayers.length // Total cards shown (all have data now)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-6">
            {/* Control Bar - Season selector and Points button on same row */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-white/70">Kausi:</span>
                  <select
                    value={selectedSeason}
                    onChange={(e) => {
                      const newSeason = e.target.value;
                      const seasonIndex = availableSeasons.indexOf(newSeason);
                      handleSeasonChange(seasonIndex);
                    }}
                    className="bg-card border border-white/20 rounded-lg px-4 py-2 text-white font-semibold min-w-[140px] focus:outline-none focus:ring-2 focus:ring-brand/50"
                  >
                    {availableSeasons.map(season => (
                      <option key={season} value={season} className="bg-card text-white">
                        {season}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                onClick={() => setShowPointsChart(!showPointsChart)}
                className="flex items-center gap-2 bg-gradient-to-r from-brand to-accent hover:from-brand/90 hover:to-accent/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105"
              >
                <BarChart3 size={16} />
                {showPointsChart ? "Piilota pistepörssi" : "Näytä pistepörssi"}
              </button>
            </div>
            
            <div className="text-white/60 text-sm">
              {loading ? 'Ladataan tilastoja...' : 
                `${teamTotals.players} aktiivista pelaajaa (${sortedPlayers.length} korttia näkyy)`
              }
            </div>
          </div>
        </Reveal>

        {/* Top Performers Chart - Now toggleable with animation */}
        <AnimatePresence>
          {stats.length > 0 && showPointsChart && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mb-12"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Statistics Overview - Made smaller and without icons */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{teamTotals.players}</div>
                <div className="text-white/70 text-xs">Pelaajia</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">{teamTotals.goals}</div>
                <div className="text-white/70 text-xs">Maaleja</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{teamTotals.assists}</div>
                <div className="text-white/70 text-xs">Syöttöjä</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{teamTotals.points}</div>
                <div className="text-white/70 text-xs">Pisteitä</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
              <div className="text-center">
                <div className="text-xl font-bold text-red-400">{teamTotals.penalties * 2}min</div>
                <div className="text-white/70 text-xs">Jäähyjä</div>
              </div>
            </div>
          </div>
        </Reveal>
        
        {/* Players Grid */}
        <Reveal delay={0.4}>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full">
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
                className="bg-gray-900/95 rounded-xl p-6 max-w-4xl w-full border border-white/20 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedPlayer.name}
                      {selectedPlayer.position === 'Maalivahti' ? (
                        <span className="ml-2 text-sm bg-orange-500 px-2 py-1 rounded-full">
                          Maalivahti #{selectedPlayer.number}
                        </span>
                      ) : (
                        <span className="ml-2 text-sm bg-orange-500 px-2 py-1 rounded-full">
                          {selectedPlayer.position || selectedPlayer.role || 'Pelaaja'} #{selectedPlayer.number}
                        </span>
                      )}
                    </h3>
                    <div className="text-white/70 text-sm mt-1">
                      {selectedPlayer.seasonHistory?.length || selectedPlayer.careerStats?.seasonsPlayed || 1} kautta uralla
                    </div>
                    
                    {/* Season Selector */}
                    <div className="flex items-center gap-2 mt-3">
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
                    className="text-white/60 hover:text-white transition text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Career Stats */}
                {(selectedPlayer.careerStats || selectedPlayer.seasonHistory) && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Uratilastot</h4>
                    {selectedPlayer.position === 'Maalivahti' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="bg-white/10 rounded p-2 text-center">
                          <div className="text-2xl font-bold text-green-400">{selectedPlayer.careerStats?.totalGames || selectedPlayer.games || 0}</div>
                          <div className="text-white/70 text-xs">Ottelut yhteensä</div>
                        </div>
                        <div className="bg-white/10 rounded p-2 text-center">
                          <div className="text-2xl font-bold text-blue-400">{selectedPlayer.careerStats?.totalWins || selectedPlayer.wins || 0}</div>
                          <div className="text-white/70 text-xs">Voitot yhteensä</div>
                        </div>
                        <div className="bg-white/10 rounded p-2 text-center">
                          <div className="text-2xl font-bold text-purple-400">{selectedPlayer.careerStats?.avgSavePercentage ? `${selectedPlayer.careerStats.avgSavePercentage.toFixed(1)}%` : selectedPlayer.savePercentage ? `${selectedPlayer.savePercentage.toFixed(1)}%` : '0.0%'}</div>
                          <div className="text-white/70 text-xs">Keskim. torjunta%</div>
                        </div>
                        <div className="bg-white/10 rounded p-2 text-center">
                          <div className="text-2xl font-bold text-cyan-400">{selectedPlayer.careerStats?.totalShutouts || selectedPlayer.shutouts || 0}</div>
                          <div className="text-white/70 text-xs">Nollapelit yhteensä</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="bg-white/10 rounded p-2 text-center">
                          <div className="text-2xl font-bold text-green-400">{selectedPlayer.careerStats?.totalGames || selectedPlayer.games || 0}</div>
                          <div className="text-white/70 text-xs">Ottelut yhteensä</div>
                        </div>
                        <div className="bg-white/10 rounded p-2 text-center">
                          <div className="text-2xl font-bold text-orange-400">{selectedPlayer.careerStats?.totalGoals || selectedPlayer.goals || 0}</div>
                          <div className="text-white/70 text-xs">Maalit yhteensä</div>
                        </div>
                        <div className="bg-white/10 rounded p-2 text-center">
                          <div className="text-2xl font-bold text-cyan-400">{selectedPlayer.careerStats?.totalAssists || selectedPlayer.assists || 0}</div>
                          <div className="text-white/70 text-xs">Syötöt yhteensä</div>
                        </div>
                        <div className="bg-white/10 rounded p-2 text-center">
                          <div className="text-2xl font-bold text-purple-400">{selectedPlayer.careerStats?.totalPoints || selectedPlayer.points || 0}</div>
                          <div className="text-white/70 text-xs">Pisteet yhteensä</div>
                        </div>
                        <div className="bg-white/10 rounded p-2 text-center">
                          <div className="text-2xl font-bold text-red-400">{selectedPlayer.careerStats?.totalPenalties || 0}</div>
                          <div className="text-white/70 text-xs">Rangaistukset yhteensä</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Season History - Show all seasons directly */}
                {selectedPlayer.seasonHistory && selectedPlayer.seasonHistory.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Kausihistoria</h4>
                    <div className="space-y-2">
                      {selectedPlayer.seasonHistory.map((season, index) => (
                        <div key={index} className="bg-white/5 rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-semibold">{season.season}</span>
                            {selectedPlayer.position === 'Maalivahti' ? (
                              <span className="text-yellow-400 font-bold">{season.savePercentage?.toFixed(1) || '0.0'}%</span>
                            ) : (
                              <span className="text-purple-400 font-bold">{season.points || 0} pts</span>
                            )}
                          </div>
                          {selectedPlayer.position === 'Maalivahti' ? (
                            <div className="grid grid-cols-5 gap-2 text-xs">
                              <div className="text-center">
                                <div className="text-green-400 font-bold">{season.games || 0}</div>
                                <div className="text-white/60">O</div>
                              </div>
                              <div className="text-center">
                                <div className="text-blue-400 font-bold">{season.wins || 0}</div>
                                <div className="text-white/60">V</div>
                              </div>
                              <div className="text-center">
                                <div className="text-purple-400 font-bold">{season.shutouts || 0}</div>
                                <div className="text-white/60">NP</div>
                              </div>
                              <div className="text-center">
                                <div className="text-cyan-400 font-bold">{season.saves || 0}</div>
                                <div className="text-white/60">Torj.</div>
                              </div>
                              <div className="text-center">
                                <div className="text-red-400 font-bold">{(season.penalties || 0) * 2}min</div>
                                <div className="text-white/60">J</div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-5 gap-2 text-xs">
                              <div className="text-center">
                                <div className="text-green-400 font-bold">{season.games || 0}</div>
                                <div className="text-white/60">O</div>
                              </div>
                              <div className="text-center">
                                <div className="text-orange-400 font-bold">{season.goals || 0}</div>
                                <div className="text-white/60">M</div>
                              </div>
                              <div className="text-center">
                                <div className="text-cyan-400 font-bold">{season.assists || 0}</div>
                                <div className="text-white/60">S</div>
                              </div>
                              <div className="text-center">
                                <div className="text-purple-400 font-bold">{season.points || 0}</div>
                                <div className="text-white/60">P</div>
                              </div>
                              <div className="text-center">
                                <div className="text-red-400 font-bold">{(season.penalties || 0) * 2}min</div>
                                <div className="text-white/60">J</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Chart - Remove the current season stats section */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">{selectedPlayer.name} - Suoritusprofiili</h4>
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
                    height={300}
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
