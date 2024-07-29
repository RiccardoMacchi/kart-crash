// Prepariamo la griglia iniziale
const gridMatrix = [
  ['', '', '', '', '', 'grass', ''],
  ['', 'cones', '', '', '', '', 'fence'],
  ['', '', 'rock', '', '', '', ''],
  ['fence', '', '', '', '', '', ''],
  ['', '', 'grass', '', '', 'water', ''],
  ['', '', '', '', 'cones', '', ''],
  ['', 'water', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', 'rock', ''],
];



// Algoritmo di Fisher-Yates
for (let i = row.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [row[i], row[j]] = [row[j], row[i]];
}
