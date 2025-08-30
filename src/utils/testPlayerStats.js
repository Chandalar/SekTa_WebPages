/**
 * Test utility for player statistics functionality
 * This file is for testing purposes only
 */

import { fetchAllPlayerStats, saveAllPlayerStatsToCSV, groupPlayerStatsBySeason, savePlayerStatsBySeasonToCSV } from './floorballDataService';

// Test the player stats functionality
async function testPlayerStats() {
  console.log('🧪 Testing player statistics functionality...');
  
  try {
    // Fetch all player stats
    const allPlayerStats = await fetchAllPlayerStats();
    console.log('✅ Fetched all player stats:', allPlayerStats.length, 'records');
    
    // Group by season
    const groupedStats = groupPlayerStatsBySeason(allPlayerStats);
    console.log('✅ Grouped stats by season:', Object.keys(groupedStats));
    
    // Test CSV export (commented out to prevent automatic download during testing)
    // await saveAllPlayerStatsToCSV(allPlayerStats);
    // console.log('✅ Saved all player stats to CSV');
    
    // Test CSV export by season (commented out to prevent automatic download during testing)
    // await savePlayerStatsBySeasonToCSV(allPlayerStats);
    // console.log('✅ Saved player stats by season to separate CSVs');
    
    return { success: true, data: allPlayerStats, grouped: groupedStats };
  } catch (error) {
    console.error('❌ Error in player stats test:', error);
    return { success: false, error: error.message };
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
  testPlayerStats().then(result => {
    console.log('Test result:', result);
  });
}

export { testPlayerStats };