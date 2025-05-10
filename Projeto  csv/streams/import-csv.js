import { parse } from 'csv-parse';
import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const csvPath = path.join(__dirname, 'task.csv');
console.log('Path to CSV:', csvPath);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
});

async function run() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    try {
      await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description })
      });
      console.log(`Importado com sucesso: ${title}`);
    } catch (err) {
      console.error(`Erro ao importar "${title}":`, err.message);
    }
  }

  console.log('Importação concluída!');
}

run().catch(err => console.error('Erro ao importar tarefas:', err));
