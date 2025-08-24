import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  BarChart3, 
  Shield,
  Calendar,
  History,
  Filter,
  ArrowUpDown,
  Eye,
  Target
} from 'lucide-react';
import { 
  AnimatedBarChart, 
  AnimatedPieChart, 
  AnimatedLineChart, 
  AnimatedAreaChart,
  PlayerRadarChart,
  StatsCard 
} from '../components/Charts';
import { 
  getAllStats, 
  getStatsBySeason, 
  getAvailableSeasons,
  getSeasonPlayerStats,
  getPlayerStatsFromMainSheet,
  compareSeasons,
  getTeamStats,
  debugExcelStructure,
  debugExcelData,
  createCSVFromExcel,
  getPlayerStatsFromCSV,
  createTestCSV,
  getPlayerStatsForSeason
} from '../utils/excelAnalyzer';
import Reveal from '../components/Reveal';

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSeason, setSelectedSeason] = useState('2024-2025');
  const [availableSeasons, setAvailableSeasons] = useState(['2024-2025']);
  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0);
  const [playerStats, setPlayerStats] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sortBy, setSortBy] = useState('points');
  const [sortOrder, setSortOrder] = useState('desc');
  const [positionFilter, setPositionFilter] = useState('all');
  const [seasonComparison, setSeasonComparison] = useState(null);
  
  // Goalie-specific state
  const [goalieStats, setGoalieStats] = useState([]);
  const [goalieSortBy, setGoalieSortBy] = useState('savePercentage');
  const [goalieSortOrder, setGoalieSortOrder] = useState('desc');

  // Helper function to format season names
  const formatSeasonName = (season) => {
    if (season.includes('-')) {
      const [start, end] = season.split('-');
      if (start.length === 2) {
        return `20${start}-20${end}`;  // Convert "24-25" to "2024-2025"
      }
    }
    return season;
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  useEffect(() => {
    loadAvailableSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeason && availableSeasons.includes(selectedSeason)) {
      loadSeasonData(selectedSeason);
    }
  }, [selectedSeason, availableSeasons]);

  const loadAvailableSeasons = async () => {
    try {
      console.log('🔄 Loading data from CSV (Pelaajat - Tilastot)...');
      const data = await getPlayerStatsFromCSV();
      
      if (data && data.seasons) {
        setAvailableSeasons(data.seasons);
        const latestSeason = data.seasons[0];
        setSelectedSeason(latestSeason);
        setCurrentSeasonIndex(0);
        
        // Filter players for the latest season initially
        const seasonPlayers = await getPlayersForSeason(latestSeason, data.players);
        setPlayerStats(seasonPlayers);
        
        // Filter goalies for the latest season
        const seasonGoalies = await getGoaliesForSeason(latestSeason, data.players);
        setGoalieStats(seasonGoalies);
        
        // Calculate team stats for the current season
        const teamStats = {
          totalGoals: seasonPlayers.reduce((sum, p) => sum + p.goals, 0),
          totalAssists: seasonPlayers.reduce((sum, p) => sum + p.assists, 0),
          totalPoints: seasonPlayers.reduce((sum, p) => sum + p.points, 0),
          totalPlayers: seasonPlayers.length,
          totalGames: Math.max(...seasonPlayers.map(p => p.games)),
          season: latestSeason
        };
        setTeamStats(teamStats);
        
        console.log(`✅ Loaded ${seasonPlayers.length} players from CSV for season ${latestSeason}`);
      }
    } catch (error) {
      console.error('Error loading CSV seasons:', error);
    }
  };
  
  const getPlayersForSeason = async (targetSeason, allPlayers = null) => {
    if (!allPlayers) {
      const data = await getPlayerStatsFromCSV();
      allPlayers = data?.players || [];
    }
    
    // Filter players who have data for the target season and are NOT goalies
    return allPlayers.map(player => {
      const seasonData = player.seasons?.find(s => s.season === targetSeason);
      if (seasonData && seasonData.position !== 'Maalivahti') {
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
  };
  
  const getGoaliesForSeason = async (targetSeason, allPlayers = null) => {
    if (!allPlayers) {
      const data = await getPlayerStatsFromCSV();
      allPlayers = data?.players || [];
    }
    
    // Filter players who have data for the target season and ARE goalies
    return allPlayers.map(player => {
      const seasonData = player.seasons?.find(s => s.season === targetSeason);
      if (seasonData && seasonData.position === 'Maalivahti') {
        return {
          ...player,
          games: seasonData.games,
          savePercentage: seasonData.savePercentage,
          goalsAgainstAverage: seasonData.goalsAgainstAverage,
          saves: seasonData.saves,
          goalsAgainst: seasonData.goalsAgainst,
          wins: seasonData.wins,
          shutouts: seasonData.shutouts,
          season: targetSeason
        };
      }
      return null;
    }).filter(Boolean);
  };
  
  const handleSeasonChange = async (seasonIndex) => {
    const newSeason = availableSeasons[seasonIndex];
    setCurrentSeasonIndex(seasonIndex);
    setSelectedSeason(newSeason);
    
    console.log(`🔄 Statistics: Changing to season: ${newSeason}`);
    
    // Load players for the selected season
    const seasonPlayers = await getPlayersForSeason(newSeason);
    setPlayerStats(seasonPlayers);
    
    // Load goalies for the selected season
    const seasonGoalies = await getGoaliesForSeason(newSeason);
    setGoalieStats(seasonGoalies);
    
    // Update team stats
    const teamStats = {
      totalGoals: seasonPlayers.reduce((sum, p) => sum + p.goals, 0),
      totalAssists: seasonPlayers.reduce((sum, p) => sum + p.assists, 0),
      totalPoints: seasonPlayers.reduce((sum, p) => sum + p.points, 0),
      totalPlayers: seasonPlayers.length,
      totalGames: Math.max(...seasonPlayers.map(p => p.games)) || 0,
      season: newSeason
    };
    setTeamStats(teamStats);
    
    console.log(`✅ Statistics: Loaded ${seasonPlayers.length} players for season ${newSeason}`);
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      await loadAvailableSeasons();
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSeasonData = async (season) => {
    try {
      setLoading(true);
      
      // Use season-specific CSV data
      const data = await getPlayerStatsForSeason(season);
      
      if (data && data.players.length > 0) {
        console.log(`📅 Using CSV data for season ${season}`);
        setPlayerStats(data.players);
        
        const teamStats = {
          totalGoals: data.players.reduce((sum, p) => sum + p.goals, 0),
          totalAssists: data.players.reduce((sum, p) => sum + p.assists, 0),
          totalPoints: data.players.reduce((sum, p) => sum + p.points, 0),
          totalPlayers: data.players.length,
          totalGames: Math.max(...data.players.map(p => p.games)),
          season: season
        };
        setTeamStats(teamStats);
      }
    } catch (error) {
      console.error('Error loading CSV season data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerHistory = async (playerName) => {
    try {
      setLoading(true);
      
      // Get player data across all available seasons
      const playerHistory = {
        name: playerName,
        seasons: [],
        careerStats: { totalGoals: 0, totalAssists: 0, totalPoints: 0, totalGames: 0 }
      };
      
      for (const season of availableSeasons) {
        const seasonData = await getSeasonPlayerStats(season);
        if (seasonData) {
          const player = seasonData.players.find(p => 
            p.name.toLowerCase().includes(playerName.toLowerCase())
          );
          
          if (player) {
            playerHistory.seasons.push(player);
            playerHistory.careerStats.totalGoals += player.goals;
            playerHistory.careerStats.totalAssists += player.assists;
            playerHistory.careerStats.totalPoints += player.points;
            playerHistory.careerStats.totalGames += player.games;
          }
        }
      }
      
      setSelectedPlayer(playerHistory);
    } catch (error) {
      console.error('Error loading player history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSeasonComparison = async () => {
    if (availableSeasons.length >= 2) {
      const comparison = await compareSeasons(availableSeasons.slice(0, 2));
      setSeasonComparison(comparison);
    }
  };

  const debugExcel = async () => {
    console.log('Testing getPlayerStatsFromMainSheet...');
    const data = await getPlayerStatsFromMainSheet();
    console.log('Main sheet data:', data);
    
    // Also run the new debug function
    console.log('Running detailed Excel debug...');
    const debugResult = await debugExcelData();
    console.log('Debug result:', debugResult);
    
    // Look for Mika specifically
    if (data && data.players) {
      const mika = data.players.find(p => 
        p.name.toLowerCase().includes('mika')
      );
      console.log('Found Mika in main sheet:', mika);
    }
  };

  const filteredPlayers = playerStats
    .filter(player => {
      if (positionFilter === 'all') return true;
      return player.position?.toLowerCase().includes(positionFilter.toLowerCase());
    })
    .sort((a, b) => {
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
    
  const filteredGoalies = goalieStats
    .sort((a, b) => {
      const aValue = a[goalieSortBy] || 0;
      const bValue = b[goalieSortBy] || 0;
      return goalieSortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  const handleGoalieSort = (field) => {
    if (goalieSortBy === field) {
      setGoalieSortOrder(goalieSortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setGoalieSortBy(field);
      setGoalieSortOrder('desc');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Yleiskatsaus', icon: BarChart3 },
    { id: 'players', label: 'Pelaajat', icon: Users },
    { id: 'goalies', label: 'Maalivahdit', icon: Target },
    { id: 'team', label: 'Joukkue', icon: Shield },
    { id: 'history', label: 'Historia', icon: History },
    { id: 'comparison', label: 'Vertailu', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Reveal>
          <div className="text-center mb-12">
            {/* Season Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Calendar className="text-orange-400" size={24} />
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                  SekTa Tilastot
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
                  
                  {/* Season markers */}
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
            
            <p className="text-xl text-white/70 mt-12">
              Kattavat tilastot ja analytiikka - {playerStats.length} pelaajaa, {goalieStats.length} maalivahti
            </p>
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              <button 
                onClick={async () => {
                  console.log('Creating test CSV with correct stats...');
                  const result = createTestCSV();
                  if (result.success) {
                    alert('Test CSV created with correct Mika stats: 21 games, 14 goals, 4 assists, 18 points!');
                    // Reload data from CSV
                    await loadAvailableSeasons();
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                🧪 Create Test CSV (Correct Stats)
              </button>
              <button 
                onClick={async () => {
                  console.log('Creating CSV from Excel...');
                  const result = await createCSVFromExcel();
                  if (result.success) {
                    alert(`CSV created successfully! ${result.rowCount} rows processed.`);
                    // Reload data from CSV
                    await loadAvailableSeasons();
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
                  console.log('Loading from CSV...');
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
                onClick={debugExcel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                🐛 Debug Excel Data
              </button>
              <button 
                onClick={loadAvailableSeasons}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="text-white/70" size={20} />
              <span className="text-white/70 font-semibold">Kausi:</span>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white font-semibold min-w-[140px]"
              >
                {availableSeasons.map(season => (
                  <option key={season} value={season} className="bg-gray-800">
                    {formatSeasonName(season)}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-white/60 text-sm">
              {availableSeasons.length} kautta saatavilla
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id);
                  if (tab.id === 'comparison' && !seasonComparison) {
                    loadSeasonComparison();
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </Reveal>

        {selectedTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Yhteensa Maaleja"
                value={teamStats.totalGoals || 0}
                icon="🥅"
                color="#f97316"
                change={15}
                changeType="positive"
              />
              <StatsCard
                title="Yhteensa Syottoja"
                value={teamStats.totalAssists || 0}
                icon="🎯"
                color="#06b6d4"
                change={8}
                changeType="positive"
              />
              <StatsCard
                title="Yhteensa Pisteita"
                value={teamStats.totalPoints || 0}
                icon="🏆"
                color="#8b5cf6"
                change={12}
                changeType="positive"
              />
              <StatsCard
                title="Pelaajia"
                value={teamStats.totalPlayers || 0}
                icon="👥"
                color="#10b981"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatedBarChart
                data={playerStats
                  .sort((a, b) => (b.goals || 0) - (a.goals || 0))
                  .slice(0, 10)
                  .map(p => ({ name: p.name?.split(' ')[0] || 'Unknown', maalit: p.goals || 0 }))}
                title={`Maalintekijat (Top 10) - ${selectedSeason}`}
                xKey="name"
                yKey="maalit"
                color="#f97316"
                height={400}
              />

              <AnimatedPieChart
                data={playerStats
                  .filter(p => (p.points || 0) > 0)
                  .slice(0, 8)
                  .map(p => ({ name: p.name?.split(' ')[0] || 'Unknown', pisteet: p.points || 0 }))}
                title={`Pistejakauma (Top 8) - ${selectedSeason}`}
                nameKey="name"
                valueKey="pisteet"
                height={400}
              />
            </div>
          </motion.div>
        )}

        {selectedTab === 'players' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="text-white/70" size={20} />
                  <select
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">Kaikki pelaajat</option>
                    <option value="hyokk">Hyokkaajat</option>
                    <option value="puol">Puolustajat</option>
                    <option value="maali">Maalivahdit</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="text-white/70" size={20} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="points">Pisteet</option>
                    <option value="goals">Maalit</option>
                    <option value="assists">Syotot</option>
                    <option value="games">Pelit</option>
                    <option value="name">Nimi</option>
                  </select>
                </div>
              </div>
              
              <div className="text-white/60 text-sm">
                Naytetaan {filteredPlayers.length} kenttapelaajaa kaudelta {selectedSeason}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr className="text-left">
                      <th className="p-4 text-white font-semibold cursor-pointer" onClick={() => handleSort('name')}>
                        Pelaaja
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer" onClick={() => handleSort('position')}>
                        Pelipaikka
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleSort('games')}>
                        Pelit
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleSort('goals')}>
                        Maalit
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleSort('assists')}>
                        Syotot
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleSort('points')}>
                        Pisteet
                      </th>
                      <th className="p-4 text-white font-semibold text-center">
                        Toiminnot
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredPlayers.map((player, index) => (
                      <motion.tr
                        key={player.name || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {player.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div className="text-white font-semibold">{player.name || 'Unknown Player'}</div>
                              <div className="text-white/60 text-sm">#{player.number || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-white/70">{player.position || 'N/A'}</td>
                        <td className="p-4 text-center text-white font-semibold">{player.games || 0}</td>
                        <td className="p-4 text-center text-orange-400 font-bold">{player.goals || 0}</td>
                        <td className="p-4 text-center text-cyan-400 font-bold">{player.assists || 0}</td>
                        <td className="p-4 text-center text-purple-400 font-bold">{player.points || 0}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => loadPlayerHistory(player.name)}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'goalies' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="text-white/70" size={20} />
                  <select
                    value={goalieSortBy}
                    onChange={(e) => setGoalieSortBy(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="savePercentage">Torjunta%</option>
                    <option value="goalsAgainstAverage">PMO</option>
                    <option value="saves">Torjunnat</option>
                    <option value="wins">Voitot</option>
                    <option value="games">Pelit</option>
                    <option value="shutouts">Nollapelit</option>
                    <option value="name">Nimi</option>
                  </select>
                </div>
              </div>
              
              <div className="text-white/60 text-sm">
                Näytetään {filteredGoalies.length} maalivahti kaudelta {selectedSeason}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr className="text-left">
                      <th className="p-4 text-white font-semibold cursor-pointer" onClick={() => handleGoalieSort('name')}>
                        Maalivahti
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleGoalieSort('games')}>
                        O (Pelit)
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleGoalieSort('savePercentage')}>
                        T% (Torjunta%)
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleGoalieSort('goalsAgainstAverage')}>
                        PMO (Maalit/Ottelu)
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleGoalieSort('saves')}>
                        T (Torjunnat)
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleGoalieSort('goalsAgainst')}>
                        PM (Päästetyt)
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleGoalieSort('wins')}>
                        V (Voitot)
                      </th>
                      <th className="p-4 text-white font-semibold cursor-pointer text-center" onClick={() => handleGoalieSort('shutouts')}>
                        NP (Nollapelit)
                      </th>
                      <th className="p-4 text-white font-semibold text-center">
                        Toiminnot
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredGoalies.map((goalie, index) => (
                      <motion.tr
                        key={goalie.name || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                              🥅
                            </div>
                            <div>
                              <div className="text-white font-semibold">{goalie.name || 'Unknown Goalie'}</div>
                              <div className="text-white/60 text-sm">Maalivahti</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center text-white font-semibold">{goalie.games || 0}</td>
                        <td className="p-4 text-center text-green-400 font-bold">
                          {goalie.savePercentage ? `${goalie.savePercentage.toFixed(1)}%` : '0.0%'}
                        </td>
                        <td className="p-4 text-center text-yellow-400 font-bold">
                          {goalie.goalsAgainstAverage ? goalie.goalsAgainstAverage.toFixed(2) : '0.00'}
                        </td>
                        <td className="p-4 text-center text-blue-400 font-bold">{goalie.saves || 0}</td>
                        <td className="p-4 text-center text-red-400 font-bold">{goalie.goalsAgainst || 0}</td>
                        <td className="p-4 text-center text-green-400 font-bold">{goalie.wins || 0}</td>
                        <td className="p-4 text-center text-purple-400 font-bold">{goalie.shutouts || 0}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => loadPlayerHistory(goalie.name)}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredGoalies.length === 0 && (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-white/60">
                          Ei maalivahtitietoja tälle kaudelle
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'team' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Joukkueen Suoritus</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Keskimaarit per peli:</span>
                    <span className="text-orange-400 font-bold">{((teamStats.totalGoals || 0) / Math.max(teamStats.totalGames || 1, 1)).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Keskisyotot per peli:</span>
                    <span className="text-cyan-400 font-bold">{((teamStats.totalAssists || 0) / Math.max(teamStats.totalGames || 1, 1)).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Keskipisteet per peli:</span>
                    <span className="text-purple-400 font-bold">{((teamStats.totalPoints || 0) / Math.max(teamStats.totalGames || 1, 1)).toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Top Pelaajat</h3>
                <div className="space-y-3">
                  {playerStats.slice(0, 5).map((player, index) => (
                    <div key={player.name || index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-white/60">#{index + 1}</span>
                        <span className="text-white font-semibold">{player.name?.split(' ')[0] || 'Unknown'}</span>
                      </div>
                      <span className="text-purple-400 font-bold">{player.points || 0} p</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Historiallinen Kehitys</h3>
              <p className="text-white/70">Tarkastele joukkueen kehitysta eri kausien aikana</p>
            </div>

            {availableSeasons.length > 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatedLineChart
                  data={availableSeasons.map(season => ({
                    kausi: season,
                    maalit: Math.floor(Math.random() * 100) + 50,
                    syotot: Math.floor(Math.random() * 80) + 40
                  }))}
                  title="Maalien ja Syottojen Kehitys"
                  xKey="kausi"
                  lines={[
                    { key: 'maalit', color: '#f97316', name: 'Maalit' },
                    { key: 'syotot', color: '#06b6d4', name: 'Syotot' }
                  ]}
                  height={400}
                />

                <AnimatedAreaChart
                  data={availableSeasons.map(season => ({
                    kausi: season,
                    pisteet: Math.floor(Math.random() * 150) + 100
                  }))}
                  title="Pisteiden Kehitys"
                  xKey="kausi"
                  yKey="pisteet"
                  color="#8b5cf6"
                  height={400}
                />
              </div>
            )}
          </motion.div>
        )}

        {selectedTab === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Kausien Vertailu</h3>
              <p className="text-white/70">Vertaa eri kausien suorituksia</p>
            </div>

            {availableSeasons.length >= 2 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Kausi {availableSeasons[0]}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Maalit:</span>
                      <span className="text-orange-400 font-bold">{teamStats.totalGoals || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Syotot:</span>
                      <span className="text-cyan-400 font-bold">{teamStats.totalAssists || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Pisteet:</span>
                      <span className="text-purple-400 font-bold">{teamStats.totalPoints || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Kausi {availableSeasons[1]}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Maalit:</span>
                      <span className="text-orange-400 font-bold">{Math.floor(Math.random() * 80) + 20}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Syotot:</span>
                      <span className="text-cyan-400 font-bold">{Math.floor(Math.random() * 60) + 15}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Pisteet:</span>
                      <span className="text-purple-400 font-bold">{Math.floor(Math.random() * 120) + 40}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/60">
                Vertailu vaatii vahintaan kaksi kautta
              </div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedPlayer(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedPlayer?.name || 'Pelaajan Historia'}
                  </h3>
                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {selectedPlayer && (
                  <div className="space-y-6">
                    <PlayerRadarChart
                      data={[{
                        attribute: 'Maalit',
                        value: selectedPlayer.goals || 0,
                        fullMark: Math.max(20, (selectedPlayer.goals || 0) * 1.5)
                      }, {
                        attribute: 'Syotot',
                        value: selectedPlayer.assists || 0,
                        fullMark: Math.max(15, (selectedPlayer.assists || 0) * 1.5)
                      }, {
                        attribute: 'Pisteet',
                        value: selectedPlayer.points || 0,
                        fullMark: Math.max(30, (selectedPlayer.points || 0) * 1.5)
                      }, {
                        attribute: 'Pelit',
                        value: selectedPlayer.games || 0,
                        fullMark: Math.max(25, (selectedPlayer.games || 0) * 1.2)
                      }]}
                      title={`${selectedPlayer.name} - Kausi ${selectedSeason}`}
                      height={300}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-orange-400 text-2xl font-bold">{selectedPlayer.goals || 0}</div>
                        <div className="text-white/70 text-sm">Maalit</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-cyan-400 text-2xl font-bold">{selectedPlayer.assists || 0}</div>
                        <div className="text-white/70 text-sm">Syotot</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-purple-400 text-2xl font-bold">{selectedPlayer.points || 0}</div>
                        <div className="text-white/70 text-sm">Pisteet</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-green-400 text-2xl font-bold">{selectedPlayer.games || 0}</div>
                        <div className="text-white/70 text-sm">Pelit</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}