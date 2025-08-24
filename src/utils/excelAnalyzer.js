import * as XLSX from 'xlsx';

// Helper function to safely convert value to string
function safeStringValue(value, defaultValue = '') {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return value.toString();
  return String(value).trim();
}

// Helper function to safely convert value to number
function safeNumberValue(value, defaultValue = 0) {
  if (value === null || value === undefined || value === '') return defaultValue;
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Debug function to examine Excel structure
export async function debugExcelStructure() {
  try {
    console.log('=== EXCEL FILE ANALYSIS START ===');
    const response = await fetch('/SekTa-Tilastot-24-25.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    console.log('Available sheets:', workbook.SheetNames);
    
    const analysis = {};
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const objectData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`\n--- Sheet: ${sheetName} ---`);
      console.log('Headers:', jsonData[0]);
      console.log('Row count:', jsonData.length - 1);
      console.log('Sample rows:', jsonData.slice(1, 6));
      
      // Look for ANY player data (not just Mika)
      const playersFound = [];
      objectData.forEach((row, index) => {
        // Check if this row contains any player-like data
        const hasName = Object.values(row).some(value => 
          typeof value === 'string' && value.length > 2 && 
          /^[A-Za-zÀ-ſ\s]+$/.test(value)
        );
        
        const hasNumbers = Object.values(row).some(value => 
          typeof value === 'number' && value > 0
        );
        
        if (hasName && hasNumbers) {
          playersFound.push({ index: index + 1, data: row });
        }
        
        // Specifically look for Mika
        const mikaData = Object.values(row).some(value => 
          typeof value === 'string' && value.toLowerCase().includes('mika')
        );
        
        if (mikaData) {
          console.log(`🎯 MIKA FOUND in row ${index + 1}:`, row);
        }
      });
      
      console.log(`Players found: ${playersFound.length}`);
      if (playersFound.length > 0) {
        console.log('Sample player data:');
        playersFound.slice(0, 3).forEach(p => {
          console.log(`  Row ${p.index}:`, p.data);
        });
      }
      
      analysis[sheetName] = {
        headers: jsonData[0] || [],
        sampleData: jsonData.slice(0, 8),
        objectData: objectData,
        playersFound: playersFound.length
      };
    });
    
    console.log('=== EXCEL FILE ANALYSIS END ===');
    return analysis;
  } catch (error) {
    console.error('Error analyzing Excel file:', error);
    return null;
  }
}

// Define comprehensive player data model with more Finnish variations
const PLAYER_STAT_FIELDS = {
  // Basic info - expanded Finnish variations
  name: [
    'Pelaaja', 'Nimi', 'Player', 'Name', 'Etunimi', 'Sukunimi',
    'Pelaajanimi', 'Pelaajan nimi', 'Etu- ja sukunimi', 'Koko nimi',
    'Pelaajat', 'Nimet', 'Henkilö'
  ],
  number: ['Numero', 'Number', '#', 'Pelinumero', 'Nro', 'N:o', 'Pn'],
  position: [
    'Pelipaikka', 'Position', 'Pos', 'Rooli', 'Paikka',
    'Sijainti', 'Pelipaikka/rooli'
  ],
  
  // Scoring stats - expanded variations
  goals: [
    'Maalit', 'Goals', 'M', 'G', 'Maali', 'Maaleja',
    'Maalimäärä', 'Tehtyj maaleja', 'Osumat'
  ],
  assists: [
    'Syötöt', 'Assists', 'S', 'A', 'Syöttö', 'Syöttöjä',
    'Syöttömäärä', 'Passit', 'Passi'
  ],
  points: [
    'Pisteet', 'Points', 'P', 'Piste', 'Pisteitä',
    'Pistemäärä', 'Yhteensä', 'Kokonaispisteet'
  ],
  
  // Game stats
  games: [
    'Ottelut', 'Games', 'GP', 'Pelit', 'Ottelu', 'Pelattuja',
    'Pelejä', 'Matsit', 'Matsi', 'Kamppailut'
  ],
  wins: ['Voitot', 'Wins', 'W', 'V', 'Voittoja'],
  losses: ['Tappiot', 'Losses', 'L', 'H', 'Häviöt', 'Häviöitä'],
  
  // Performance stats
  shots: ['Laukaukset', 'Shots', 'SOG', 'Laukaus', 'Laukauksia', 'Heitot'],
  saves: ['Torjunnat', 'Saves', 'SV', 'Torjunta', 'Torjuntoja'],
  penalties: ['Jäähyt', 'Penalties', 'PIM', 'Jäähy', 'Jäähyjä', 'Rangaistukset'],
  plusMinus: ['+/-', 'Plus/Minus', 'PM', '+', '-'],
  
  // Time stats
  timeOnIce: ['Peliaika', 'TOI', 'Time', 'Aika', 'Peliaikaa'],
  powerPlayGoals: ['YV-maalit', 'PPG', 'PowerPlay', 'Ylivoima', 'YV'],
  shortHandedGoals: ['AV-maalit', 'SHG', 'ShortHanded', 'Alivoima', 'AV'],
  
  // Goalie specific
  goalsAgainst: ['Päästetyt', 'GA', 'Against', 'Päästettyjä'],
  shutouts: ['Nollapeli', 'SO', 'Shutout', 'Nollapelit'],
  savePercentage: ['Torjunta%', 'SV%', 'Save%', 'Torjuntaprosentti'],
  
  // Additional stats
  hits: ['Taklaukset', 'Hits', 'Hit', 'Taklausta'],
  blocks: ['Blokit', 'Blocks', 'BLK', 'Blokki', 'Blokkeja'],
  takeaways: ['Riistot', 'Takeaways', 'TK', 'Riisto'],
  giveaways: ['Luovutukset', 'Giveaways', 'GV', 'Luovutus'],
  faceoffWins: ['Aloitukset', 'FO%', 'Faceoff', 'Aloitus']
};

// Season/Year detection patterns - expanded for historical seasons
const SEASON_PATTERNS = {
  current: ['24-25', '2024-25', '2024-2025', '2024', '25'],
  previous: ['23-24', '2023-24', '2023-2024', '2023', '24'],
  historical: {
    '2022-23': ['22-23', '2022-23', '2022', '22'],
    '2021-22': ['21-22', '2021-22', '2021', '21'],
    '2020-21': ['20-21', '2020-21', '2020', '20'],
    '2019-20': ['19-20', '2019-20', '2019', '19'],
    '2018-19': ['18-19', '2018-19', '2018', '18'],
    '2017-18': ['17-18', '2017-18', '2017', '17'],
    '2016-17': ['16-17', '2016-17', '2016', '16'],
    '2015-16': ['15-16', '2015-16', '2015', '15'],
    '2014-15': ['14-15', '2014-15', '2014', '14'],
    '2013-14': ['13-14', '2013-14', '2013', '13'],
    '2012-13': ['12-13', '2012-13', '2012', '12'],
    '2011-12': ['11-12', '2011-12', '2011', '11'],
    '2010-11': ['10-11', '2010-11', '2010', '10'],
    '2009-10': ['09-10', '2009-10', '2009', '09'],
    '2008-09': ['08-09', '2008-09', '2008', '08'],
    '2007-08': ['07-08', '2007-08', '2007', '07'],
    '2006-07': ['06-07', '2006-07', '2006', '06']
  }
};

// Function to find matching field value with enhanced matching
function findFieldValue(row, fieldKeys) {
  // First try exact matches
  for (const key of fieldKeys) {
    for (const rowKey of Object.keys(row)) {
      if (rowKey && typeof rowKey === 'string') {
        const normalizedRowKey = rowKey.toLowerCase().trim();
        const normalizedKey = key.toLowerCase().trim();
        
        // Exact match
        if (normalizedRowKey === normalizedKey) {
          return row[rowKey];
        }
      }
    }
  }
  
  // Then try partial matches
  for (const key of fieldKeys) {
    for (const rowKey of Object.keys(row)) {
      if (rowKey && typeof rowKey === 'string') {
        const normalizedRowKey = rowKey.toLowerCase().trim();
        const normalizedKey = key.toLowerCase().trim();
        
        // Partial match - key contains the field or field contains the key
        if (normalizedRowKey.includes(normalizedKey) || normalizedKey.includes(normalizedRowKey)) {
          return row[rowKey];
        }
      }
    }
  }
  
  // Finally try very loose matching for common abbreviations
  for (const key of fieldKeys) {
    for (const rowKey of Object.keys(row)) {
      if (rowKey && typeof rowKey === 'string') {
        const normalizedRowKey = rowKey.toLowerCase().trim().replace(/[^a-zäöå]/g, '');
        const normalizedKey = key.toLowerCase().trim().replace(/[^a-zäöå]/g, '');
        
        // Very loose match for single letters or very short abbreviations
        if (normalizedKey.length <= 2 && normalizedRowKey === normalizedKey) {
          return row[rowKey];
        }
      }
    }
  }
  
  return null;
}

