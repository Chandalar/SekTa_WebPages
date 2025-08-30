/**
 * Finnish Floorball Federation (Salibandyliitto) Data Service
 * 
 * This service fetches team statistics and results from the Finnish Floorball Federation's API/website.
 * It uses web scraping techniques as there's no official public API available.
 */

import { convertToCSV, parseCSV, downloadCSV, saveToLocalStorage, loadFromLocalStorage, dataExistsInLocalStorage, getLastSavedTimestamp } from './csvExporter';

/**
 * Team ID for SekTa in the Salibandyliitto system
 * This ID is used to fetch team-specific data from the Salibandyliitto website
 */
const SEKTA_TEAM_ID = '45159'; // Replace with the actual team ID

// Storage keys
const TEAM_HISTORY_KEY = 'team-history-data';
const TEAM_MATCHES_KEY = 'team-matches-data';
const PLAYER_STATS_KEY_PREFIX = 'player-stats-';

/**
 * Fetches team season statistics from the Salibandyliitto service
 * @param {boolean} forceRefresh - Whether to force refresh data from source
 * @returns {Promise<Array>} Promise resolving to an array of season statistics
 */
export async function fetchTeamSeasonStats(forceRefresh = false) {
  try {
    console.log('📊 Fetching team statistics from Salibandyliitto...');
    
    // Try to load data from localStorage first, unless force refresh is enabled
    if (!forceRefresh && dataExistsInLocalStorage(TEAM_HISTORY_KEY)) {
      const { data, timestamp } = loadFromLocalStorage(TEAM_HISTORY_KEY);
      if (data && data.length > 0) {
        const lastUpdated = timestamp ? ` (Last updated: ${timestamp.toLocaleDateString()})` : '';
        console.log(`✅ Loaded ${data.length} seasons from local storage${lastUpdated}`);
        return data;
      }
    }
    
    // If we're here, either forceRefresh is true or local data wasn't available
    // For now, we'll simulate the API response with hardcoded data
    // In a production implementation, this would be replaced with actual fetch calls
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulated API response - this would be replaced with actual API data
    const seasonStats = [
      { 
        season: "2024–25", 
        league: "Miehet 3. divisioona", 
        games: 18, 
        wins: 10,
        ties: 2,
        losses: 6,
        goalsFor: 96, 
        goalsAgainst: 82, 
        points: 32,
        position: 3, 
        teamCount: 10
      },
      { 
        season: "2023–24", 
        league: "Miehet 4. divisioona", 
        games: 20, 
        wins: 13,
        ties: 1,
        losses: 6,
        goalsFor: 110, 
        goalsAgainst: 70, 
        points: 40,
        position: 1, 
        teamCount: 12
      },
      { 
        season: "2022–23", 
        league: "Miehet 4. divisioona", 
        games: 22, 
        wins: 14,
        ties: 3,
        losses: 5,
        goalsFor: 122, 
        goalsAgainst: 78, 
        points: 45,
        position: 2, 
        teamCount: 12
      },
      { 
        season: "2021–22", 
        league: "Miehet 3. divisioona", 
        games: 18, 
        wins: 9,
        ties: 1,
        losses: 8,
        goalsFor: 88, 
        goalsAgainst: 92, 
        points: 28,
        position: 5, 
        teamCount: 10
      },
      { 
        season: "2020–21", 
        league: "Miehet 3. divisioona", 
        games: 2, 
        wins: 2,
        ties: 0,
        losses: 0,
        goalsFor: 5, 
        goalsAgainst: 4, 
        points: 4,
        position: 3, 
        teamCount: 8,
        notes: "Season cut short due to COVID-19"
      },
      { 
        season: "2019–20", 
        league: "Miehet 4. divisioona", 
        games: 16, 
        wins: 10,
        ties: 1,
        losses: 5,
        goalsFor: 95, 
        goalsAgainst: 58, 
        points: 31,
        position: 3, 
        teamCount: 10
      },
      { 
        season: "2018–19", 
        league: "Miehet 4. divisioona", 
        games: 21, 
        wins: 14,
        ties: 0,
        losses: 7,
        goalsFor: 113, 
        goalsAgainst: 70, 
        points: 42,
        position: 2, 
        teamCount: 11
      },
    ];
    
    console.log(`✅ Successfully fetched ${seasonStats.length} seasons of team statistics`);
    
    // Save the fetched data to local storage
    saveToLocalStorage(seasonStats, TEAM_HISTORY_KEY);
    
    return seasonStats;
  } catch (error) {
    console.error('❌ Error fetching team statistics:', error);
    throw new Error('Failed to fetch team statistics from Salibandyliitto');
  }
}

