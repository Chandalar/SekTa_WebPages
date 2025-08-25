import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  Save, 
  Download, 
  Upload, 
  Users, 
  Target,
  Settings,
  Trash2,
  Edit
} from 'lucide-react';
import Reveal from '../components/Reveal';
import { getPlayerStatsFromCSV, getComprehensivePlayerAndGoalieLists } from '../utils/csvDataLoader';

export default function Formation() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('2023-2024'); // Use last year by default
  const [formations, setFormations] = useState([]);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [fieldPlayers, setFieldPlayers] = useState({
    players1: [],
    tactics1: []
  });
  const fieldRefs = useRef({
    field1: null,
    field2: null,
    field3: null
  });
  const [activeField, setActiveField] = useState('field1');
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([
    { id: 'players1', type: 'players', name: 'Kentälliset 1' },
    { id: 'tactics1', type: 'tactics', name: 'Taktiikka 1' }
  ]);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editingFieldName, setEditingFieldName] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchedPlayer, setTouchedPlayer] = useState(null);

  // Player image mapping - maps player names to their actual image filenames
  const playerImageMap = {
    'Mika Aaltonen': 'mika.jpg',
    'Mika Ahven': 'Ahven.jpg', 
    'Jesse Höykinpuro': 'Jesse.jpg',
    'Henri Kananen': 'Kananen.jpg',
    'Juha Kiilunen': 'Jimi.jpg', // Check if this should be different
    'Jimi Laaksonen': 'Jimi.jpg',
    'Akseli Nykänen': 'Akseli.jpg',
    'Niko Nynäs': 'Niko.jpg',
    // Add more mappings based on actual player names
    'Miika': 'Miika.jpg',
    'Joonas': 'Joonas.jpg',
    'Joni': 'Joni.jpg', 
    'Petri': 'Petri.jpg',
    'Ville': 'Ville.jpg',
    'Veikka': 'Veikka.jpg',
    'Masto': 'Juha.jpg',
    'Opa': 'Opa.jpg'
  };

  // Function to get player image
  const getPlayerImage = (playerName) => {
    return playerImageMap[playerName] || `${playerName.split(' ')[0]}.jpg`;
  };

  // Detect touch device
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // Load real player data
  useEffect(() => {
    loadPlayerData();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      loadFormations();
      initializeFields();
    }
  }, [selectedSeason]);

  const loadPlayerData = async () => {
    try {
      console.log(' Hockey Loading real player data for floorball formation...');
      setLoading(true);
      
      // Use the comprehensive data loader to get all players including those from pelaajat.csv
      const data = await getComprehensivePlayerAndGoalieLists();
      
      if (data && (data.players.length > 0 || data.goalies.length > 0)) {
        // We only want field players, not goalies
        setAllPlayers(data.players);
        setAvailableSeasons(data.seasons || ['2024-2025', '2023-2024']);
        
        // Set to last year (second season in list or 2023-2024)
        const lastYear = data.seasons?.[1] || '2023-2024';
        setSelectedSeason(lastYear);
        
        console.log(`✅ Loaded ${data.players.length} players from seasons:`, data.seasons);
        console.log('👥 Using season for formation:', lastYear);
      } else {
        // Fallback to original method if comprehensive data fails
        const fallbackData = await getPlayerStatsFromCSV();
        
        if (fallbackData && fallbackData.players) {
          setAllPlayers(fallbackData.players);
          setAvailableSeasons(fallbackData.seasons || ['2024-2025', '2023-2024']);
          
          // Set to last year (second season in list or 2023-2024)
          const lastYear = fallbackData.seasons?.[1] || '2023-2024';
          setSelectedSeason(lastYear);
          
          console.log(`✅ Loaded ${fallbackData.players.length} players from seasons:`, fallbackData.seasons);
          console.log('👥 Using season for formation:', lastYear);
        }
      }
    } catch (error) {
      console.error('Error loading player data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get field players (not goalies) for selected season
  const getFieldPlayersForSeason = () => {
    return allPlayers.map(player => {
      const seasonData = player.seasons?.find(s => s.season === selectedSeason);
      if (seasonData && seasonData.position !== 'Maalivahti') {
        return {
          id: player.name,
          name: player.name,
          number: seasonData.number || 'N/A',
          position: seasonData.position,
          goals: seasonData.goals || 0,
          assists: seasonData.assists || 0,
          points: seasonData.points || 0,
          games: seasonData.games || 0
        };
      }
      return null;
    }).filter(Boolean);
  };

  const availablePlayers = getFieldPlayersForSeason();

  const loadFormations = () => {
    const saved = localStorage.getItem(`sekta_formations_${selectedSeason}`);
    if (saved) {
      setFormations(JSON.parse(saved));
    }
  };

  const saveFormations = (newFormations) => {
    localStorage.setItem(`sekta_formations_${selectedSeason}`, JSON.stringify(newFormations));
    setFormations(newFormations);
  };

  // Initialize empty fields for both player lineup and tactics
  const initializeFields = () => {
    const initialFields = {};
    fields.forEach(field => {
      if (field.type === 'tactics') {
        // Tactics fields start with default positions
        const emptyField = [
          // Defenders (2) - positioned at back
          { id: 'def1', x: 25, y: 85, role: 'Puolustaja', player: null },
          { id: 'def2', x: 75, y: 85, role: 'Puolustaja', player: null },
          // Forwards (3) - positioned at front
          { id: 'fwd1', x: 20, y: 25, role: 'Hyökkääjä', player: null },
          { id: 'fwd2', x: 50, y: 15, role: 'Hyökkääjä', player: null },
          { id: 'fwd3', x: 80, y: 25, role: 'Hyökkääjä', player: null },
        ];
        initialFields[field.id] = emptyField.map(p => ({ ...p, id: `${field.id}_${p.id}` }));
      } else {
        // Player lineup fields start empty
        initialFields[field.id] = [];
      }
    });
    
    setFieldPlayers(initialFields);
  };

  const handleDragStart = (player) => {
    setDraggedPlayer(player);
  };

  const handlePlayerDragStart = (e, playerId, fieldName) => {
    // Store the player being dragged from the field
    const player = fieldPlayers[fieldName]?.find(p => p.id === playerId)?.player;
    if (player) {
      setDraggedPlayer({ ...player, fromField: fieldName, fromPositionId: playerId });
    }
  };

  const addField = (type) => {
    const newId = `${type}${Date.now()}`;
    const newField = {
      id: newId,
      type,
      name: type === 'players' ? `Kentälliset ${fields.filter(f => f.type === 'players').length + 1}` : `Taktiikka ${fields.filter(f => f.type === 'tactics').length + 1}`
    };
    
    setFields(prev => [...prev, newField]);
    
    // Initialize the new field
    setFieldPlayers(prev => ({
      ...prev,
      [newId]: type === 'tactics' ? [
        // Default positions for tactics fields
        { id: `${newId}_def1`, x: 25, y: 85, role: 'Puolustaja', player: null },
        { id: `${newId}_def2`, x: 75, y: 85, role: 'Puolustaja', player: null },
        { id: `${newId}_fwd1`, x: 20, y: 25, role: 'Hyökkääjä', player: null },
        { id: `${newId}_fwd2`, x: 50, y: 15, role: 'Hyökkääjä', player: null },
        { id: `${newId}_fwd3`, x: 80, y: 25, role: 'Hyökkääjä', player: null },
      ] : []
    }));
  };

  const removeField = (fieldId) => {
    setFields(prev => prev.filter(f => f.id !== fieldId));
    setFieldPlayers(prev => {
      const updated = { ...prev };
      delete updated[fieldId];
      return updated;
    });
  };

  const startEditingField = (fieldId, currentName) => {
    setEditingFieldId(fieldId);
    setEditingFieldName(currentName);
  };

  const saveFieldName = () => {
    if (editingFieldName.trim()) {
      setFields(prev => prev.map(f => 
        f.id === editingFieldId ? { ...f, name: editingFieldName.trim() } : f
      ));
    }
    setEditingFieldId(null);
    setEditingFieldName('');
  };

  const cancelEditingField = () => {
    setEditingFieldId(null);
    setEditingFieldName('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, positionId, fieldName) => {
    e.preventDefault();
    if (!draggedPlayer) return;

    // Update the specific field
    setFieldPlayers(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map(pos => {
        if (pos.id === positionId) {
          return { ...pos, player: draggedPlayer };
        }
        // Remove player from other positions in this field
        if (pos.player && pos.player.id === draggedPlayer.id) {
          return { ...pos, player: null };
        }
        return pos;
      })
    }));

    // Also remove from other fields
    setFieldPlayers(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(field => {
        if (field !== fieldName) {
          updated[field] = updated[field].map(pos => 
            pos.player && pos.player.id === draggedPlayer.id 
              ? { ...pos, player: null } 
              : pos
          );
        }
      });
      return updated;
    });

    setDraggedPlayer(null);
  };

  const handleFieldDrop = (e, fieldName) => {
    e.preventDefault();
    if (!draggedPlayer || !fieldRefs.current[fieldName]) return;

    const rect = fieldRefs.current[fieldName].getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // If player is being moved from another field, remove from original location
    if (draggedPlayer.fromField && draggedPlayer.fromPositionId) {
      setFieldPlayers(prev => ({
        ...prev,
        [draggedPlayer.fromField]: prev[draggedPlayer.fromField].filter(p => p.id !== draggedPlayer.fromPositionId)
      }));
    }

    // Create new position
    const newPosition = {
      id: `${fieldName}_custom_${Date.now()}`,
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
      role: draggedPlayer.position || 'Custom',
      player: {
        id: draggedPlayer.id,
        name: draggedPlayer.name,
        number: draggedPlayer.number,
        position: draggedPlayer.position
      }
    };

    // Remove player from all fields first (to prevent duplicates)
    setFieldPlayers(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(field => {
        if (field !== fieldName) {
          updated[field] = updated[field].filter(pos => 
            !pos.player || pos.player.id !== draggedPlayer.id
          );
        }
      });
      
      // Add to target field
      updated[fieldName] = [...(updated[fieldName] || []).filter(pos => 
        !pos.player || pos.player.id !== draggedPlayer.id
      ), newPosition];
      
      return updated;
    });

    setDraggedPlayer(null);
  };

  const removePlayerFromField = (positionId, fieldName) => {
    setFieldPlayers(prev => ({
      ...prev,
      [fieldName]: prev[fieldName]?.filter(pos => pos.id !== positionId) || []
    }));
  };

  const clearField = (fieldName) => {
    const field = fields.find(f => f.id === fieldName);
    if (field?.type === 'tactics') {
      // Reset tactics field to default positions
      const emptyField = [
        { id: `${fieldName}_def1`, x: 25, y: 85, role: 'Puolustaja', player: null },
        { id: `${fieldName}_def2`, x: 75, y: 85, role: 'Puolustaja', player: null },
        { id: `${fieldName}_fwd1`, x: 20, y: 25, role: 'Hyökkääjä', player: null },
        { id: `${fieldName}_fwd2`, x: 50, y: 15, role: 'Hyökkääjä', player: null },
        { id: `${fieldName}_fwd3`, x: 80, y: 25, role: 'Hyökkääjä', player: null },
      ];
      setFieldPlayers(prev => ({ ...prev, [fieldName]: emptyField }));
    } else {
      // Clear players field completely
      setFieldPlayers(prev => ({ ...prev, [fieldName]: [] }));
    }
  };

  const clearAllFields = () => {
    const cleared = {};
    fields.forEach(field => {
      if (field.type === 'tactics') {
        cleared[field.id] = [
          { id: `${field.id}_def1`, x: 25, y: 85, role: 'Puolustaja', player: null },
          { id: `${field.id}_def2`, x: 75, y: 85, role: 'Puolustaja', player: null },
          { id: `${field.id}_fwd1`, x: 20, y: 25, role: 'Hyökkääjä', player: null },
          { id: `${field.id}_fwd2`, x: 50, y: 15, role: 'Hyökkääjä', player: null },
          { id: `${field.id}_fwd3`, x: 80, y: 25, role: 'Hyökkääjä', player: null },
        ];
      } else {
        cleared[field.id] = [];
      }
    });
    setFieldPlayers(cleared);
  };

  const saveCurrentFormation = () => {
    const name = prompt('Anna kokoonpanolle nimi:');
    if (!name) return;

    const formation = {
      id: Date.now(),
      name,
      season: selectedSeason,
      fields: fieldPlayers,
      created: new Date().toISOString()
    };

    const updated = [...formations, formation];
    saveFormations(updated);
    alert('Kokoonpano tallennettu!');
  };

  const loadSavedFormation = (formation) => {
    setFieldPlayers(formation.fields || formation.positions); // Handle both old and new format
  };

  const exportFormation = () => {
    const data = {
      season: selectedSeason,
      fields: fieldPlayers,
      exported: new Date().toISOString(),
      totalPlayers: Object.values(fieldPlayers).flat().filter(p => p.player).length
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salibandy_formation_${selectedSeason}_${Date.now()}.json`;
    link.click();
  };

  // Add these touch event handlers

  const handleTouchStart = (player) => {
    if (!isTouchDevice) return;
    setTouchedPlayer(player);
  };

  const handleTouchEnd = (e, positionId, fieldName) => {
    if (!isTouchDevice || !touchedPlayer) return;
    e.preventDefault();
    
    // Update the specific field
    setFieldPlayers(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map(pos => {
        if (pos.id === positionId) {
          return { ...pos, player: touchedPlayer };
        }
        // Remove player from other positions in this field
        if (pos.player && pos.player.id === touchedPlayer.id) {
          return { ...pos, player: null };
        }
        return pos;
      })
    }));

    // Also remove from other fields
    setFieldPlayers(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(field => {
        if (field !== fieldName) {
          updated[field] = updated[field].map(pos => 
            pos.player && pos.player.id === touchedPlayer.id 
              ? { ...pos, player: null } 
              : pos
          );
        }
      });
      return updated;
    });

    setTouchedPlayer(null);
  };

  const handleFieldTouchEnd = (e, fieldName) => {
    if (!isTouchDevice || !touchedPlayer || !fieldRefs.current[fieldName]) return;
    e.preventDefault();
    
    const rect = fieldRefs.current[fieldName].getBoundingClientRect();
    const touch = e.changedTouches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    // If player is being moved from another field, remove from original location
    if (touchedPlayer.fromField && touchedPlayer.fromPositionId) {
      setFieldPlayers(prev => ({
        ...prev,
        [touchedPlayer.fromField]: prev[touchedPlayer.fromField].filter(p => p.id !== touchedPlayer.fromPositionId)
      }));
    }

    // Create new position
    const newPosition = {
      id: `${fieldName}_custom_${Date.now()}`,
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
      role: touchedPlayer.position || 'Custom',
      player: {
        id: touchedPlayer.id,
        name: touchedPlayer.name,
        number: touchedPlayer.number,
        position: touchedPlayer.position
      }
    };

    // Remove player from all fields first (to prevent duplicates)
    setFieldPlayers(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(field => {
        if (field !== fieldName) {
          updated[field] = updated[field].filter(pos => 
            !pos.player || pos.player.id !== touchedPlayer.id
          );
        }
      });
      
      // Add to target field
      updated[fieldName] = [...(updated[fieldName] || []).filter(pos => 
        !pos.player || pos.player.id !== touchedPlayer.id
      ), newPosition];
      
      return updated;
    });

    setTouchedPlayer(null);
  };

  const handlePlayerTouchStart = (e, playerId, fieldName) => {
    if (!isTouchDevice) return;
    // Store the player being dragged from the field
    const player = fieldPlayers[fieldName]?.find(p => p.id === playerId)?.player;
    if (player) {
      setTouchedPlayer({ ...player, fromField: fieldName, fromPositionId: playerId });
    }
  };

  // Mobile layout adjustments
  useEffect(() => {
    // Mobile-specific layout adjustments
    const adjustForMobile = () => {
      if (isTouchDevice) {
        // Make positions slightly larger on mobile for easier touch targets
        document.documentElement.style.setProperty('--player-size', '18px');
        document.documentElement.style.setProperty('--field-min-height', '250px');
      } else {
        document.documentElement.style.setProperty('--player-size', '14px');
        document.documentElement.style.removeProperty('--field-min-height');
      }
    };
    
    adjustForMobile();
    
    return () => {
      // Cleanup
      document.documentElement.style.removeProperty('--player-size');
      document.documentElement.style.removeProperty('--field-min-height');
    };
  }, [isTouchDevice]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-white text-xl">Ladataan pelaajatietoja...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Reveal>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="text-orange-400" size={32} />
              <h1 className="text-4xl font-extrabold text-white">Salibandy Kokoonpanot</h1>
            </div>
            <p className="text-xl text-white/70">Järjestä kenttäpelaajat (3 hyökkääjää + 2 puolustajaa per kenttä)</p>
            <p className="text-lg text-white/60 mt-2">Kausi: {selectedSeason} • {availablePlayers.length} kenttäpelaajaa saatavilla</p>
          </div>
        </Reveal>

        {/* Mobile Touch Mode Notification */}
        {isTouchDevice && (
          <Reveal delay={0.2}>
            <div className="bg-orange-500/80 text-white p-4 rounded-lg mb-6">
              <p className="font-bold">Kosketustila käytössä</p>
              <p className="text-sm">Kosketa ensin pelaajaa, sitten kosketa kenttää tai paikkaa siirtääksesi pelaajan sinne.</p>
              {touchedPlayer && (
                <p className="mt-2 font-bold">Valittu pelaaja: {touchedPlayer.name}</p>
              )}
            </div>
          </Reveal>
        )}

        {/* Controls */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white font-semibold"
              >
                {availableSeasons.map(season => (
                  <option key={season} value={season} className="bg-gray-800">
                    {season}
                  </option>
                ))}
              </select>



            <div className="flex items-center gap-2">
              <button
                onClick={() => addField('players')}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Users size={16} />
                Lisää kentälliset
              </button>
              
              <button
                onClick={() => addField('tactics')}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Target size={16} />
                Lisää taktiikka
              </button>
              
              <button
                onClick={clearAllFields}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Trash2 size={20} />
                Tyhjennä kaikki kentät
              </button>
            </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={saveCurrentFormation}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Save size={20} />
                Tallenna kokoonpano
              </button>

              <button
                onClick={exportFormation}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Download size={20} />
                Vie kokoonpano
              </button>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Player List */}
          <Reveal delay={0.2}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users size={24} />
                Kenttäpelaajat ({availablePlayers.length})
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availablePlayers.map(player => (
                  <motion.div
                    key={player.id}
                    draggable={!isTouchDevice}
                    onDragStart={() => handleDragStart(player)}
                    onTouchStart={() => handleTouchStart(player)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-white/10 border-white/10 hover:border-orange-400/50 ${isTouchDevice ? 'active:border-orange-500 active:bg-white/20' : 'cursor-grab active:cursor-grabbing'} rounded-lg p-3 border transition-colors ${touchedPlayer?.id === player.id ? 'border-orange-500 bg-white/20' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden relative">
                        <img 
                          src={`/${getPlayerImage(player.name)}`}
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to gradient circle with number if image not found
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('bg-gradient-to-br', 'from-orange-500', 'to-purple-600');
                            e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-sm">${player.number || 'N/A'}</div>`;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm">{player.name}</div>
                        <div className="text-white/60 text-xs">{player.position} • {player.points}p</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {availablePlayers.length === 0 && (
                  <div className="text-white/60 text-center py-8">
                    Ei kenttäpelaajia kaudelta {selectedSeason}
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Dynamic Fields */}
          <div className="xl:col-span-3 space-y-6">
            {fields.map((field, index) => {
              const currentFieldPlayers = fieldPlayers[field.id] || [];
              const playerCount = currentFieldPlayers.filter(p => p.player).length;
              
              return (
                <Reveal key={field.id} delay={0.3 + index * 0.1}>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {field.type === 'players' ? <Users size={20} /> : <Target size={20} />}
                        {editingFieldId === field.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingFieldName}
                              onChange={(e) => setEditingFieldName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveFieldName();
                                if (e.key === 'Escape') cancelEditingField();
                              }}
                              onBlur={saveFieldName}
                              className="bg-white/20 border border-white/30 rounded px-2 py-1 text-white text-xl font-bold focus:outline-none focus:border-orange-400"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <h3 
                            className="text-xl font-bold text-white cursor-pointer hover:text-orange-300 transition-colors"
                            onClick={() => startEditingField(field.id, field.name)}
                            title="Klikkaa muokataksesi nimeä"
                          >
                            {field.name}
                          </h3>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white/70">
                          Pelaajia: {playerCount}
                        </span>
                        {field.type === 'tactics' && (
                          <>
                            <span className="text-orange-400">
                              H: {currentFieldPlayers.filter(p => p.player && p.role === 'Hyökkääjä').length}
                            </span>
                            <span className="text-cyan-400">
                              P: {currentFieldPlayers.filter(p => p.player && p.role === 'Puolustaja').length}
                            </span>
                          </>
                        )}
                        <button
                          onClick={() => clearField(field.id)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Tyhjennä kenttä"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => removeField(field.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Poista kenttä"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    <div
                      ref={el => fieldRefs.current[field.id] = el}
                      className={`relative w-full aspect-[2/1] min-h-[var(--field-min-height,auto)] rounded-lg border-4 border-white/20 overflow-hidden shadow-2xl ${
                        field.type === 'players' 
                          ? 'bg-gradient-to-b from-green-600 to-green-700' 
                          : 'bg-contain bg-center bg-no-repeat'
                      } ${touchedPlayer ? 'border-orange-400' : ''}`}
                      style={field.type === 'tactics' ? { 
                        backgroundImage: 'url(/salibandykentta.png)', 
                        backgroundColor: '#047857' 
                      } : {}}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleFieldDrop(e, field.id)}
                      onTouchEnd={(e) => handleFieldTouchEnd(e, field.id)}
                    >
                      {/* Player positions */}
                      {currentFieldPlayers.map((position) => (
                        <div
                          key={position.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{ 
                            left: `${position.x}%`, 
                            top: `${position.y}%` 
                          }}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, position.id, field.id)}
                          onTouchEnd={(e) => handleTouchEnd(e, position.id, field.id)}
                        >
                          {position.player ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="relative group cursor-move"
                              draggable={!isTouchDevice}
                              onDragStart={(e) => handlePlayerDragStart(e, position.id, field.id)}
                              onTouchStart={(e) => handlePlayerTouchStart(e, position.id, field.id)}
                            >
                              {/* Player Image */}
                              <div className={`w-[var(--player-size,14px)] h-[var(--player-size,14px)] rounded-full border-3 shadow-lg overflow-hidden relative ${
                                position.role === 'Hyökkääjä' ? 'border-orange-500' : 
                                position.role === 'Puolustaja' ? 'border-cyan-500' :
                                'border-purple-500'
                              }`}>
                                <img 
                                  src={`/${getPlayerImage(position.player.name)}`}
                                  alt={position.player.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to colored circle with number if image not found
                                    e.target.style.display = 'none';
                                    const bgColor = position.role === 'Hyökkääjä' ? 'from-orange-500 to-red-600' : 
                                      position.role === 'Puolustaja' ? 'from-blue-500 to-cyan-600' : 'from-purple-500 to-pink-600';
                                    e.target.parentElement.classList.add('bg-gradient-to-br');
                                    e.target.parentElement.classList.add(...bgColor.split(' '));
                                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-sm">${position.player.number || 'N/A'}</div>`;
                                  }}
                                />
                              </div>
                              
                              {/* Player Name */}
                              <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-white text-xs font-semibold bg-black/80 px-2 py-1 rounded whitespace-nowrap border border-white/30">
                                {position.player.name.split(' ')[0]}
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                onClick={() => removePlayerFromField(position.id, field.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                ×
                              </button>
                            </motion.div>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-sm text-white/60">
                      {isTouchDevice ? (
                        <div>
                          <p className="mb-1">📱 Mobiili: Kosketa pelaajaa ja sitten kosketa kenttää tai tyhjää paikkaa asettaaksesi pelaajan</p>
                          <p>{field.type === 'players' 
                            ? 'Kosketa pelaajia asettaaksesi ne kentälle'
                            : 'Kosketa pelaajia ja sitten tyhjiä paikkoja. Oranssi = Hyökkääjä, Sininen = Puolustaja.'
                          }</p>
                        </div>
                      ) : (
                        <p>{field.type === 'players' 
                          ? 'Vedä pelaajat kentälle nähdäksesi kentälliset'
                          : 'Vedä pelaajat kentälle tai tyhjille paikoille. Oranssi = Hyökkääjä, Sininen = Puolustaja. Pelaajia voi siirtellä raahaamalla.'
                        }</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          </div>

        {/* Saved Formations */}
        {formations.length > 0 && (
          <Reveal delay={0.6}>
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Tallennetut kokoonpanot ({selectedSeason})</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formations.map(formation => (
                  <div
                    key={formation.id}
                    className="bg-white/10 rounded-lg p-4 border border-white/10 hover:border-orange-400/50 transition-colors"
                  >
                    <h4 className="text-white font-semibold mb-2">{formation.name}</h4>
                    <p className="text-white/60 text-sm mb-3">
                      {new Date(formation.created).toLocaleDateString('fi-FI')}
                    </p>
                    <div className="text-white/60 text-xs mb-3">
                      Pelaajia yhteensä: {Object.values(formation.fields || formation.positions || {}).flat().filter(p => p.player).length}
                    </div>
                    <button
                      onClick={() => loadSavedFormation(formation)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      Lataa kokoonpano
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
