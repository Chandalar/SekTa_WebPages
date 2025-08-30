import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target,
  Plus,
  Trash2,
  Save,
  Upload,
  Download,
  Edit,
  X,
  Minus
} from 'lucide-react';
import { getComprehensivePlayerAndGoalieLists } from '../utils/csvDataLoader';
import Reveal from '../components/Reveal';

export default function Tactics() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('2024-2025');
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([
    { id: 'field1', name: 'Kenttä 1', players: [], width: 600, height: 300 }
  ]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchedPlayer, setTouchedPlayer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [draggedFieldPlayer, setDraggedFieldPlayer] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [pendingPlayer, setPendingPlayer] = useState(null);
  const fieldRefs = useRef({});

  // Player image mapping
  const playerImageMap = {
    'Mika Aaltonen': 'Mika.jpg',
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

  const getPlayerImage = (playerName) => {
    return playerImageMap[playerName] || 'gorilla_puku.jpeg';
  };

  // Detect touch device
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // Load player data
  useEffect(() => {
    loadPlayerData();
  }, []);

  // Filter available players when all players or season changes
  useEffect(() => {
    // Get all players for the selected season (including goalies)
    const seasonPlayers = allPlayers
      .filter(player => {
        const seasonData = player.seasons?.find(s => s.season === selectedSeason);
        return seasonData;
      })
      .map(player => {
        const seasonData = player.seasons.find(s => s.season === selectedSeason);
        return {
          id: player.name,
          name: player.name,
          number: seasonData.number || 'N/A',
          position: seasonData.position,
          goals: seasonData.goals || 0,
          assists: seasonData.assists || 0,
          penalties: seasonData.penalties || 0,
          img: getPlayerImage(player.name)
        };
      });
    
    setAvailablePlayers(seasonPlayers);
  }, [allPlayers, selectedSeason]);

  const loadPlayerData = async () => {
    try {
      setLoading(true);
      const data = await getComprehensivePlayerAndGoalieLists();
      
      if (data && (data.players.length > 0 || data.goalies.length > 0)) {
        // Combine players and goalies
        const allPlayers = [...data.players, ...data.goalies];
        setAllPlayers(allPlayers);
        setAvailableSeasons(data.seasons || ['2024-2025', '2023-2024']);
        setSelectedSeason(data.seasons?.[0] || '2024-2025');
      }
    } catch (error) {
      console.error('Error loading player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    const newId = `field${Date.now()}`;
    const newName = `Kenttä ${fields.length + 1}`;
    setFields(prev => [...prev, { id: newId, name: newName, players: [], width: 600, height: 300 }]);
  };

  const removeField = (fieldId) => {
    if (fields.length <= 1) return;
    setFields(prev => prev.filter(f => f.id !== fieldId));
  };

  const updateFieldName = (fieldId, newName) => {
    setFields(prev => prev.map(f => 
      f.id === fieldId ? { ...f, name: newName } : f
    ));
  };

  const addPlayerToField = (fieldId, player, x = 50, y = 50) => {
    setFields(prev => prev.map(field => {
      if (field.id === fieldId) {
        const newPlayer = {
          id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          x,
          y,
          player
        };
        return { ...field, players: [...field.players, newPlayer] };
      }
      return field;
    }));
  };

  const removePlayerFromField = (fieldId, playerId) => {
    setFields(prev => prev.map(field => {
      if (field.id === fieldId) {
        const newPlayers = field.players.filter(p => p.id !== playerId);
        return { ...field, players: newPlayers };
      }
      return field;
    }));
  };

  const clearField = (fieldId) => {
    setFields(prev => prev.map(field => {
      if (field.id === fieldId) {
        return { ...field, players: [] };
      }
      return field;
    }));
  };

  const updatePlayerPosition = (fieldId, playerId, x, y) => {
    setFields(prev => prev.map(field => {
      if (field.id === fieldId) {
        const newPlayers = field.players.map(player => {
          if (player.id === playerId) {
            return { ...player, x, y };
          }
          return player;
        });
        return { ...field, players: newPlayers };
      }
      return field;
    }));
  };

  // Update field size
  const updateFieldSize = (fieldId, width, height) => {
    setFields(prev => prev.map(field => {
      if (field.id === fieldId) {
        return { ...field, width, height };
      }
      return field;
    }));
  };

  // Drag and drop handlers
  const handleDragStart = (player) => {
    setDraggedPlayer(player);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, fieldId) => {
    e.preventDefault();
    if (draggedPlayer) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      addPlayerToField(fieldId, draggedPlayer, x, y);
      setDraggedPlayer(null);
    }
  };

  // Touch handlers
  const handleTouchStart = (player) => {
    setTouchedPlayer(player);
  };

  const handleFieldTouch = (e, fieldId) => {
    e.preventDefault();
    if (touchedPlayer) {
      const touch = e.changedTouches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      addPlayerToField(fieldId, touchedPlayer, x, y);
      setTouchedPlayer(null);
    }
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  const closePlayerModal = () => {
    setSelectedPlayer(null);
  };

  // Field player dragging handlers
  const handleFieldMouseDown = (e, fieldId, playerId) => {
    e.preventDefault();
    setDraggedFieldPlayer({ fieldId, playerId });
    
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const player = fields.find(f => f.id === fieldId)?.players.find(p => p.id === playerId);
    if (player) {
      setDragOffset({
        x: e.clientX - (rect.left + (player.x / 100) * rect.width),
        y: e.clientY - (rect.top + (player.y / 100) * rect.height)
      });
    }
  };

  const handleFieldMouseMove = (e, fieldId) => {
    if (!draggedFieldPlayer) return;
    
    const { fieldId: dragFieldId, playerId } = draggedFieldPlayer;
    if (dragFieldId !== fieldId) return;
    
    const fieldRect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - fieldRect.left - dragOffset.x) / fieldRect.width) * 100;
    const y = ((e.clientY - fieldRect.top - dragOffset.y) / fieldRect.height) * 100;
    
    // Keep player within field boundaries
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));
    
    updatePlayerPosition(fieldId, playerId, boundedX, boundedY);
  };

  const handleFieldMouseUp = () => {
    setDraggedFieldPlayer(null);
  };

  const handleFieldTouchStart = (e, fieldId, playerId) => {
    const touch = e.touches[0];
    setDraggedFieldPlayer({ fieldId, playerId });
    
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const player = fields.find(f => f.id === fieldId)?.players.find(p => p.id === playerId);
    if (player) {
      setDragOffset({
        x: touch.clientX - (rect.left + (player.x / 100) * rect.width),
        y: touch.clientY - (rect.top + (player.y / 100) * rect.height)
      });
    }
  };

  const handleFieldTouchMove = (e, fieldId) => {
    if (!draggedFieldPlayer) return;
    
    const { fieldId: dragFieldId, playerId } = draggedFieldPlayer;
    if (dragFieldId !== fieldId) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const fieldRect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - fieldRect.left - dragOffset.x) / fieldRect.width) * 100;
    const y = ((touch.clientY - fieldRect.top - dragOffset.y) / fieldRect.height) * 100;
    
    // Keep player within field boundaries
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));
    
    updatePlayerPosition(fieldId, playerId, boundedX, boundedY);
  };

  const handleFieldTouchEnd = () => {
    setDraggedFieldPlayer(null);
  };

  // Handle plus button click
  const handlePlusClick = (player) => {
    if (fields.length === 1) {
      // If only one field, add directly to it
      addPlayerToField(fields[0].id, player, 50, 50);
    } else {
      // If multiple fields, show selector
      setPendingPlayer(player);
      setShowFieldSelector(true);
    }
  };

  // Handle field selection
  const handleFieldSelect = (fieldId) => {
    if (pendingPlayer) {
      addPlayerToField(fieldId, pendingPlayer, 50, 50);
      setPendingPlayer(null);
    }
    setShowFieldSelector(false);
  };

  // Handle field resize
  const handleResizeMouseDown = (e, fieldId) => {
    e.preventDefault();
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = field.width;
    const startHeight = field.height;
    
    const doDrag = (e) => {
      const newWidth = Math.max(300, startWidth + (e.clientX - startX));
      const newHeight = Math.max(200, startHeight + (e.clientY - startY));
      updateFieldSize(fieldId, newWidth, newHeight);
    };
    
    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };
    
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Ladataan pelaajatietoja...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Season Selector */}
        <Reveal delay={0.1}>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold text-white">Valitse kausi</h2>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {availableSeasons.map(season => (
                  <option key={season} value={season} className="bg-gray-800">
                    {season}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Player List */}
          <Reveal delay={0.2}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users size={24} />
                  Pelaajat ({availablePlayers.length})
                </h3>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {availablePlayers.map(player => (
                  <motion.div
                    key={player.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    draggable={!isTouchDevice}
                    onDragStart={() => handleDragStart(player)}
                    onTouchStart={() => handleTouchStart(player)}
                    className={`bg-white/10 border border-white/20 rounded-lg p-3 cursor-pointer transition-all ${
                      touchedPlayer?.id === player.id 
                        ? 'border-orange-500 bg-white/20' 
                        : 'hover:border-orange-400/50'
                    }`}
                    onClick={() => handlePlayerClick(player)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500">
                          <img 
                            src={`/${player.img}`}
                            alt={player.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                  ${player.number || 'N/A'}
                                </div>
                              `;
                            }}
                          />
                        </div>
                        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {player.number}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold truncate">{player.name}</div>
                        <div className="text-white/60 text-sm flex justify-between">
                          <span>{player.goals}M / {player.assists}S</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlusClick(player);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {availablePlayers.length === 0 && (
                  <div className="text-white/60 text-center py-8">
                    Ei kenttäpelaajia valitulla kaudella
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Fields */}
          <div className="lg:col-span-3 space-y-6">
            {fields.map((field, index) => (
              <Reveal key={field.id} delay={0.3 + index * 0.1}>
                <div 
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 relative"
                  style={{ width: field.width, height: field.height + 100 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Target size={20} className="text-orange-400" />
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateFieldName(field.id, e.target.value)}
                        className="bg-transparent border-b border-white/30 text-white text-xl font-bold focus:outline-none focus:border-orange-400 pb-1"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => clearField(field.id)}
                        className="flex items-center gap-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-3 py-1 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                        <span className="text-sm">Tyhjennä</span>
                      </button>
                      {fields.length > 1 && (
                        <button
                          onClick={() => removeField(field.id)}
                          className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Poista</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Field Visualization */}
                  <div 
                    className="relative w-full bg-gray-900 rounded-lg border-2 border-dashed border-white/30 overflow-hidden"
                    style={{ height: field.height - 100 }}
                    ref={el => fieldRefs.current[field.id] = el}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, field.id)}
                    onMouseMove={(e) => handleFieldMouseMove(e, field.id)}
                    onMouseUp={handleFieldMouseUp}
                    onMouseLeave={handleFieldMouseUp}
                    onTouchStart={(e) => handleFieldTouch(e, field.id)}
                    onTouchMove={(e) => handleFieldTouchMove(e, field.id)}
                    onTouchEnd={handleFieldTouchEnd}
                  >
                    {/* SekTa logo background */}
                    <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                      <div className="text-white text-6xl font-bold">SEKTA</div>
                    </div>
                    
                    {/* Player positions */}
                    {field.players.map((player) => (
                      <div
                        key={player.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move"
                        style={{ 
                          left: `${player.x}%`, 
                          top: `${player.y}%` 
                        }}
                        onMouseDown={(e) => handleFieldMouseDown(e, field.id, player.id)}
                        onTouchStart={(e) => handleFieldTouchStart(e, field.id, player.id)}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative group"
                        >
                          <div className="w-16 h-16 rounded-full border-3 border-white shadow-lg overflow-hidden">
                            <img 
                              src={`/${player.player.img}`}
                              alt={player.player.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                  <div class="w-full h-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                    ${player.player.number}
                                  </div>
                                `;
                              }}
                            />
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {player.player.name.split(' ')[0]}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePlayerFromField(field.id, player.id);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </motion.div>
                      </div>
                    ))}
                    
                    {/* Resize handle */}
                    <div
                      className="absolute bottom-0 right-0 w-6 h-6 bg-orange-500 cursor-se-resize rounded-tl-lg"
                      onMouseDown={(e) => handleResizeMouseDown(e, field.id)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Minus size={12} className="text-white rotate-45" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-white/60">
                    {isTouchDevice ? (
                      <p>📱 Kosketa pelaajaa ja sitten kenttää asettaaksesi pelaajan</p>
                    ) : (
                      <p>🖱️ Vedä pelaajat kentälle asettaaksesi heidät paikoilleen</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
            
            {/* Add Field Button */}
            <Reveal delay={0.5}>
              <button
                onClick={addField}
                className="w-full bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/30 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-colors group"
              >
                <Plus size={32} className="text-white/60 group-hover:text-white transition-colors" />
                <span className="text-white/60 group-hover:text-white font-medium transition-colors">
                  Lisää kenttä
                </span>
              </button>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Player Details Modal */}
      {selectedPlayer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closePlayerModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/95 rounded-xl p-6 max-w-md w-full border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedPlayer.name}</h3>
              <button
                onClick={closePlayerModal}
                className="text-white/60 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500">
                <img 
                  src={`/${selectedPlayer.img}`}
                  alt={selectedPlayer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        ${selectedPlayer.number}
                      </div>
                    `;
                  }}
                />
              </div>
              <div>
                <div className="text-white font-semibold">#{selectedPlayer.number}</div>
                <div className="text-orange-400 font-bold mt-1">{selectedPlayer.goals} maalia / {selectedPlayer.assists} syöttöä</div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={closePlayerModal}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Sulje
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Field Selector Modal */}
      {showFieldSelector && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowFieldSelector(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/95 rounded-xl p-6 max-w-md w-full border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Valitse kenttä</h3>
              <button
                onClick={() => setShowFieldSelector(false)}
                className="text-white/60 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-white/80 mb-4">
              Valitse kenttä jolle pelaaja {pendingPlayer?.name} lisätään:
            </p>
            
            <div className="space-y-3">
              {fields.map(field => (
                <button
                  key={field.id}
                  onClick={() => handleFieldSelect(field.id)}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 text-white text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Target size={20} className="text-orange-400" />
                    <span className="font-medium">{field.name}</span>
                    <span className="text-white/60 text-sm ml-auto">
                      {field.players.length} pelaajaa
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
