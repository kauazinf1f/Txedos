import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.json');

function loadDB() {
  try {
    const data = readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveDB(data) {
  writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const criminals = loadDB();

  if (req.method === 'GET') {
    return res.status(200).json(criminals);
  }

  if (req.method === 'POST') {
    const { name, crime, details } = req.body;
    if (!name || !crime) {
      return res.status(400).json({ error: 'Nome e crime são obrigatórios' });
    }

    const newCriminal = {
      id: Date.now(),
      name,
      crime,
      details: details || '',
      createdAt: new Date().toISOString(),
    };
    criminals.push(newCriminal);
    saveDB(criminals);
    return res.status(201).json(newCriminal);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const index = criminals.findIndex(c => c.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ error: 'Criminoso não encontrado' });
    }
    criminals.splice(index, 1);
    saveDB(criminals);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Método não permitido' });
}