// Function to detect season from sheet name or data
function detectSeason(sheetName, data) {
  const name = sheetName.toLowerCase();
  
  console.log(`   📅 Detecting season for sheet: "${sheetName}" (normalized: "${name}")`);
  
  // Check for current season
  if (SEASON_PATTERNS.current.some(pattern => name.includes(pattern))) {
    console.log(`   ✅ Matched current season -> 2024-2025`);
    return '2024-2025';
  }
  
  // Check for previous season
  if (SEASON_PATTERNS.previous.some(pattern => name.includes(pattern))) {
    console.log(`   ✅ Matched previous season -> 2023-2024`);
    return '2023-2024';
  }
  
  // Check for historical seasons
  for (const [season, patterns] of Object.entries(SEASON_PATTERNS.historical)) {
    if (patterns.some(pattern => name.includes(pattern))) {
      console.log(`   ✅ Matched historical season -> ${season}`);
      return season;
    }
  }
  
  // If sheet contains "Pelaajat - Tilastot", try to extract seasons from data
  if (name.includes('pelaajat') && name.includes('tilastot')) {
    console.log(`   🔍 Found player stats sheet, analyzing data for seasons...`);
    // This sheet likely contains data from multiple seasons
    return 'multi-season';
  }
  
  // Default to current season
  console.log(`   ⚠️ No season pattern matched, defaulting to 2024-2025`);
  return '2024-2025';
}

// Function to analyze Excel file structure
export async function analyzeExcelFile() {
  try {
    const response = await fetch('/SekTa-Tilastot-24-25.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    console.log('Available sheets:', workbook.SheetNames);
    
    const analysis = {};
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const objectData = XLSX.utils.sheet_to_json(worksheet);
      
      analysis[sheetName] = {
        name: sheetName,
        headers: jsonData[0] || [],
        rowCount: jsonData.length - 1,
        sampleData: jsonData.slice(0, 5),
        allData: jsonData,
        objectData: objectData,
        season: detectSeason(sheetName, jsonData),
        playerCount: 0,
        statTypes: []
      };
      
      // Analyze for player data
      if (objectData.length > 0) {
        const firstRow = objectData[0];
        const hasPlayerData = Object.keys(firstRow).some(key => 
          PLAYER_STAT_FIELDS.name.some(nameField => 
            key.toLowerCase().includes(nameField.toLowerCase())
          )
        );
        
        if (hasPlayerData) {
          analysis[sheetName].playerCount = objectData.length;
          analysis[sheetName].statTypes = Object.keys(firstRow);
        }
      }
      
      console.log(`Sheet: ${sheetName}`);
      console.log('Headers:', jsonData[0]);
      console.log('Rows:', jsonData.length - 1);
      console.log('Season:', analysis[sheetName].season);
      console.log('Player Count:', analysis[sheetName].playerCount);
      console.log('---');
    });
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing Excel file:', error);
    return null;
  }
}

// Function to extract player statistics with season filtering
export async function getPlayerStats(season = null) {
  const allStats = await getAllStats();
  if (!allStats) return null;
  
  if (season) {
    return getStatsBySeason(season);
  }
  
  return allStats.players;
}

// Function to extract team statistics with historical data
export async function getTeamStats(season = '2024-2025') {
  const allStats = await getAllStats();
  if (!allStats) return null;
  
  const players = season ? 
    allStats.players.filter(p => p.seasons?.some(s => s.season === season)) :
    allStats.players;
  
  const seasonPlayers = season ? 
    players.map(p => {
      const seasonData = p.seasons?.find(s => s.season === season);
      return seasonData ? { ...p, ...seasonData } : p;
    }) : players;
  
  return {
    season: season,
    totalPlayers: seasonPlayers.length,
    totalGoals: seasonPlayers.reduce((sum, p) => sum + (p.goals || 0), 0),
    totalAssists: seasonPlayers.reduce((sum, p) => sum + (p.assists || 0), 0),
    totalPoints: seasonPlayers.reduce((sum, p) => sum + (p.points || 0), 0),
    totalGames: seasonPlayers.reduce((sum, p) => sum + (p.games || 0), 0),
    players: seasonPlayers,
    availableSeasons: allStats.seasons
  };
}

// Function to compare seasons
export async function compareSeasons(seasons = ['2024-2025', '2023-2024']) {
  const allStats = await getAllStats();
  if (!allStats) return null;
  
  const comparison = {};
  
  seasons.forEach(season => {
    const seasonPlayers = allStats.players.map(player => {
      const seasonData = player.seasons?.find(s => s.season === season);
      return seasonData ? { ...player, ...seasonData } : null;
    }).filter(Boolean);
    
    comparison[season] = {
      totalPlayers: seasonPlayers.length,
      totalGoals: seasonPlayers.reduce((sum, p) => sum + p.goals, 0),
      totalAssists: seasonPlayers.reduce((sum, p) => sum + p.assists, 0),
      totalPoints: seasonPlayers.reduce((sum, p) => sum + p.points, 0),
      averagePointsPerPlayer: seasonPlayers.length > 0 ? 
        (seasonPlayers.reduce((sum, p) => sum + p.points, 0) / seasonPlayers.length).toFixed(2) : 0,
      topScorer: seasonPlayers.sort((a, b) => b.points - a.points)[0] || null
    };
  });
  
  return comparison;
}

// Function to extract comprehensive player profile
function extractPlayerProfile(row, sheetName, season) {
  const profile = {
    // Basic info
    name: safeStringValue(findFieldValue(row, PLAYER_STAT_FIELDS.name), 'Unknown Player'),
    number: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.number), null),
    position: safeStringValue(findFieldValue(row, PLAYER_STAT_FIELDS.position), 'Unknown'),
    
    // Season info
    season: season,
    sheet: sheetName,
    
    // Scoring stats
    goals: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.goals)),
    assists: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.assists)),
    points: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.points)),
    
    // Game stats
    games: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.games)),
    wins: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.wins)),
    losses: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.losses)),
    
    // Performance stats
    shots: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.shots)),
    saves: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.saves)),
    penalties: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.penalties)),
    plusMinus: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.plusMinus)),
    
    // Advanced stats
    powerPlayGoals: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.powerPlayGoals)),
    shortHandedGoals: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.shortHandedGoals)),
    hits: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.hits)),
    blocks: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.blocks)),
    takeaways: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.takeaways)),
    giveaways: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.giveaways)),
    
    // Goalie stats
    goalsAgainst: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.goalsAgainst)),
    shutouts: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.shutouts)),
    savePercentage: safeNumberValue(findFieldValue(row, PLAYER_STAT_FIELDS.savePercentage)),
    
    // Calculate derived stats
    get pointsPerGame() {
      return this.games > 0 ? (this.points / this.games).toFixed(2) : '0.00';
    },
    get goalsPerGame() {
      return this.games > 0 ? (this.goals / this.games).toFixed(2) : '0.00';
    },
    get assistsPerGame() {
      return this.games > 0 ? (this.assists / this.games).toFixed(2) : '0.00';
    },
    get shootingPercentage() {
      return this.shots > 0 ? ((this.goals / this.shots) * 100).toFixed(1) : '0.0';
    }
  };
  
  // Auto-calculate points if not provided
  if (profile.points === 0 && (profile.goals > 0 || profile.assists > 0)) {
    profile.points = profile.goals + profile.assists;
  }
  
  return profile;
}

