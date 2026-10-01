import test from 'node:test';
import assert from 'node:assert/strict';
import {displayFields} from '../src/view.js';

test('schema-only changes preserve each side own fields including special names',()=>{
  const record={type:'unchanged',old:{id:'1',removed:'valuable-old-data'},new:Object.fromEntries([['id','1'],['__proto__','new-proto'],['constructor','new-constructor']]),changes:[]};
  assert.deepEqual(displayFields(record,'old'),[{column:'id',value:'1'},{column:'removed',value:'valuable-old-data'}]);
  assert.deepEqual(displayFields(record,'new'),[{column:'id',value:'1'},{column:'__proto__',value:'new-proto'},{column:'constructor',value:'new-constructor'}]);
});
test('modified records show only actual modified fields on each side',()=>{
  const record={type:'changed',old:{id:'1',v:'old',same:'keep'},new:{id:'1',v:'new',same:'keep'},changes:[{column:'v',old:'old',new:'new'}]};
  assert.deepEqual(displayFields(record,'old'),[{column:'v',value:'old'}]);
  assert.deepEqual(displayFields(record,'new'),[{column:'v',value:'new'}]);
});
test('absent rows render as no fields rather than inherited values',()=>{
  assert.deepEqual(displayFields({type:'added',old:null,new:{id:'1'},changes:[]},'old'),[]);
});
