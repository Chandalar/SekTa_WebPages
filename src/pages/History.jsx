import { useState, useEffect } from "react";
import Reveal from "../components/Reveal";
import { fetchTeamSeasonStats, saveTeamHistoryToCSV, getLastUpdateTime, fetchAllPlayerStats, saveAllPlayerStatsToCSV, savePlayerStatsBySeasonToCSV } from "../utils/floorballDataService";
import { RefreshCcw, Loader2, Download, Database, Save, Users } from "lucide-react";

export default function History() {
  const [seasons, setSeasons] = useState([
    { season: "2024–25", league: "Miehet 3. div", games: 18, goalsFor: 96, goalsAgainst: 82, points: 32 },
    { season: "2023–24", league: "Miehet 4. div", games: 20, goalsFor: 110, goalsAgainst: 70, points: 40 },
  ]);
  const [loading, setLoading] = useState(false);
  const [liveDataEnabled, setLiveDataEnabled] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('default'); // 'default', 'local', or 'remote'
  const [lastUpdated, setLastUpdated] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);
  const [showPlayerStats, setShowPlayerStats] = useState(false);

  useEffect(() => {
    // Check if we have locally saved data on component mount
    checkForLocalData();
    
    // If live data is enabled, fetch data on component mount
    if (liveDataEnabled) {
      fetchData();
    }
  }, [liveDataEnabled]);

  const checkForLocalData = () => {
    try {
      const lastUpdateTime = getLastUpdateTime('team-history');
      if (lastUpdateTime) {
        setLastUpdated(lastUpdateTime);
        setDataSource('local');
        // If local data exists and live data is enabled, load it
        if (liveDataEnabled) {
          fetchData(false);
        }
      } else {
        setDataSource('default');
      }
    } catch (err) {
      console.warn("Could not check for local data:", err);
    }
  };

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Pass the forceRefresh flag to the fetch function
      const data = await fetchTeamSeasonStats(forceRefresh);
      setSeasons(data);
      setDataSource(forceRefresh ? 'remote' : 'local');
      
      // Get the last update time
      const lastUpdateTime = getLastUpdateTime('team-history');
      if (lastUpdateTime) {
        setLastUpdated(lastUpdateTime);
      }
      
      console.log("Successfully fetched team statistics:", data);
    } catch (err) {
      console.error("Error fetching team statistics:", err);
      setError("Virhe tilastojen haussa. Yritä myöhemmin uudelleen.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all player statistics for all seasons
      const data = await fetchAllPlayerStats(forceRefresh);
      setPlayerStats(data);
      setDataSource(forceRefresh ? 'remote' : 'local');
      
      console.log("Successfully fetched player statistics:", data);
    } catch (err) {
      console.error("Error fetching player statistics:", err);
      setError("Virhe pelaajatilastojen haussa. Yritä myöhemmin uudelleen.");
    } finally {
      setLoading(false);
    }
  };

  const forceRefreshData = async () => {
    if (showPlayerStats) {
      await fetchPlayerData(true);
    } else {
      await fetchData(true);
    }
  };

  const toggleLiveData = () => {
    // If we're turning on live data for the first time
    if (!liveDataEnabled) {
      setLiveDataEnabled(true);
      if (showPlayerStats) {
        fetchPlayerData();
      } else {
        fetchData();
      }
    } else {
      setLiveDataEnabled(false);
      // Reset to default data if disabling live data
      setSeasons([
        { season: "2024–25", league: "Miehet 3. div", games: 18, goalsFor: 96, goalsAgainst: 82, points: 32 },
        { season: "2023–24", league: "Miehet 4. div", games: 20, goalsFor: 110, goalsAgainst: 70, points: 40 },
      ]);
      setPlayerStats([]);
      setDataSource('default');
      setLastUpdated(null);
    }
  };

  const exportToCSV = async () => {
    try {
      if (showPlayerStats) {
        // Export player stats
        if (playerStats.length > 0) {
          // Option 1: Export all player stats to one CSV
          await saveAllPlayerStatsToCSV(playerStats);
          
          // Option 2: Export player stats by season to separate CSVs
          // await savePlayerStatsBySeasonToCSV(playerStats);
        }
      } else {
        // Export team history
        await saveTeamHistoryToCSV(seasons);
      }
    } catch (err) {
      console.error("Error exporting data to CSV:", err);
      setError("Virhe tietojen viennissä CSV-tiedostoon.");
    }
  };

  const toggleView = () => {
    setShowPlayerStats(!showPlayerStats);
    // If live data is enabled, fetch the appropriate data when toggling views
    if (liveDataEnabled) {
      if (showPlayerStats) {
        fetchData();
      } else {
        fetchPlayerData();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center">Historia</h1>
        
        {/* Live data toggle button */}
        <div className="flex justify-center mb-6 gap-2 flex-wrap">
          <button
            onClick={toggleLiveData}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              liveDataEnabled
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
            }`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Database size={18} className={liveDataEnabled ? "text-green-300" : ""} />
            )}
            {liveDataEnabled ? "Live-haku käytössä" : "Kytke live-haku"}
          </button>
          
          <button
            onClick={toggleView}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-all"
            disabled={loading}
          >
            <Users size={18} />
            {showPlayerStats ? "Näytä joukkuehistoria" : "Näytä pelaajatilastot"}
          </button>
          
          {liveDataEnabled && (
            <button
              onClick={forceRefreshData}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all"
              disabled={loading}
              title="Päivitä tiedot Salibandyliiton palvelusta"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
              Päivitä
            </button>
          )}
          
          {(seasons.length > 0 || playerStats.length > 0) && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all"
              disabled={loading}
              title="Tallenna tiedot CSV-tiedostoon"
            >
              <Save size={18} />
              Tallenna CSV
            </button>
          )}
        </div>
        
        {/* Data source indicator */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-sm">
            <span className="text-white/70">Tietolähde:</span>
            <span className={`font-semibold ${
              dataSource === 'remote' 
                ? 'text-green-400' 
                : dataSource === 'local' 
                  ? 'text-blue-400' 
                  : 'text-orange-400'
            }`}>
              {dataSource === 'remote' 
                ? 'Päivitetty Salibandyliiton sivuilta' 
                : dataSource === 'local' 
                  ? 'Paikallisesti tallennettu data' 
                  : 'Sovelluksen oletusdata'}
            </span>
          </div>
          
          {lastUpdated && (
            <div className="text-white/50 text-xs mt-1">
              Päivitetty: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        
        <Reveal>
          {!showPlayerStats ? (
            // Team History View
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-white/80">
                  <tr>
                    <th className="p-3">Kausi</th>
                    <th className="p-3">Sarja</th>
                    <th className="p-3">Ottelut</th>
                    <th className="p-3">V</th>
                    <th className="p-3">T</th>
                    <th className="p-3">H</th>
                    <th className="p-3">TM</th>
                    <th className="p-3">PM</th>
                    <th className="p-3">Pisteet</th>
                    <th className="p-3">Sijoitus</th>
                  </tr>
                </thead>
                <tbody className="text-white/90">
                  {loading && !seasons.length ? (
                    <tr>
                      <td colSpan="10" className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Loader2 size={40} className="animate-spin text-orange-500" />
                          <span className="text-white/70">Haetaan tietoja Salibandyliitolta...</span>
                        </div>
                      </td>
                    </tr>
                  ) : seasons.length > 0 ? (
                    seasons.map((s) => (
                      <tr key={s.season} className="border-t border-white/10 hover:bg-white/5 transition">
                        <td className="p-3">{s.season}</td>
                        <td className="p-3">{s.league}</td>
                        <td className="p-3">{s.games}</td>
                        <td className="p-3">{s.wins || "-"}</td>
                        <td className="p-3">{s.ties || "-"}</td>
                        <td className="p-3">{s.losses || "-"}</td>
                        <td className="p-3">{s.goalsFor}</td>
                        <td className="p-3">{s.goalsAgainst}</td>
                        <td className="p-3">{s.points}</td>
                        <td className="p-3">
                          {s.position && s.teamCount 
                            ? `${s.position}/${s.teamCount}`
                            : "-"
                          }
                          {s.notes && (
                            <span className="ml-2 text-xs text-orange-400 cursor-help" title={s.notes}>*</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-8 text-center text-white/50">
                        Ei kausia saatavilla
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            // Player Statistics View
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-white/80">
                  <tr>
                    <th className="p-3">Pelaaja</th>
                    <th className="p-3">Kausi</th>
                    <th className="p-3">Pelipaikka</th>
                    <th className="p-3">Ottelut</th>
                    <th className="p-3">Maalit</th>
                    <th className="p-3">Syötöt</th>
                    <th className="p-3">Pisteet</th>
                    <th className="p-3">Jäähyt</th>
                    {playerStats.some(p => p.position === 'Maalivahti') && (
                      <>
                        <th className="p-3">Torjunnat</th>
                        <th className="p-3">T%</th>
                        <th className="p-3">PM/O</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="text-white/90">
                  {loading && !playerStats.length ? (
                    <tr>
                      <td colSpan="12" className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Loader2 size={40} className="animate-spin text-orange-500" />
                          <span className="text-white/70">Haetaan pelaajatilastoja Salibandyliitolta...</span>
                        </div>
                      </td>
                    </tr>
                  ) : playerStats.length > 0 ? (
                    playerStats.map((player, index) => (
                      <tr key={`${player.name}-${player.season}-${index}`} className="border-t border-white/10 hover:bg-white/5 transition">
                        <td className="p-3">{player.name}</td>
                        <td className="p-3">{player.season}</td>
                        <td className="p-3">{player.position}</td>
                        <td className="p-3">{player.games}</td>
                        <td className="p-3">{player.goals}</td>
                        <td className="p-3">{player.assists}</td>
                        <td className="p-3">{player.points}</td>
                        <td className="p-3">{player.penalties}</td>
                        {player.position === 'Maalivahti' && (
                          <>
                            <td className="p-3">{player.saves || "-"}</td>
                            <td className="p-3">{player.savePercentage ? player.savePercentage.toFixed(1) + "%" : "-"}</td>
                            <td className="p-3">{player.goalsAgainstAverage ? player.goalsAgainstAverage.toFixed(2) : "-"}</td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="p-8 text-center text-white/50">
                        Ei pelaajatilastoja saatavilla
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Reveal>
        
        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
          <p className="text-white/60 text-sm">
            {liveDataEnabled 
              ? showPlayerStats 
                ? "Pelaajatilastot haetaan suoraan Salibandyliiton tulospalvelusta ja tallennetaan paikallisesti."
                : "Tiedot haetaan suoraan Salibandyliiton tulospalvelusta ja tallennetaan paikallisesti."
              : showPlayerStats
                ? "Pelaajatilastot ovat staattisia. Kytke live-haku käyttöön saadaksesi ajantasaiset tiedot Salibandyliitolta."
                : "Tiedot ovat staattisia. Kytke live-haku käyttöön saadaksesi ajantasaiset tiedot Salibandyliitolta."}
          </p>
          
          {liveDataEnabled && dataSource === 'local' && (
            <button
              onClick={forceRefreshData}
              className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition p-1 rounded-md hover:bg-white/10"
              title="Päivitä tiedot"
            >
              <RefreshCcw size={14} />
              <span>Päivitä online-lähteestä</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}