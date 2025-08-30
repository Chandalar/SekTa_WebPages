// Simple CSV-based data loader for SekTa stats
// Replaces the complex Excel processing system

import { normalizeString } from './stringUtils';

// Cache for loaded data to prevent re-fetching
let cachedData = null;
let lastLoadTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Parse CSV text into structured data
function parseCSV(csvText) {
  console.log('Parsing CSV data...');
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  console.log('CSV Headers:', headers);
  
  const players = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < 3) continue; // Skip empty or incomplete lines
    
    const player = {};
    
    // Match columns to their respective headers
    headers.forEach((header, index) => {
      if (index < values.length) {
        const value = values[index];
        const lowerHeader = header.toLowerCase();
        
        // Numeric fields
        if (['games', 'goals', 'assists', 'points', 'penalties', 'number', 'wins', 'shutouts', 'saves', 'goalsagainst'].includes(lowerHeader)) {
          player[lowerHeader] = parseInt(value) || 0;
        }
        // Decimal fields
        else if (['savepercentage', 'goalsagainstaverage'].includes(lowerHeader)) {
          player[lowerHeader] = parseFloat(value) || 0;
        }
        // String fields
        else {
          player[lowerHeader] = value;
        }
      }
    });
    
    // Ensure all needed fields are set
    player.player = player.player || '';
    player.position = player.position || '';
    player.season = player.season || '2024-2025';
    player.games = player.games || 0;
    player.goals = player.goals || 0;
    player.assists = player.assists || 0;
    player.points = player.points || 0;
    player.penalties = player.penalties || 0;
    player.number = player.number || 0;
    
    // Set goalie-specific stats if applicable
    if (player.position.toLowerCase() === 'maalivahti') {
      player.savepercentage = player.savepercentage || 0;
      player.goalsagainstaverage = player.goalsagainstaverage || 0;
      player.saves = player.saves || 0;
      player.goalsagainst = player.goalsagainst || 0;
      player.wins = player.wins || 0;
      player.shutouts = player.shutouts || 0;
      
      // Goalies have no goals or assists as per requirements
      player.goals = 0;
      player.assists = 0;
      player.points = 0;
    }
    
    // Use the Player field as the name
    player.name = player.player;
    
    // Add player if we have a name
    if (player.name) {
      console.log(`Parsed player: ${player.name}, ${player.position}, Season: ${player.season}`);
      players.push(player);
    }
  }
  
  console.log(`Successfully parsed ${players.length} players from CSV`);
  return players;
}

