import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCSV} from '../src/csv.js';
import {compareCSV} from '../src/compare.js';
import {createReport} from '../src/report.js';

test('report contains all rows, schema changes and comparison settings',()=>{
  const r=compareCSV(parseCSV('id,old,v\n1,a,10\n2,b,20'),parseCSV('id,new,v\n1,z,11\n3,c,30'),{keys:['id'],numeric:['v'],tolerance:0.25});
  const html=createReport(r);
  for(const expected of ['10','11','20','30','old','new','0.25','CSV Delta','Added','Removed','Changed']) assert.ok(html.includes(expected));
  assert.equal((html.match(/data-record=/g)||[]).length,3);
  assert.ok(!/<script\b|<link\b|<img\b|https?:\/\//i.test(html));
});
test('escapes malicious field values, keys and headers in reports',()=>{
  const old=parseCSV('id,v\n1,safe');
  const newData={headers:['id','v'],rows:[['1','<script>alert(1)</script><img src=x onerror="alert(2)">&']]};
  const html=createReport(compareCSV(old,newData,{keys:['id']}));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(html.includes('&quot;alert(2)&quot;'));
  assert.ok(!html.includes('<script>')); assert.ok(!html.includes('<img'));
});
test('Chinese report remains self-contained and includes unchanged rows',()=>{
  const data=parseCSV('id,__proto__\n1,value');
  const html=createReport(compareCSV(data,data,{keys:['id']}),{language:'zh'});
  assert.ok(html.includes('未变')); assert.ok(html.includes('value')); assert.ok(html.includes('lang="zh-CN"'));
});