// Function to merge player data from multiple sheets
function mergePlayerData(players) {
  const playerMap = new Map();
  
  players.forEach(player => {
    // Ensure player name is properly formatted
    const playerName = safeStringValue(player.name, 'Unknown Player');
    if (playerName === 'Unknown Player' || playerName.length < 2) {
      return; // Skip invalid players
    }
    
    const key = playerName.toLowerCase().trim();
    
    if (playerMap.has(key)) {
      const existing = playerMap.get(key);
      
      // Merge stats, preferring non-zero values
      Object.keys(player).forEach(stat => {
        if (typeof player[stat] === 'number' && player[stat] > 0) {
          if (!existing[stat] || existing[stat] === 0) {
            existing[stat] = player[stat];
          } else {
            // Sum up stats from different sheets for same season
            if (player.season === existing.season && 
                ['goals', 'assists', 'points', 'games', 'shots', 'penalties'].includes(stat)) {
              existing[stat] += player[stat];
            }
          }
        } else if (!existing[stat] && player[stat]) {
          existing[stat] = player[stat];
        }
      });
      
      // Store multiple seasons
      if (!existing.seasons) existing.seasons = [];
      if (!existing.seasons.find(s => s.season === player.season)) {
        existing.seasons.push({
          season: player.season,
          sheet: player.sheet,
          goals: player.goals,
          assists: player.assists,
          points: player.points,
          games: player.games
        });
      }
    } else {
      // Ensure the player object has valid name
      player.name = playerName;
      player.seasons = [{
        season: player.season,
        sheet: player.sheet,
        goals: player.goals,
        assists: player.assists,
        points: player.points,
        games: player.games
      }];
      playerMap.set(key, player);
    }
  });
  
  return Array.from(playerMap.values());
}

// Function to extract all statistics with comprehensive player data
export async function getAllStats() {
  try {
    console.log('🔍 Starting Excel analysis...');
    const response = await fetch('/SekTa-Tilastot-24-25.xlsx');
    
    if (!response.ok) {
      console.error('❌ Failed to fetch Excel file:', response.status, response.statusText);
      return null;
    }
    
    console.log('✅ Excel file fetched successfully');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    console.log('📊 Excel workbook loaded. Sheets:', workbook.SheetNames);
    
    const stats = {
      sheets: {},
      players: [],
      seasons: [],
      summary: {
        totalSheets: workbook.SheetNames.length,
        sheetNames: workbook.SheetNames,
        totalPlayers: 0,
        seasonsAvailable: []
      }
    };
    
    const allPlayers = [];
    const seasonsSet = new Set();
    
    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
      console.log(`\n📋 Processing Sheet ${sheetIndex + 1}/${workbook.SheetNames.length}: "${sheetName}"`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log(`   Headers:`, rawData[0]);
      console.log(`   Rows: ${jsonData.length}`);
      
      const season = detectSeason(sheetName, rawData);
      seasonsSet.add(season);
      console.log(`   Detected season: ${season}`);
      
      stats.sheets[sheetName] = {
        name: sheetName,
        data: jsonData,
        rawData: rawData,
        headers: rawData[0] || [],
        rowCount: jsonData.length,
        season: season,
        players: []
      };
      
      // Extract player data from this sheet with more lenient criteria
      jsonData.forEach((row, rowIndex) => {
        if (row && typeof row === 'object') {
          // Try multiple approaches to find player names
          let playerName = findFieldValue(row, PLAYER_STAT_FIELDS.name);
          
          // If no direct name match, look for any string value that could be a name
          if (!playerName) {
            for (const [key, value] of Object.entries(row)) {
              const stringValue = safeStringValue(value);
              if (stringValue.length > 2 && 
                  /^[A-Za-zÀ-ſ\s\.\-]+$/.test(stringValue) && 
                  !key.toLowerCase().includes('kausi') && 
                  !key.toLowerCase().includes('season') &&
                  !key.toLowerCase().includes('päiv') &&
                  !key.toLowerCase().includes('date')) {
                playerName = stringValue;
                console.log(`   📄 Found potential player name in column '${key}': '${stringValue}'`);
                break;
              }
            }
          }
          
          // Special check for Mika in any field
          const hasMika = Object.values(row).some(value => {
            const stringValue = safeStringValue(value);
            return stringValue.toLowerCase().includes('mika');
          });
          
          if (hasMika) {
            console.log(`   🎯 FOUND MIKA in row ${rowIndex + 1}:`, row);
            playerName = playerName || Object.values(row).find(value => {
              const stringValue = safeStringValue(value);
              return stringValue.toLowerCase().includes('mika');
            });
          }
          
          // Check if this row has any numeric stats (indicating it's a player record)
          const hasStats = Object.values(row).some(value => 
            typeof value === 'number' && value >= 0
          );
          
          if (playerName && safeStringValue(playerName) !== '' && hasStats) {
            const cleanPlayerName = safeStringValue(playerName);
            console.log(`   ✅ Extracting player: '${cleanPlayerName}' from row ${rowIndex + 1}`);
            const profile = extractPlayerProfile(row, sheetName, season);
            // Override name if we found it through alternative methods
            if (profile.name === 'Unknown Player' && cleanPlayerName) {
              profile.name = cleanPlayerName;
            }
            allPlayers.push(profile);
            stats.sheets[sheetName].players.push(profile);
            
            if (profile.name.toLowerCase().includes('mika')) {
              console.log(`   ⭐ Extracted Mika profile:`, profile);
            }
          } else if (playerName) {
            console.log(`   ⚠️ Found name '${safeStringValue(playerName)}' but no stats in row ${rowIndex + 1}`);
          }
        }
      });
      
      console.log(`   Players found in this sheet: ${stats.sheets[sheetName].players.length}`);
    });
    
    console.log(`\n🔄 Merging ${allPlayers.length} player records...`);
    
    // Merge and deduplicate player data
    stats.players = mergePlayerData(allPlayers);
    stats.seasons = Array.from(seasonsSet).sort().reverse(); // Latest first
    stats.summary.totalPlayers = stats.players.length;
    stats.summary.seasonsAvailable = stats.seasons;
    
    // Final check for Mika
    const mikaFinal = stats.players.find(p => p.name.toLowerCase().includes('mika'));
    if (mikaFinal) {
      console.log('🎯 FINAL MIKA DATA:', mikaFinal);
    } else {
      console.log('❌ No Mika found in final player list');
      console.log('Available players:', stats.players.map(p => p.name));
    }
    
    console.log('\n📊 Final Processing Results:');
    console.log(`   Total players: ${stats.players.length}`);
    console.log(`   Seasons: ${stats.seasons.join(', ')}`);
    console.log(`   Sheets processed: ${Object.keys(stats.sheets).length}`);
    
    return stats;
  } catch (error) {
    console.error('💥 Error getting comprehensive stats:', error);
    return null;
  }
}

// Function to get stats for specific season
export async function getStatsBySeason(season = '2024-2025') {
  const allStats = await getAllStats();
  if (!allStats) return null;
  
  return {
    ...allStats,
    players: allStats.players.map(player => {
      const seasonData = player.seasons?.find(s => s.season === season);
      if (seasonData) {
        return {
          ...player,
          goals: seasonData.goals,
          assists: seasonData.assists,
          points: seasonData.points,
          games: seasonData.games,
          currentSeason: season
        };
      }
      return player;
    }),
    currentSeason: season
  };
}

