/**
 * CSV and data export utilities for SekTa
 * 
 * This file contains utility functions for handling CSV data exports and persistence
 * between sessions. It works with the floorballDataService to store fetched data.
 */

/**
 * Convert JSON data to CSV format
 * @param {Array} data - Array of objects to convert to CSV
 * @returns {string} CSV formatted string
 */
export function convertToCSV(data) {
  if (!data || !data.length) {
    return '';
  }

  // Extract headers from first object
  const headers = Object.keys(data[0]);
  
  // Create header row
  const headerRow = headers.join(';');
  
  // Create data rows
  const rows = data.map(obj => {
    return headers.map(header => {
      const value = obj[header];
      // Handle different types of values
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string' && value.includes(';')) {
        // Escape strings containing the delimiter
        return `"${value}"`;
      } else {
        return String(value);
      }
    }).join(';');
  });
  
  // Combine header and rows
  return [headerRow, ...rows].join('\n');
}

/**
 * Parse CSV string back to JSON data
 * @param {string} csvString - CSV formatted string
 * @returns {Array} Array of objects
 */
export function parseCSV(csvString) {
  if (!csvString) {
    return [];
  }
  
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    return [];
  }
  
  // Parse header row
  const headers = lines[0].split(';');
  
  // Parse data rows
  return lines.slice(1).map(line => {
    const values = line.split(';');
    const obj = {};
    
    headers.forEach((header, i) => {
      // Try to convert to number if possible
      if (values[i] === '' || values[i] === undefined) {
        obj[header] = null;
      } else if (!isNaN(values[i])) {
        obj[header] = Number(values[i]);
      } else {
        // Remove quotes if present
        let value = values[i];
        if (value && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        obj[header] = value;
      }
    });
    
    return obj;
  });
}

/**
 * Save data as a downloadable CSV file
 * @param {Array} data - Data to export
 * @param {string} filename - Name of the file to download
 */
export function downloadCSV(data, filename = 'export.csv') {
  const csvContent = convertToCSV(data);
  
  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Store in localStorage for persistence
  saveToLocalStorage(data, filename);
}

/**
 * Save data to localStorage for persistence
 * @param {Array} data - Data to store
 * @param {string} key - Key to store data under
 */
export function saveToLocalStorage(data, key) {
  try {
    const csvContent = convertToCSV(data);
    localStorage.setItem(key, csvContent);
    localStorage.setItem(`${key}-timestamp`, Date.now().toString());
    console.log(`✅ Data saved to localStorage with key: ${key}`);
  } catch (error) {
    console.error(`❌ Error saving data to localStorage: ${error.message}`);
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Key to load data from
 * @returns {Object} Object containing data and timestamp
 */
export function loadFromLocalStorage(key) {
  try {
    const csvContent = localStorage.getItem(key);
    if (!csvContent) {
      return { data: [], timestamp: null };
    }
    
    const timestamp = localStorage.getItem(`${key}-timestamp`);
    const data = parseCSV(csvContent);
    
    return {
      data,
      timestamp: timestamp ? new Date(parseInt(timestamp)) : null
    };
  } catch (error) {
    console.error(`❌ Error loading data from localStorage: ${error.message}`);
    return { data: [], timestamp: null };
  }
}

/**
 * Check if data exists in localStorage
 * @param {string} key - Key to check
 * @returns {boolean} Whether data exists
 */
export function dataExistsInLocalStorage(key) {
  return !!localStorage.getItem(key);
}

/**
 * Get the timestamp of when data was last saved
 * @param {string} key - Key to check
 * @returns {Date|null} Timestamp or null if not found
 */
export function getLastSavedTimestamp(key) {
  const timestamp = localStorage.getItem(`${key}-timestamp`);
  return timestamp ? new Date(parseInt(timestamp)) : null;
}