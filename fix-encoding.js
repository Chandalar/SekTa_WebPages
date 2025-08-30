// Utility script to fix encoding issues in player CSV files

// Get file paths and read the content
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = __dirname;
const pelaajatCsvPath = path.join(workspaceRoot, 'public', 'pelaajat.csv');

// Read the file with proper encoding
let csvContent = fs.readFileSync(pelaajatCsvPath, 'utf8');

// Fix duplicated characters that were created by previous fixes
// This needs to be done first to prevent cascading issues
csvContent = csvContent
  // Remove extra 'ä' characters from specific names - very targeted approach
  .replace(/Matias Mäkiläää/g, 'Matias Mäkilä')
  .replace(/Tuukka Mettäläää/g, 'Tuukka Mettälä')
  .replace(/Ville Mettäläää/g, 'Ville Mettälä')
  .replace(/Matias Mäkilää/g, 'Matias Mäkilä')
  .replace(/Tuukka Mettälää/g, 'Tuukka Mettälä')
  .replace(/Ville Mettälää/g, 'Ville Mettälä')
  .replace(/Sami Pällönen/g, 'Sami Pällönen')
  .replace(/Sami Pällönenn/g, 'Sami Pällönen')
  .replace(/Nynäsäs/g, 'Nynäs')
  .replace(/Nykänen/g, 'Nykänen')
  .replace(/Nykänen/g, 'Nykänen')
  .replace(/Nynäs/g, 'Nynäs')
  .replace(/Mettälä/g, 'Mettälä')
  .replace(/Pällönen/g, 'Pällönen')
  .replace(/Mäkilä/g, 'Mäkilä');

// Write the fixed content back to the file with UTF-8 encoding
fs.writeFileSync(pelaajatCsvPath, csvContent, 'utf8');

console.log('Fixed encoding issues in pelaajat.csv');