// Function to extract season-specific data from Pelaajat - Tilastot sheet
export async function getSeasonPlayerStats(targetSeason = '2024-2025') {
  try {
    const response = await fetch('/SekTa-Tilastot-24-25.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Find the "Pelaajat - Tilastot" sheet
    const playerStatsSheet = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('pelaajat') && name.toLowerCase().includes('tilastot')
    );
    
    if (!playerStatsSheet) {
      console.warn('Pelaajat - Tilastot sheet not found');
      return null;
    }
    
    console.log(`📈 Extracting ${targetSeason} data from ${playerStatsSheet}...`);
    
    const worksheet = workbook.Sheets[playerStatsSheet];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const objectData = XLSX.utils.sheet_to_json(worksheet);
    
    const players = [];
    let currentSeason = null;
    let inTargetSeason = false;
    
    // Process the data looking for season sections
    rawData.forEach((row, index) => {
      if (Array.isArray(row) && row.length > 0) {
        // Check if this row contains a season identifier
        const rowText = row.join(' ').toLowerCase();
        
        // Look for season patterns
        for (const [season, patterns] of Object.entries(SEASON_PATTERNS.historical)) {
          if (patterns.some(pattern => rowText.includes(pattern))) {
            currentSeason = season;
            inTargetSeason = (season === targetSeason);
            console.log(`📅 Found season section: ${season} (target: ${inTargetSeason})`);
            return;
          }
        }
        
        // Check for current/previous seasons
        if (SEASON_PATTERNS.current.some(pattern => rowText.includes(pattern))) {
          currentSeason = '2024-2025';
          inTargetSeason = (targetSeason === '2024-2025' || targetSeason === '2024-25');
          console.log(`📅 Found current season section: 2024-2025 (target: ${inTargetSeason})`);
          return;
        }
        
        if (SEASON_PATTERNS.previous.some(pattern => rowText.includes(pattern))) {
          currentSeason = '2023-2024';
          inTargetSeason = (targetSeason === '2023-2024' || targetSeason === '2023-24');
          console.log(`📅 Found previous season section: 2023-2024 (target: ${inTargetSeason})`);
          return;
        }
        
        // If we're in the target season and this looks like player data
        if (inTargetSeason && row.length >= 3) {
          const playerName = safeStringValue(row[0] || row[1]);
          
          if (playerName.length > 2 && 
              /^[A-Za-zÀ-ſ\s\.\-,]+$/.test(playerName) &&
              !playerName.toLowerCase().includes('kausi') &&
              !playerName.toLowerCase().includes('yhteensä') &&
              !playerName.toLowerCase().includes('ottelu')) {
            
            // Extract stats from the row
            const games = safeNumberValue(row[1] || row[2]);
            const goals = safeNumberValue(row[2] || row[3]);
            const assists = safeNumberValue(row[3] || row[4]);
            const points = safeNumberValue(row[4] || row[5]);
            
            if (games > 0 || goals > 0 || assists > 0 || points > 0) {
              const player = {
                name: playerName,
                season: targetSeason,
                games: games,
                goals: goals,
                assists: assists,
                points: points || (goals + assists),
                sheet: playerStatsSheet,
                rowIndex: index
              };
              
              players.push(player);
              
              // Special log for Mika
              if (playerName.toLowerCase().includes('mika')) {
                console.log(`⭐ Found Mika in ${targetSeason}:`, player);
              }
            }
          }
        }
      }
    });
    
    console.log(`🏆 Extracted ${players.length} players for season ${targetSeason}`);
    
    return {
      season: targetSeason,
      players: players,
      totalPlayers: players.length,
      totalGoals: players.reduce((sum, p) => sum + p.goals, 0),
      totalAssists: players.reduce((sum, p) => sum + p.assists, 0),
      totalPoints: players.reduce((sum, p) => sum + p.points, 0),
      totalGames: players.reduce((sum, p) => sum + p.games, 0)
    };
    
  } catch (error) {
    console.error(`Error extracting season data for ${targetSeason}:`, error);
    return null;
  }
}

// Function to extract all available seasons from Excel data
export async function getAvailableSeasons() {
  try {
    const response = await fetch('/SekTa-Tilastot-24-25.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const seasonsSet = new Set();
    
    // Check all sheet names for season patterns
    workbook.SheetNames.forEach(sheetName => {
      const detectedSeason = detectSeason(sheetName, []);
      if (detectedSeason !== 'multi-season' && detectedSeason !== '2024-2025') {
        seasonsSet.add(detectedSeason);
      }
    });
    
    // Add current season
    seasonsSet.add('2024-2025');
    
    // Check "Pelaajat - Tilastot" sheet for historical data
    const playerStatsSheet = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('pelaajat') && name.toLowerCase().includes('tilastot')
    );
    
    if (playerStatsSheet) {
      console.log(`🔍 Analyzing ${playerStatsSheet} for season data...`);
      const worksheet = workbook.Sheets[playerStatsSheet];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Look for season indicators in the data
      rawData.forEach((row, index) => {
        if (Array.isArray(row)) {
          row.forEach(cell => {
            if (typeof cell === 'string') {
              // Check for season patterns in the data
              for (const [season, patterns] of Object.entries(SEASON_PATTERNS.historical)) {
                if (patterns.some(pattern => cell.includes(pattern))) {
                  seasonsSet.add(season);
                  console.log(`📅 Found season ${season} in data: "${cell}"`);
                }
              }
            }
          });
        }
      });
    }
    
    // Convert to sorted array (latest first)
    const seasons = Array.from(seasonsSet).sort((a, b) => {
      const yearA = parseInt(a.split('-')[0]) + 2000;
      const yearB = parseInt(b.split('-')[0]) + 2000;
      return yearB - yearA;
    });
    
    console.log('📊 Available seasons found:', seasons);
    return seasons;
  } catch (error) {
    console.error('Error getting available seasons:', error);
    return ['2024-2025', '2023-2024']; // Fallback
  }
}

