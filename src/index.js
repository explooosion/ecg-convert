import fs from 'fs';
import path from 'path';
import Worker from './Worker';

const PATH = './src/data';

const jobs = fs.readdirSync(PATH).map(p => {
    return { path: p, files: fs.readdirSync(path.resolve(PATH, p)) }
});

jobs.forEach(job => {
    job.files.forEach(file => new Worker(PATH, job.path, file).run())
});
