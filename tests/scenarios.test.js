import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseCSV} from '../src/csv.js';
import {compareCSV} from '../src/compare.js';
const scenarios=JSON.parse(await readFile(new URL('../examples/scenarios.json',import.meta.url),'utf8'));
for(const scenario of scenarios) test(`published ${scenario.id} example matches documented counts and field changes`,async()=>{
  const [before,after]=await Promise.all([scenario.before,scenario.after].map(path=>readFile(new URL(`../${path}`,import.meta.url),'utf8')));
  const result=compareCSV(parseCSV(before),parseCSV(after),scenario.settings);
  assert.deepEqual(result.counts,scenario.counts);
  assert.deepEqual(result.records.filter(row=>row.type==='changed').flatMap(row=>row.changes.map(change=>({key:row.key,...change}))),scenario.changes);
});