// Function to extract Pelaajat-Tilastot sheet and create CSV
export async function createCSVFromExcel() {
  try {
    console.log('📁 Creating CSV from Pelaajat - Tilastot sheet...');
    const response = await fetch('/SekTa-Tilastot-24-25.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Find the "Pelaajat - Tilastot" sheet
    const playerStatsSheet = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('pelaajat') && 
      name.toLowerCase().includes('tilastot') && 
      !name.toLowerCase().includes('vanha')
    );
    
    if (!playerStatsSheet) {
      throw new Error('Pelaajat - Tilastot sheet not found');
    }
    
    console.log(`📊 Found sheet: "${playerStatsSheet}"`);
    
    const worksheet = workbook.Sheets[playerStatsSheet];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📋 Sheet has ${rawData.length} rows`);
    console.log('First 10 rows:', rawData.slice(0, 10));
    
    // Convert to CSV format
    let csvContent = '';
    rawData.forEach(row => {
      if (Array.isArray(row)) {
        // Escape commas and quotes in cell content
        const escapedRow = row.map(cell => {
          if (cell === null || cell === undefined) return '';
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        });
        csvContent += escapedRow.join(',') + '\n';
      }
    });
    
    console.log('📄 CSV content created, length:', csvContent.length);
    console.log('First 500 chars of CSV:', csvContent.substring(0, 500));
    
    // Create downloadable CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pelaajat-tilastot.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ CSV file created and downloaded: pelaajat-tilastot.csv');
    
    // Also save to localStorage for immediate use
    localStorage.setItem('pelaajat-tilastot-csv', csvContent);
    console.log('💾 CSV data saved to localStorage');
    
    return { success: true, csvContent: csvContent, rowCount: rawData.length };
    
  } catch (error) {
    console.error('❌ Error creating CSV:', error);
    return { success: false, error: error.message };
  }
}

// Function to create a test CSV file with multiple seasons for debugging
export function createTestCSV() {
  // Create complex CSV format with multiple divisions and comprehensive player data
  const csvContent = `,,O,M,S,P,J,VM,YV,AV,RL-,RL+,SR,TV,H,TM,IM
KAUSI 2024-2025,Regular Season,,,,,,,,,,,,,,,,
PELAAJAT,O,M,S,P,J,VM,YV,AV,RL-,RL+,SR,TV,H,TM,IM
,"Aaltonen, Mika",21,14,4,18,1,1,2,0,0,0,0,0,1,1,0
,"Vikman, Petri",18,8,12,20,2,0,1,0,0,0,0,0,0,2,0
,"Oja-Nisula, Miika",19,6,9,15,0,0,0,0,0,0,0,0,1,0,0
,"Nykänen, Akseli",15,12,3,15,3,0,2,0,0,0,0,0,0,3,0
,"Laine, Jukka-Pekka",20,5,8,13,1,0,1,0,0,0,0,0,2,1,0
,"Tuokko, Aleksi",17,9,4,13,2,0,2,0,0,0,0,0,1,2,0
,"Vainio, Joni",16,7,5,12,0,0,1,0,0,0,0,0,0,0,0
,"Laaksonen, Jimi",14,4,7,11,1,0,0,0,0,0,0,0,1,1,0
,"Halme, Vesa",22,2,8,10,4,0,0,0,0,0,0,0,3,4,0
,"Kiilunen, Juha",20,1,6,7,3,0,1,0,0,0,0,0,1,3,0
,"Mäenranta, Ville",18,3,3,6,2,0,0,0,0,0,0,0,1,2,0
,"Kananen, Henri",16,1,4,5,1,0,0,0,0,0,0,0,0,1,0
,"Virtanen, Joonas",12,2,2,4,0,0,0,0,0,0,0,0,0,0,0

,,,,,,,,,,,,,,,,
KAUSI 2024-2025,III-DIV - LR LOHKO A,,,MAALIVAHDIT,,,,,,,,,,,,
,O,T%,PMO,T,PM,V,NP,,,,,,,,,,
,"Ahven, Mika (MV)",14,0.618867,3.428571,265,48,8,0
,"Virta, Matias (MV)",8,0.748427,5.125,159,40,1,0
,,,,,,,,,,,,,,,,
KAUSI 2023-2024,IV-DIV - LR LOHKO A,,,,,,,,,,,,,,,,
PELAAJAT,O,M,S,P,J,VM,YV,AV,RL-,RL+,SR,TV,H,TM,IM
,"Aaltonen, Mika",21,14,4,18,1,1,2,0,0,0,0,0,1,1,0
,"Vikman, Petri",18,8,12,20,2,0,1,0,0,0,0,0,0,2,0
,"Oja-Nisula, Miika",19,6,9,15,0,0,0,0,0,0,0,0,1,0,0
,"Nykänen, Akseli",15,12,3,15,3,0,2,0,0,0,0,0,0,3,0
,"Laine, Jukka-Pekka",20,5,8,13,1,0,1,0,0,0,0,0,2,1,0
,"Tuokko, Aleksi",17,9,4,13,2,0,2,0,0,0,0,0,1,2,0
,"Nieminen, Kalle",16,3,5,8,1,0,0,0,0,0,0,0,1,1,0
,"Korhonen, Jari",14,2,4,6,2,0,0,0,0,0,0,0,0,2,0
,"Ahven, Mika",12,0,0,0,0,0,0,0,0,0,0,0,0,0,0
,"Virta, Matias",10,0,0,0,0,0,0,0,0,0,0,0,0,0,0
,,,,,,,,,,,,,,,,
KAUSI 2023-2024,MAALIVAHDIT IV-DIV - LR LOHKO A,,,,,,,,,,,,,,,,
MAALIVAHDIT,O,T%,PMO,T,PM,V,NP,,,,,,,,,,
,"Ahven, Mika",12,92.8,2.5,128,30,6,1
,,,,,,,,,,,,,,,,
KAUSI 2023-2024,III-DIV - Karsinnat,,,,,,,,,,,,,,,,
PELAAJAT,O,M,S,P,J,VM,YV,AV,RL-,RL+,SR,TV,H,TM,IM
,"Aaltonen, Mika",15,8,6,14,0,0,1,0,0,0,0,0,0,0,0
,"Vikman, Petri",14,5,7,12,1,0,0,0,0,0,0,0,1,1,0
,"Tuokko, Aleksi",12,9,2,11,2,0,1,0,0,0,0,0,0,2,0
,"Vainio, Joni",13,4,6,10,0,0,0,0,0,0,0,0,2,0,0
,"Laaksonen, Jimi",11,3,4,7,1,0,0,0,0,0,0,0,0,1,0
,"Mäkelä, Antti",10,2,3,5,0,0,0,0,0,0,0,0,1,0,0
,"Ahven, Mika",8,0,0,0,0,0,0,0,0,0,0,0,0,0,0
,"Virta, Matias",6,0,0,0,0,0,0,0,0,0,0,0,0,0,0
,,,,,,,,,,,,,,,,
KAUSI 2023-2024,MAALIVAHDIT III-DIV - Karsinnat,,,,,,,,,,,,,,,,
MAALIVAHDIT,O,T%,PMO,T,PM,V,NP,,,,,,,,,,
,"Ahven, Mika",8,89.5,3.1,95,25,4,0
,"Virta, Matias",6,87.3,3.5,72,21,2,0
,,,,,,,,,,,,,,,,
KAUSI 2023-2024,IV-DIV + KARS,,,,,,,,,,,,,,,,
PELAAJAT,O,M,S,P,J,VM,YV,AV,RL-,RL+,SR,TV,H,TM,IM
,"Aaltonen, Mika",18,10,8,18,1,0,2,0,0,0,0,0,1,1,0
,"Laaksonen, Jimi",16,7,5,12,1,0,1,0,0,0,0,0,0,1,0
,"Halme, Vesa",20,2,10,12,4,0,0,0,0,0,0,0,3,4,0
,"Kiilunen, Juha",17,3,7,10,3,0,1,0,0,0,0,0,1,3,0
,"Mäenranta, Ville",15,4,4,8,2,0,0,0,0,0,0,0,1,2,0
,"Laitinen, Sami",12,1,3,4,1,0,0,0,0,0,0,0,0,1,0
,"Ahven, Mika",10,0,0,0,0,0,0,0,0,0,0,0,0,0,0
,"Virta, Matias",8,0,0,0,0,0,0,0,0,0,0,0,0,0,0
,,,,,,,,,,,,,,,,
KAUSI 2023-2024,MAALIVAHDIT IV-DIV + KARS,,,,,,,,,,,,,,,,
MAALIVAHDIT,O,T%,PMO,T,PM,V,NP,,,,,,,,,,
,"Ahven, Mika",10,91.3,2.8,118,28,5,1
,"Virta, Matias",8,89.2,3.1,75,25,3,0
,,,,,,,,,,,,,,,,
KAUSI 2022-2023,Regular Season,,,,,,,,,,,,,,,,
PELAAJAT,O,M,S,P,J,VM,YV,AV,RL-,RL+,SR,TV,H,TM,IM
,"Aaltonen, Mika",20,15,6,21,1,0,3,0,0,0,0,0,1,1,0
,"Vikman, Petri",18,10,10,20,0,0,2,0,0,0,0,0,0,0,0
,"Oja-Nisula, Miika",16,5,7,12,1,0,1,0,0,0,0,0,1,1,0
,"Nykänen, Akseli",15,8,4,12,1,0,1,0,0,0,0,0,0,1,0
,"Laine, Jukka-Pekka",19,4,6,10,2,0,0,0,0,0,0,0,2,2,0
,"Tuokko, Aleksi",14,7,3,10,1,0,1,0,0,0,0,0,1,1,0
,"Järvinen, Mikko",13,3,4,7,0,0,0,0,0,0,0,0,1,0,0
,"Ahven, Mika",18,0,0,0,0,0,0,0,0,0,0,0,0,0,0
,"Virta, Matias",14,0,0,0,0,0,0,0,0,0,0,0,0,0,0
,,,,,,,,,,,,,,,,
KAUSI 2022-2023,MAALIVAHDIT Regular Season,,,,,,,,,,,,,,,,
MAALIVAHDIT,O,T%,PMO,T,PM,V,NP,,,,,,,,,,
,"Ahven, Mika",18,93.7,2.2,168,39,10,3
,"Virta, Matias",14,92.1,2.5,145,35,8,2`;
  
  console.log('📄 Creating comprehensive multi-division test CSV...');
  
  // Save to localStorage
  localStorage.setItem('pelaajat-tilastot-csv', csvContent);
  
  // Also create downloadable file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'sekta-players-comprehensive.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('✅ Comprehensive multi-division test CSV created and saved!');
  console.log('📊 Expected seasons:');
  console.log('  - 2024-2025 (Regular Season) - 13 players (including Mika Ahven as goalie)');
  console.log('  - 2023-2024 (IV-DIV LR LOHKO A) - 9 players (including Mika Ahven as goalie)');
  console.log('  - 2023-2024 (III-DIV Karsinnat) - 7 players (including Mika Ahven as goalie)');
  console.log('  - 2023-2024 (IV-DIV KARS) - 7 players (including Mika Ahven as goalie)');
  console.log('  - 2022-2023 (Regular Season) - 8 players (including Mika Ahven as goalie)');
  console.log('ℹ️ Note: Mika Ahven is a goalie with 0 goals and 0 assists in all seasons');
  console.log('ℹ️ Note: Some players appear in multiple seasons, some only in specific seasons');
  
  return { success: true, csvContent: csvContent };
}

// Function to parse CSV data and extract player statistics
export function parseCSVPlayerStats(csvContent) {
  try {
    console.log('📊 Parsing CSV player statistics...');
    
    const lines = csvContent.split('\n').filter(line => line.trim());
    console.log(`📋 CSV has ${lines.length} lines`);
    
    if (lines.length === 0) return [];
    
    // Check if this is the new multi-season format or the old format
    const firstLine = lines[0].toLowerCase();
    const isMultiSeasonFormat = firstLine.includes('season') && firstLine.includes('player');
    
    if (isMultiSeasonFormat) {
      return parseMultiSeasonCSV(lines);
    } else {
      return parseOriginalFormatCSV(lines);
    }
    
  } catch (error) {
    console.error('❌ Error parsing CSV:', error);
    return [];
  }
}

// Parse the new multi-season CSV format
function parseMultiSeasonCSV(lines) {
  console.log('📅 Parsing multi-season CSV format...');
  const players = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    if (cells.length < 6) continue;
    
    // Format: Season,Player,Games,Goals,Assists,Points,Penalties
    const season = safeStringValue(cells[0]);
    const playerNameRaw = safeStringValue(cells[1]);
    const games = safeNumberValue(cells[2]);
    const goals = safeNumberValue(cells[3]);
    const assists = safeNumberValue(cells[4]);
    const points = safeNumberValue(cells[5]);
    const penalties = safeNumberValue(cells[6]);
    
    if (playerNameRaw.length < 3) continue;
    
    // Convert "Surname, Firstname" to "Firstname Surname"
    const nameParts = playerNameRaw.includes(',') ? 
      playerNameRaw.split(',').map(part => part.trim()) : [playerNameRaw];
    const playerName = nameParts.length >= 2 ? `${nameParts[1]} ${nameParts[0]}` : playerNameRaw;
    
    // Validate reasonable hockey stats
    if (goals > 100 || assists > 150 || points > 200 || games > 100) {
      console.log(`⚠️ Skipping ${playerName} - unrealistic stats:`, { goals, assists, points, games });
      continue;
    }
    
    // Only include players with some stats
    if (games > 0 || goals > 0 || assists > 0) {
      const player = {
        name: playerName,
        season: season,
        games: games,
        goals: goals,
        assists: assists,
        points: points,
        penalties: penalties,
        source: 'csv-multseason',
        lineNumber: i + 1
      };
      
      players.push(player);
      
      // Special logging for Mika
      if (playerName.toLowerCase().includes('mika')) {
        console.log(`🎯 MIKA in CSV (${season}) - Line ${i + 1}:`, player);
      }
    }
  }
  
  console.log(`✅ Parsed ${players.length} player records from multi-season CSV`);
  return players;
}

// Parse the original format CSV with complex headers
function parseOriginalFormatCSV(lines) {
  console.log('📄 Parsing original/complex CSV format...');
  const players = [];
  
  // Find header lines that contain season information
  let currentSeason = '2024-2025';
  let seasonSections = [];
  
  // First pass: identify season sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('KAUSI') || line.includes('kausi')) {
      // Extract season from header like "KAUSI 2023-2024,IV-DIV - LR LOHKO A"
      const seasonMatch = line.match(/KAUSI\s*(\d{4}-\d{4})/i) || line.match(/(\d{4}-\d{4})/);
      if (seasonMatch) {
        const baseYear = seasonMatch[1];
        
        // Extract division and create unique season identifier
        let divisionInfo = 'Unknown';
        let uniqueSeasonId = baseYear;
        
        if (line.includes('III-DIV')) {
          divisionInfo = 'III-DIV';
          if (line.includes('Karsinnat')) {
            divisionInfo += ' - Karsinnat';
            uniqueSeasonId = `${baseYear} (III-DIV Karsinnat)`;
          } else {
            uniqueSeasonId = `${baseYear} (III-DIV)`;
          }
        } else if (line.includes('IV-DIV')) {
          if (line.includes('LR LOHKO A')) {
            divisionInfo = 'IV-DIV - LR LOHKO A';
            uniqueSeasonId = `${baseYear} (IV-DIV LR LOHKO A)`;
          } else if (line.includes('KARS')) {
            divisionInfo = 'IV-DIV + KARS';
            uniqueSeasonId = `${baseYear} (IV-DIV KARS)`;
          } else {
            divisionInfo = 'IV-DIV';
            uniqueSeasonId = `${baseYear} (IV-DIV)`;
          }
        }
        
        // Check if this is a goalie section - handle multiple patterns
        const isGoalieSection = line.toLowerCase().includes('maalivahdit') || 
                               line.toLowerCase().includes('goalie') ||
                               line.toLowerCase().includes('maalivahti') ||
                               line.includes(',,,MAALIVAHDIT') ||
                               line.includes(',,MAALIVAHDIT');
        
        console.log(`🔍 Checking line for goalie section: "${line}" -> isGoalie: ${isGoalieSection}`);
        
        seasonSections.push({
          season: uniqueSeasonId,  // Use unique identifier
          baseYear: baseYear,     // Keep original year
          division: divisionInfo,
          headerLine: i,
          fullHeader: line,
          isGoalieSection: isGoalieSection
        });
        console.log(`📅 Found season section: ${uniqueSeasonId} (${divisionInfo}) ${isGoalieSection ? '[GOALIES]' : '[PLAYERS]'} at line ${i}`);
      }
    }
  }
  
  console.log('🗺️ Season sections found:', seasonSections);
  
  // Process each season section
  seasonSections.forEach((section, sectionIndex) => {
    const startLine = section.headerLine + 1;
    const endLine = sectionIndex < seasonSections.length - 1 ? 
                   seasonSections[sectionIndex + 1].headerLine : lines.length;
    
    console.log(`📄 Processing ${section.season} ${section.division} ${section.isGoalieSection ? '[GOALIES]' : '[PLAYERS]'} from line ${startLine} to ${endLine}`);
    
    // Find the column headers for this section
    let headerRowIndex = -1;
    for (let i = startLine; i < Math.min(startLine + 3, endLine); i++) {
      if (lines[i]) {
        const line = lines[i].toLowerCase();
        if (section.isGoalieSection) {
          // Look for goalie headers: O,T%,PMO,T,PM,V,NP or just ,O,T%,PMO
          if (line.includes('o,t%,pmo') || line.includes(',o,t%,pmo') || line.includes('maalivahdit')) {
            headerRowIndex = i;
            console.log(`🥅 Found goalie header at line ${i}: ${lines[i]}`);
            break;
          }
        } else {
          // Look for regular player headers: O,M,S,P
          if (line.includes('o,m,s,p') || line.includes('pelaajat')) {
            headerRowIndex = i;
            console.log(`⚽ Found player header at line ${i}: ${lines[i]}`);
            break;
          }
        }
      }
    }
    
    if (headerRowIndex === -1) {
      console.log(`⚠️ No header row found for ${section.season} ${section.division}`);
      return;
    }
    
    // Process player data rows for this section
    for (let i = headerRowIndex + 1; i < endLine; i++) {
      const line = lines[i];
      if (!line || line.trim() === '' || line.includes('KAUSI')) continue;
      
      const cells = parseCSVLine(line);
      if (cells.length < 6) continue;
      
      // Extract player name (usually in first or second column)
      let playerNameRaw = '';
      let nameColumnIndex = -1;
      
      // Look for the name in first few columns
      for (let col = 0; col < Math.min(3, cells.length); col++) {
        const cellValue = safeStringValue(cells[col]);
        if (cellValue.length > 3 && /^[A-Za-zÀ-ſ\s\.,\-]+$/.test(cellValue) && 
            !cellValue.includes('KAUSI') && !cellValue.toLowerCase().includes('pelaajat') && 
            !cellValue.toLowerCase().includes('maalivahdit')) {
          playerNameRaw = cellValue;
          nameColumnIndex = col;
          break;
        }
      }
      
      if (!playerNameRaw || nameColumnIndex === -1) continue;
      
      // Convert name format and clean up (MV) indicators
      let playerName = playerNameRaw.includes(',') ? 
        playerNameRaw.split(',').map(part => part.trim()).reverse().join(' ') : 
        playerNameRaw;
      
      // Remove (MV) or other position indicators from name
      playerName = playerName.replace(/\s*\([^)]*\)\s*/g, '').trim();
      
      console.log(`📝 Processing player: "${playerNameRaw}" -> "${playerName}" in ${section.isGoalieSection ? 'GOALIE' : 'PLAYER'} section`);
      
      
      let player;
      
      if (section.isGoalieSection) {
        // Parse goalie stats: O, T%, PMO, T, PM, V, NP
        const statsStart = nameColumnIndex + 1;
        const games = safeNumberValue(cells[statsStart]);
        let savePercentage = safeNumberValue(cells[statsStart + 1]);
        const goalsAgainstAverage = safeNumberValue(cells[statsStart + 2]);
        const saves = safeNumberValue(cells[statsStart + 3]);
        const goalsAgainst = safeNumberValue(cells[statsStart + 4]);
        const wins = safeNumberValue(cells[statsStart + 5]);
        const shutouts = safeNumberValue(cells[statsStart + 6]);
        
        // Convert decimal save percentage to percentage (0.618 -> 61.8%)
        if (savePercentage > 0 && savePercentage < 1) {
          savePercentage = savePercentage * 100;
        }
        
        player = {
          name: playerName,
          season: section.season,
          baseYear: section.baseYear,
          division: section.division,
          position: 'Maalivahti',
          games: games,
          goals: 0,  // Goalies don't score
          assists: 0,  // Goalies don't get assists
          points: 0,  // Goalies don't get points
          penalties: 0,
          // Goalie-specific stats
          savePercentage: savePercentage,
          goalsAgainstAverage: goalsAgainstAverage,
          saves: saves,
          goalsAgainst: goalsAgainst,
          wins: wins,
          shutouts: shutouts,
          source: 'csv-complex-goalie',
          lineNumber: i + 1
        };
        
        console.log(`🥅 PARSED GOALIE: ${playerName} in ${section.season}:`, player);
      } else {
        // Parse regular player stats: O, M, S, P, J, etc.
        const statsStart = nameColumnIndex + 1;
        const games = safeNumberValue(cells[statsStart]);
        const goals = safeNumberValue(cells[statsStart + 1]);
        const assists = safeNumberValue(cells[statsStart + 2]);
        const points = safeNumberValue(cells[statsStart + 3]);
        const penalties = safeNumberValue(cells[statsStart + 4]);
        
        // Validate reasonable hockey stats
        if (goals > 200 || assists > 300 || points > 400 || games > 100) {
          console.log(`⚠️ Skipping ${playerName} - unrealistic stats:`, { goals, assists, points, games });
          continue;
        }
        
        player = {
          name: playerName,
          season: section.season,
          baseYear: section.baseYear,
          division: section.division,
          games: games,
          goals: goals,
          assists: assists,
          points: points,
          penalties: penalties,
          source: 'csv-complex',
          lineNumber: i + 1
        };
      }
      
      // Only include players with some stats
      if (player.games > 0 || player.goals > 0 || player.assists > 0 || player.saves > 0) {
        players.push(player);
        
        // Special logging for Mika
        if (playerName.toLowerCase().includes('mika')) {
          console.log(`🎯 MIKA in ${section.season} ${section.division} ${section.isGoalieSection ? '[GOALIE]' : '[PLAYER]'} - Line ${i + 1}:`, player);
        }
      }
    }
  });
  
  console.log(`✅ Parsed ${players.length} players from complex CSV format`);
  return players;
}

// Helper function to parse a CSV line handling quoted values
function parseCSVLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  cells.push(current.trim());
  return cells;
}

// Function to get player stats for a specific season from CSV
export async function getPlayerStatsForSeason(targetSeason = '2024-2025') {
  try {
    const allData = await getPlayerStatsFromCSV();
    if (!allData || !allData.players) return { players: [], seasons: [targetSeason] };
    
    console.log(`📅 Getting stats for season: ${targetSeason}`);
    console.log(`📊 Available seasons: ${allData.seasons.join(', ')}`);
    
    const seasonPlayers = allData.players.map(player => {
      // Find the season data for this player - handle both exact match and partial match
      let seasonData = player.seasons?.find(s => s.season === targetSeason);
      
      // If no exact match, try partial matching for base year
      if (!seasonData && targetSeason.includes('-')) {
        const targetYear = targetSeason.split('(')[0].trim(); // Extract base year like "2023-2024"
        seasonData = player.seasons?.find(s => 
          s.season.includes(targetYear) || 
          (s.baseYear && s.baseYear === targetYear)
        );
      }
      
      if (seasonData) {
        const playerForSeason = {
          ...player,
          games: seasonData.games,
          goals: seasonData.goals,
          assists: seasonData.assists,
          points: seasonData.points,
          penalties: seasonData.penalties,
          season: seasonData.season,  // Use the full season identifier
          division: seasonData.division,
          baseYear: seasonData.baseYear
        };
        
        // Add goalie-specific stats if applicable
        if (seasonData.position === 'Maalivahti' || player.position === 'Maalivahti') {
          playerForSeason.position = 'Maalivahti';
          playerForSeason.savePercentage = seasonData.savePercentage || player.savePercentage;
          playerForSeason.goalsAgainstAverage = seasonData.goalsAgainstAverage || player.goalsAgainstAverage;
          playerForSeason.saves = seasonData.saves || player.saves;
          playerForSeason.goalsAgainst = seasonData.goalsAgainst || player.goalsAgainst;
          playerForSeason.wins = seasonData.wins || player.wins;
          playerForSeason.shutouts = seasonData.shutouts || player.shutouts;
        }
        
        return playerForSeason;
      }
      
      // If no data for this season, return null
      return null;
    }).filter(Boolean); // Remove null entries
    
    console.log(`✅ Found ${seasonPlayers.length} players for season ${targetSeason}`);
    
    // Log a sample to verify the data
    if (seasonPlayers.length > 0) {
      console.log('🔍 Sample player data:', seasonPlayers[0]);
    }
    
    return {
      players: seasonPlayers,
      seasons: allData.seasons,
      totalPlayers: seasonPlayers.length,
      source: 'csv-season-specific'
    };
    
  } catch (error) {
    console.error(`❌ Error getting stats for season ${targetSeason}:`, error);
    return { players: [], seasons: [targetSeason] };
  }
}

// Function to get player stats from CSV (replaces Excel reading)
export async function getPlayerStatsFromCSV() {
  try {
    console.log('📊 Loading player stats from CSV...');
    
    // First try to get from localStorage
    let csvContent = localStorage.getItem('pelaajat-tilastot-csv');
    
    if (!csvContent) {
      console.log('💾 No CSV in localStorage, trying to create from Excel...');
      const result = await createCSVFromExcel();
      if (result.success) {
        csvContent = result.csvContent;
      } else {
        throw new Error('Could not create CSV from Excel: ' + result.error);
      }
    }
    
    if (!csvContent) {
      throw new Error('No CSV content available');
    }
    
    console.log('📄 Using CSV content, length:', csvContent.length);
    
    const allPlayers = parseCSVPlayerStats(csvContent);
    
    // Group players by season and extract available seasons
    const seasonsSet = new Set();
    const playersByName = new Map();
    
    allPlayers.forEach(player => {
      seasonsSet.add(player.season);
      
      const key = player.name.toLowerCase();
      if (!playersByName.has(key)) {
        // Create player record based on whether it's a goalie or regular player
        const baseRecord = {
          name: player.name,
          seasons: [],
          // Latest season stats as primary
          games: player.games,
          goals: player.goals,
          assists: player.assists,
          points: player.points,
          penalties: player.penalties,
          season: player.season
        };
        
        // Add goalie-specific properties if this is a goalie
        if (player.position === 'Maalivahti') {
          baseRecord.position = 'Maalivahti';
          baseRecord.savePercentage = player.savePercentage;
          baseRecord.goalsAgainstAverage = player.goalsAgainstAverage;
          baseRecord.saves = player.saves;
          baseRecord.goalsAgainst = player.goalsAgainst;
          baseRecord.wins = player.wins;
          baseRecord.shutouts = player.shutouts;
          console.log(`🥅 CREATED GOALIE RECORD: ${player.name}:`, baseRecord);
        }
        
        playersByName.set(key, baseRecord);
      }
      
      const playerRecord = playersByName.get(key);
      
      // Create season record with appropriate stats
      const seasonRecord = {
        season: player.season,
        baseYear: player.baseYear,  // Include base year for sorting
        division: player.division,   // Include division info
        games: player.games,
        goals: player.goals,
        assists: player.assists,
        points: player.points,
        penalties: player.penalties
      };
      
      // Add goalie-specific stats to season record if applicable
      if (player.position === 'Maalivahti') {
        seasonRecord.position = 'Maalivahti';
        seasonRecord.savePercentage = player.savePercentage;
        seasonRecord.goalsAgainstAverage = player.goalsAgainstAverage;
        seasonRecord.saves = player.saves;
        seasonRecord.goalsAgainst = player.goalsAgainst;
        seasonRecord.wins = player.wins;
        seasonRecord.shutouts = player.shutouts;
      }
      
      playerRecord.seasons.push(seasonRecord);
      
      // Use the latest season as primary stats (prefer 2024-2025 or most recent)
      const currentSeasonYear = player.baseYear || player.season;
      const recordSeasonYear = playerRecord.season.includes('2024') ? '2024-2025' : playerRecord.season;
      
      if (currentSeasonYear === '2024-2025' || 
          (currentSeasonYear > recordSeasonYear && !recordSeasonYear.includes('2024'))) {
        playerRecord.games = player.games;
        playerRecord.goals = player.goals;
        playerRecord.assists = player.assists;
        playerRecord.points = player.points;
        playerRecord.penalties = player.penalties;
        playerRecord.season = player.season;
        
        // Update goalie-specific stats if this is a goalie
        if (player.position === 'Maalivahti') {
          playerRecord.position = 'Maalivahti';
          playerRecord.savePercentage = player.savePercentage;
          playerRecord.goalsAgainstAverage = player.goalsAgainstAverage;
          playerRecord.saves = player.saves;
          playerRecord.goalsAgainst = player.goalsAgainst;
          playerRecord.wins = player.wins;
          playerRecord.shutouts = player.shutouts;
        }
      }
    });
    
    // Sort seasons by year (descending) and then by division
    const availableSeasons = Array.from(seasonsSet).sort((a, b) => {
      // Extract base year for sorting
      const yearA = a.match(/\d{4}/) ? parseInt(a.match(/\d{4}/)[0]) : 0;
      const yearB = b.match(/\d{4}/) ? parseInt(b.match(/\d{4}/)[0]) : 0;
      
      if (yearA !== yearB) {
        return yearB - yearA; // Latest year first
      }
      
      // If same year, sort by division (III-DIV before IV-DIV)
      if (a.includes('III-DIV') && b.includes('IV-DIV')) return -1;
      if (a.includes('IV-DIV') && b.includes('III-DIV')) return 1;
      
      return a.localeCompare(b); // Alphabetical fallback
    });
    const players = Array.from(playersByName.values());
    
    console.log(`✅ Processed ${players.length} unique players across ${availableSeasons.length} seasons`);
    console.log('📅 Available seasons:', availableSeasons);
    
    return {
      players: players,
      seasons: availableSeasons,
      totalPlayers: players.length,
      source: 'csv-multseason'
    };
    
  } catch (error) {
    console.error('💥 Error loading CSV stats:', error);
    return { players: [], seasons: ['2024-2025'], source: 'csv-error' };
  }
}
export async function debugExcelData() {
  try {
    const response = await fetch('/SekTa-Tilastot-24-25.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    console.log('=== EXCEL DEBUG START ===');
    console.log('Available sheets:', workbook.SheetNames);
    
    // Check each sheet
    workbook.SheetNames.forEach(sheetName => {
      console.log(`\n--- SHEET: ${sheetName} ---`);
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log(`Rows: ${rawData.length}`);
      console.log('First 8 rows:');
      rawData.slice(0, 8).forEach((row, idx) => {
        console.log(`  [${idx}]:`, row);
      });
      
      // Look for Mika specifically
      rawData.forEach((row, idx) => {
        if (Array.isArray(row)) {
          const hasMika = row.some(cell => 
            typeof cell === 'string' && cell.toLowerCase().includes('mika')
          );
          if (hasMika) {
            console.log(`  >>> MIKA found at row ${idx}:`, row);
          }
        }
      });
    });
    
    console.log('=== EXCEL DEBUG END ===');
    return { success: true, sheets: workbook.SheetNames };
  } catch (error) {
    console.error('Debug error:', error);
    return { success: false, error: error.message };
  }
}

// Function to extract player statistics specifically from "Pelaajat - Tilastot" sheet
export async function getPlayerStatsFromMainSheet() {
  try {
    console.log('🔍 Loading ONLY from Pelaajat - Tilastot sheet...');
    const response = await fetch('/SekTa-Tilastot-24-25.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    console.log('📁 All available sheets:', workbook.SheetNames);
    
    // Find the exact "Pelaajat - Tilastot" sheet
    const playerStatsSheet = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('pelaajat') && 
      name.toLowerCase().includes('tilastot') && 
      !name.toLowerCase().includes('vanha')
    );
    
    if (!playerStatsSheet) {
      console.error('❌ "Pelaajat - Tilastot" sheet not found');
      console.log('Available sheets:', workbook.SheetNames);
      return { players: [], seasons: ['2024-2025'] };
    }
    
    console.log(`📊 Processing ONLY sheet: "${playerStatsSheet}"`);
    
    const worksheet = workbook.Sheets[playerStatsSheet];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📋 Sheet has ${rawData.length} total rows`);
    console.log('📋 First 15 rows for analysis:');
    rawData.slice(0, 15).forEach((row, idx) => {
      console.log(`Row ${idx}:`, row);
    });
    
    const players = [];
    
    // Find header row to understand column structure
    let headerRowIndex = -1;
    let columnMapping = {};
    
    for (let i = 0; i < Math.min(10, rawData.length); i++) {
      const row = rawData[i];
      if (Array.isArray(row)) {
        const rowText = row.join(' ').toLowerCase();
        // Look for common Finnish hockey stat headers
        if (rowText.includes('nimi') || rowText.includes('pelaaja') || 
            rowText.includes('maalit') || rowText.includes('syötöt') ||
            rowText.includes('pisteet') || rowText.includes('ottelu')) {
          headerRowIndex = i;
          console.log(`🎯 Found header row at index ${i}:`, row);
          
          // Map columns based on Finnish headers
          row.forEach((header, colIndex) => {
            const headerLower = String(header).toLowerCase();
            if (headerLower.includes('nimi') || headerLower.includes('pelaaja')) {
              columnMapping.name = colIndex;
            } else if (headerLower.includes('ottelu') || headerLower.includes('pelat')) {
              columnMapping.games = colIndex;
            } else if (headerLower.includes('maali') || headerLower === 'm') {
              columnMapping.goals = colIndex;
            } else if (headerLower.includes('syött') || headerLower === 's') {
              columnMapping.assists = colIndex;
            } else if (headerLower.includes('piste') || headerLower === 'p') {
              columnMapping.points = colIndex;
            } else if (headerLower.includes('jäähy') || headerLower.includes('rangaist')) {
              columnMapping.penalties = colIndex;
            }
          });
          break;
        }
      }
    }
    
    console.log('🗺️ Column mapping found:', columnMapping);
    
    // If no header found, use default assumption: Name, Games, Goals, Assists, Points
    if (headerRowIndex === -1) {
      console.log('⚠️ No header row found, using default column mapping');
      columnMapping = { name: 0, games: 1, goals: 2, assists: 3, points: 4, penalties: 5 };
      headerRowIndex = 0;
    }
    
    // Process data rows starting after header
    for (let index = headerRowIndex + 1; index < rawData.length; index++) {
      const row = rawData[index];
      if (!Array.isArray(row) || row.length < 2) continue;
      
      const playerName = safeStringValue(row[columnMapping.name] || row[0]);
      
      // Skip non-player rows
      if (playerName.length < 2 || 
          /^\d+$/.test(playerName) || // Skip pure numbers
          playerName.toLowerCase().includes('yhteensä') ||
          playerName.toLowerCase().includes('kausi') ||
          playerName.toLowerCase().includes('ottelu') ||
          playerName.toLowerCase().includes('summa')) {
        continue;
      }
      
      // Extract stats using column mapping
      const games = safeNumberValue(row[columnMapping.games] || row[1]);
      const goals = safeNumberValue(row[columnMapping.goals] || row[2]);
      const assists = safeNumberValue(row[columnMapping.assists] || row[3]);
      let points = safeNumberValue(row[columnMapping.points] || row[4]);
      const penalties = safeNumberValue(row[columnMapping.penalties] || row[5]);
      
      // Calculate points if missing
      if (points === 0 && (goals > 0 || assists > 0)) {
        points = goals + assists;
      }
      
      // Validate hockey stats (reasonable ranges)
      if (goals > 150 || assists > 200 || points > 300 || games > 150) {
        console.log(`⚠️ Suspicious stats for ${playerName}:`, { goals, assists, points, games });
        console.log(`   Raw row data:`, row);
        continue; // Skip this player
      }
      
      // Only include players with some stats
      if (games > 0 || goals > 0 || assists > 0) {
        const player = {
          name: playerName,
          season: '2024-2025',
          games: games,
          goals: goals,
          assists: assists,
          points: points,
          penalties: penalties,
          sheet: playerStatsSheet,
          rowIndex: index + 1
        };
        
        players.push(player);
        
        // Special logging for Mika
        if (playerName.toLowerCase().includes('mika')) {
          console.log(`🎯 MIKA FOUND - Row ${index + 1}:`);
          console.log('   Raw row:', row);
          console.log('   Column mapping:', columnMapping);
          console.log('   Extracted values:', {
            name: `row[${columnMapping.name}] = ${row[columnMapping.name]}`,
            games: `row[${columnMapping.games}] = ${row[columnMapping.games]} -> ${games}`,
            goals: `row[${columnMapping.goals}] = ${row[columnMapping.goals]} -> ${goals}`,
            assists: `row[${columnMapping.assists}] = ${row[columnMapping.assists]} -> ${assists}`,
            points: `row[${columnMapping.points}] = ${row[columnMapping.points]} -> ${points}`
          });
          console.log('   Final player object:', player);
        }
      }
    }
    
    console.log(`✅ Extracted ${players.length} players from "${playerStatsSheet}"`);
    
    return {
      players: players,
      seasons: ['2024-2025', '2023-2024', '2022-2023', '2021-2022', '2020-2021'],
      totalPlayers: players.length,
      sheet: playerStatsSheet,
      columnMapping: columnMapping
    };
    
  } catch (error) {
    console.error('💥 Error extracting player stats:', error);
    return { players: [], seasons: ['2024-2025'] };
  }
}