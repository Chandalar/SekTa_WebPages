/**
 * playerMedia.js - Centralized player media management
 * 
 * This utility file provides a single place to manage all player image and video references.
 * It exports functions to get player images and videos consistently across the application.
 */

import { normalizeString } from './stringUtils';

/**
 * Master mapping of player names to their image and video files
 * This is the ONLY place that needs to be updated when changing player media
 */
export const PLAYER_MEDIA = {
  'Mika Aaltonen': { 
    image: 'Mika.jpg', 
    video: 'Mika.mp4',
    number: 119,
    position: 'Hyökkääjä'
  },
  'Mika Ahven': { 
    image: 'Ahven.jpg', 
    video: 'Ahven.mp4',
    number: 1,
    position: 'Maalivahti' 
  },
  'Jesse Höykinpuro': { 
    image: 'Jesse.jpg', 
    video: null,
    number: 8,
    position: 'Hyökkääjä'
  },
  'Jesse Höykinpuro': { 
    image: 'Jesse.jpg', 
    video: null,
    number: 8,
    position: 'Hyökkääjä'
  },
  'Henri Kananen': { 
    image: 'Kananen.jpg', 
    video: null,
    number: 27,
    position: 'Hyökkääjä'
  },
  'Juha Kiilunen': { 
    image: 'Juha.jpg', 
    video: 'Juha.mp4',
    number: null,
    position: null
  },
  'Jimi Laaksonen': { 
    image: 'Jimi.jpg', 
    video: null,
    number: 11,
    position: 'Hyökkääjä'
  },
  'Akseli Nykänen': { 
    image: 'Akseli.jpg', 
    video: 'Akseli_gorilla.jpeg',
    number: 15,
    position: 'Hyökkääjä'
  },
  'Niko Nynäs': { 
    image: 'Niko.jpg', 
    video: null,
    number: 33,
    position: 'Puolustaja'
  },
  'Miika Oja-Nisula': { 
    image: 'Miika.jpg', 
    video: 'Miika.mp4',
    number: 66,
    position: 'Hyökkääjä'
  },
  'Joonas Leppänen': { 
    image: 'Joonas.jpg', 
    video: null,
    number: 44,
    position: 'Puolustaja'
  },
  'Joni Vainio': { 
    image: 'Joni.jpg', 
    video: 'Joni.mp4',
    number: 13,
    position: 'Hyökkääjä'
  },
  'Petri Vikman': { 
    image: 'Petri.jpg', 
    video: 'Petri.mp4',
    number: 22,
    position: 'Hyökkääjä'
  },
  'Ville Mäenranta': { 
    image: 'Ville.jpg', 
    video: 'Ville.mp4',
    number: 28,
    position: 'Puolustaja'
  },
  'Vesa Halme': { 
    image: 'Vesa.jpg', 
    video: 'Vesa.mp4',
    number: 55,
    position: 'Puolustaja'
  },
  'Veikka Saarinen': { 
    image: 'Veikka.jpg', 
    video: 'Veikka.mp4',
    number: 14,
    position: 'Hyökkääjä'
  },
  'Matias Virta': { 
    image: 'Matias.jpg', 
    video: null,
    number: 30,
    position: 'Maalivahti'
  }
};

/**
 * Default fallback image to use when a player image isn't found
 */
export const DEFAULT_PLAYER_IMAGE = 'gorilla_puku.jpeg';

/**
 * Get the image path for a player
 * @param {string} playerName - The player's name
 * @returns {string} - Path to the player's image
 */
export function getPlayerImage(playerName) {
  // Handle null values
  if (!playerName || typeof playerName !== 'string') {
    return DEFAULT_PLAYER_IMAGE;
  }
  
  // Apply normalization
  const normalizedName = normalizeString(playerName);
  
  // Special case for Jesse
  if (normalizedName.includes('Jesse')) {
    return 'Jesse.jpg';
  }
  
  // Find the player in our media mapping
  const playerMedia = PLAYER_MEDIA[normalizedName];
  
  if (playerMedia && playerMedia.image) {
    return playerMedia.image;
  }
  
  // Try first name as fallback
  return `${normalizedName.split(' ')[0]}.jpg`;
}

/**
 * Get the video path for a player
 * @param {string} playerName - The player's name
 * @returns {string|null} - Path to the player's video or null if not available
 */
export function getPlayerVideo(playerName) {
  // Handle null values
  if (!playerName || typeof playerName !== 'string') {
    return null;
  }
  
  // Apply normalization
  const normalizedName = normalizeString(playerName);
  
  // Find the player in our media mapping
  const playerMedia = PLAYER_MEDIA[normalizedName];
  
  if (playerMedia && playerMedia.video) {
    return playerMedia.video;
  }
  
  // Generate standardized video name based on naming convention
  const videoName = normalizedName.replace(/\s+/g, '_') + '.mp4';
  
  // Check if the generated name is in any of the values
  const matchingPlayer = Object.values(PLAYER_MEDIA).find(
    media => media.video && media.video.toLowerCase() === videoName.toLowerCase()
  );
  
  return matchingPlayer ? matchingPlayer.video : null;
}

/**
 * Get complete player media information
 * @param {string} playerName - The player's name
 * @returns {Object} - Complete player media info including image, video, number, position
 */
export function getPlayerMediaInfo(playerName) {
  // Handle null values
  if (!playerName || typeof playerName !== 'string') {
    return {
      image: DEFAULT_PLAYER_IMAGE,
      video: null,
      number: null,
      position: null
    };
  }
  
  // Apply normalization
  const normalizedName = normalizeString(playerName);
  
  // Find the player in our media mapping
  const playerMedia = PLAYER_MEDIA[normalizedName];
  
  if (playerMedia) {
    return {
      image: playerMedia.image || DEFAULT_PLAYER_IMAGE,
      video: playerMedia.video || null,
      number: playerMedia.number || null,
      position: playerMedia.position || null
    };
  }
  
  // Return defaults with just the image fallback
  return {
    image: getPlayerImage(playerName),
    video: null,
    number: null,
    position: null
  };
}

/**
 * Get full player data including media references
 * @param {Object} playerData - Basic player data with name
 * @returns {Object} - Enhanced player data with media references
 */
export function enrichPlayerWithMedia(playerData) {
  if (!playerData || !playerData.name) {
    return playerData;
  }
  
  const mediaInfo = getPlayerMediaInfo(playerData.name);
  
  return {
    ...playerData,
    img: mediaInfo.image,
    video: mediaInfo.video,
    number: playerData.number || mediaInfo.number,
    position: playerData.position || mediaInfo.position
  };
}

/**
 * Get array of all players with their media info
 * @returns {Array} - Array of player objects with media info
 */
export function getAllPlayersWithMedia() {
  return Object.entries(PLAYER_MEDIA).map(([name, media]) => ({
    name,
    img: media.image,
    video: media.video,
    number: media.number,
    role: media.position
  }));
}