// Load player data from CSV - now uses comprehensive parser
export async function getPlayerStatsFromCSV() {
  // Clear cache to force fresh data load
  cachedData = null;
  lastLoadTime = null;
  
  // Check cache first
  const now = Date.now();
  if (cachedData && lastLoadTime && (now - lastLoadTime) < CACHE_DURATION) {
    console.log('📊 Using cached CSV data');
    return cachedData;
  }

  try {
    console.log('📊 Loading comprehensive CSV data from existing files...');
    
    // Use the comprehensive parser for existing CSV files
    const comprehensiveData = await parseComprehensiveCSVData();
    
    if (comprehensiveData.players.length === 0) {
      console.log('⚠️ No data from comprehensive parser, falling back to simple CSV...');
      // Fallback to simple CSV if comprehensive parsing fails
      const response = await fetch('/sekta-stats.csv');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch simple CSV: ${response.status}`);
      }
      
      const csvText = await response.text();
      const players = parseCSV(csvText);
      
      // Group by player name for fallback
      const playersByName = {};
      players.forEach(player => {
        if (!playersByName[player.name]) {
          playersByName[player.name] = {
            name: player.name,
            position: player.position,
            number: player.number,
            seasons: []
          };
        }
        
        const seasonData = {
          season: player.season,
          position: player.position,
          games: player.games,
          goals: player.goals,
          assists: player.assists,
          points: player.points,
          penalties: player.penalties,
          number: player.number
        };
        
        if (player.position.toLowerCase() === 'maalivahti') {
          seasonData.savePercentage = player.savepercentage || 0;
          seasonData.goalsAgainstAverage = player.goalsagainstaverage || 0;
          seasonData.saves = player.saves || 0;
          seasonData.goalsAgainst = player.goalsagainst || 0;
          seasonData.wins = player.wins || 0;
          seasonData.shutouts = player.shutouts || 0;
        }
        
        playersByName[player.name].seasons.push(seasonData);
      });
      
      comprehensiveData.players = Object.values(playersByName);
      comprehensiveData.seasons = ['2024-2025'];
    }
    
    // Enhance with static player data (images, numbers, positions)
    const STATIC_PLAYER_DATA = [
      { name: "Mika Aaltonen", role: "Hyökkääjä", number: 19 },
      { name: "Petri Vikman", role: "Hyökkääjä", number: 22 },
      { name: "Miika Oja-Nisula", role: "Hyökkääjä", number: 66 },
      { name: "Akseli Nykänen", role: "Hyökkääjä", number: 15 },
      { name: "Joni Vainio", role: "Hyökkääjä", number: 13 },
      { name: "Vesa Halme", role: "Puolustaja", number: 55 },
      { name: "Ville Mäenranta", role: "Puolustaja", number: 28 },
      { name: "Mika Ahven", role: "Maalivahti", number: 1 },
      { name: "Henri Kananen", role: "Hyökkääjä", number: 27 },
      { name: "Jesse Höykinpuro", role: "Hyökkääjä", number: 8 },
      { name: "Jimi Laaksonen", role: "Hyökkääjä", number: 11 },
      { name: "Niko Nynäs", role: "Puolustaja", number: 33 },
      { name: "Joonas Leppänen", role: "Puolustaja", number: 44 },
      { name: "Matias Virta", role: "Maalivahti", number: 30 },
      { name: "Lassi Liukkonen", role: "Maalivahti", number: 35 },
      { name: "Juha Kiilunen", role: "Hyökkääjä", number: 18 },
      { name: "Veikka Saarinen", role: "Hyökkääjä", number: 14 },
      { name: "Aleksi Tuokko", role: "Hyökkääjä", number: 77 },
      { name: "Joonas Pentti", role: "Hyökkääjä", number: 88 },
      { name: "Vesa Kurppa", role: "Maalivahti", number: 99 }
    ];
    
    // Enhance players with static data
    comprehensiveData.players = comprehensiveData.players.map(player => {
      const staticData = STATIC_PLAYER_DATA.find(sp => 
        sp.name.toLowerCase() === player.name.toLowerCase()
      );
      
      if (staticData) {
        player.position = staticData.role;
        player.number = staticData.number;
        // Update all seasons with correct position and number
        player.seasons = player.seasons.map(season => ({
          ...season,
          position: staticData.role,
          number: staticData.number
        }));
      }
      
      return player;
    });
    
    // Cache the result
    cachedData = comprehensiveData;
    lastLoadTime = now;
    
    console.log(`✅ Loaded ${comprehensiveData.players.length} players from comprehensive CSV for ${comprehensiveData.seasons.length} seasons`);
    console.log('📅 Available seasons:', comprehensiveData.seasons);
    
    // Debug: Log goalie data specifically
    const goalies = comprehensiveData.players.filter(p => p.position === 'Maalivahti');
    console.log(`🥅 Found ${goalies.length} goalies:`, goalies.map(g => `${g.name} (${g.seasons.length} seasons)`));
    
    return comprehensiveData;
    
  } catch (error) {
    console.error('❌ Error loading comprehensive CSV data:', error);
    
    // Return fallback data if everything fails
    return {
      players: [],
      seasons: ['2024-2025'],
      error: error.message
    };
  }
}

// Get stats for current season (defaults to the first/latest season)
export async function getCurrentSeasonStats() {
  const data = await getPlayerStatsFromCSV();
  const currentSeason = data.seasons[0] || '2024-2025';
  
  console.log(`Getting current season stats for: ${currentSeason}`);
  
  const currentSeasonPlayers = [];
  
  data.players.forEach(player => {
    const seasonData = player.seasons.find(s => s.season === currentSeason);
    if (seasonData) {
      const playerWithSeasonData = {
        ...player,
        ...seasonData
      };
      
      console.log(`Found player ${player.name} for season ${currentSeason}`);
      currentSeasonPlayers.push(playerWithSeasonData);
    }
  });
  
  console.log(`Found ${currentSeasonPlayers.length} players for current season ${currentSeason}`);
  
  return {
    players: currentSeasonPlayers,
    currentSeason: currentSeason,
    seasons: data.seasons,
    totalGoals: currentSeasonPlayers.reduce((sum, p) => sum + (p.goals || 0), 0),
    totalAssists: currentSeasonPlayers.reduce((sum, p) => sum + (p.assists || 0), 0),
    totalPoints: currentSeasonPlayers.reduce((sum, p) => sum + (p.points || 0), 0),
    totalPlayers: currentSeasonPlayers.length
  };
}

// Function to generate a proper CSV file with all players
export function generateProperCSV() {
  try {
    console.log('Generating a proper CSV file with all players...');
    
    // Create CSV content with proper headers
    let csvContent = 'Player,Position,Season,Games,Goals,Assists,Points,Penalties,Number,SavePercentage,GoalsAgainstAverage,Saves,GoalsAgainst,Wins,Shutouts\n';
    
    // Add each player from the static PLAYERS list (ensures all are included)
    const players = [
      { name: "Mika Aaltonen", position: "Hyökkääjä", season: "2024-2025", games: 15, goals: 12, assists: 8, points: 20, penalties: 4, number: 19 },
      { name: "Petri Vikman", position: "Hyökkääjä", season: "2024-2025", games: 8, goals: 2, assists: 2, points: 4, penalties: 0, number: 22 },
      { name: "Miika Oja-Nisula", position: "Hyökkääjä", season: "2024-2025", games: 12, goals: 9, assists: 5, points: 14, penalties: 1, number: 66 },
      { name: "Akseli Nykänen", position: "Hyökkääjä", season: "2024-2025", games: 16, goals: 10, assists: 8, points: 18, penalties: 5, number: 15 },
      { name: "Joni Vainio", position: "Hyökkääjä", season: "2024-2025", games: 9, goals: 3, assists: 3, points: 6, penalties: 1, number: 13 },
      { name: "Vesa Halme", position: "Puolustaja", season: "2024-2025", games: 7, goals: 0, assists: 2, points: 2, penalties: 1, number: 55 },
      { name: "Ville Mäenranta", position: "Puolustaja", season: "2024-2025", games: 11, goals: 1, assists: 3, points: 4, penalties: 2, number: 28 },
      { name: "Mika Ahven", position: "Maalivahti", season: "2024-2025", games: 14, goals: 0, assists: 0, points: 0, penalties: 0, number: 1, savePercentage: 82.0, goalsAgainstAverage: 3.43, saves: 265, goalsAgainst: 48, wins: 8, shutouts: 0 },
      { name: "Henri Kananen", position: "Hyökkääjä", season: "2024-2025", games: 14, goals: 6, assists: 9, points: 15, penalties: 3, number: 27 },
      { name: "Jesse Höykinpuro", position: "Hyökkääjä", season: "2024-2025", games: 12, goals: 8, assists: 6, points: 14, penalties: 2, number: 8 },
      { name: "Jimi Laaksonen", position: "Hyökkääjä", season: "2024-2025", games: 13, goals: 7, assists: 4, points: 11, penalties: 2, number: 11 },
      { name: "Niko Nynäs", position: "Puolustaja", season: "2024-2025", games: 14, goals: 2, assists: 6, points: 8, penalties: 3, number: 33 },
      { name: "Joonas Leppänen", position: "Puolustaja", season: "2024-2025", games: 10, goals: 1, assists: 4, points: 5, penalties: 2, number: 44 },
      { name: "Matias Virta", position: "Maalivahti", season: "2024-2025", games: 5, goals: 0, assists: 0, points: 0, penalties: 0, number: 30, savePercentage: 91.8, goalsAgainstAverage: 2.4, saves: 98, goalsAgainst: 29, wins: 7, shutouts: 1 },
      { name: "Lassi Liukkonen", position: "Maalivahti", season: "2024-2025", games: 3, goals: 0, assists: 0, points: 0, penalties: 0, number: 35, savePercentage: 89.5, goalsAgainstAverage: 3.2, saves: 75, goalsAgainst: 18, wins: 0, shutouts: 0 },
    ];
    
    // Add each player to the CSV content
    players.forEach(player => {
      const goalieStats = player.position === 'Maalivahti' ? 
        `${player.savePercentage || ''},${player.goalsAgainstAverage || ''},${player.saves || ''},${player.goalsAgainst || ''},${player.wins || ''},${player.shutouts || ''}` :
        ',,,,,'; // Empty goalie fields for non-goalies
      
      csvContent += `${player.name},${player.position},${player.season},${player.games},${player.goals},${player.assists},${player.points},${player.penalties},${player.number},${goalieStats}\n`;
    });
    
    // Create downloadable file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sekta-stats-proper.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Proper CSV file created and downloaded: sekta-stats-proper.csv');
    
    // Clear the cached data to force a reload
    clearStatsCache();
    
    return { success: true, message: 'CSV file created successfully!' };
  } catch (error) {
    console.error('Error generating CSV:', error);
    return { success: false, error: error.message };
  }
}

// Clear cache function for admin use
export function clearStatsCache() {
  cachedData = null;
  lastLoadTime = null;
  console.log('🗑️ Stats cache cleared');
}

// For backward compatibility with existing code
export async function getAllStats() {
  return await getCurrentSeasonStats();
}

// Parse comprehensive CSV data from existing files
export async function parseComprehensiveCSVData() {
  try {
    console.log('📊 Loading comprehensive data from existing CSV files...');
    
    // Load goalies, skaters, and dedicated maalivahdit files
    const [goaliesResponse, skatersResponse, dedicatedGoaliesData] = await Promise.all([
      fetch('/pelaajat-tilastot_goalies.csv'),
      fetch('/pelaajat-tilastot_skaters.csv'),
      parseGoaliesFromDedicatedCSV()
    ]);
    
    if (!goaliesResponse.ok || !skatersResponse.ok) {
      throw new Error('Failed to fetch CSV files');
    }
    
    const goaliesText = await goaliesResponse.text();
    const skatersText = await skatersResponse.text();
    
    console.log('📄 Loaded goalies CSV:', goaliesText.length, 'chars');
    console.log('📄 Loaded skaters CSV:', skatersText.length, 'chars');
    console.log('🥅 Loaded dedicated goalies data:', dedicatedGoaliesData.goalies.length, 'goalies');
    
    // Parse both files with improved logic
    const goaliesData = parseAdvancedGoaliesCSV(goaliesText);
    const skatersData = parseAdvancedSkatersCSV(skatersText);
    
    // Combine the data, prioritizing dedicated goalie data
    let allPlayers = [...skatersData];
    
    // Add goalies from dedicated CSV (this takes priority)
    if (dedicatedGoaliesData.goalies.length > 0) {
      console.log('🥅 Using dedicated maalivahdit.csv data for goalies');
      allPlayers.push(...dedicatedGoaliesData.rawData);
    } else {
      console.log('🥅 Falling back to parsed goalies data');
      allPlayers.push(...goaliesData);
    }
    
    // Extract seasons from data
    const seasonsSet = new Set();
    allPlayers.forEach(player => {
      if (player.season) {
        seasonsSet.add(player.season);
      }
    });
    
    // Add seasons from dedicated goalie data
    dedicatedGoaliesData.seasons.forEach(season => {
      seasonsSet.add(season);
    });
    
    const seasons = Array.from(seasonsSet).sort().reverse();
    console.log('📅 Detected seasons:', seasons);
    
    // Group players by name and season
    const playersByName = {};
    
    allPlayers.forEach(player => {
      if (!playersByName[player.name]) {
        playersByName[player.name] = {
          name: player.name,
          position: player.position,
          number: player.number,
          seasons: []
        };
      }
      
      const seasonData = {
        season: player.season,
        position: player.position,
        games: player.games,
        goals: player.goals,
        assists: player.assists,
        points: player.points,
        penalties: player.penalties,
        number: player.number
      };
      
      // Add goalie-specific stats if applicable
      if (player.position === 'Maalivahti') {
        seasonData.savePercentage = player.savePercentage || 0;
        seasonData.goalsAgainstAverage = player.goalsAgainstAverage || 0;
        seasonData.saves = player.saves || 0;
        seasonData.goalsAgainst = player.goalsAgainst || 0;
        seasonData.wins = player.wins || 0;
        seasonData.shutouts = player.shutouts || 0;
      }
      
      playersByName[player.name].seasons.push(seasonData);
    });
    
    return {
      players: Object.values(playersByName),
      seasons: seasons,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Error parsing comprehensive CSV data:', error);
    return {
      players: [],
      seasons: ['2024-2025'],
      error: error.message
    };
  }
}

// Advanced parser for skaters CSV that handles multi-season format
function parseAdvancedSkatersCSV(csvText) {
  console.log('🏃 Parsing skaters CSV with advanced logic...');
  const lines = csvText.split('\n');
  const skaters = [];
  
  // Parse line by line looking for season sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for lines that contain season and division information
    if (line.includes('KAUSI') && line.includes('PELAAJAT')) {
      console.log(`📅 Found season section at line ${i}:`, line.substring(0, 100));
      
      // Parse this section
      const seasonData = parseSeasonSection(lines, i, false); // false = not goalies
      skaters.push(...seasonData);
    }
  }
  
  console.log(`✅ Parsed ${skaters.length} skaters from advanced CSV`);
  return skaters;
}

// Advanced parser for goalies CSV that handles multi-season format
function parseAdvancedGoaliesCSV(csvText) {
  console.log('🥅 Parsing goalies CSV with advanced logic...');
  const lines = csvText.split('\n');
  const goalies = [];
  
  // Parse line by line looking for season sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for lines that contain season and goalie information
    if (line.includes('KAUSI') && line.includes('MAALIVAHDIT')) {
      console.log(`📅 Found goalie season section at line ${i}:`, line.substring(0, 100));
      
      // Parse this section
      const seasonData = parseSeasonSection(lines, i, true); // true = goalies
      goalies.push(...seasonData);
    }
  }
  
  console.log(`✅ Parsed ${goalies.length} goalies from advanced CSV`);
  return goalies;
}

// Parse a specific season section starting from a given line
function parseSeasonSection(lines, startLine, isGoalies) {
  const players = [];
  const seasonLine = lines[startLine];
  
  // Extract season and division information
  const seasonMatch = seasonLine.match(/KAUSI\s+(\d{4}-\d{4})/);
  const divisionMatch = seasonLine.match(/(III-DIV[^,]*|IV-DIV[^,]*)/);
  
  if (!seasonMatch) return players;
  
  const season = seasonMatch[1];
  const division = divisionMatch ? divisionMatch[0].trim() : '';
  const seasonName = division ? `${season} (${division})` : season;
  
  console.log(`🏆 Parsing season: ${seasonName}, isGoalies: ${isGoalies}`);
  console.log(`📋 Season line: ${seasonLine.substring(0, 100)}...`);
  
  // Find the header line and player data
  let headerLine = -1;
  let dataStartLine = -1;
  
  // Look for header pattern - scan more lines to find the right header
  for (let i = startLine; i < Math.min(startLine + 30, lines.length); i++) {
    const line = lines[i];
    
    if (isGoalies) {
      // Look for goalie headers: O, T%, PMO, T, PM, V, NP
      if (line.includes(',O,') && line.includes('T%') && line.includes('PMO')) {
        headerLine = i;
        dataStartLine = i + 1;
        console.log(`📋 Found goalie header at line ${i}: ${line.substring(0, 100)}`);
        break;
      }
    } else {
      // Look for player headers: O, M, S, P, J
      if (line.includes(',O,') && line.includes(',M,') && line.includes(',S,') && line.includes(',P,')) {
        headerLine = i;
        dataStartLine = i + 1;
        console.log(`📋 Found player header at line ${i}: ${line.substring(0, 100)}`);
        break;
      }
    }
  }
  
  if (headerLine === -1 || dataStartLine === -1) {
    console.log(`⚠️ No header found for section starting at line ${startLine}`);
    return players;
  }
  
  // Parse player data - look further ahead but stop at next season
  for (let i = dataStartLine; i < Math.min(dataStartLine + 50, lines.length); i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Stop if we hit another season section
    if (line.includes('KAUSI') && i > startLine) {
      console.log(`🛑 Stopped parsing at next season section (line ${i})`);
      break;
    }
    
    const cells = line.split(',').map(c => c.trim());
    
    if (isGoalies) {
      // Parse goalie line
      if (line.includes('(MV)')) {
        const goalie = parseGoalieLine(cells, seasonName);
        if (goalie) {
          players.push(goalie);
          // Special logging for Mika Ahven
          if (goalie.name.toLowerCase().includes('mika ahven')) {
            console.log(`🎯 MIKA AHVEN FOUND - Season: ${seasonName}, Line ${i}:`, goalie);
          }
        }
      }
    } else {
      // Parse player line
      if (cells[0] && (cells[0].includes(',') || cells[0].includes('"')) && !line.includes('(MV)')) {
        const player = parsePlayerLine(cells, seasonName);
        if (player) players.push(player);
      }
    }
  }
  
  console.log(`📈 Parsed ${players.length} ${isGoalies ? 'goalies' : 'players'} for ${seasonName}`);
  return players;
}

// Parse a single goalie line
function parseGoalieLine(cells, seasonName) {
  // Find the cell with (MV)
  const mvCell = cells.find(c => c.includes('(MV)'));
  if (!mvCell) return null;
  
  const mvIndex = cells.indexOf(mvCell);
  
  // Extract name
  let playerName = mvCell.replace('(MV)', '').trim();
  if (playerName.includes(',')) {
    const [lastName, firstName] = playerName.split(',').map(s => s.trim());
    playerName = `${firstName} ${lastName}`;
  }
  
  // Extract stats in the exact order they appear: O, T%, PMO, T, PM, V, NP
  // The stats start immediately after the name cell
  const games = parseInt(cells[mvIndex + 1]) || 0;                    // O (games)
  const savePercentageRaw = parseFloat(cells[mvIndex + 2]) || 0;       // T% (save percentage)
  const goalsAgainstAverage = parseFloat(cells[mvIndex + 3]) || 0;     // PMO (goals against average)
  const saves = parseInt(cells[mvIndex + 4]) || 0;                    // T (saves)
  const goalsAgainst = parseInt(cells[mvIndex + 5]) || 0;              // PM (goals against)
  const wins = parseInt(cells[mvIndex + 6]) || 0;                     // V (wins)
  const shutouts = parseInt(cells[mvIndex + 7]) || 0;                 // NP (shutouts)
  
  // Convert save percentage: if it's a decimal (0.8188...), convert to percentage (81.88%)
  const savePercentage = savePercentageRaw < 1 ? savePercentageRaw * 100 : savePercentageRaw;
  
  if (games === 0) return null;
  
  console.log(`🥅 Parsed goalie: ${playerName} (${seasonName}) - O:${games}, T%:${savePercentage.toFixed(1)}%, PMO:${goalsAgainstAverage.toFixed(2)}, T:${saves}, PM:${goalsAgainst}, V:${wins}, NP:${shutouts}`);
  
  return {
    name: playerName,
    position: 'Maalivahti',
    season: seasonName,
    games: games,
    goals: 0,
    assists: 0,
    points: 0,
    penalties: 0,
    number: 0,
    savePercentage: savePercentage,
    goalsAgainstAverage: goalsAgainstAverage,
    saves: saves,
    goalsAgainst: goalsAgainst,
    wins: wins,
    shutouts: shutouts
  };
}

// Parse a single player line
function parsePlayerLine(cells, seasonName) {
  let playerName = '';
  
  // Extract name from first cell
  if (cells[0].includes('"')) {
    const nameMatch = cells[0].match(/"([^"]+)"/);
    if (nameMatch) {
      const fullName = nameMatch[1];
      const [lastName, firstName] = fullName.split(',').map(s => s.trim());
      playerName = `${firstName} ${lastName}`;
    }
  } else if (cells[0].includes(',')) {
    const nameMatch = cells[0].match(/([^,]+),\s*([^,]+)/);
    if (nameMatch) {
      const lastName = nameMatch[1].trim();
      const firstName = nameMatch[2].trim();
      playerName = `${firstName} ${lastName}`;
    }
  }
  
  if (!playerName) return null;
  
  // Extract stats: O, M, S, P, J
  const games = parseInt(cells[1]) || 0;
  const goals = parseInt(cells[2]) || 0;
  const assists = parseInt(cells[3]) || 0;
  const points = parseInt(cells[4]) || 0;
  const penalties = parseInt(cells[5]) || 0;
  
  if (games === 0) return null;
  
  console.log(`🏃 Parsed player: ${playerName} - O:${games}, M:${goals}, S:${assists}`);
  
  return {
    name: playerName,
    position: 'Hyökkääjä',
    season: seasonName,
    games: games,
    goals: goals,
    assists: assists,
    points: points,
    penalties: penalties,
    number: 0
  };
}

// Parse the dedicated maalivahdit.csv file with comprehensive goalie statistics
export async function parseGoaliesFromDedicatedCSV() {
  try {
    console.log('🥅 Loading comprehensive goalie data from maalivahdit.csv...');
    
    const response = await fetch('/maalivahdit.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch maalivahdit.csv: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('📄 Loaded maalivahdit.csv:', csvText.length, 'chars');
    
    const lines = csvText.split('\n');
    const goalies = [];
    
    // Parse each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Split by semicolon as the file uses semicolon separators
      const cells = line.split(';').map(c => c.trim());
      
      if (cells.length < 10) continue; // Need at least 10 columns
      
      // Extract data according to CSV structure:
      // Kausi;Lohko;Nimi;O;T%;PMO;T;PM;V;NP;
      const season = cells[0]; // Kausi
      const division = cells[1]; // Lohko
      const name = cells[2]; // Nimi
      const games = parseInt(cells[3]) || 0; // O (Ottelut)
      const savePercentageStr = cells[4]; // T% (Torjuntaprosentti)
      const goalsAgainstAverageStr = cells[5]; // PMO (Päästetyt maalit ottelu)
      const saves = parseInt(cells[6]) || 0; // T (Torjunnat)
      const goalsAgainst = parseInt(cells[7]) || 0; // PM (Päästetyt maalit)
      const wins = parseInt(cells[8]) || 0; // V (Voitot)
      const shutouts = parseInt(cells[9]) || 0; // NP (Nollapelit)
      
      if (!name || games === 0) continue;
      
      // Use basic normalization with special case handling
      let playerName = normalizeString(name.trim());
      
      // Parse save percentage - remove % sign and convert to number
      let savePercentage = 0;
      if (savePercentageStr && savePercentageStr !== '') {
        const cleanPercentage = savePercentageStr.replace('%', '').replace(',', '.').trim();
        savePercentage = parseFloat(cleanPercentage) || 0;
      }
      
      // Parse goals against average - replace comma with dot for decimal
      let goalsAgainstAverage = 0;
      if (goalsAgainstAverageStr && goalsAgainstAverageStr !== '') {
        const cleanGAA = goalsAgainstAverageStr.replace(',', '.').trim();
        goalsAgainstAverage = parseFloat(cleanGAA) || 0;
      }
      
      // Create season name with division
      const seasonName = division ? `${season} (${division})` : season;
      
      const goalie = {
        name: playerName,
        position: 'Maalivahti',
        season: seasonName,
        games: games,
        goals: 0, // Goalies have 0 goals
        assists: 0, // Goalies have 0 assists
        points: 0, // Goalies have 0 points
        penalties: 0,
        number: 0, // Will be set from static data
        savePercentage: savePercentage,
        goalsAgainstAverage: goalsAgainstAverage,
        saves: saves,
        goalsAgainst: goalsAgainst,
        wins: wins,
        shutouts: shutouts
      };
      
      console.log(`🥅 Parsed goalie: ${playerName} (${seasonName}) - O:${games}, T%:${savePercentage}%, PMO:${goalsAgainstAverage}, T:${saves}, PM:${goalsAgainst}, V:${wins}, NP:${shutouts}`);
      goalies.push(goalie);
    }
    
    console.log(`✅ Parsed ${goalies.length} goalies from maalivahdit.csv`);
    
    // Group goalies by name for comprehensive view
    const goaliesByName = {};
    goalies.forEach(goalie => {
      if (!goaliesByName[goalie.name]) {
        goaliesByName[goalie.name] = {
          name: goalie.name,
          position: 'Maalivahti',
          number: 0, // Will be set from static data
          seasons: []
        };
      }
      
      const seasonData = {
        season: goalie.season,
        position: 'Maalivahti',
        games: goalie.games,
        goals: 0,
        assists: 0,
        points: 0,
        penalties: 0,
        number: 0,
        savePercentage: goalie.savePercentage,
        goalsAgainstAverage: goalie.goalsAgainstAverage,
        saves: goalie.saves,
        goalsAgainst: goalie.goalsAgainst,
        wins: goalie.wins,
        shutouts: goalie.shutouts
      };
      
      goaliesByName[goalie.name].seasons.push(seasonData);
    });
    
    // Extract unique seasons
    const seasonsSet = new Set();
    goalies.forEach(goalie => {
      if (goalie.season) {
        seasonsSet.add(goalie.season);
      }
    });
    const seasons = Array.from(seasonsSet).sort().reverse();
    
    return {
      goalies: Object.values(goaliesByName),
      seasons: seasons,
      rawData: goalies
    };
    
  } catch (error) {
    console.error('❌ Error parsing maalivahdit.csv:', error);
    return {
      goalies: [],
      seasons: [],
      rawData: [],
      error: error.message
    };
  }
}

// Parse the dedicated pelaajat.csv file with comprehensive player statistics
export async function parsePlayersFromDedicatedCSV() {
  try {
    console.log('🏃 Loading comprehensive player data from pelaajat.csv...');
    
    const response = await fetch('/pelaajat.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch pelaajat.csv: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('📄 Loaded pelaajat.csv:', csvText.length, 'chars');
    
    const lines = csvText.split('\n');
    const players = [];
    
    // Parse each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Split by semicolon as the file uses semicolon separators
      const cells = line.split(';').map(c => c.trim());
      
      if (cells.length < 7) continue; // Need at least basic columns
      
      // Extract data according to CSV structure:
      // kausi;lohko;[player name];O;M;S;P;J;VM;YV;AV;RL-;RL+;SR;TV;H;TM;IM;...
      const season = cells[0]; // kausi
      const division = cells[1]; // lohko
      const playerNameRaw = cells[2]; // player name
      const games = parseInt(cells[3]) || 0; // O (ottelut)
      const goals = parseInt(cells[4]) || 0; // M (maalit)
      const assists = parseInt(cells[5]) || 0; // S (syötöt)
      const points = parseInt(cells[6]) || 0; // P (pisteet)
      const penalties = parseInt(cells[7]) || 0; // J (jäähyt)
      
      // Additional statistics (if available)
      const vm = parseInt(cells[8]) || 0; // VM
      const yv = parseInt(cells[9]) || 0; // YV
      const av = parseInt(cells[10]) || 0; // AV
      
      if (!playerNameRaw || games === 0) continue;
      
      // Parse player name - handle different formats
      let playerName = playerNameRaw;
      if (playerName.includes(',')) {
        const parts = playerName.split(',');
        if (parts.length >= 2) {
          const lastName = parts[0].trim();
          const firstName = parts[1].trim();
          playerName = `${firstName} ${lastName}`;
        }
      }
      
      // Apply simple normalization
      playerName = normalizeString(playerName);
      
      // Create season name with division
      const seasonName = division ? `${season} (${division})` : season;
      
      // Determine position based on name patterns and stats
      let position = 'Hyökkääjä'; // Default
      
      // Goalies typically have 0 goals and assists in player stats
      if ((goals === 0 && assists === 0 && points === 0) && 
          (playerName.includes('Ahven') || playerName.includes('Virta') || 
           playerName.includes('Liukkonen') || playerName.includes('Kurppa'))) {
        position = 'Maalivahti';
      }
      // Defenders often have fewer goals relative to assists
      else if (goals < assists && assists > 2) {
        position = 'Puolustaja';
      }
      
      const player = {
        name: playerName.trim(),
        position: position,
        season: seasonName,
        games: games,
        goals: goals,
        assists: assists,
        points: points,
        penalties: penalties,
        number: 0, // Will be set from static data
        // Additional stats
        vm: vm,
        yv: yv,
        av: av
      };
      
      console.log(`🏃 Parsed player: ${playerName} (${seasonName}) - O:${games}, M:${goals}, S:${assists}, P:${points}, J:${penalties}`);
      players.push(player);
    }
    
    console.log(`✅ Parsed ${players.length} players from pelaajat.csv`);
    
    // Group players by name for comprehensive view
    const playersByName = {};
    players.forEach(player => {
      if (!playersByName[player.name]) {
        playersByName[player.name] = {
          name: player.name,
          position: player.position,
          number: 0, // Will be set from static data
          seasons: []
        };
      }
      
      const seasonData = {
        season: player.season,
        position: player.position,
        games: player.games,
        goals: player.goals,
        assists: player.assists,
        points: player.points,
        penalties: player.penalties,
        number: 0,
        vm: player.vm,
        yv: player.yv,
        av: player.av
      };
      
      playersByName[player.name].seasons.push(seasonData);
    });
    
    // Extract unique seasons
    const seasonsSet = new Set();
    players.forEach(player => {
      if (player.season) {
        seasonsSet.add(player.season);
      }
    });
    const seasons = Array.from(seasonsSet).sort().reverse();
    
    return {
      players: Object.values(playersByName),
      seasons: seasons,
      rawData: players
    };
    
  } catch (error) {
    console.error('❌ Error parsing pelaajat.csv:', error);
    return {
      players: [],
      seasons: [],
      rawData: [],
      error: error.message
    };
  }
}

// Get comprehensive goalie statistics for all years
export async function getComprehensiveGoalieStats() {
  try {
    console.log('📊 Loading comprehensive goalie statistics...');
    
    const goalieData = await parseGoaliesFromDedicatedCSV();
    
    if (goalieData.goalies.length === 0) {
      console.log('⚠️ No goalies found in dedicated CSV');
      return goalieData;
    }
    
    // Enhance with static player data (images, numbers)
    const GOALIE_STATIC_DATA = [
      { name: "Mika Ahven", number: 1 },
      { name: "Matias Virta", number: 30 },
      { name: "Lassi Liukkonen", number: 35 },
      { name: "Vesa Kurppa", number: 99 }
    ];
    
    goalieData.goalies = goalieData.goalies.map(goalie => {
      // Apply basic normalization
      const normalizedName = normalizeString(goalie.name);
      
      const staticData = GOALIE_STATIC_DATA.find(sg => 
        sg.name.toLowerCase() === normalizedName.toLowerCase()
      );
      
      if (staticData) {
        goalie.number = staticData.number;
        // Update all seasons with correct number
        goalie.seasons = goalie.seasons.map(season => ({
          ...season,
          number: staticData.number
        }));
      }
      
      // Update the goalie name with normalized version
      goalie.name = normalizedName;
      
      return goalie;
    });
    
    console.log(`✅ Enhanced ${goalieData.goalies.length} goalies with static data`);
    
    // Calculate career totals for each goalie
    goalieData.goalies.forEach(goalie => {
      const careerStats = {
        totalGames: 0,
        totalSaves: 0,
        totalGoalsAgainst: 0,
        totalWins: 0,
        totalShutouts: 0,
        seasonsPlayed: goalie.seasons.length,
        avgSavePercentage: 0,
        avgGoalsAgainstAverage: 0
      };
      
      goalie.seasons.forEach(season => {
        careerStats.totalGames += season.games || 0;
        careerStats.totalSaves += season.saves || 0;
        careerStats.totalGoalsAgainst += season.goalsAgainst || 0;
        careerStats.totalWins += season.wins || 0;
        careerStats.totalShutouts += season.shutouts || 0;
      });
      
      // Calculate averages
      if (careerStats.totalGames > 0) {
        const totalShots = careerStats.totalSaves + careerStats.totalGoalsAgainst;
        careerStats.avgSavePercentage = totalShots > 0 ? (careerStats.totalSaves / totalShots) * 100 : 0;
        careerStats.avgGoalsAgainstAverage = careerStats.totalGoalsAgainst / careerStats.totalGames;
      }
      
      goalie.careerStats = careerStats;
    });
    
    return goalieData;
    
  } catch (error) {
    console.error('❌ Error getting comprehensive goalie stats:', error);
    return {
      goalies: [],
      seasons: [],
      rawData: [],
      error: error.message
    };
  }
}

// Get comprehensive player and goalie lists from dedicated CSV files
export async function getComprehensivePlayerAndGoalieLists() {
  try {
    console.log('📊 Loading comprehensive player and goalie data from dedicated CSV files...');
    
    // Load both players and goalies in parallel
    const [playerData, goalieData] = await Promise.all([
      parsePlayersFromDedicatedCSV(),
      parseGoaliesFromDedicatedCSV()
    ]);
    
    console.log(`📄 Loaded ${playerData.players.length} players and ${goalieData.goalies.length} goalies`);
    
    // Enhance with static player data (images, numbers, positions)
    const STATIC_PLAYER_DATA = [
      { name: "Mika Aaltonen", role: "Hyökkääjä", number: 19 },
      { name: "Petri Vikman", role: "Hyökkääjä", number: 22 },
      { name: "Miika Oja-Nisula", role: "Hyökkääjä", number: 66 },
      { name: "Akseli Nykänen", role: "Hyökkääjä", number: 15 },
      { name: "Joni Vainio", role: "Hyökkääjä", number: 13 },
      { name: "Vesa Halme", role: "Puolustaja", number: 55 },
      { name: "Ville Mäenranta", role: "Puolustaja", number: 28 },
      { name: "Mika Ahven", role: "Maalivahti", number: 1 },
      { name: "Henri Kananen", role: "Hyökkääjä", number: 27 },
      { name: "Jesse Höykinpuro", role: "Hyökkääjä", number: 8 },
      { name: "Jimi Laaksonen", role: "Hyökkääjä", number: 11 },
      { name: "Niko Nynäs", role: "Puolustaja", number: 33 },
      { name: "Joonas Leppänen", role: "Puolustaja", number: 44 },
      { name: "Matias Virta", role: "Maalivahti", number: 30 },
      { name: "Lassi Liukkonen", role: "Maalivahti", number: 35 },
      { name: "Juha Kiilunen", role: "Hyökkääjä", number: 18 },
      { name: "Veikka Saarinen", role: "Hyökkääjä", number: 14 },
      { name: "Aleksi Tuokko", role: "Hyökkääjä", number: 77 },
      { name: "Joonas Pentti", role: "Hyökkääjä", number: 88 },
      { name: "Vesa Kurppa", role: "Maalivahti", number: 99 }
    ];
    
    // Enhance players with static data
    const enhancedPlayers = playerData.players.map(player => {
      // Apply basic normalization
      const normalizedName = normalizeString(player.name);
      
      const staticData = STATIC_PLAYER_DATA.find(sp => 
        sp.name.toLowerCase() === normalizedName.toLowerCase()
      );
      
      if (staticData) {
        player.position = staticData.role;
        player.number = staticData.number;
        // Update all seasons with correct position and number
        player.seasons = player.seasons.map(season => ({
          ...season,
          position: staticData.role,
          number: staticData.number
        }));
      }
      
      // Update the player name with normalized version
      player.name = normalizedName;
      
      return player;
    });
    
    // Enhance goalies with static data
    const enhancedGoalies = goalieData.goalies.map(goalie => {
      // Apply basic normalization
      const normalizedName = normalizeString(goalie.name);
      
      const staticData = STATIC_PLAYER_DATA.find(sp => 
        sp.name.toLowerCase() === normalizedName.toLowerCase()
      );
      
      if (staticData) {
        goalie.number = staticData.number;
        // Update all seasons with correct number
        goalie.seasons = goalie.seasons.map(season => ({
          ...season,
          number: staticData.number
        }));
      }
      
      // Update the goalie name with normalized version
      goalie.name = normalizedName;
      
      return goalie;
    });
    
    // Combine all seasons
    const allSeasons = new Set([...playerData.seasons, ...goalieData.seasons]);
    const seasons = Array.from(allSeasons).sort().reverse();
    
    // Calculate career totals for players
    enhancedPlayers.forEach(player => {
      const careerStats = {
        totalGames: 0,
        totalGoals: 0,
        totalAssists: 0,
        totalPoints: 0,
        totalPenalties: 0,
        seasonsPlayed: player.seasons.length,
        avgPointsPerGame: 0
      };
      
      player.seasons.forEach(season => {
        careerStats.totalGames += season.games || 0;
        careerStats.totalGoals += season.goals || 0;
        careerStats.totalAssists += season.assists || 0;
        careerStats.totalPoints += season.points || 0;
        careerStats.totalPenalties += season.penalties || 0;
      });
      
      // Calculate averages
      if (careerStats.totalGames > 0) {
        careerStats.avgPointsPerGame = careerStats.totalPoints / careerStats.totalGames;
      }
      
      player.careerStats = careerStats;
    });
    
    return {
      players: enhancedPlayers,
      goalies: enhancedGoalies,
      seasons: seasons,
      playerSeasons: playerData.seasons,
      goalieSeasons: goalieData.seasons,
      rawPlayerData: playerData.rawData,
      rawGoalieData: goalieData.rawData,
      totalPlayers: enhancedPlayers.length,
      totalGoalies: enhancedGoalies.length
    };
    
  } catch (error) {
    console.error('❌ Error getting comprehensive player and goalie lists:', error);
    return {
      players: [],
      goalies: [],
      seasons: [],
      playerSeasons: [],
      goalieSeasons: [],
      rawPlayerData: [],
      rawGoalieData: [],
      totalPlayers: 0,
      totalGoalies: 0,
      error: error.message
    };
  }
}

// Get stats for a specific season
export async function getPlayerStatsForSeason(seasonName) {
  const data = await getPlayerStatsFromCSV();
  const targetSeason = seasonName || data.seasons[0] || '2024-2025';
  
  console.log(`Getting stats for specific season: ${targetSeason}`);
  
  const seasonPlayers = [];
  
  data.players.forEach(player => {
    const seasonData = player.seasons.find(s => s.season === targetSeason);
    if (seasonData) {
      seasonPlayers.push({
        ...player,
        ...seasonData
      });
    }
  });
  
  console.log(`Found ${seasonPlayers.length} players for season ${targetSeason}`);
  
  return {
    players: seasonPlayers,
    currentSeason: targetSeason,
    seasons: data.seasons,
    totalGoals: seasonPlayers.reduce((sum, p) => sum + (p.goals || 0), 0),
    totalAssists: seasonPlayers.reduce((sum, p) => sum + (p.assists || 0), 0),
    totalPoints: seasonPlayers.reduce((sum, p) => sum + (p.points || 0), 0),
    totalPlayers: seasonPlayers.length
  };
}