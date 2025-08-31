// Test script to verify season sorting
const seasons = [
  "2023-2024 (III-DIV - LR LOHKO A)",
  "2025-2026 (III-DIV)",
  "2024-2025 (III-DIV - LR LOHKO A)",
  "2022-2023 (IV-DIV - LR LOHKO 10)"
];

console.log("Original seasons:", seasons);

// Old sorting method (string sort)
const oldSorted = [...seasons].sort().reverse();
console.log("Old sorting (string sort):", oldSorted);

// New sorting method (numeric year sort)
const newSorted = [...seasons].sort((a, b) => {
  // Extract year ranges from season strings like "2025-2026" or "2025-2026 (III-DIV)"
  const yearA = parseInt(a.split('-')[0]) || 0;
  const yearB = parseInt(b.split('-')[0]) || 0;
  return yearB - yearA; // Descending order (latest first)
});
console.log("New sorting (numeric year sort):", newSorted);