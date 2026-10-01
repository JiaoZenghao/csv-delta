import {mkdir,copyFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
// Explicit allowlist keeps source-control metadata and internal planning out of the site.
const files=['index.html','styles.css','favicon.svg','src/app.js','src/csv.js','src/compare.js','src/report.js','src/i18n.js','src/example.js','src/view.js','examples/before.csv','examples/after.csv'];
const output=resolve('dist');
await rm(output,{recursive:true,force:true});
for(const file of files){const target=resolve(output,file);await mkdir(dirname(target),{recursive:true});await copyFile(file,target);}
await copyFile('LICENSE',resolve(output,'LICENSE'));
console.log(`Built ${files.length+1} public files in dist/`);
