const fs = require('fs');
const d = require('./hisn_muslim.json');
fs.writeFileSync('src/data/hisn.ts', `export interface HisnCategory {
    title: string;
    items: { text: string }[];
}

export const hisnCategories: HisnCategory[] = ${JSON.stringify(d, null, 2)};`);
