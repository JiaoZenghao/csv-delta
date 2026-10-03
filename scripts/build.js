import {mkdir,copyFile,rm,readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
// Explicit allowlist keeps source-control metadata and internal planning out of the site.
const files=['index.html','styles.css','favicon.svg','src/app.js','src/csv.js','src/compare.js','src/report.js','src/i18n.js','src/example.js','src/view.js','src/analytics.js','examples/before.csv','examples/after.csv'];
const output=resolve('dist');
await rm(output,{recursive:true,force:true});
for(const file of files){const target=resolve(output,file);await mkdir(dirname(target),{recursive:true});await copyFile(file,target);}
await copyFile('LICENSE',resolve(output,'LICENSE'));
console.log(`Built ${files.length+1} public files in dist/`);

// Analytics is opt-in at deployment; source and ordinary local builds remain disabled.
const endpoint=process.env.GOATCOUNTER_SITE || '';
if(endpoint){
  const site=new URL(endpoint);
  if(site.protocol!=='https:' || !/^[a-z0-9-]+\.goatcounter\.com$/.test(site.hostname) || site.port || site.username || site.password || site.pathname!=='/' || site.search || site.hash) throw new Error('GOATCOUNTER_SITE must be a HTTPS GoatCounter site origin');
  const path=resolve(output,'index.html');
  let html=await readFile(path,'utf8');
  html=html.replace("img-src 'self' data:",`img-src 'self' data: ${site.origin}/count`);
  html=html.replace('</head>',`<meta name="goatcounter-site" content="${site.origin}"><script type="module" src="./src/analytics.js"></script></head>`);
  await writeFile(path,html);
}
