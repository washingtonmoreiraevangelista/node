import fs from 'fs';

const db = JSON.parse(fs.readFileSync('../db.json', 'utf-8'));
const tasks = db.tasks;

const header = ['title', 'description'];

const rows = tasks.map(task =>
  header.map(header => {
    const value = task[header] ?? '';
    return `"${String(value).replace(/"/g, '""')}"`;
  }).join(',')
)

const csvContent = [header.join(','), ...rows].join('\n');
fs.writeFileSync('../tasks.csv', csvContent, 'utf8');

console.log('CSV gerado com sucesso!');