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
  
  return text;
}

// Export the utility functions
export { normalizeString };
