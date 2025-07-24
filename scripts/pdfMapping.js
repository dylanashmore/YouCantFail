import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, './public');
const folders = ['Questions', 'Solutions'];

const topics = {};

folders.forEach(folder => {
  const baseDir = path.join(publicDir, folder);
  if (fs.existsSync(baseDir)) {
    fs.readdirSync(baseDir).forEach(topicFolder => {
      const topicPath = path.join(baseDir, topicFolder);
      if (fs.statSync(topicPath).isDirectory()) {
        const topicKey = `${folder}/${topicFolder}`;
        topics[topicKey] = fs.readdirSync(topicPath)
          .filter(f => f.endsWith('.pdf'))
          .map(f => `/${folder}/${topicFolder}/${f}`);
      }
    });
  }
});

console.log('export const TOPIC_PDFS =', JSON.stringify(topics, null, 2), ';');