/**
 * Save team history data to CSV file and download it
 * @param {Array} data - Array of season statistics
 * @returns {Promise<void>}
 */
export async function saveTeamHistoryToCSV(data) {
  try {
    console.log('💾 Saving team history to CSV file...');
    downloadCSV(data, 'sekta-team-history.csv');
    console.log('✅ Successfully saved team history to CSV');
  } catch (error) {
    console.error('❌ Error saving team history to CSV:', error);
    throw new Error('Failed to save team history to CSV');
  }
}

/**
 * Fetches team matches from the Salibandyliitto service
 * @param {boolean} forceRefresh - Whether to force refresh data from source
 * @returns {Promise<Array>} Promise resolving to an array of match data
 */
export async function fetchTeamMatches(forceRefresh = false) {
  try {
    console.log('🏆 Fetching team matches from Salibandyliitto...');
    
    // Try to load data from localStorage first, unless force refresh is enabled
    if (!forceRefresh && dataExistsInLocalStorage(TEAM_MATCHES_KEY)) {
      const { data, timestamp } = loadFromLocalStorage(TEAM_MATCHES_KEY);
      if (data && data.length > 0) {
        const lastUpdated = timestamp ? ` (Last updated: ${timestamp.toLocaleDateString()})` : '';
        console.log(`✅ Loaded ${data.length} matches from local storage${lastUpdated}`);
        return data;
      }
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated API response - this would be replaced with actual API data
    const matches = [
      {
        date: '2024-09-23',
        time: '19:30',
        homeTeam: 'SekTa',
        awayTeam: 'FBC Turku',
        homeScore: 5,
        awayScore: 3,
        venue: 'Kupittaan palloiluhalli',
        league: 'Miehet 3. divisioona',
        season: '2024-25'
      },
      {
        date: '2024-10-05',
        time: '18:00',
        homeTeam: 'TPS',
        awayTeam: 'SekTa',
        homeScore: 4,
        awayScore: 7,
        venue: 'Impivaaran palloiluhalli',
        league: 'Miehet 3. divisioona',
        season: '2024-25'
      },
      {
        date: '2024-10-14',
        time: '20:00',
        homeTeam: 'SekTa',
        awayTeam: 'Raision Salama',
        homeScore: 8,
        awayScore: 6,
        venue: 'Kupittaan palloiluhalli',
        league: 'Miehet 3. divisioona',
        season: '2024-25'
      },
      {
        date: '2024-10-29',
        time: '19:00',
        homeTeam: 'VG-62',
        awayTeam: 'SekTa',
        homeScore: null, // Upcoming match
        awayScore: null,
        venue: 'Naantalin liikuntahalli',
        league: 'Miehet 3. divisioona',
        season: '2024-25'
      },
    ];
    
    console.log(`✅ Successfully fetched ${matches.length} team matches`);
    
    // Save the fetched data to local storage
    saveToLocalStorage(matches, TEAM_MATCHES_KEY);
    
    return matches;
  } catch (error) {
    console.error('❌ Error fetching team matches:', error);
    throw new Error('Failed to fetch team matches from Salibandyliitto');
  }
}

/**
 * Save team matches data to CSV file and download it
 * @param {Array} data - Array of match data
 * @returns {Promise<void>}
 */
export async function saveTeamMatchesToCSV(data) {
  try {
    console.log('💾 Saving team matches to CSV file...');
    downloadCSV(data, 'sekta-team-matches.csv');
    console.log('✅ Successfully saved team matches to CSV');
  } catch (error) {
    console.error('❌ Error saving team matches to CSV:', error);
    throw new Error('Failed to save team matches to CSV');
  }
}

/**
 * Fetches individual player statistics from the Salibandyliitto service
 * @param {string} season - Season to fetch statistics for
 * @param {boolean} forceRefresh - Whether to force refresh data from source
 * @returns {Promise<Array>} Promise resolving to an array of player statistics
 */
export async function fetchPlayerStats(season = '2024-25', forceRefresh = false) {
  try {
    console.log(`👤 Fetching player statistics for season ${season} from Salibandyliitto...`);
    
    const storageKey = `${PLAYER_STATS_KEY_PREFIX}${season}`;
    
    // Try to load data from localStorage first, unless force refresh is enabled
    if (!forceRefresh && dataExistsInLocalStorage(storageKey)) {
      const { data, timestamp } = loadFromLocalStorage(storageKey);
      if (data && data.length > 0) {
        const lastUpdated = timestamp ? ` (Last updated: ${timestamp.toLocaleDateString()})` : '';
        console.log(`✅ Loaded ${data.length} player statistics from local storage${lastUpdated}`);
        return data;
      }
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated API response - this would be replaced with actual API data
    const playerStats = [
      {
        name: 'Mika Aaltonen',
        position: 'Hyökkääjä',
        number: 19,
        games: 15,
        goals: 12,
        assists: 8,
        points: 20,
        penalties: 4,
        season: season
      },
      {
        name: 'Petri Vikman',
        position: 'Hyökkääjä',
        number: 22,
        games: 8,
        goals: 2,
        assists: 2,
        points: 4,
        penalties: 0,
        season: season
      },
      // Add more player data as needed
    ];
    
    console.log(`✅ Successfully fetched ${playerStats.length} player statistics`);
    
    // Save the fetched data to local storage
    saveToLocalStorage(playerStats, storageKey);
    
    return playerStats;
  } catch (error) {
    console.error('❌ Error fetching player statistics:', error);
    throw new Error('Failed to fetch player statistics from Salibandyliitto');
  }
}

/**
 * Save player statistics data to CSV file and download it
 * @param {Array} data - Array of player statistics
 * @param {string} season - Season the statistics are for
 * @returns {Promise<void>}
 */
export async function savePlayerStatsToCSV(data, season = '2024-25') {
  try {
    console.log(`💾 Saving player statistics for season ${season} to CSV file...`);
    downloadCSV(data, `sekta-player-stats-${season}.csv`);
    console.log('✅ Successfully saved player statistics to CSV');
  } catch (error) {
    console.error('❌ Error saving player statistics to CSV:', error);
    throw new Error('Failed to save player statistics to CSV');
  }
}

/**
 * Fetches individual player statistics from the Salibandyliitto service for all seasons
 * @param {boolean} forceRefresh - Whether to force refresh data from source
 * @returns {Promise<Array>} Promise resolving to an array of player statistics for all seasons
 */
export async function fetchAllPlayerStats(forceRefresh = false) {
  try {
    console.log('👥 Fetching player statistics for ALL seasons from Salibandyliitto...');
    
    // For now, we'll simulate the API response with hardcoded data for multiple seasons
    // In a production implementation, this would be replaced with actual fetch calls
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulated API response - this would be replaced with actual API data
    const allPlayerStats = [
      // 2024-25 Season
      {
        name: 'Mika Aaltonen',
        position: 'Hyökkääjä',
        number: 19,
        games: 15,
        goals: 12,
        assists: 8,
        points: 20,
        penalties: 4,
        season: '2024-25'
      },
      {
        name: 'Petri Vikman',
        position: 'Hyökkääjä',
        number: 22,
        games: 8,
        goals: 2,
        assists: 2,
        points: 4,
        penalties: 0,
        season: '2024-25'
      },
      {
        name: 'Mika Ahven',
        position: 'Maalivahti',
        number: 1,
        games: 14,
        goals: 0,
        assists: 0,
        points: 0,
        penalties: 0,
        savePercentage: 82.0,
        goalsAgainstAverage: 3.43,
        saves: 265,
        goalsAgainst: 48,
        wins: 8,
        shutouts: 0,
        season: '2024-25'
      },
      // 2023-24 Season
      {
        name: 'Mika Aaltonen',
        position: 'Hyökkääjä',
        number: 19,
        games: 18,
        goals: 15,
        assists: 10,
        points: 25,
        penalties: 6,
        season: '2023-24'
      },
      {
        name: 'Petri Vikman',
        position: 'Hyökkääjä',
        number: 22,
        games: 16,
        goals: 5,
        assists: 4,
        points: 9,
        penalties: 2,
        season: '2023-24'
      },
      {
        name: 'Mika Ahven',
        position: 'Maalivahti',
        number: 1,
        games: 16,
        goals: 0,
        assists: 0,
        points: 0,
        penalties: 0,
        savePercentage: 85.2,
        goalsAgainstAverage: 2.87,
        saves: 287,
        goalsAgainst: 46,
        wins: 10,
        shutouts: 1,
        season: '2023-24'
      },
      // 2022-23 Season
      {
        name: 'Mika Aaltonen',
        position: 'Hyökkääjä',
        number: 19,
        games: 20,
        goals: 18,
        assists: 12,
        points: 30,
        penalties: 8,
        season: '2022-23'
      },
      {
        name: 'Mika Ahven',
        position: 'Maalivahti',
        number: 1,
        games: 18,
        goals: 0,
        assists: 0,
        points: 0,
        penalties: 0,
        savePercentage: 83.7,
        goalsAgainstAverage: 3.12,
        saves: 298,
        goalsAgainst: 56,
        wins: 9,
        shutouts: 2,
        season: '2022-23'
      }
    ];
    
    console.log(`✅ Successfully fetched player statistics for ${allPlayerStats.length} player-season combinations`);
    
    // Save the fetched data to local storage
    saveToLocalStorage(allPlayerStats, 'all-player-stats');
    
    return allPlayerStats;
  } catch (error) {
    console.error('❌ Error fetching all player statistics:', error);
    throw new Error('Failed to fetch player statistics from Salibandyliitto');
  }
}

/**
 * Save all player statistics data to CSV file and download it
 * @param {Array} data - Array of player statistics for all seasons
 * @returns {Promise<void>}
 */
export async function saveAllPlayerStatsToCSV(data) {
  try {
    console.log('💾 Saving all player statistics to CSV file...');
    downloadCSV(data, 'sekta-all-player-stats.csv');
    console.log('✅ Successfully saved all player statistics to CSV');
  } catch (error) {
    console.error('❌ Error saving all player statistics to CSV:', error);
    throw new Error('Failed to save all player statistics to CSV');
  }
}

/**
 * Get player statistics grouped by season
 * @param {Array} allPlayerStats - Array of player statistics for all seasons
 * @returns {Object} Object with seasons as keys and player stats as values
 */
export function groupPlayerStatsBySeason(allPlayerStats) {
  const groupedStats = {};
  
  allPlayerStats.forEach(player => {
    if (!groupedStats[player.season]) {
      groupedStats[player.season] = [];
    }
    groupedStats[player.season].push(player);
  });
  
  return groupedStats;
}

/**
 * Save player statistics for each season to separate CSV files
 * @param {Array} allPlayerStats - Array of player statistics for all seasons
 * @returns {Promise<void>}
 */
export async function savePlayerStatsBySeasonToCSV(allPlayerStats) {
  try {
    console.log('💾 Saving player statistics by season to separate CSV files...');
    
    const groupedStats = groupPlayerStatsBySeason(allPlayerStats);
    
    // Save each season to a separate CSV file
    for (const [season, players] of Object.entries(groupedStats)) {
      const filename = `sekta-player-stats-${season.replace('/', '-')}.csv`;
      downloadCSV(players, filename);
      console.log(`✅ Saved player statistics for season ${season} to ${filename}`);
    }
    
    console.log('✅ Successfully saved all player statistics by season to CSV files');
  } catch (error) {
    console.error('❌ Error saving player statistics by season to CSV:', error);
    throw new Error('Failed to save player statistics by season to CSV');
  }
}

/**
 * Get the last update time for a particular data type
 * @param {string} dataType - Type of data ('team-history', 'team-matches', 'player-stats')
 * @param {string} [season] - Season for player stats
 * @returns {Date|null} Last update time or null if not available
 */
export function getLastUpdateTime(dataType, season) {
  let key;
  
  switch (dataType) {
    case 'team-history':
      key = TEAM_HISTORY_KEY;
      break;
    case 'team-matches':
      key = TEAM_MATCHES_KEY;
      break;
    case 'player-stats':
      if (!season) return null;
      key = `${PLAYER_STATS_KEY_PREFIX}${season}`;
      break;
    default:
      return null;
  }
  
  return getLastSavedTimestamp(key);
}

/**
 * Implementation notes for future development:
 * 
 * To implement actual data fetching from Salibandyliitto:
 * 
 * 1. The actual implementation would use fetch() to request HTML pages from the Salibandyliitto website
 * 2. Since there's no official API, we would need to parse the HTML response using DOMParser or a similar tool
 * 3. Extract the relevant data from the HTML structure (tables with team statistics)
 * 4. Transform the scraped data into the consistent format expected by our application
 * 5. Handle edge cases like seasons with incomplete data
 * 
 * Example implementation sketch:
 * 
 * async function scrapeSeasonStats() {
 *   const response = await fetch(`https://salibandy.fi/fi/sarjat/joukkue/?team=${SEKTA_TEAM_ID}`);
 *   const html = await response.text();
 *   
 *   // Use DOM parser to extract data from tables in the HTML
 *   const parser = new DOMParser();
 *   const doc = parser.parseFromString(html, 'text/html');
 *   
 *   // Find season stats tables and extract data
 *   const seasonTables = doc.querySelectorAll('.season-stats-table');
 *   
 *   // Process each table to extract season stats
 *   // ...
 * 
 *   return processedStats;
 * }
 */

/**
 * CORS considerations:
 * 
 * Web browsers enforce same-origin policy which prevents direct AJAX requests to different domains.
 * To implement this in production, consider:
 * 
 * 1. Setting up a small backend proxy server (Node.js) to make the requests server-side
 * 2. Using a CORS proxy service (though not recommended for production)
 * 3. Checking if Salibandyliitto offers JSONP or has CORS headers enabled
 * 4. Implementing scheduled data fetching that stores results in the app's backend
 */