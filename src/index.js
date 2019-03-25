import fs from 'fs';
import path from 'path';
import moment from 'moment';

// Inport Data
import data from './data/ecg';

// Output Data
const OUTPUT_PATH = './out';
const OUTPUT_FILE = `output-${moment().format('YYYYMMDD-HHmmss')}.dat`;

// Data processing
const DAT = data.map(({ data }) => (data === null ? 0 : data) + '\r\n').join('');

// Work
const FILE = path.resolve(OUTPUT_PATH, OUTPUT_FILE);
fs.writeFileSync(FILE, DAT);