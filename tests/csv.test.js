import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCSV } from '../src/csv.js';

test('preserves quoted separators, newlines, escaped quotes and whitespace', () => {
  assert.deepEqual(parseCSV('\uFEFFid,name,note\r\n1,"a,b","hello\n""world"""\r\n2, x ,\r\n'), {
    headers: ['id','name','note'], rows: [['1','a,b','hello\n"world"'],['2',' x ','']]
  });
});
for (const delimiter of [';', '\t']) test(`supports delimiter ${JSON.stringify(delimiter)}`, () => {
  assert.deepEqual(parseCSV(`id${delimiter}name\n1${delimiter}a`, {delimiter}).rows, [['1','a']]);
});
test('does not turn final record terminators into extra rows', () => {
  assert.deepEqual(parseCSV('id,name\n1,x\n\n').rows, [['1','x']]);
  assert.deepEqual(parseCSV('id,name').rows, []);
  assert.deepEqual(parseCSV('id\n""\n').rows, [['']]);
});
for (const [text, pattern] of [
  ['',/empty/i], ['\uFEFF',/empty/i], ['id,\n1,x',/header/i], ['id,id\n1,2',/duplicate.*header/i],
  ['id,name\n1,"x',/record 2.*quote/i], ['id,name\n1,x"y',/record 2.*quote/i],
  ['id,name\n1,"x"y',/record 2.*quote/i], ['id,name\n1',/record 2.*fields/i]
]) test(`rejects malformed input ${JSON.stringify(text)}`, () => assert.throws(() => parseCSV(text), pattern));
test('enforces record limit and allows exactly 50000 data rows', () => {
  assert.equal(parseCSV('id\n'+Array.from({length:50000},(_,i)=>String(i)).join('\n')).rows.length,50000);
  assert.throws(()=>parseCSV('id\n1\n2',{maxRecords:1}),/limit/i);
});
test('treats prototype property names as ordinary headers', () => {
  assert.deepEqual(parseCSV('__proto__,constructor\na,b').headers,['__proto__','constructor']);
});
test('rejects unsupported delimiter', () => assert.throws(()=>parseCSV('id',{delimiter:'|'}),/delimiter/i));
