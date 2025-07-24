import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const examsDir = path.join(__dirname, '..', 'public', 'fullExams');

console.log('Exam dir:', examsDir);

try {
  const files = fs.readdirSync(examsDir);
  console.log('Files:', files);

  // Filter PDF files
  const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));

  // Split into questions and solutions based on '-Sol' in filename
  const questions = pdfFiles
    .filter(f => !f.includes('-Sol'))
    .map(f => `/fullExams/${f}`);

  const solutions = pdfFiles
    .filter(f => f.includes('-Sol'))
    .map(f => `/fullExams/${f}`);

  const fullExamManifest = {
    questions,
    solutions,
  };

  console.log('export const FULL_EXAMS =', JSON.stringify(fullExamManifest, null, 2), ';');
} catch (err) {
  console.error('Error reading dir:', err);
}
