import { createRequire } from 'module';
import * as path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../plan/AB-plan.xlsx');

try {
  console.log(`Reading file from: ${filePath}`);
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  console.log('Sheet Names:', sheetNames);

  sheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const worksheet = workbook.Sheets[sheetName];
    // Convert to JSON to see structure - using header:1 to get array of arrays (rows)
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(JSON.stringify(jsonData, null, 2));
  });

} catch (error) {
  console.error('Error reading Excel file:', error);
}
