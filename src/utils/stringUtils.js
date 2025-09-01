/**
 * String Normalization Utility
 * Handles special character normalization for Finnish characters (ä, ö)
 * Used throughout the application to ensure consistent display of player names
 */

// Simple basic normalization for most cases
function normalizeString(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Special case for Jesse Höykinpuro
  if (text.includes('Jesse') && 
      (text.includes('ykinpuro') || 
       text.includes('?ykinpuro') || 
       text.includes('äykinpuro'))) {
    return 'Jesse Höykinpuro';
  }
  
  // Replace common problematic characters
  return text
    .replace(/\?/g, 'ä')  // Replace ? with ä
    .replace(/Ã¤/g, 'ä')  // Replace Ã¤ with ä
    .replace(/Ã¶/g, 'ö')  // Replace Ã¶ with ö
    .replace(/Ã¥/g, 'å')  // Replace Ã¥ with å
    .replace(/â€™/g, "'")  // Replace â€™ with '
    .trim();
}

// Export the utility functions
export { normalizeString };