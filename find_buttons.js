import fs from 'fs';
const content = fs.readFileSync('main.js', 'utf-8');
const lines = content.split(/\r?\n/);

lines.forEach((line, index) => {
  if (line.toLowerCase().includes('button') || (line.includes('<a ') && line.includes('btn'))) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
