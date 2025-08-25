import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  User, 
  Plus, 
  Save, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Upload,
  Download,
  Users,
  Shield
} from 'lucide-react';
import Reveal from '../components/Reveal';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('2024-2025');
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    position: 'Hyökkääjä',
    image: '',
    games: 0,
    goals: 0,
    assists: 0,
    penalties: 0,
    // Goalie specific stats
    savePercentage: 0,
    goalsAgainstAverage: 0,
    saves: 0,
    goalsAgainst: 0,
    wins: 0,
    shutouts: 0
  });

  const positions = ['Hyökkääjä', 'Puolustaja', 'Maalivahti'];
  const availableSeasons = ['2024-2025', '2023-2024', '2022-2023'];

  // Load players from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      loadPlayers();
    }
  }, [isAuthenticated, selectedSeason]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'sekta') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Väärä salasana!');
      setPassword('');
    }
  };

  const loadPlayers = () => {
    const storedPlayers = localStorage.getItem(`players_${selectedSeason}`);
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    } else {
      setPlayers([]);
    }
  };

  const savePlayers = (updatedPlayers) => {
    localStorage.setItem(`players_${selectedSeason}`, JSON.stringify(updatedPlayers));
    setPlayers(updatedPlayers);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('games') || name.includes('goals') || name.includes('assists') || 
              name.includes('penalties') || name.includes('saves') || name.includes('wins') || 
              name.includes('shutouts') ? parseInt(value) || 0 :
              name.includes('savePercentage') || name.includes('goalsAgainstAverage') ? 
              parseFloat(value) || 0 : value
    }));
  };

  const calculatePoints = () => {
    return (formData.goals || 0) + (formData.assists || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const playerData = {
      ...formData,
      points: formData.position === 'Maalivahti' ? 0 : calculatePoints(),
      id: editingPlayer ? editingPlayer.id : Date.now(),
      season: selectedSeason
    };

    let updatedPlayers;
    if (editingPlayer) {
      updatedPlayers = players.map(p => p.id === editingPlayer.id ? playerData : p);
    } else {
      updatedPlayers = [...players, playerData];
    }

    savePlayers(updatedPlayers);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      position: 'Hyökkääjä',
      image: '',
      games: 0,
      goals: 0,
      assists: 0,
      penalties: 0,
      savePercentage: 0,
      goalsAgainstAverage: 0,
      saves: 0,
      goalsAgainst: 0,
      wins: 0,
      shutouts: 0
    });
    setEditingPlayer(null);
    setShowAddForm(false);
  };

  const handleEdit = (player) => {
    setFormData(player);
    setEditingPlayer(player);
    setShowAddForm(true);
  };

  const handleDelete = (playerId) => {
    if (confirm('Haluatko varmasti poistaa tämän pelaajan?')) {
      const updatedPlayers = players.filter(p => p.id !== playerId);
      savePlayers(updatedPlayers);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(players, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `players_${selectedSeason}.json`;
    link.click();
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPlayers = JSON.parse(e.target.result);
          savePlayers(importedPlayers);
          alert('Tiedot tuotu onnistuneesti!');
        } catch (error) {
          alert('Virhe tietojen tuonnissa!');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Reveal>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/10 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">Admin Kirjautuminen</h2>
              <p className="text-white/70 mt-2">Syötä salasana päästäksesi hallintapaneeliin</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Salasana"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-purple-700 transition-all"
              >
                Kirjaudu sisään
              </button>
            </form>
          </motion.div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Reveal>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="text-orange-400" size={32} />
              <h1 className="text-4xl font-extrabold text-white">Admin Hallintapaneeli</h1>
            </div>
            <p className="text-xl text-white/70">Hallitse pelaajatietoja ja kauden tilastoja</p>
          </div>
        </Reveal>

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

              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Plus size={20} />
                Lisää Pelaaja
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Download size={20} />
                Vie tiedot
              </button>

              <label className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer">
                <Upload size={20} />
                Tuo tiedot
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Lock size={20} />
                Kirjaudu ulos
              </button>
            </div>
          </div>
        </Reveal>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Reveal delay={0.2}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {editingPlayer ? 'Muokkaa Pelaajaa' : 'Lisää Uusi Pelaaja'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm font-semibold mb-2">Nimi</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-semibold mb-2">Pelinumero</label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-semibold mb-2">Pelipaikka</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      {positions.map(pos => (
                        <option key={pos} value={pos} className="bg-gray-800">{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">Pelaajan kuva</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg" />
                  )}
                </div>

                {formData.position === 'Maalivahti' ? (
                  // Goalie stats
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Pelit</label>
                      <input
                        type="number"
                        name="games"
                        value={formData.games}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Torjunta%</label>
                      <input
                        type="number"
                        name="savePercentage"
                        value={formData.savePercentage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">PMO</label>
                      <input
                        type="number"
                        name="goalsAgainstAverage"
                        value={formData.goalsAgainstAverage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Torjunnat</label>
                      <input
                        type="number"
                        name="saves"
                        value={formData.saves}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Päästetyt maalit</label>
                      <input
                        type="number"
                        name="goalsAgainst"
                        value={formData.goalsAgainst}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Voitot</label>
                      <input
                        type="number"
                        name="wins"
                        value={formData.wins}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Nollapelit</label>
                      <input
                        type="number"
                        name="shutouts"
                        value={formData.shutouts}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                      />
                    </div>
                  </div>
                ) : (
                  // Regular player stats
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Pelit</label>
                      <input
                        type="number"
                        name="games"
                        value={formData.games}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Maalit</label>
                      <input
                        type="number"
                        name="goals"
                        value={formData.goals}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Syötöt</label>
                      <input
                        type="number"
                        name="assists"
                        value={formData.assists}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Pisteet (auto)</label>
                      <input
                        type="number"
                        value={calculatePoints()}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">Rangaistusminuutit</label>
                      <input
                        type="number"
                        name="penalties"
                        value={formData.penalties}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        min="0"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <Save size={20} />
                    {editingPlayer ? 'Tallenna muutokset' : 'Lisää pelaaja'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Peruuta
                  </button>
                </div>
              </form>
            </motion.div>
          </Reveal>
        )}

        {/* Players List */}
        <Reveal delay={0.3}>
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users size={24} />
                  Pelaajat - {selectedSeason}
                </h3>
                <div className="text-white/60">
                  {players.length} pelaajaa
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr className="text-left">
                    <th className="p-4 text-white font-semibold">Kuva</th>
                    <th className="p-4 text-white font-semibold">Pelaaja</th>
                    <th className="p-4 text-white font-semibold">Pelipaikka</th>
                    <th className="p-4 text-white font-semibold text-center">Pelit</th>
                    <th className="p-4 text-white font-semibold text-center">Tilastot</th>
                    <th className="p-4 text-white font-semibold text-center">Toiminnot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {players.map((player, index) => (
                    <motion.tr
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        {player.image ? (
                          <img 
                            src={player.image} 
                            alt={player.name}
                            className="w-12 h-12 object-cover rounded-full border-2 border-white/20"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {player.name?.charAt(0) || '?'}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-white font-semibold">{player.name}</div>
                          <div className="text-white/60 text-sm">#{player.number || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="p-4 text-white/70">{player.position}</td>
                      <td className="p-4 text-center text-white font-semibold">{player.games}</td>
                      <td className="p-4 text-center">
                        {player.position === 'Maalivahti' ? (
                          <div className="text-sm">
                            <div className="text-green-400 font-bold">{player.savePercentage?.toFixed(1)}% T%</div>
                            <div className="text-yellow-400">{player.goalsAgainstAverage?.toFixed(2)} PMO</div>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <div className="text-orange-400 font-bold">{player.goals}M + {player.assists}S = {player.points}P</div>
                            <div className="text-red-400">{player.penalties} RMin</div>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(player)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(player.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {players.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-white/60">
                        Ei pelaajia tälle kaudelle. Lisää ensimmäinen pelaaja yllä olevalla napilla.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}