import { createFile } from './create';
import { readFile } from './read';
import * as fs from 'fs';

(async () => {
    const file = '/Users/maksimparkhomenka/Documents/work/bull.js/excel.xlsx';
    await fs.promises.access(file).catch(() => createFile());
    await readFile();
})();