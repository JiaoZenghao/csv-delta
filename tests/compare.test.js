import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCSV} from '../src/csv.js';
import {compareCSV} from '../src/compare.js';
const run = (oldText, newText, settings={keys:['id']}) => compareCSV(parseCSV(oldText),parseCSV(newText),settings);

test('row and column reorder do not count as changes',()=>{
  assert.deepEqual(run('id,name\n1,a\n2,b','name,id\nb,2\na,1').counts,{added:0,removed:0,changed:0,unchanged:2});
});
test('counts changes and retains exact old/new field values',()=>{
  const result=run('id,name\n1,a\n2,b\n4,d','id,name\n1,z\n3,c\n4,d');
  assert.deepEqual(result.counts,{added:1,removed:1,changed:1,unchanged:1});
  assert.deepEqual(result.records.find(r=>r.type==='changed').changes,[{column:'name',old:'a',new:'z'}]);
});
test('composite keys cannot collide at separator characters',()=>{
  const r=run('a,b,v\n"a,b",c,old\na,"b,c",keep','a,b,v\na,"b,c",keep\n"a,b",c,new',{keys:['a','b']});
  assert.deepEqual(r.counts,{added:0,removed:0,changed:1,unchanged:1});
  assert.deepEqual(r.records.find(r=>r.type==='changed').key,['a,b','c']);
});
test('reports schema changes separately from common-column changes',()=>{
  const r=run('id,old,v\n1,x,a','id,new,v\n1,y,a');
  assert.deepEqual(r.columnsAdded,['new']); assert.deepEqual(r.columnsRemoved,['old']);
  assert.equal(r.counts.unchanged,1);
});
test('ignores explicitly selected non-key columns',()=>{
  assert.equal(run('id,v\n1,a','id,v\n1,b',{keys:['id'],ignore:['v']}).counts.unchanged,1);
});
for(const [label,a,b,settings,pattern] of [
  ['empty keys','id\n1','id\n1',{keys:[]},/key/i],
  ['duplicate keys','id\n1\n1','id\n1',{keys:['id']},/old.*record 3.*duplicate/i],
  ['new duplicate','id\n1','id\n1\n1',{keys:['id']},/new.*record 3.*duplicate/i],
  ['empty key','id,v\n,x','id,v\n1,x',{keys:['id']},/old.*record 2.*empty/i],
  ['whitespace key','id\n ','id\n1',{keys:['id']},/empty/i],
  ['missing key','id\n1','other\n1',{keys:['id']},/key/i],
  ['ignored key','id\n1','id\n1',{keys:['id'],ignore:['id']},/key/i],
  ['unknown ignore','id\n1','id\n1',{keys:['id'],ignore:['v']},/column/i],
  ['unknown numeric','id\n1','id\n1',{keys:['id'],numeric:['v']},/column/i],
  ['negative tolerance','id\n1','id\n1',{keys:['id'],tolerance:-1},/tolerance/i],
  ['NaN tolerance','id\n1','id\n1',{keys:['id'],tolerance:NaN},/tolerance/i]
]) test(`rejects ${label}`,()=>assert.throws(()=>run(a,b,settings),pattern));
test('numeric comparison is opt-in and defaults to exact strings',()=>{
  assert.equal(run('id,v\n1,1.00','id,v\n1,1').counts.changed,1);
  assert.equal(run('id,v\n1,1.00','id,v\n1,1',{keys:['id'],numeric:['v']}).counts.unchanged,1);
});
test('absolute numeric tolerance includes its boundary',()=>{
  assert.equal(run('id,v\n1,1','id,v\n1,1.25',{keys:['id'],numeric:['v'],tolerance:0.25}).counts.unchanged,1);
  assert.equal(run('id,v\n1,1','id,v\n1,1.26',{keys:['id'],numeric:['v'],tolerance:0.25}).counts.changed,1);
});
for (const [a,b] of [['','0'],['Infinity','1'],['0x10','16'],['1e999','0']]) test(`non-decimal ${a} falls back to string comparison`,()=>{
  assert.equal(run(`id,v\n1,${a}`,`id,v\n1,${b}`,{keys:['id'],numeric:['v'],tolerance:100}).counts.changed,1);
});
test('prototype property columns are safe and remain reportable',()=>{
  const r=run('id,__proto__,constructor\n1,a,x','id,__proto__,constructor\n1,b,x');
  assert.equal(r.records[0].old.__proto__,'a'); assert.equal(r.records[0].new.__proto__,'b');
  assert.equal(r.records[0].old.constructor,'x'); assert.equal({}.polluted,undefined);
});
