// Updated Player Detail Modal for Team.jsx
// This file contains the updated player detail modal design to match the goalie statistics display style
// Replace the existing Player Detail Modal section in Team.jsx with this code

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
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4">Uratilastot</h4>
            {selectedPlayer.position === 'Maalivahti' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">🥅</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{selectedPlayer.careerStats?.totalGames || selectedPlayer.games || 0}</div>
                  <div className="text-white/70 text-sm">Ottelut yhteensä</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{selectedPlayer.careerStats?.totalWins || selectedPlayer.wins || 0}</div>
                  <div className="text-white/70 text-sm">Voitot yhteensä</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{selectedPlayer.careerStats?.avgSavePercentage ? `${selectedPlayer.careerStats.avgSavePercentage.toFixed(1)}%` : selectedPlayer.savePercentage ? `${selectedPlayer.savePercentage.toFixed(1)}%` : '0.0%'}</div>
                  <div className="text-white/70 text-sm">Keskimääräinen torjunta%</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">🚫</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">{selectedPlayer.careerStats?.totalShutouts || selectedPlayer.shutouts || 0}</div>
                  <div className="text-white/70 text-sm">Nollapelit yhteensä</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">🏒</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{selectedPlayer.careerStats?.totalGames || selectedPlayer.games || 0}</div>
                  <div className="text-white/70 text-sm">Ottelut yhteensä</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">⚽</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">{selectedPlayer.careerStats?.totalGoals || selectedPlayer.goals || 0}</div>
                  <div className="text-white/70 text-sm">Maalit yhteensä</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">{selectedPlayer.careerStats?.totalAssists || selectedPlayer.assists || 0}</div>
                  <div className="text-white/70 text-sm">Syötöt yhteensä</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{selectedPlayer.careerStats?.totalPoints || selectedPlayer.points || 0}</div>
                  <div className="text-white/70 text-sm">Pisteet yhteensä</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Season History */}
        {selectedPlayer.seasonHistory && selectedPlayer.seasonHistory.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">Kausihistoria</h4>
            <div className="space-y-3">
              {selectedPlayer.seasonHistory.map((season, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <span className="text-white font-semibold">{season.season}</span>
                  </div>
                  {selectedPlayer.position === 'Maalivahti' ? (
                    <div className="grid grid-cols-6 gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-green-400 font-bold">{season.games || 0}</div>
                        <div className="text-white/60 text-xs">Ottelut</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold">{season.savePercentage?.toFixed(1) || '0.0'}%</div>
                        <div className="text-white/60 text-xs">Torjunta%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">{season.wins || 0}</div>
                        <div className="text-white/60 text-xs">Voitot</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold">{season.shutouts || 0}</div>
                        <div className="text-white/60 text-xs">Nollapelit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-cyan-400 font-bold">{season.saves || 0}</div>
                        <div className="text-white/60 text-xs">Torjunnat</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-bold">{season.goalsAgainst || 0}</div>
                        <div className="text-white/60 text-xs">Päästetyt</div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-green-400 font-bold">{season.games || 0}</div>
                        <div className="text-white/60 text-xs">Ottelut</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 font-bold">{season.goals || 0}</div>
                        <div className="text-white/60 text-xs">Maalit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-cyan-400 font-bold">{season.assists || 0}</div>
                        <div className="text-white/60 text-xs">Syötöt</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold">{season.points || 0}</div>
                        <div className="text-white/60 text-xs">Pisteet</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-bold">{season.penalties || 0}</div>
                        <div className="text-white/60 text-xs">Rangaistukset</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold">
                          {season.games > 0 ? (season.points / season.games).toFixed(2) : '0.00'}
                        </div>
                        <div className="text-white/60 text-xs">P/Ottelu</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Season Stats */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">Kausi {selectedSeason}</h4>
          {selectedPlayer.position === 'Maalivahti' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🥅</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{selectedPlayer.games || 0}</div>
                <div className="text-white/70 text-sm">Ottelut</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🏆</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">{selectedPlayer.wins || 0}</div>
                <div className="text-white/70 text-sm">Voitot</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🛡️</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">{selectedPlayer.savePercentage ? `${selectedPlayer.savePercentage.toFixed(1)}%` : '0.0%'}</div>
                <div className="text-white/70 text-sm">Torjunta%</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🚫</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">{selectedPlayer.shutouts || 0}</div>
                <div className="text-white/70 text-sm">Nollapelit</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">👐</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">{selectedPlayer.saves || 0}</div>
                <div className="text-white/70 text-sm">Torjunnat</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🥅</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{selectedPlayer.goalsAgainst || 0}</div>
                <div className="text-white/70 text-sm">Päästetyt</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📊</span>
                </div>
                <div className="text-2xl font-bold text-indigo-400">{selectedPlayer.goalsAgainstAverage?.toFixed(2) || '0.00'}</div>
                <div className="text-white/70 text-sm">PMO</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">%</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {selectedPlayer.games > 0 ? Math.round((selectedPlayer.wins / selectedPlayer.games) * 100) : 0}%
                </div>
                <div className="text-white/70 text-sm">Voitto%</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🏒</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{selectedPlayer.games || 0}</div>
                <div className="text-white/70 text-sm">Ottelut</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">⚽</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">{selectedPlayer.goals || 0}</div>
                <div className="text-white/70 text-sm">Maalit</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🎯</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">{selectedPlayer.assists || 0}</div>
                <div className="text-white/70 text-sm">Syötöt</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🏆</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">{selectedPlayer.points || 0}</div>
                <div className="text-white/70 text-sm">Pisteet</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🟨</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{(selectedPlayer.penalties || 0) * 2}min</div>
                <div className="text-white/70 text-sm">Rangaistukset</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📊</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {selectedPlayer.games > 0 ? (selectedPlayer.points / selectedPlayer.games).toFixed(2) : '0.00'}
                </div>
                <div className="text-white/70 text-sm">P/Ottelu</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">%</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {selectedPlayer.points > 0 ? Math.round((selectedPlayer.goals / selectedPlayer.points) * 100) : 0}%
                </div>
                <div className="text-white/70 text-sm">Maalitehokkuus</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">%</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {selectedPlayer.points > 0 ? Math.round((selectedPlayer.assists / selectedPlayer.points) * 100) : 0}%
                </div>
                <div className="text-white/70 text-sm">Syöttötehokkuus</div>
              </div>
            </div>
          )}
        </div>

        {/* Performance Chart */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">{selectedPlayer.name} - Suoritusprofiili</h4>
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
            height={350}
          />
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>